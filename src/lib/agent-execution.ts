import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';
import { getZAIConfig } from './zai-config';

export interface AgentExecutionRequest {
  agentId: string;
  input: string;
  context?: any;
}

export interface AgentExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime: number;
}

export class AgentExecutionService {
  private static instance: AgentExecutionService;
  private zai: any = null;

  private constructor() {}

  public static getInstance(): AgentExecutionService {
    if (!AgentExecutionService.instance) {
      AgentExecutionService.instance = new AgentExecutionService();
    }
    return AgentExecutionService.instance;
  }

  private async initializeZAI() {
    if (!this.zai) {
      try {
        console.log('Inicializando ZAI com configuração...');
        const config = getZAIConfig();
        console.log('Configuração ZAI:', JSON.stringify(config, null, 2));
        
        // Verificar se a chave de API está configurada
        if (!config.apiKey) {
          throw new Error('ZAI_API_KEY não está configurada');
        }
        
        this.zai = await ZAI.create(config);
        console.log('ZAI inicializado com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar ZAI:', error);
        throw new Error(`Falha ao inicializar serviço de IA: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }
    return this.zai;
  }

  public async executeAgent(request: AgentExecutionRequest): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    
    try {
      console.log(`Iniciando execução do agente ${request.agentId}`);
      console.log(`Input: ${request.input}`);
      
      // Buscar configuração do agente
      const agent = await db.agent.findUnique({
        where: { id: request.agentId },
        include: { workspace: true }
      });

      if (!agent) {
        throw new Error(`Agente não encontrado: ${request.agentId}`);
      }

      console.log(`Agente encontrado: ${agent.name} (${agent.type})`);

      // Inicializar ZAI
      const zai = await this.initializeZAI();

      // Preparar prompt com base na configuração do agente
      const systemPrompt = this.buildSystemPrompt(agent);
      console.log(`System prompt gerado para ${agent.name}:`, systemPrompt);
      
      // Executar o agente
      console.log('Enviando requisição para API Z.ai...');
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: request.input
          }
        ],
        model: 'glm-4.5-flash',
        temperature: 0.7,
        max_tokens: 2000
      });

      console.log('Resposta da API Z.ai recebida:', JSON.stringify(completion, null, 2));

      // Verificar se a resposta tem a estrutura esperada - ser mais tolerante
      let output = '';
      if (completion && completion.choices && completion.choices[0] && completion.choices[0].message) {
        output = completion.choices[0].message.content || '';
      } else if (completion && completion.choices && completion.choices[0]) {
        // Tentar outros formatos possíveis
        output = completion.choices[0].text || JSON.stringify(completion.choices[0]);
      } else if (completion && completion.content) {
        // Outro formato possível
        output = completion.content;
      } else {
        // Se não encontrar o formato esperado, logar a estrutura completa
        console.warn('Formato de resposta inesperado:', completion);
        output = JSON.stringify(completion);
      }

      console.log(`Output extraído: ${output}`);

      const executionTime = Date.now() - startTime;
      console.log(`Execução concluída em ${executionTime}ms`);

      // Registrar aprendizado
      await this.recordLearning(agent.id, 'execution', {
        input: request.input,
        output,
        executionTime,
        success: true
      }, 0.9);

      return {
        success: true,
        output,
        executionTime
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error('Erro ao executar agente:', error);

      // Registrar falha para aprendizado
      await this.recordLearning(request.agentId, 'execution', {
        input: request.input,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        executionTime,
        success: false
      }, 0.1);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        executionTime
      };
    }
  }

  private buildSystemPrompt(agent: any): string {
    let prompt = `Você é ${agent.name}.\n\n`;
    
    if (agent.description) {
      prompt += `Descrição: ${agent.description}\n\n`;
    }

    if (agent.knowledge) {
      prompt += `Conhecimento:\n${agent.knowledge}\n\n`;
    }

    if (agent.config) {
      try {
        const config = JSON.parse(agent.config);
        if (config.capabilities) {
          prompt += `Capacidades: ${config.capabilities.join(', ')}\n\n`;
        }
        if (config.settings) {
          prompt += `Configurações: ${JSON.stringify(config.settings, null, 2)}\n\n`;
        }
      } catch (error) {
        // Ignorar erro de parsing, config pode estar em YAML
      }
    }

    prompt += `Responda de forma precisa, útil e alinhada com sua especialidade.`;
    
    return prompt;
  }

  private async recordLearning(agentId: string, type: string, data: any, confidence: number) {
    try {
      await db.learning.create({
        data: {
          agentId,
          type,
          data: JSON.stringify(data),
          confidence
        }
      });
    } catch (error) {
      console.error('Erro ao registrar aprendizado:', error);
    }
  }

  public async executeComposition(compositionId: string, input: string): Promise<AgentExecutionResult> {
    try {
      // Buscar composição com agentes
      const composition = await db.composition.findUnique({
        where: { id: compositionId },
        include: {
          agents: true,
          workspace: true
        }
      });

      if (!composition || composition.agents.length === 0) {
        throw new Error('Composição não encontrada ou sem agentes');
      }

      // Executar agentes em sequência (pode ser paralelo no futuro)
      const results: string[] = [];
      
      for (const agent of composition.agents) {
        const result = await this.executeAgent({
          agentId: agent.id,
          input: input,
          context: { compositionId, previousResults: results }
        });

        if (result.success && result.output) {
          results.push(`[${agent.name}]: ${result.output}`);
        }
      }

      const executionTime = Date.now();
      
      return {
        success: true,
        output: results.join('\n\n'),
        executionTime
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        executionTime: 0
      };
    }
  }
}