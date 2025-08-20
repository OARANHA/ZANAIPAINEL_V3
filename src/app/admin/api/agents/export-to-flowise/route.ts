import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FlowiseConverter } from '@/lib/flowise-converter';

export async function POST(request: NextRequest) {
  try {
    const { agentId } = await request.json();

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Buscar o agente completo
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

    console.log(`🚀 Exportando agente para Flowise: ${agent.name} (${agent.id})`);

    // Gerar workflow a partir do agente
    const generatedWorkflow = {
      name: agent.name,
      description: agent.description || `Agente: ${agent.name}`,
      nodes: [
        {
          id: 'start_node',
          type: 'StartNode',
          name: 'Início',
          description: 'Ponto de entrada do workflow',
          config: {}
        },
        {
          id: 'agent_node',
          type: 'CustomNode',
          name: agent.name,
          description: agent.description || '',
          config: {
            agentId: agent.id,
            agentName: agent.name,
            agentConfig: agent.config || '{}',
            agentKnowledge: agent.knowledge || ''
          }
        },
        {
          id: 'end_node',
          type: 'EndNode',
          name: 'Fim',
          description: 'Ponto de saída do workflow',
          config: {}
        }
      ],
      edges: [
        {
          source: 'start_node',
          target: 'agent_node',
          type: 'sequential'
        },
        {
          source: 'agent_node',
          target: 'end_node',
          type: 'sequential'
        }
      ],
      agents: [agent.id],
      complexity: 'simple',
      estimatedTime: '< 1 minuto'
    };

    // Converter para formato Flowise
    const flowiseWorkflow = await FlowiseConverter.convertToFlowiseFormat(
      generatedWorkflow,
      agent.workspaceId
    );

    // Preparar dados para exportação
    const flowData = {
      nodes: flowiseWorkflow.nodes,
      edges: flowiseWorkflow.edges,
      viewport: { x: 0, y: 0, zoom: 1 }
    };

    const exportData = {
      id: agent.id,
      name: agent.name,
      description: agent.description || '',
      type: 'CHATFLOW', // Importante: deve ser CHATFLOW para aparecer na lista
      flowData: JSON.stringify(flowData),
      deployed: true,
      isPublic: true,
      category: 'agentes',
      workspaceId: agent.workspaceId
    };

    // Exportar para o Flowise externo
    const flowiseResponse = await exportToFlowiseExternal(exportData, agent.slug);

    if (!flowiseResponse.success) {
      throw new Error(flowiseResponse.error || 'Failed to export to Flowise');
    }

    // Atualizar o agente com o link do Flowise
    const chatUrl = flowiseResponse.data?.chatUrl || 
                   `https://aaranha-zania.hf.space/chat/${flowiseResponse.data?.canvasId}`;
    
    const embedCode = generateEmbedCode(flowiseResponse.data?.canvasId || agent.slug);

    await db.agent.update({
      where: { id: agent.id },
      data: {
        chatflowUrl: chatUrl,
        flowiseId: flowiseResponse.data?.canvasId,
        exportedToFlowise: true,
        exportedAt: new Date()
      }
    });

    // Gerar estatísticas iniciais
    const stats = {
      totalExecutions: 0,
      successRate: '100%',
      lastExecution: null,
      avgResponseTime: '0ms'
    };

    console.log(`✅ Agente exportado com sucesso: ${agent.name} -> ${chatUrl}`);

    return NextResponse.json({
      success: true,
      message: 'Agent exported to Flowise successfully',
      data: {
        agentId: agent.id,
        agentName: agent.name,
        canvasId: flowiseResponse.data?.canvasId,
        chatUrl: chatUrl,
        embedCode: embedCode,
        stats: stats,
        exportedAt: new Date().toISOString(),
        flowiseResponse: flowiseResponse.data
      }
    });

  } catch (error) {
    console.error('Error exporting agent to Flowise:', error);
    return NextResponse.json(
      { 
        error: 'Failed to export agent to Flowise',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function exportToFlowiseExternal(exportData: any, agentSlug: string) {
  try {
    const canvasId = `agent_${agentSlug}_${Date.now()}`;
    
    console.log('🚀 Enviando requisição de exportação para Flowise:', {
      action: 'export_workflow',
      canvasId: canvasId,
      workflowData: exportData
    });

    const response = await fetch('/api/flowise-external-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'export_workflow',
        canvasId: canvasId,
        workflowData: exportData
      })
    });

    console.log('📝 Resposta da API Flowise:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    const result = await response.json();
    console.log('📊 Dados da resposta Flowise:', result);

    if (response.ok && result.success) {
      return {
        success: true,
        data: {
          canvasId: result.data?.canvasId || result.data?.flowiseResponse?.id || canvasId,
          chatUrl: `https://aaranha-zania.hf.space/chat/${result.data?.canvasId || result.data?.flowiseResponse?.id || canvasId}`,
          flowiseResponse: result.data?.flowiseResponse || result.data
        }
      };
    } else {
      return {
        success: false,
        error: result.message || result.error || 'Failed to export to Flowise'
      };
    }
  } catch (error) {
    console.error('❌ Erro ao exportar para Flowise:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function generateEmbedCode(canvasId: string): string {
  const baseUrl = 'https://aaranha-zania.hf.space';
  
  return `<iframe
  src="${baseUrl}/chat/${canvasId}"
  width="100%"
  height="600px"
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
  allow="microphone; camera"
></iframe>`;
}