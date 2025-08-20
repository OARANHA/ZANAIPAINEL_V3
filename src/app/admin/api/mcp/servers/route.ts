import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const servers = await db.mCPServer.findMany({
      include: {
        workspace: {
          select: {
            id: true,
            name: true
          }
        },
        tools: {
          select: {
            id: true,
            name: true,
            description: true,
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
        },
        _count: {
          select: {
            tools: true,
            connections: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ servers });
  } catch (error) {
    console.error('Erro ao buscar servidores MCP:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar servidores MCP' },
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
      type,
      command,
      args,
      url,
      env,
      headers,
      workspaceId
    } = body;

    // Validar campos obrigatórios
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Nome e tipo são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar campos específicos por tipo
    if (type === 'stdio' && !command) {
      return NextResponse.json(
        { error: 'Comando é obrigatório para servidores stdio' },
        { status: 400 }
      );
    }

    if ((type === 'sse' || type === 'http') && !url) {
      return NextResponse.json(
        { error: 'URL é obrigatória para servidores SSE/HTTP' },
        { status: 400 }
      );
    }

    const server = await db.mCPServer.create({
      data: {
        name,
        description,
        type,
        command,
        args: args ? JSON.stringify(args) : null,
        url,
        env: env ? JSON.stringify(env) : null,
        headers: headers ? JSON.stringify(headers) : null,
        workspaceId
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true
          }
        },
        tools: true
      }
    });

    return NextResponse.json({ server });
  } catch (error) {
    console.error('Erro ao criar servidor MCP:', error);
    return NextResponse.json(
      { error: 'Erro ao criar servidor MCP' },
      { status: 500 }
    );
  }
}