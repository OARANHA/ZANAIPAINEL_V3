import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface AnalyticsRequest {
  companyId?: string;
  clientId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  metrics?: string[];
  groupBy?: 'day' | 'week' | 'month' | 'agent' | 'client';
}

interface AnalyticsResponse {
  overview: {
    totalAgents: number;
    activeAgents: number;
    totalMessages: number;
    whatsappMessages: number;
    totalClients: number;
    activeProjects: number;
    successRate: number;
    averageResponseTime: number;
  };
  trends: {
    messages: Array<{
      date: string;
      count: number;
      whatsapp: number;
      chat: number;
    }>;
    agentUsage: Array<{
      date: string;
      active: number;
      total: number;
    }>;
    responseTimes: Array<{
      date: string;
      average: number;
      min: number;
      max: number;
    }>;
  };
  topAgents: Array<{
    id: string;
    name: string;
    messages: number;
    successRate: number;
    avgResponseTime: number;
    lastUsed: string;
  }>;
  clientMetrics: Array<{
    id: string;
    name: string;
    projects: number;
    messages: number;
    satisfaction?: number;
    lastActivity: string;
  }>;
  performance: {
    systemHealth: {
      uptime: number;
      errorRate: number;
      avgResponseTime: number;
    };
    agentPerformance: Array<{
      agentId: string;
      agentName: string;
      cpu: number;
      memory: number;
      requests: number;
    }>;
  };
  exportData: {
    csvUrl?: string;
    pdfUrl?: string;
    lastGenerated: string;
  };
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
      companyId,
      clientId,
      dateRange,
      metrics = ['overview', 'trends', 'agents', 'clients'],
      groupBy = 'day'
    }: AnalyticsRequest = body;

    // Verificar permissões
    if (companyId) {
      const hasAccess = await verifyCompanyAccess(session.user.id, companyId);
      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Access denied to company analytics' },
          { status: 403 }
        );
      }
    }

    if (clientId) {
      const hasAccess = await verifyClientAccess(session.user.id, clientId);
      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Access denied to client analytics' },
          { status: 403 }
        );
      }
    }

    console.log(`📊 Generating analytics for user ${session.user.id}`);

    // Definir período de análise
    const startDate = dateRange?.start ? new Date(dateRange.start) : getDefaultStartDate();
    const endDate = dateRange?.end ? new Date(dateRange.end) : new Date();

    // Gerar analytics baseado nas métricas solicitadas
    const analytics: AnalyticsResponse = {
      overview: metrics.includes('overview') ? await getOverviewMetrics(session.user.id, companyId, clientId, startDate, endDate) : null,
      trends: metrics.includes('trends') ? await getTrendsData(session.user.id, companyId, clientId, startDate, endDate, groupBy) : null,
      topAgents: metrics.includes('agents') ? await getTopAgents(session.user.id, companyId, startDate, endDate) : null,
      clientMetrics: metrics.includes('clients') ? await getClientMetrics(session.user.id, companyId, startDate, endDate) : null,
      performance: metrics.includes('performance') ? await getPerformanceMetrics(session.user.id, companyId, startDate, endDate) : null,
      exportData: {
        lastGenerated: new Date().toISOString()
      }
    };

    console.log(`✅ Analytics generated successfully`);

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('❌ Analytics generation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Funções auxiliares para gerar métricas
async function getOverviewMetrics(userId: string, companyId?: string, clientId?: string, startDate?: Date, endDate?: Date) {
  // Buscar workspaces acessíveis
  const workspaces = await getAccessibleWorkspaces(userId, companyId);
  const workspaceIds = workspaces.map(w => w.id);

  // Buscar agentes
  const agents = await db.agent.findMany({
    where: {
      workspaceId: { in: workspaceIds },
      status: 'active'
    }
  });

  // Buscar execuções no período
  const executions = await db.agentExecution.findMany({
    where: {
      agentId: { in: agents.map(a => a.id) },
      createdAt: { gte: startDate, lte: endDate }
    }
  });

  // Buscar clientes
  const clientsFilter: any = {};
  if (companyId) clientsFilter.companyId = companyId;
  if (clientId) clientsFilter.id = clientId;
  else if (!companyId) clientsFilter.userId = userId;

  const clients = await db.client.findMany({
    where: clientsFilter
  });

  // Buscar projetos
  const projects = await db.project.findMany({
    where: {
      OR: [
        { companyId },
        { clientId },
        { ...(clientId ? {} : { companyId: companyId }) }
      ],
      status: 'active'
    }
  });

  // Calcular métricas
  const successfulExecutions = executions.filter(e => e.status === 'completed');
  const whatsappExecutions = executions.filter(e => 
    e.context && JSON.parse(e.context).channel === 'whatsapp'
  );

  const responseTimes = successfulExecutions
    .filter(e => e.completedAt && e.startedAt)
    .map(e => new Date(e.completedAt!).getTime() - new Date(e.startedAt!).getTime());

  const avgResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
    : 0;

  return {
    totalAgents: agents.length,
    activeAgents: agents.length,
    totalMessages: executions.length,
    whatsappMessages: whatsappExecutions.length,
    totalClients: clients.length,
    activeProjects: projects.length,
    successRate: executions.length > 0 ? (successfulExecutions.length / executions.length) * 100 : 0,
    averageResponseTime: Math.round(avgResponseTime)
  };
}

async function getTrendsData(userId: string, companyId?: string, clientId?: string, startDate?: Date, endDate?: Date, groupBy: string = 'day') {
  const workspaces = await getAccessibleWorkspaces(userId, companyId);
  const workspaceIds = workspaces.map(w => w.id);

  const agents = await db.agent.findMany({
    where: {
      workspaceId: { in: workspaceIds }
    }
  });

  // Gerar dados de tendências agrupados por período
  const trends = await generateTimeSeriesData(
    startDate!,
    endDate!,
    groupBy,
    async (start, end) => {
      const executions = await db.agentExecution.findMany({
        where: {
          agentId: { in: agents.map(a => a.id) },
          createdAt: { gte: start, lte: end }
        }
      });

      const whatsappExecutions = executions.filter(e => 
        e.context && JSON.parse(e.context).channel === 'whatsapp'
      );

      const activeAgents = await db.agent.count({
        where: {
          id: { in: agents.map(a => a.id) },
          executions: {
            some: {
              createdAt: { gte: start, lte: end }
            }
          }
        }
      });

      const responseTimes = executions
        .filter(e => e.status === 'completed' && e.completedAt && e.startedAt)
        .map(e => new Date(e.completedAt!).getTime() - new Date(e.startedAt!).getTime());

      return {
        messages: executions.length,
        whatsapp: whatsappExecutions.length,
        chat: executions.length - whatsappExecutions.length,
        activeAgents,
        totalAgents: agents.length,
        avgResponseTime: responseTimes.length > 0 
          ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
          : 0,
        minResponseTime: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
        maxResponseTime: responseTimes.length > 0 ? Math.max(...responseTimes) : 0
      };
    }
  );

  return {
    messages: trends.map(t => ({
      date: t.period,
      count: t.data.messages,
      whatsapp: t.data.whatsapp,
      chat: t.data.chat
    })),
    agentUsage: trends.map(t => ({
      date: t.period,
      active: t.data.activeAgents,
      total: t.data.totalAgents
    })),
    responseTimes: trends.map(t => ({
      date: t.period,
      average: Math.round(t.data.avgResponseTime),
      min: Math.round(t.data.minResponseTime),
      max: Math.round(t.data.maxResponseTime)
    }))
  };
}

async function getTopAgents(userId: string, companyId?: string, startDate?: Date, endDate?: Date) {
  const workspaces = await getAccessibleWorkspaces(userId, companyId);
  const workspaceIds = workspaces.map(w => w.id);

  const agents = await db.agent.findMany({
    where: {
      workspaceId: { in: workspaceIds }
    },
    include: {
      executions: {
        where: {
          createdAt: { gte: startDate, lte: endDate }
        }
      }
    }
  });

  return agents
    .map(agent => {
      const executions = agent.executions;
      const successfulExecutions = executions.filter(e => e.status === 'completed');
      const responseTimes = successfulExecutions
        .filter(e => e.completedAt && e.startedAt)
        .map(e => new Date(e.completedAt!).getTime() - new Date(e.startedAt!).getTime());

      return {
        id: agent.id,
        name: agent.name,
        messages: executions.length,
        successRate: executions.length > 0 ? (successfulExecutions.length / executions.length) * 100 : 0,
        avgResponseTime: responseTimes.length > 0 
          ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length) 
          : 0,
        lastUsed: executions.length > 0 
          ? Math.max(...executions.map(e => new Date(e.createdAt).getTime())).toString() 
          : agent.createdAt.toISOString()
      };
    })
    .sort((a, b) => b.messages - a.messages)
    .slice(0, 10);
}

async function getClientMetrics(userId: string, companyId?: string, startDate?: Date, endDate?: Date) {
  const clientsFilter: any = {};
  if (companyId) clientsFilter.companyId = companyId;
  else if (!companyId) clientsFilter.userId = userId;

  const clients = await db.client.findMany({
    where: clientsFilter,
    include: {
      projects: {
        where: {
          createdAt: { gte: startDate, lte: endDate }
        }
      },
      company: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  // Buscar execuções relacionadas aos clientes
  const workspaces = await getAccessibleWorkspaces(userId, companyId);
  const workspaceIds = workspaces.map(w => w.id);

  const executions = await db.agentExecution.findMany({
    where: {
      agent: {
        workspaceId: { in: workspaceIds }
      },
      createdAt: { gte: startDate, lte: endDate },
      context: {
        path: '$.clientId',
        not: null
      }
    }
  });

  return clients.map(client => {
    const clientExecutions = executions.filter(e => {
      const context = JSON.parse(e.context);
      return context.clientId === client.id;
    });

    return {
      id: client.id,
      name: client.name,
      projects: client.projects.length,
      messages: clientExecutions.length,
      satisfaction: 4.5, // Placeholder - implementar cálculo real
      lastActivity: clientExecutions.length > 0 
        ? Math.max(...clientExecutions.map(e => new Date(e.createdAt).getTime())).toString() 
        : client.updatedAt.toISOString()
    };
  });
}

async function getPerformanceMetrics(userId: string, companyId?: string, startDate?: Date, endDate?: Date) {
  // Métricas simuladas de sistema - em produção, integrar com monitoramento real
  return {
    systemHealth: {
      uptime: 99.9,
      errorRate: 0.1,
      avgResponseTime: 150
    },
    agentPerformance: [
      {
        agentId: 'agent1',
        agentName: 'Agente Principal',
        cpu: 45,
        memory: 60,
        requests: 1250
      },
      {
        agentId: 'agent2',
        agentName: 'Agente de Suporte',
        cpu: 30,
        memory: 45,
        requests: 890
      }
    ]
  };
}

// Funções utilitárias
async function verifyCompanyAccess(userId: string, companyId: string): Promise<boolean> {
  if (userId === 'admin') return true;

  const company = await db.company.findFirst({
    where: {
      id: companyId,
      users: {
        some: {
          id: userId
        }
      }
    }
  });

  return !!company;
}

async function verifyClientAccess(userId: string, clientId: string): Promise<boolean> {
  if (userId === 'admin') return true;

  const client = await db.client.findFirst({
    where: {
      id: clientId,
      OR: [
        { userId },
        { company: { users: { some: { id: userId } } } }
      ]
    }
  });

  return !!client;
}

async function getAccessibleWorkspaces(userId: string, companyId?: string) {
  if (companyId) {
    return await db.workspace.findMany({
      where: {
        config: {
          path: '$.companyId',
          equals: companyId
        }
      }
    });
  }

  return await db.workspace.findMany({
    where: { userId }
  });
}

function getDefaultStartDate(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() - 1); // Último mês por padrão
  return date;
}

async function generateTimeSeriesData(
  startDate: Date,
  endDate: Date,
  groupBy: string,
  dataFetcher: (start: Date, end: Date) => Promise<any>
) {
  const periods = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    let periodStart: Date;
    let periodEnd: Date;
    let periodLabel: string;

    switch (groupBy) {
      case 'week':
        periodStart = new Date(current);
        periodStart.setDate(current.getDate() - current.getDay());
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6);
        periodLabel = periodStart.toISOString().split('T')[0];
        current.setDate(current.getDate() + 7);
        break;
      case 'month':
        periodStart = new Date(current.getFullYear(), current.getMonth(), 1);
        periodEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
        periodLabel = periodStart.toISOString().slice(0, 7); // YYYY-MM
        current.setMonth(current.getMonth() + 1);
        break;
      default: // day
        periodStart = new Date(current);
        periodEnd = new Date(current);
        periodEnd.setDate(current.getDate() + 1);
        periodLabel = current.toISOString().split('T')[0];
        current.setDate(current.getDate() + 1);
        break;
    }

    const data = await dataFetcher(periodStart, periodEnd);
    periods.push({ period: periodLabel, data });
  }

  return periods;
}