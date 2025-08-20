import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { generateFlowiseConfig, AgentData } from '@/lib/flowise-config-generator';
import { createFlowiseClient, defaultFlowiseConfig } from '@/lib/flowise-client';

interface AgentCreationRequest {
  name: string;
  description?: string;
  type: 'template' | 'custom' | 'composed';
  persona: {
    name: string;
    role: string;
    personality: string;
    expertise: string[];
    communicationStyle: string;
    language: 'pt' | 'en' | 'es';
  };
  context: {
    businessDomain: string;
    industry: string;
    targetAudience: string;
    companyProfile?: {
      name: string;
      size: 'small' | 'medium' | 'large';
      sector: string;
    };
    knowledgeBase?: string[];
    constraints?: string[];
  };
  rgaConfig?: {
    reasoningLevel: 'basic' | 'advanced' | 'expert';
    autonomy: 'low' | 'medium' | 'high';
    learningCapability: boolean;
    decisionMaking: 'assisted' | 'autonomous';
  };
  workspaceId?: string;
  config?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
    tools?: string[];
    memory?: {
      type: 'short' | 'long' | 'hybrid';
      capacity: number;
    };
  };
}

interface AgentResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: string;
  status: string;
  persona: any;
  context: any;
  rgaConfig?: any;
  config: any;
  createdAt: string;
  updatedAt: string;
  links: {
    chat: string;
    api: string;
    whatsapp?: string;
  };
  flowise?: {
    workflowId?: string;
    embedUrl?: string;
    status?: 'created' | 'failed' | 'pending';
    error?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      type,
      persona,
      context,
      rgaConfig,
      workspaceId,
      config
    }: AgentCreationRequest = body;

    // Validação básica
    if (!name || !type || !persona || !context) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, persona, context' },
        { status: 400 }
      );
    }

    // Gerar slug único
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Verificar se workspace existe e pertence ao usuário
    let workspace = null;
    if (workspaceId) {
      workspace = await db.workspace.findFirst({
        where: {
          id: workspaceId,
          userId: session.user.id
        }
      });

      if (!workspace) {
        return NextResponse.json(
          { error: 'Workspace not found or access denied' },
          { status: 404 }
        );
      }
    } else {
      // Criar workspace padrão se não fornecido
      workspace = await db.workspace.create({
        data: {
          name: `${session.user.name || session.user.email}'s Workspace`,
          description: 'Default workspace for agent creation',
          config: '{}',
          userId: session.user.id
        }
      });
    }

    // Preparar configuração do agente
    const agentConfig = {
      model: config?.model || 'gpt-4',
      temperature: config?.temperature ?? 0.7,
      maxTokens: config?.maxTokens ?? 2000,
      systemPrompt: generateSystemPrompt(persona, context),
      tools: config?.tools || [],
      memory: config?.memory || {
        type: 'hybrid',
        capacity: 1000
      },
      ...config
    };

    // Criar o agente no banco de dados
    const agent = await db.agent.create({
      data: {
        name,
        slug,
        description: description || `${persona.name} - ${persona.role}`,
        type,
        config: JSON.stringify(agentConfig),
        knowledge: generateKnowledgeBase(persona, context),
        status: 'active',
        workspaceId: workspace.id,
        userId: session.user.id
      }
    });

    // Integrar com Flowise - Criar workflow automaticamente
    let flowiseIntegration = {
      status: 'pending' as const,
      workflowId: undefined as string | undefined,
      embedUrl: undefined as string | undefined,
      error: undefined as string | undefined
    };

    try {
      // Preparar dados do agente para o Flowise
      const agentData: AgentData = {
        id: agent.id,
        name: agent.name,
        description: agent.description,
        type: agent.type as 'template' | 'custom' | 'composed',
        persona,
        context,
        rgaConfig,
        config: agentConfig
      };

      // Gerar configuração Flowise
      const flowiseConfig = generateFlowiseConfig(agentData);

      // Criar cliente Flowise
      const flowiseClient = createFlowiseClient(defaultFlowiseConfig);

      // Criar workflow no Flowise
      const flowiseWorkflow = await flowiseClient.createChatflow({
        name: flowiseConfig.name,
        flowData: flowiseConfig.flowData,
        type: flowiseConfig.type,
        category: flowiseConfig.category,
        deployed: false,
        isPublic: false,
        chatbotConfig: flowiseConfig.chatbotConfig,
        apiConfig: flowiseConfig.apiConfig
      });

      // Registrar workflow no banco de dados local
      await db.flowiseWorkflow.create({
        data: {
          flowiseId: flowiseWorkflow.id,
          name: flowiseWorkflow.name,
          description: `Workflow para agente: ${agent.name}`,
          type: flowiseWorkflow.type,
          flowData: flowiseWorkflow.flowData,
          deployed: flowiseWorkflow.deployed || false,
          isPublic: flowiseWorkflow.isPublic || false,
          category: flowiseWorkflow.category || 'general',
          workspaceId: workspace.id,
          lastSyncAt: new Date(),
          createdAt: flowiseWorkflow.createdDate,
          updatedAt: flowiseWorkflow.updatedDate
        }
      });

      // Atualizar status da integração
      flowiseIntegration = {
        status: 'created',
        workflowId: flowiseWorkflow.id,
        embedUrl: `${defaultFlowiseConfig.baseUrl}/chat/${flowiseWorkflow.id}`,
        error: undefined
      };

      console.log(`✅ Flowise workflow created successfully: ${flowiseWorkflow.id} for agent ${agent.name}`);

    } catch (flowiseError) {
      console.error('❌ Flowise integration error:', flowiseError);
      flowiseIntegration = {
        status: 'failed',
        workflowId: undefined,
        embedUrl: undefined,
        error: flowiseError instanceof Error ? flowiseError.message : 'Unknown Flowise error'
      };
    }

    // Gerar links de acesso
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const links = {
      chat: `${baseUrl}/chat/${agent.id}`,
      api: `${baseUrl}/api/v1/agents/${agent.id}/chat`,
      whatsapp: rgaConfig?.autonomy === 'high' ? `${baseUrl}/api/v1/agents/${agent.id}/whatsapp` : undefined
    };

    // Preparar resposta
    const response: AgentResponse = {
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      type: agent.type,
      status: agent.status,
      persona,
      context,
      rgaConfig,
      config: agentConfig,
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      links,
      flowise: flowiseIntegration
    };

    // Registrar criação no audit log
    await db.auditLog.create({
      data: {
        action: 'create',
        entityType: 'agent',
        entityId: agent.id,
        userId: session.user.id,
        newValues: JSON.stringify({
          name,
          type,
          persona,
          context,
          rgaConfig
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    console.log(`✅ Agent created successfully: ${agent.name} (${agent.id})`);
    if (flowiseIntegration.status === 'created') {
      console.log(`✅ Flowise workflow created: ${flowiseIntegration.workflowId}`);
    } else if (flowiseIntegration.status === 'failed') {
      console.log(`❌ Flowise integration failed: ${flowiseIntegration.error}`);
    }

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('❌ Agent creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Construir filtro
    const where: any = {
      userId: session.user.id
    };

    if (workspaceId) {
      where.workspaceId = workspaceId;
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    // Buscar agentes com paginação
    const [agents, total] = await Promise.all([
      db.agent.findMany({
        where,
        include: {
          workspace: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.agent.count({ where })
    ]);

    // Formatar resposta
    const formattedAgents = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      type: agent.type,
      status: agent.status,
      workspace: agent.workspace,
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      links: {
        chat: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/chat/${agent.id}`,
        api: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/v1/agents/${agent.id}/chat`
      }
    }));

    return NextResponse.json({
      agents: formattedAgents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Agent listing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Funções auxiliares
function generateSystemPrompt(persona: any, context: any): string {
  const basePrompt = `Você é ${persona.name}, um ${persona.role} especializado.

**Personalidade e Estilo de Comunicação:**
- Personalidade: ${persona.personality}
- Estilo de comunicação: ${persona.communicationStyle}
- Idioma: ${persona.language === 'pt' ? 'Português' : persona.language === 'es' ? 'Espanhol' : 'Inglês'}

**Expertise:**
${persona.expertise.map((exp: string) => `- ${exp}`).join('\n')}

**Contexto de Negócio:**
- Domínio: ${context.businessDomain}
- Indústria: ${context.industry}
- Público-alvo: ${context.targetAudience}

${context.companyProfile ? `
**Perfil da Empresa:**
- Nome: ${context.companyProfile.name}
- Porte: ${context.companyProfile.size}
- Setor: ${context.companyProfile.sector}
` : ''}

**Diretrizes:**
1. Mantenha o tom profissional e alinhado com sua personalidade definida
2. Forneça respostas detalhadas e acionáveis
3. Considere sempre o contexto de negócio e o público-alvo
4. Use exemplos relevantes quando aplicável
5. Seja proativo em sugerir melhorias e soluções

${context.constraints ? `**Restrições:**
${context.constraints.map((constraint: string) => `- ${constraint}`).join('\n')}
` : ''}

Responda sempre em ${persona.language === 'pt' ? 'português' : persona.language === 'es' ? 'espanhol' : 'inglês'}.`;

  return basePrompt;
}

function generateKnowledgeBase(persona: any, context: any): string {
  const knowledge = `# Base de Conhecimento: ${persona.name}

## Perfil do Agente
**Nome:** ${persona.name}
**Função:** ${persona.role}
**Personalidade:** ${persona.personality}
**Estilo de Comunicação:** ${persona.communicationStyle}

## Áreas de Expertise
${persona.expertise.map((exp: string) => `- ${exp}`).join('\n')}

## Contexto de Atuação
### Domínio de Negócio
${context.businessDomain}

### Indústria
${context.industry}

### Público-Alvo
${context.targetAudience}

${context.companyProfile ? `
### Perfil da Empresa
- **Nome:** ${context.companyProfile.name}
- **Porte:** ${context.companyProfile.size}
- **Setor:** ${context.companyProfile.sector}
` : ''}

${context.knowledgeBase ? `
### Base de Conhecimento Adicional
${context.knowledgeBase.map((item: string) => `- ${item}`).join('\n')}
` : ''}

${context.constraints ? `
### Restrições e Limitações
${context.constraints.map((constraint: string) => `- ${constraint}`).join('\n')}
` : ''}

## Diretrizes de Interação
1. Manter consistência na personalidade e estilo de comunicação
2. Focar em fornecer valor dentro das áreas de expertise
3. Adaptar a profundidade técnica conforme o público-alvo
4. Manter atualização sobre as tendências do setor
5. Respeitar as restrições definidas

## Objetivos Principais
- Fornecer análises e insights acionáveis
- Auxiliar na tomada de decisão estratégica
- Sugerir melhorias e inovações
- Manter alto nível de relevância e precisão
`;

  return knowledge;
}