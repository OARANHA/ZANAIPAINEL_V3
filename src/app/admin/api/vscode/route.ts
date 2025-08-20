import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data, workspaceId } = body;

    // Verificar workspace
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      include: { user: true }
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    switch (action) {
      case 'sync_context':
        // Sincronizar contexto do VS Code com o Zanai
        const contextData = {
          files: data.files || [],
          activeFile: data.activeFile || null,
          workspacePath: data.workspacePath || '',
          timestamp: new Date().toISOString()
        };

        // Atualizar workspace com contexto do VS Code
        await db.workspace.update({
          where: { id: workspaceId },
          data: {
            vscodeContext: contextData,
            lastSyncedAt: new Date()
          }
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Context synchronized successfully',
          context: contextData 
        });

      case 'execute_agent':
        // Executar agente no contexto do VS Code
        const { agentId, input, context } = data;
        
        const agent = await db.agent.findFirst({
          where: { 
            id: agentId,
            workspaceId: workspaceId 
          }
        });

        if (!agent) {
          return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
        }

        // Criar execução do agente
        const execution = await db.agentExecution.create({
          data: {
            agentId: agent.id,
            input: input,
            status: 'running',
            context: context || {},
            vscodeContext: contextData
          }
        });

        // Aqui seria integrado com o SDK de IA para executar o agente
        // Por enquanto, vamos simular uma resposta
        const result = {
          output: `Agent "${agent.name}" executed with input: "${input}"`,
          actions: [
            {
              type: 'file_modification',
              path: contextData.activeFile || 'unknown',
              changes: 'Simulated changes based on agent execution'
            }
          ]
        };

        // Atualizar execução
        await db.agentExecution.update({
          where: { id: execution.id },
          data: {
            status: 'completed',
            output: result.output,
            result: result
          }
        });

        return NextResponse.json({ 
          success: true, 
          executionId: execution.id,
          result: result 
        });

      case 'get_agents':
        // Listar agentes disponíveis para o workspace
        const agents = await db.agent.findMany({
          where: { workspaceId: workspaceId },
          orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json({ 
          success: true, 
          agents: agents 
        });

      case 'get_compositions':
        // Listar composições disponíveis para o workspace
        const compositions = await db.composition.findMany({
          where: { workspaceId: workspaceId },
          include: {
            agents: true,
            createdBy: true
          },
          orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json({ 
          success: true, 
          compositions: compositions 
        });

      case 'create_agent_from_template':
        // Criar agente a partir de template no VS Code
        const { templateId, name, description } = data;
        
        const newAgent = await db.agent.create({
          data: {
            name: name || 'New Agent from VS Code',
            description: description || 'Created from VS Code integration',
            type: 'template',
            templateId: templateId,
            config: {
              createdFrom: 'vscode',
              templateUsed: templateId
            },
            workspaceId: workspaceId,
            createdById: workspace.userId
          }
        });

        return NextResponse.json({ 
          success: true, 
          agent: newAgent 
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('VS Code API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const action = searchParams.get('action');

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 });
    }

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId }
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    switch (action) {
      case 'get_context':
        // Obter contexto atual do VS Code
        return NextResponse.json({ 
          success: true, 
          context: workspace.vscodeContext || {} 
        });

      case 'get_status':
        // Obter status da integração
        return NextResponse.json({ 
          success: true, 
          status: {
            connected: true,
            lastSyncedAt: workspace.lastSyncedAt,
            workspacePath: workspace.vscodeContext?.workspacePath || null
          } 
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('VS Code GET API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}