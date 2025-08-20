import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Buscando agentes para debug...');
    
    const agents = await db.agent.findMany({
      include: {
        workspace: true,
        _count: {
          select: {
            executions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Encontrados ${agents.length} agentes`);
    
    // Verificar configuração de cada agente
    const agentsWithDebug = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      type: agent.type,
      status: agent.status,
      description: agent.description,
      workspace: agent.workspace?.name,
      hasConfig: !!agent.config,
      configLength: agent.config?.length || 0,
      hasKnowledge: !!agent.knowledge,
      knowledgeLength: agent.knowledge?.length || 0,
      executionCount: agent._count.executions,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      count: agents.length,
      agents: agentsWithDebug
    });
    
  } catch (error) {
    console.error('Erro ao buscar agentes:', error);
    return NextResponse.json({
      success: false,
      error: `Erro ao buscar agentes: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      details: {
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      }
    }, { status: 500 });
  }
}