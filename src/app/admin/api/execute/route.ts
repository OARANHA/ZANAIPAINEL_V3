import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AgentExecutionService } from '@/lib/agent-execution';

export async function POST(request: NextRequest) {
  try {
    const { agentId, input, context } = await request.json();

    if (!agentId || !input) {
      return NextResponse.json(
        { error: 'Agent ID and input are required' },
        { status: 400 }
      );
    }

    // Verificar se o agente existe
    const agent = await db.agent.findUnique({
      where: { id: agentId },
      include: { workspace: true }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Criar registro de execução
    const execution = await db.agentExecution.create({
      data: {
        agentId,
        input,
        context: context ? JSON.stringify(context) : null,
        status: 'running',
        startedAt: new Date()
      }
    });

    // Processar a execução de forma assíncrona usando o serviço real
    processAgentExecutionWithZAI(agentId, execution.id, input, context).catch(error => {
      console.error('Error processing agent execution:', error);
    });

    return NextResponse.json({
      executionId: execution.id,
      status: 'running',
      message: 'Agent execution started'
    });

  } catch (error) {
    console.error('Error starting agent execution:', error);
    return NextResponse.json(
      { error: 'Failed to start agent execution' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const executionId = searchParams.get('executionId');
    const agentId = searchParams.get('agentId');

    if (executionId) {
      // Buscar execução específica
      const execution = await db.agentExecution.findUnique({
        where: { id: executionId },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              type: true
            }
          }
        }
      });

      if (!execution) {
        return NextResponse.json(
          { error: 'Execution not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(execution);
    }

    if (agentId) {
      // Buscar execuções de um agente específico
      const executions = await db.agentExecution.findMany({
        where: { agentId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      return NextResponse.json(executions);
    }

    // Buscar todas as execuções recentes
    const executions = await db.agentExecution.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    return NextResponse.json(executions);
  } catch (error) {
    console.error('Error fetching executions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch executions' },
      { status: 500 }
    );
  }
}

async function processAgentExecutionWithZAI(agentId: string, executionId: string, input: string, context?: any) {
  try {
    console.log(`Iniciando execução do agente ${agentId} com API Z.ai - Execution ID: ${executionId}`);
    console.log(`Input: ${input}`);
    console.log(`Context:`, context);
    
    // Usar o serviço de execução de agentes real
    const executionService = AgentExecutionService.getInstance();
    const result = await executionService.executeAgent({
      agentId,
      input,
      context
    });

    console.log(`Resultado da execução do agente ${agentId}:`, result);

    if (result.success) {
      // Atualizar o registro de execução com o resultado real
      await db.agentExecution.update({
        where: { id: executionId },
        data: {
          status: 'completed',
          output: result.output,
          result: JSON.stringify({
            output: result.output,
            executionTime: result.executionTime,
            success: true
          }),
          completedAt: new Date()
        }
      });
      console.log(`Execução ${executionId} concluída com sucesso`);
    } else {
      // Atualizar o registro de execução com erro
      console.error(`Execução ${executionId} falhou:`, result.error);
      await db.agentExecution.update({
        where: { id: executionId },
        data: {
          status: 'failed',
          error: result.error || 'Erro na execução do agente',
          completedAt: new Date()
        }
      });
    }

  } catch (error) {
    console.error('Error in agent execution with Z.ai:', error);
    
    // Atualizar o registro de execução com erro
    await db.agentExecution.update({
      where: { id: executionId },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Erro desconhecido na execução',
        completedAt: new Date()
      }
    });
  }
}