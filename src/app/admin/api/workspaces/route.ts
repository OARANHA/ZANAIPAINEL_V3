import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const workspaces = await db.workspace.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error('Erro ao buscar workspaces:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar workspaces' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, config } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const workspace = await db.workspace.create({
      data: {
        name,
        description: description || '',
        config: config || '{}',
        userId: 'default-user' // Em um sistema real, isso viria da autenticação
      }
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar workspace:', error);
    return NextResponse.json(
      { error: 'Erro ao criar workspace' },
      { status: 500 }
    );
  }
}