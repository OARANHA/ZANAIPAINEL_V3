import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serverId = searchParams.get('serverId');

    const where = serverId ? { serverId } : {};

    const tools = await db.mCPTool.findMany({
      where,
      include: {
        server: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true
          }
        },
        connections: {
          include: {
            agent: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Erro ao buscar ferramentas MCP:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ferramentas MCP' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      inputSchema,
      serverId
    } = body;

    if (!name || !inputSchema || !serverId) {
      return NextResponse.json(
        { error: 'Nome, schema e servidor são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o servidor existe
    const server = await db.mCPServer.findUnique({
      where: { id: serverId }
    });

    if (!server) {
      return NextResponse.json(
        { error: 'Servidor MCP não encontrado' },
        { status: 404 }
      );
    }

    const tool = await db.mCPTool.create({
      data: {
        name,
        description,
        inputSchema: JSON.stringify(inputSchema),
        serverId
      },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    return NextResponse.json({ tool });
  } catch (error) {
    console.error('Erro ao criar ferramenta MCP:', error);
    return NextResponse.json(
      { error: 'Erro ao criar ferramenta MCP' },
      { status: 500 }
    );
  }
}