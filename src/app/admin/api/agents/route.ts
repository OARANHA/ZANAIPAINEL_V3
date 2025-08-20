import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const agents = await db.agent.findMany({
      include: {
        workspace: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transformar para o formato esperado pela extensão
    const formattedAgents = agents.map(agent => ({
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      type: agent.type,
      status: agent.status,
      config: agent.config,
      knowledge: agent.knowledge,
      roleDefinition: agent.description || `Você é um agente especialista chamado ${agent.name}`,
      groups: [
        "read",
        ["edit", { "fileRegex": "\\.(md|ts|js|py|java|cpp|c|h|go|rs|php|rb)$", "description": "Arquivos de código e documentação" }]
      ],
      customInstructions: agent.config ? (typeof agent.config === 'string' ? agent.config : JSON.stringify(agent.config)) : `Siga as diretrizes do agente ${agent.name}`,
      workspaceId: agent.workspaceId,
      workspace: {
        name: agent.workspace.name,
        description: agent.workspace.description
      }
    }));

    return NextResponse.json({ agents: formattedAgents });
  } catch (error) {
    console.error('Erro ao buscar agentes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar agentes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, type, config, knowledge, workspaceId } = await request.json();

    if (!name || !workspaceId) {
      return NextResponse.json(
        { error: 'Nome e workspace são obrigatórios' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const agent = await db.agent.create({
      data: {
        name,
        slug,
        description: description || '',
        type: type || 'template',
        config: config || '',
        knowledge: knowledge || '',
        workspaceId,
        status: 'active'
      }
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar agente:', error);
    return NextResponse.json(
      { error: 'Erro ao criar agente' },
      { status: 500 }
    );
  }
}