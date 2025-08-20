import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface ChatRequest {
  message: string;
  context?: {
    sessionId?: string;
    userId?: string;
    metadata?: Record<string, any>;
  };
  options?: {
    stream?: boolean;
    temperature?: number;
    maxTokens?: number;
  };
}

interface ChatResponse {
  response: string;
  agentId: string;
  sessionId: string;
  timestamp: string;
  metadata?: {
    model: string;
    tokensUsed: number;
    responseTime: number;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const agentId = params.id;
    const body = await request.json();
    const { message, context, options }: ChatRequest = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Buscar agente e verificar permissões
    const agent = await db.agent.findFirst({
      where: {
        id: agentId,
        OR: [
          { userId: session.user.id },
          { workspace: { userId: session.user.id } }
        ]
      }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found or access denied' },
        { status: 404 }
      );
    }

    if (agent.status !== 'active') {
      return NextResponse.json(
        { error: 'Agent is not active' },
        { status: 400 }
      );
    }

    // Parse configuração do agente
    const agentConfig = JSON.parse(agent.config);
    const sessionId = context?.sessionId || generateSessionId();

    // Registrar execução do agente
    const execution = await db.agentExecution.create({
      data: {
        agentId: agent.id,
        input: message,
        status: 'running',
        context: JSON.stringify({
          sessionId,
          userId: session.user.id,
          ...context?.metadata
        }),
        startedAt: new Date()
      }
    });

    console.log(`🤖 Executing agent ${agent.name} (${agent.id}) for session ${sessionId}`);

    try {
      // Executar agente usando ZAI SDK
      const startTime = Date.now();
      const response = await executeAgentWithZAI(agentConfig, message, context);
      const responseTime = Date.now() - startTime;

      // Atualizar execução com sucesso
      await db.agentExecution.update({
        where: { id: execution.id },
        data: {
          output: response.text,
          status: 'completed',
          result: JSON.stringify({
            model: response.model,
            tokensUsed: response.tokensUsed,
            responseTime
          }),
          completedAt: new Date()
        }
      });

      // Registrar métricas
      await db.agentMetrics.create({
        data: {
          timestamp: BigInt(Date.now()),
          agentId: agent.id,
          metricName: 'chat_requests',
          metricValue: 1,
          tags: JSON.stringify({
            sessionId,
            userId: session.user.id
          })
        }
      });

      const chatResponse: ChatResponse = {
        response: response.text,
        agentId: agent.id,
        sessionId,
        timestamp: new Date().toISOString(),
        metadata: {
          model: response.model,
          tokensUsed: response.tokensUsed,
          responseTime
        }
      };

      console.log(`✅ Agent ${agent.name} executed successfully in ${responseTime}ms`);

      return NextResponse.json(chatResponse);

    } catch (error) {
      console.error(`❌ Agent execution error for ${agent.name}:`, error);

      // Atualizar execução com erro
      await db.agentExecution.update({
        where: { id: execution.id },
        data: {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date()
        }
      });

      return NextResponse.json(
        { 
          error: 'Agent execution failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Função para executar agente com ZAI SDK
async function executeAgentWithZAI(agentConfig: any, message: string, context?: any) {
  try {
    // Importar ZAI SDK dinamicamente para evitar erros de importação
    const ZAI = await import('z-ai-web-dev-sdk');
    const zai = await ZAI.create();

    // Preparar mensagens para o chat
    const messages = [
      {
        role: 'system',
        content: agentConfig.systemPrompt || 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: message
      }
    ];

    // Adicionar contexto de conversa anterior se existir
    if (context?.metadata?.conversationHistory) {
      const history = context.metadata.conversationHistory;
      // Inserir histórico antes da mensagem atual
      messages.splice(1, 0, ...history);
    }

    // Executar chat completion
    const completion = await zai.chat.completions.create({
      messages,
      model: agentConfig.model || 'gpt-4',
      temperature: agentConfig.temperature ?? 0.7,
      max_tokens: agentConfig.maxTokens ?? 2000,
      // Adicionar outras configurações conforme necessário
    });

    // Extrair resposta e metadados
    const responseText = completion.choices[0]?.message?.content || 'No response generated';
    
    // Estimar tokens usados (aproximado)
    const tokensUsed = Math.ceil(
      (agentConfig.systemPrompt?.length || 0 + message.length + responseText.length) / 4
    );

    return {
      text: responseText,
      model: agentConfig.model || 'gpt-4',
      tokensUsed,
      rawResponse: completion
    };

  } catch (error) {
    console.error('❌ ZAI SDK execution error:', error);
    
    // Fallback para resposta simulada em caso de erro
    return {
      text: `Desculpe, estou enfrentando dificuldades técnicas para processar sua solicitação no momento. Por favor, tente novamente mais tarde.\n\nErro: ${error instanceof Error ? error.message : 'Unknown error'}`,
      model: agentConfig?.model || 'gpt-4',
      tokensUsed: 50,
      rawResponse: null
    };
  }
}

// Gerar ID de sessão único
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Endpoint para obter informações do agente
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const agentId = params.id;

    // Buscar agente com informações detalhadas
    const agent = await db.agent.findFirst({
      where: {
        id: agentId,
        OR: [
          { userId: session.user.id },
          { workspace: { userId: session.user.id } }
        ]
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true
          }
        },
        executions: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            completedAt: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        metrics: {
          select: {
            metricName: true,
            metricValue: true,
            timestamp: true
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 20
        }
      }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found or access denied' },
        { status: 404 }
      );
    }

    // Parse configuração
    const agentConfig = JSON.parse(agent.config);

    // Calcular estatísticas
    const totalExecutions = agent.executions.length;
    const successfulExecutions = agent.executions.filter(e => e.status === 'completed').length;
    const averageResponseTime = agent.executions
      .filter(e => e.completedAt && e.startedAt)
      .reduce((acc, e) => {
        const time = new Date(e.completedAt!).getTime() - new Date(e.startedAt!).getTime();
        return acc + time;
      }, 0) / successfulExecutions || 0;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return NextResponse.json({
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      type: agent.type,
      status: agent.status,
      workspace: agent.workspace,
      config: agentConfig,
      knowledge: agent.knowledge,
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      stats: {
        totalExecutions,
        successfulExecutions,
        successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
        averageResponseTime: Math.round(averageResponseTime)
      },
      recentExecutions: agent.executions.map(exec => ({
        id: exec.id,
        status: exec.status,
        createdAt: exec.createdAt.toISOString(),
        completedAt: exec.completedAt?.toISOString()
      })),
      links: {
        chat: `${baseUrl}/chat/${agent.id}`,
        api: `${baseUrl}/api/v1/agents/${agent.id}/chat`
      }
    });

  } catch (error) {
    console.error('❌ Agent info error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}