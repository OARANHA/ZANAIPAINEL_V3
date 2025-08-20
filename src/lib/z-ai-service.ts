/**
 * Serviço de integração com a API Z para tomada de decisões inteligentes
 * Utiliza o z-ai-web-dev-sdk para processamento de linguagem natural e decisões
 */

import ZAI from 'z-ai-web-dev-sdk';

export interface ZAIDecisionRequest {
  context: string;
  options: string[];
  criteria?: string[];
  agentInfo?: {
    name: string;
    type: string;
    capabilities: string[];
    description?: string;
  };
}

export interface ZAIDecisionResponse {
  decision: string;
  reasoning: string;
  confidence: number;
  alternatives: Array<{
    option: string;
    score: number;
    reasoning: string;
  }>;
  metadata?: {
    processingTime: number;
    modelUsed: string;
    tokensUsed: number;
  };
}

export interface ZAIAnalysisRequest {
  agentData: {
    name: string;
    description: string;
    type: string;
    config: string;
    knowledge?: string;
    capabilities?: string[];
  };
  analysisType: 'template_selection' | 'optimization' | 'performance' | 'security';
}

export interface ZAIAnalysisResponse {
  analysis: string;
  recommendations: string[];
  confidence: number;
  insights: string[];
  actionItems: string[];
}

class ZAIService {
  private zai: any = null;
  private initialized: boolean = false;

  /**
   * Inicializa o serviço ZAI
   */
  async initialize(): Promise<void> {
    try {
      if (this.initialized) return;

      console.log('🚀 Inicializando serviço ZAI...');
      this.zai = await ZAI.create();
      this.initialized = true;
      console.log('✅ Serviço ZAI inicializado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao inicializar serviço ZAI:', error);
      throw new Error('Falha ao inicializar serviço de IA');
    }
  }

  /**
   * Toma uma decisão baseada em contexto e opções
   */
  async makeDecision(request: ZAIDecisionRequest): Promise<ZAIDecisionResponse> {
    await this.initialize();

    try {
      const startTime = Date.now();
      
      // Construir o prompt para a decisão
      const prompt = this.buildDecisionPrompt(request);
      
      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Você é um assistente de IA especializado em tomada de decisões para sistemas de agentes inteligentes. 
            Sua tarefa é analisar o contexto fornecido e recomendar a melhor opção entre as alternativas disponíveis,
            considerando os critérios especificados e as características do agente.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Baixa temperatura para decisões mais consistentes
        max_tokens: 1000
      });

      const processingTime = Date.now() - startTime;
      const responseText = completion.choices[0]?.message?.content || '';

      // Parsear a resposta para extrair a decisão estruturada
      const decision = this.parseDecisionResponse(responseText, request.options);

      return {
        ...decision,
        metadata: {
          processingTime,
          modelUsed: 'gpt-4',
          tokensUsed: completion.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      console.error('❌ Erro ao tomar decisão com ZAI:', error);
      throw new Error('Falha ao processar decisão com IA');
    }
  }

  /**
   * Analisa um agente e fornece recomendações
   */
  async analyzeAgent(request: ZAIAnalysisRequest): Promise<ZAIAnalysisResponse> {
    await this.initialize();

    try {
      const prompt = this.buildAnalysisPrompt(request);
      
      const completion = await this.zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em arquitetura de sistemas de IA e análise de agentes inteligentes.
            Sua tarefa é analisar o agente fornecido e fornecer insights detalhados, recomendações de otimização
            e sugestões de melhorias baseadas no tipo de análise solicitado.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 1500
      });

      const responseText = completion.choices[0]?.message?.content || '';
      return this.parseAnalysisResponse(responseText);
    } catch (error) {
      console.error('❌ Erro ao analisar agente com ZAI:', error);
      throw new Error('Falha ao analisar agente com IA');
    }
  }

  /**
   * Seleciona o template ideal para um agente baseado em suas características
   */
  async selectOptimalTemplate(agentData: {
    name: string;
    description: string;
    type: string;
    config: string;
    knowledge?: string;
    capabilities?: string[];
  }): Promise<{
    template: string;
    reasoning: string;
    confidence: number;
    alternatives: Array<{ template: string; score: number; reasoning: string }>;
  }> {
    const request: ZAIDecisionRequest = {
      context: `Selecionar o template ideal do Flowise para o agente "${agentData.name}".
      Descrição: ${agentData.description}
      Tipo: ${agentData.type}
      Tem conhecimento base: ${!!agentData.knowledge}
      Configuração: ${agentData.config.substring(0, 200)}...
      Capacidades: ${agentData.capabilities?.join(', ') || 'Não especificadas'}`,
      options: ['professional', 'assistant', 'tool', 'knowledge', 'chat', 'composed', 'custom'],
      criteria: [
        'adequação ao tipo de agente',
        'suporte às capacidades necessárias',
        'complexidade apropriada',
        'integração com conhecimento base',
        'performance esperada'
      ],
      agentInfo: {
        name: agentData.name,
        type: agentData.type,
        capabilities: agentData.capabilities || [],
        description: agentData.description
      }
    };

    const decision = await this.makeDecision(request);
    
    return {
      template: decision.decision,
      reasoning: decision.reasoning,
      confidence: decision.confidence,
      alternatives: decision.alternatives.map(alt => ({
        template: alt.option,
        score: alt.score,
        reasoning: alt.reasoning
      }))
    };
  }

  /**
   * Gera um prompt para tomada de decisão
   */
  private buildDecisionPrompt(request: ZAIDecisionRequest): string {
    let prompt = `# Contexto da Decisão\n${request.context}\n\n`;
    
    prompt += `# Opções Disponíveis\n`;
    request.options.forEach((option, index) => {
      prompt += `${index + 1}. ${option}\n`;
    });
    
    if (request.criteria && request.criteria.length > 0) {
      prompt += `\n# Critérios de Avaliação\n`;
      request.criteria.forEach((criterion, index) => {
        prompt += `${index + 1}. ${criterion}\n`;
      });
    }
    
    if (request.agentInfo) {
      prompt += `\n# Informações do Agente\n`;
      prompt += `- Nome: ${request.agentInfo.name}\n`;
      prompt += `- Tipo: ${request.agentInfo.type}\n`;
      prompt += `- Capacidades: ${request.agentInfo.capabilities.join(', ')}\n`;
      if (request.agentInfo.description) {
        prompt += `- Descrição: ${request.agentInfo.description}\n`;
      }
    }
    
    prompt += `\n# Instruções\n`;
    prompt += `Analise o contexto e as opções disponíveis. Considere os critérios de avaliação `;
    prompt += `e as características do agente. Selecione a MELHOR opção e justifique sua decisão.\n\n`;
    prompt += `# Formato de Resposta\n`;
    prompt += `DECISÃO: [nome da opção escolhida]\n`;
    prompt += `CONFIANÇA: [valor de 0 a 1]\n`;
    prompt += `RAZONAMENTO: [explicação detalhada da decisão]\n`;
    prompt += `ALTERNATIVAS:\n`;
    prompt += `- [opção]: [score 0-1] - [breve justificativa]\n`;
    
    return prompt;
  }

  /**
   * Gera um prompt para análise de agente
   */
  private buildAnalysisPrompt(request: ZAIAnalysisRequest): string {
    let prompt = `# Análise de Agente - ${request.analysisType.toUpperCase()}\n\n`;
    
    prompt += `## Informações do Agente\n`;
    prompt += `- Nome: ${request.agentData.name}\n`;
    prompt += `- Descrição: ${request.agentData.description}\n`;
    prompt += `- Tipo: ${request.agentData.type}\n`;
    prompt += `- Configuração: ${request.agentData.config.substring(0, 300)}...\n`;
    
    if (request.agentData.knowledge) {
      prompt += `- Possui base de conhecimento: Sim (${request.agentData.knowledge.length} caracteres)\n`;
    }
    
    if (request.agentData.capabilities && request.agentData.capabilities.length > 0) {
      prompt += `- Capacidades: ${request.agentData.capabilities.join(', ')}\n`;
    }
    
    prompt += `\n## Tipo de Análise\n`;
    prompt += `${this.getAnalysisTypeDescription(request.analysisType)}\n\n`;
    
    prompt += `## Instruções\n`;
    prompt += `Forneça uma análise detalhada do agente considerando o tipo de análise solicitado. `;
    prompt += `Inclua recomendações práticas, insights úteis e itens de ação específicos.\n\n`;
    
    prompt += `## Formato de Resposta\n`;
    prompt += `ANÁLISE: [análise detalhada]\n`;
    prompt += `RECOMENDAÇÕES:\n`;
    prompt += `- [recomendação 1]\n`;
    prompt += `- [recomendação 2]\n`;
    prompt += `CONFIANÇA: [valor de 0 a 1]\n`;
    prompt += `INSIGHTS:\n`;
    prompt += `- [insight 1]\n`;
    prompt += `- [insight 2]\n`;
    prompt += `AÇÕES:\n`;
    prompt += `- [ação 1]\n`;
    prompt += `- [ação 2]\n`;
    
    return prompt;
  }

  /**
   * Obtém descrição do tipo de análise
   */
  private getAnalysisTypeDescription(type: string): string {
    switch (type) {
      case 'template_selection':
        return 'Análise para seleção do template ideal do Flowise';
      case 'optimization':
        return 'Análise de otimização de performance e eficiência';
      case 'performance':
        return 'Análise de performance e capacidade de resposta';
      case 'security':
        return 'Análise de segurança e melhores práticas';
      default:
        return 'Análise geral do agente';
    }
  }

  /**
   * Parseia a resposta de decisão para extrair informações estruturadas
   */
  private parseDecisionResponse(responseText: string, options: string[]): ZAIDecisionResponse {
    const lines = responseText.split('\n');
    let decision = '';
    let reasoning = '';
    let confidence = 0.5;
    const alternatives: any[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('DECISÃO:')) {
        decision = trimmed.replace('DECISÃO:', '').trim();
      } else if (trimmed.startsWith('RAZONAMENTO:')) {
        reasoning = trimmed.replace('RAZONAMENTO:', '').trim();
      } else if (trimmed.startsWith('CONFIANÇA:')) {
        const confidenceStr = trimmed.replace('CONFIANÇA:', '').trim();
        confidence = parseFloat(confidenceStr) || 0.5;
      } else if (trimmed.startsWith('-') && trimmed.includes(':')) {
        const parts = trimmed.substring(1).split(':');
        if (parts.length >= 3) {
          const option = parts[0].trim();
          const scoreStr = parts[1].trim();
          const altReasoning = parts.slice(2).join(':').trim();
          
          if (options.includes(option)) {
            alternatives.push({
              option,
              score: parseFloat(scoreStr) || 0,
              reasoning: altReasoning
            });
          }
        }
      }
    }

    // Garantir que a decisão seja uma das opções válidas
    if (!options.includes(decision)) {
      decision = options[0]; // Fallback para primeira opção
    }

    return {
      decision,
      reasoning,
      confidence,
      alternatives
    };
  }

  /**
   * Parseia a resposta de análise para extrair informações estruturadas
   */
  private parseAnalysisResponse(responseText: string): ZAIAnalysisResponse {
    const lines = responseText.split('\n');
    let analysis = '';
    const recommendations: string[] = [];
    let confidence = 0.5;
    const insights: string[] = [];
    const actionItems: string[] = [];

    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('ANÁLISE:')) {
        analysis = trimmed.replace('ANÁLISE:', '').trim();
        currentSection = 'analysis';
      } else if (trimmed.startsWith('RECOMENDAÇÕES:')) {
        currentSection = 'recommendations';
      } else if (trimmed.startsWith('CONFIANÇA:')) {
        const confidenceStr = trimmed.replace('CONFIANÇA:', '').trim();
        confidence = parseFloat(confidenceStr) || 0.5;
      } else if (trimmed.startsWith('INSIGHTS:')) {
        currentSection = 'insights';
      } else if (trimmed.startsWith('AÇÕES:')) {
        currentSection = 'actions';
      } else if (trimmed.startsWith('-')) {
        const content = trimmed.substring(1).trim();
        switch (currentSection) {
          case 'recommendations':
            recommendations.push(content);
            break;
          case 'insights':
            insights.push(content);
            break;
          case 'actions':
            actionItems.push(content);
            break;
        }
      } else if (currentSection === 'analysis' && analysis) {
        analysis += ' ' + trimmed;
      }
    }

    return {
      analysis,
      recommendations,
      confidence,
      insights,
      actionItems
    };
  }
}

// Exportar instância singleton
export const zaiService = new ZAIService();
export default ZAIService;