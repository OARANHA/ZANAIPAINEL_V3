import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { importData, workspaceId } = await request.json();

    if (!importData || !workspaceId) {
      return NextResponse.json(
        { error: 'Import data and workspace ID are required' },
        { status: 400 }
      );
    }

    // Validar estrutura dos dados importados
    if (!importData.agent || !importData.agent.name) {
      return NextResponse.json(
        { error: 'Invalid import data format' },
        { status: 400 }
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

    // Criar novo agente com os dados importados
    const newAgent = await db.agent.create({
      data: {
        name: importData.agent.name,
        description: importData.agent.description || '',
        type: importData.agent.type || 'template',
        config: importData.agent.config || '',
        knowledge: importData.agent.knowledge || null,
        status: importData.agent.status || 'active',
        workspaceId
      }
    });

    return NextResponse.json({
      message: 'Agent imported successfully',
      agent: newAgent,
      importMetadata: {
        originalName: importData.metadata?.agentName || importData.agent.name,
        exportedAt: importData.metadata?.exportedAt,
        version: importData.metadata?.version
      }
    });

  } catch (error) {
    console.error('Error importing agent:', error);
    return NextResponse.json(
      { error: 'Failed to import agent' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Retornar informações sobre o formato de importação
    const importFormat = {
      version: '1.0.0',
      description: 'Format for importing agent configurations',
      structure: {
        metadata: {
          version: 'string',
          exportedAt: 'ISO 8601 datetime',
          agentId: 'string (optional)',
          agentName: 'string'
        },
        agent: {
          name: 'string (required)',
          description: 'string',
          type: 'string (template|custom|composed)',
          config: 'string (YAML)',
          knowledge: 'string (Markdown, optional)',
          status: 'string (active|inactive|training)'
        },
        workspace: {
          name: 'string',
          description: 'string'
        }
      },
      example: {
        metadata: {
          version: '1.0.0',
          exportedAt: '2024-01-01T00:00:00.000Z',
          agentName: 'Example Agent'
        },
        agent: {
          name: 'Example Agent',
          description: 'An example agent',
          type: 'template',
          config: 'name: Example Agent\nversion: 1.0.0\ndescription: Example description',
          knowledge: '# Knowledge Base\n\n## Information\nExample knowledge',
          status: 'active'
        },
        workspace: {
          name: 'Example Workspace',
          description: 'Example workspace description'
        }
      }
    };

    return NextResponse.json(importFormat);
  } catch (error) {
    console.error('Error getting import format:', error);
    return NextResponse.json(
      { error: 'Failed to get import format' },
      { status: 500 }
    );
  }
}