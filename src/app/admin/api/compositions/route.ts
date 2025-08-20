import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const compositions = await db.composition.findMany({
      include: {
        workspace: true,
        agents: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(compositions);
  } catch (error) {
    console.error('Erro ao buscar composições:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar composições' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, workspaceId, agents } = await request.json();

    if (!name || !workspaceId) {
      return NextResponse.json(
        { error: 'Nome e workspace são obrigatórios' },
        { status: 400 }
      );
    }

    const composition = await db.composition.create({
      data: {
        name,
        description: description || '',
        config: '{}',
        workspaceId,
        status: 'active'
      }
    });

    // Conectar agentes à composição se fornecidos
    if (agents && agents.length > 0) {
      await db.composition.update({
        where: { id: composition.id },
        data: {
          agents: {
            connect: agents.map((id: string) => ({ id }))
          }
        }
      });
    }

    const updatedComposition = await db.composition.findUnique({
      where: { id: composition.id },
      include: {
        workspace: true,
        agents: true
      }
    });

    return NextResponse.json(updatedComposition, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar composição:', error);
    return NextResponse.json(
      { error: 'Erro ao criar composição' },
      { status: 500 }
    );
  }
}