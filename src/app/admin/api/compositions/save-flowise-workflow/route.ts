import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { generatedWorkflow, workspaceId, compositionId } = body;

    if (!generatedWorkflow || !workspaceId || !compositionId) {
      return NextResponse.json(
        { error: 'Dados incompletos para salvar workflow Flowise' },
        { status: 400 }
      );
    }

    // Convert the generated workflow to Flowise format
    const flowiseWorkflow = {
      name: generatedWorkflow.name,
      description: generatedWorkflow.description,
      nodes: generatedWorkflow.nodes.map((node: any) => ({
        id: node.id,
        type: node.type,
        name: node.name,
        description: node.description,
        config: node.config,
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400
        }
      })),
      edges: generatedWorkflow.edges.map((edge: any) => ({
        source: edge.source,
        target: edge.target,
        type: edge.type
      })),
      workspaceId,
      compositionId,
      aiGenerated: true,
      complexity: generatedWorkflow.complexity,
      estimatedTime: generatedWorkflow.estimatedTime
    };

    // Here you would typically save to a Flowise database or service
    // For now, we'll just log and return success
    console.log('Flowise workflow to be saved:', flowiseWorkflow);

    // TODO: Implement actual Flowise integration
    // This would involve:
    // 1. Connecting to Flowise API
    // 2. Creating the workflow in Flowise
    // 3. Returning the Flowise workflow ID

    return NextResponse.json({
      success: true,
      message: 'Workflow Flowise salvo com sucesso',
      flowiseWorkflowId: `flowise_${Date.now()}`, // Placeholder ID
      workflow: flowiseWorkflow
    });
  } catch (error) {
    console.error('Error saving Flowise workflow:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar workflow Flowise' },
      { status: 500 }
    );
  }
}