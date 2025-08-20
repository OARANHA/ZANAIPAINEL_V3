import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface ConnectionCreationRequest {
  agentId: string;
  type: 'chat' | 'whatsapp' | 'api' | 'embed';
  config?: {
    // Configurações para chat
    theme?: 'light' | 'dark' | 'auto';
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    welcomeMessage?: string;
    primaryColor?: string;
    
    // Configurações para WhatsApp
    template?: string;
    autoReply?: boolean;
    businessHours?: {
      enabled: boolean;
      timezone: string;
      schedule: Array<{
        day: string;
        start: string;
        end: string;
      }>;
    };
    
    // Configurações para API
    rateLimit?: {
      requests: number;
      window: string; // '1m', '5m', '1h', '1d'
    };
    webhooks?: {
      url: string;
      events: string[];
    };
    
    // Configurações para embed
    domain?: string;
    sandbox?: boolean;
    customCSS?: string;
  };
  metadata?: {
    clientId?: string;
    projectId?: string;
    tags?: string[];
    description?: string;
  };
  expiresAt?: string; // Data de expiração opcional
}

interface ConnectionResponse {
  id: string;
  agentId: string;
  type: string;
  status: string;
  config: any;
  links: {
    chatUrl?: string;
    whatsappUrl?: string;
    apiUrl?: string;
    embedCode?: string;
  };
  stats: {
    totalConnections: number;
    activeConnections: number;
    totalMessages: number;
    lastActivity?: string;
  };
  createdAt: string;
  expiresAt?: string;
  metadata?: any;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      agentId,
      type,
      config = {},
      metadata,
      expiresAt
    }: ConnectionCreationRequest = body;

    // Validação básica
    if (!agentId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: agentId, type' },
        { status: 400 }
      );
    }

    // Verificar se o agente existe e pertence ao usuário
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

    // Validar configurações específicas por tipo
    if (type === 'whatsapp') {
      // Verificar se o agente tem configuração para WhatsApp
      const agentConfig = JSON.parse(agent.config);
      if (!agentConfig.rgaConfig || agentConfig.rgaConfig.autonomy !== 'high') {
        return NextResponse.json(
          { error: 'Agent does not support WhatsApp connections' },
          { status: 400 }
        );
      }
    }

    console.log(`🔗 Creating ${type} connection for agent ${agent.name}`);

    // Gerar ID único para a conexão
    const connectionId = generateConnectionId(type);

    // Preparar configuração padrão
    const defaultConfig = getDefaultConnectionConfig(type);
    const mergedConfig = { ...defaultConfig, ...config };

    // Criar a conexão no banco de dados
    const connection = await db.agentExecution.create({
      data: {
        agentId: agent.id,
        input: `Connection creation: ${type}`,
        status: 'active',
        context: JSON.stringify({
          connectionId,
          connectionType: type,
          config: mergedConfig,
          metadata,
          userId: session.user.id
        }),
        result: JSON.stringify({
          connectionId,
          type,
          status: 'active',
          createdAt: new Date().toISOString()
        }),
        startedAt: new Date(),
        completedAt: new Date()
      }
    });

    // Gerar links de acesso
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const links = generateConnectionLinks(connectionId, type, agent.id, mergedConfig, baseUrl);

    // Registrar métricas
    await db.agentMetrics.create({
      data: {
        timestamp: BigInt(Date.now()),
        agentId: agent.id,
        metricName: 'connection_created',
        metricValue: 1,
        tags: JSON.stringify({
          connectionId,
          type,
          userId: session.user.id
        })
      }
    });

    // Registrar criação no audit log
    await db.auditLog.create({
      data: {
        action: 'create',
        entityType: 'connection',
        entityId: connectionId,
        userId: session.user.id,
        newValues: JSON.stringify({
          agentId,
          type,
          config: mergedConfig,
          metadata,
          expiresAt
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    // Preparar resposta
    const response: ConnectionResponse = {
      id: connectionId,
      agentId: agent.id,
      type,
      status: 'active',
      config: mergedConfig,
      links,
      stats: {
        totalConnections: 1,
        activeConnections: 1,
        totalMessages: 0
      },
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt,
      metadata
    };

    console.log(`✅ Connection created successfully: ${connectionId}`);

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('❌ Connection creation error:', error);
    
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Buscar workspaces do usuário
    const workspaces = await db.workspace.findMany({
      where: { userId: session.user.id }
    });

    const workspaceIds = workspaces.map(w => w.id);

    // Buscar agentes do usuário
    const agents = await db.agent.findMany({
      where: {
        workspaceId: { in: workspaceIds }
      }
    });

    const agentIds = agents.map(a => a.id);

    // Construir filtro para conexões
    const where: any = {
      agentId: { in: agentIds },
      context: {
        path: '$.connectionId',
        not: null
      }
    };

    if (agentId) where.agentId = agentId;
    if (status) where.status = status;

    // Buscar execuções que representam conexões
    const [connections, total] = await Promise.all([
      db.agentExecution.findMany({
        where,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.agentExecution.count({ where })
    ]);

    // Formatar conexões
    const formattedConnections = connections.map(execution => {
      const context = JSON.parse(execution.context);
      const result = JSON.parse(execution.result || '{}');
      
      return {
        id: context.connectionId,
        agentId: execution.agentId,
        agent: execution.agent,
        type: context.connectionType,
        status: result.status || execution.status,
        config: context.config,
        metadata: context.metadata,
        createdAt: execution.createdAt.toISOString(),
        expiresAt: context.expiresAt,
        stats: {
          totalConnections: 1,
          activeConnections: execution.status === 'active' ? 1 : 0,
          totalMessages: 0, // Implementar contagem real de mensagens
          lastActivity: execution.updatedAt.toISOString()
        }
      };
    });

    // Gerar links para cada conexão
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const connectionsWithLinks = formattedConnections.map(conn => ({
      ...conn,
      links: generateConnectionLinks(conn.id, conn.type, conn.agentId, conn.config, baseUrl)
    }));

    return NextResponse.json({
      connections: connectionsWithLinks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Connection listing error:', error);
    
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
function generateConnectionId(type: string): string {
  const prefix = type.substring(0, 3).toUpperCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6);
  return `${prefix}_${timestamp}_${random}`;
}

function getDefaultConnectionConfig(type: string): any {
  const baseConfig = {
    theme: 'auto',
    welcomeMessage: 'Olá! Como posso ajudar você hoje?'
  };

  switch (type) {
    case 'chat':
      return {
        ...baseConfig,
        position: 'bottom-right',
        primaryColor: '#3B82F6',
        showAgentAvatar: true,
        allowFileUpload: false,
        collectUserInfo: false
      };

    case 'whatsapp':
      return {
        ...baseConfig,
        template: 'default',
        autoReply: true,
        businessHours: {
          enabled: false,
          timezone: 'America/Sao_Paulo',
          schedule: [
            { day: 'monday', start: '09:00', end: '18:00' },
            { day: 'tuesday', start: '09:00', end: '18:00' },
            { day: 'wednesday', start: '09:00', end: '18:00' },
            { day: 'thursday', start: '09:00', end: '18:00' },
            { day: 'friday', start: '09:00', end: '18:00' }
          ]
        },
        awayMessage: 'Olá! No momento estamos fora do horário comercial. Responderemos assim que possível.'
      };

    case 'api':
      return {
        rateLimit: {
          requests: 100,
          window: '1h'
        },
        webhooks: {
          events: ['message.sent', 'message.received', 'agent.error']
        },
        format: 'json',
        version: 'v1'
      };

    case 'embed':
      return {
        domain: '*',
        sandbox: true,
        customCSS: '',
        height: '600px',
        width: '100%',
        border: 'none',
        borderRadius: '8px'
      };

    default:
      return baseConfig;
  }
}

function generateConnectionLinks(connectionId: string, type: string, agentId: string, config: any, baseUrl: string): any {
  const links: any = {};

  switch (type) {
    case 'chat':
      links.chatUrl = `${baseUrl}/chat/${connectionId}`;
      break;

    case 'whatsapp':
      links.whatsappUrl = `${baseUrl}/api/v1/whatsapp/${connectionId}`;
      links.qrCodeUrl = `${baseUrl}/api/v1/whatsapp/${connectionId}/qr`;
      break;

    case 'api':
      links.apiUrl = `${baseUrl}/api/v1/agents/${agentId}/chat`;
      links.documentationUrl = `${baseUrl}/docs/api/${connectionId}`;
      break;

    case 'embed':
      links.embedUrl = `${baseUrl}/embed/${connectionId}`;
      links.embedCode = generateEmbedCode(connectionId, config, baseUrl);
      break;
  }

  links.managementUrl = `${baseUrl}/connections/${connectionId}`;
  links.analyticsUrl = `${baseUrl}/connections/${connectionId}/analytics`;

  return links;
}

function generateEmbedCode(connectionId: string, config: any, baseUrl: string): string {
  return `<div id="zanai-chat-${connectionId}" style="height: ${config.height || '600px'}; width: ${config.width || '100%'};"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = "${baseUrl}/embed/${connectionId}/script.js";
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;
}

// Endpoint para acessar conexão de chat
export async function handleChatConnection(
  request: NextRequest,
  { params }: { params: { connectionId: string } }
) {
  try {
    const connectionId = params.connectionId;

    // Buscar conexão
    const connection = await db.agentExecution.findFirst({
      where: {
        context: {
          path: '$.connectionId',
          equals: connectionId
        },
        status: 'active'
      }
    });

    if (!connection) {
      return NextResponse.json(
        { error: 'Connection not found or inactive' },
        { status: 404 }
      );
    }

    const context = JSON.parse(connection.context);
    const config = context.config;

    // Verificar expiração
    if (context.expiresAt && new Date(context.expiresAt) < new Date()) {
      await db.agentExecution.update({
        where: { id: connection.id },
        data: { status: 'expired' }
      });

      return NextResponse.json(
        { error: 'Connection expired' },
        { status: 410 }
      );
    }

    // Incrementar contador de acessos
    await db.agentMetrics.create({
      data: {
        timestamp: BigInt(Date.now()),
        agentId: connection.agentId,
        metricName: 'chat_access',
        metricValue: 1,
        tags: JSON.stringify({
          connectionId,
          source: 'chat_link'
        })
      }
    });

    // Retornar configuração do chat
    return NextResponse.json({
      connectionId,
      agentId: connection.agentId,
      config,
      metadata: context.metadata,
      sessionToken: generateSessionToken(connectionId)
    });

  } catch (error) {
    console.error('❌ Chat connection error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateSessionToken(connectionId: string): string {
  const payload = {
    connectionId,
    timestamp: Date.now(),
    nonce: Math.random().toString(36).substr(2, 8)
  };
  
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}