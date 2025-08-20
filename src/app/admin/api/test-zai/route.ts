import { NextRequest, NextResponse } from 'next/server';
import { AgentExecutionService } from '@/lib/agent-execution';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('Iniciando teste ZAI...');
    
    const executionService = AgentExecutionService.getInstance();
    
    // Testar inicialização do ZAI
    try {
      await executionService['initializeZAI']();
      console.log('ZAI inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar ZAI:', error);
      return NextResponse.json({
        success: false,
        error: `Erro ao inicializar ZAI: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        details: {
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined
        }
      }, { status: 500 });
    }
    
    // Testar execução simples
    try {
      // First get a real agent ID
      const agents = await db.agent.findMany({
        take: 1,
        where: { status: 'active' }
      });
      
      if (agents.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'Nenhum agente encontrado para teste'
        }, { status: 404 });
      }
      
      const agentId = agents[0].id;
      console.log(`Usando agente ${agents[0].name} (${agentId}) para teste`);
      
      const result = await executionService.executeAgent({
        agentId,
        input: 'Olá, por favor responda apenas com "OK" para teste.'
      });
      
      console.log('Resultado do teste:', result);
      
      return NextResponse.json({
        success: true,
        message: 'ZAI está funcionando corretamente',
        result: result
      });
      
    } catch (error) {
      console.error('Erro ao testar execução ZAI:', error);
      return NextResponse.json({
        success: false,
        error: `Erro ao testar execução ZAI: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        details: {
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined
        }
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Erro geral no teste ZAI:', error);
    return NextResponse.json({
      success: false,
      error: `Erro geral: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      details: {
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      }
    }, { status: 500 });
  }
}