import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await db.agent.findUnique({
      where: { id: params.id },
      include: {
        workspace: true
      }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, type, config, knowledge, status, workspaceId } = await request.json();

    if (!name || !workspaceId) {
      return NextResponse.json(
        { error: 'Name and workspace are required' },
        { status: 400 }
      );
    }

    // Verificar se o agente existe
    const existingAgent = await db.agent.findUnique({
      where: { id: params.id }
    });

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Verificar se o workspace existe
    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId }
    });

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    const updatedAgent = await db.agent.update({
      where: { id: params.id },
      data: {
        name,
        description: description || '',
        type: type || 'template',
        config: config || '',
        knowledge: knowledge || null,
        status: status || 'active',
        workspaceId
      }
    });

    return NextResponse.json(updatedAgent);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o agente existe
    const existingAgent = await db.agent.findUnique({
      where: { id: params.id }
    });

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Deletar o agente (as execuções relacionadas serão mantidas para histórico)
    await db.agent.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      message: 'Agent deleted successfully',
      deletedId: params.id 
    });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}