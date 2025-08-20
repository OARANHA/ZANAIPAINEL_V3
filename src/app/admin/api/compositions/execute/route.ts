import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { collectAgentExecutionMetric } from '@/lib/metrics-middleware';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const timeout = 45000; // 45 segundos timeout
  
  try {
    const { compositionId, input } = await request.json();

    if (!compositionId || !input) {
      return NextResponse.json(
        { error: 'Composition ID e input são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar a composição com seus agentes
    const composition = await db.composition.findUnique({
      where: { id: compositionId },
      include: {
        agents: true,
        workspace: true
      }
    });

    if (!composition) {
      return NextResponse.json(
        { error: 'Composição não encontrada' },
        { status: 404 }
      );
    }

    if (composition.status !== 'active') {
      return NextResponse.json(
        { error: 'Composição não está ativa' },
        { status: 400 }
      );
    }

    if (composition.agents.length === 0) {
      return NextResponse.json(
        { error: 'Composição não possui agentes' },
        { status: 400 }
      );
    }

    // Criar um AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Executar cada agente na composição com timeout
      const results = [];
      const executionStartTime = Date.now();
      
      for (const agent of composition.agents) {
        const agentStartTime = Date.now();
        
        try {
          // Usar fetch com timeout para cada agente
          const response = await fetch('http://localhost:3000/api/execute', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              agentId: agent.id,
              input: input,
              context: {
                compositionId: composition.id,
                compositionName: composition.name,
                agentCount: composition.agents.length
              }
            }),
            signal: controller.signal
          });

          if (!response.ok) {
            throw new Error(`Erro ao executar agente ${agent.name}: ${response.status}`);
          }

          const agentResult = await response.json();
          const agentEndTime = Date.now();
          const agentExecutionTime = agentEndTime - agentStartTime;
          
          const result = {
            agentId: agent.id,
            agentName: agent.name,
            result: agentResult.output || 'Sem resposta',
            executionTime: agentExecutionTime,
            success: true
          };
          
          results.push(result);

          // Coletar métricas para este agente
          await collectAgentExecutionMetric({
            agentId: agent.id,
            executionTime: agentExecutionTime,
            success: true,
            inputLength: input.length,
            outputLength: result.result.length
          });

        } catch (error) {
          const agentEndTime = Date.now();
          const agentExecutionTime = agentEndTime - agentStartTime;
          
          console.error(`Erro ao executar agente ${agent.name}:`, error);
          
          const errorResult = {
            agentId: agent.id,
            agentName: agent.name,
            error: error.message || 'Erro ao executar agente',
            executionTime: agentExecutionTime,
            success: false
          };
          
          results.push(errorResult);

          // Coletar métricas de erro para este agente
          await collectAgentExecutionMetric({
            agentId: agent.id,
            executionTime: agentExecutionTime,
            success: false,
            inputLength: input.length,
            error: error.message
          });
        }
      }

      clearTimeout(timeoutId);
      const totalExecutionTime = Date.now() - executionStartTime;

      // Criar registro de execução
      await db.execution.create({
        data: {
          compositionId: composition.id,
          input,
          results: JSON.stringify(results),
          status: 'completed'
        }
      });

      // Coletar métricas para a composição como um todo
      for (const agent of composition.agents) {
        await collectAgentExecutionMetric({
          agentId: agent.id,
          executionTime: totalExecutionTime / composition.agents.length, // média por agente
          success: true,
          inputLength: input.length,
          outputLength: JSON.stringify(results).length,
          tags: {
            compositionId: composition.id,
            compositionName: composition.name,
            agentCount: composition.agents.length
          }
        });
      }

      return NextResponse.json({
        compositionId,
        input,
        results,
        totalExecutionTime,
        executedAt: new Date().toISOString()
      });

    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Erro ao executar composição:', error);
      
      // Criar registro de execução com erro
      await db.execution.create({
        data: {
          compositionId: composition.id,
          input,
          results: JSON.stringify([{ error: error.message || 'Erro desconhecido' }]),
          status: 'failed'
        }
      });

      return NextResponse.json(
        { error: 'Erro ao executar composição: ' + (error.message || 'Erro desconhecido') },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Erro geral na execução da composição:', error);
    return NextResponse.json(
      { error: 'Erro ao executar composição' },
      { status: 500 }
    );
  }
}