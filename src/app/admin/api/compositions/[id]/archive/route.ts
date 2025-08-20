import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const compositionId = params.id;

    // Buscar a composição atual
    const composition = await db.composition.findUnique({
      where: { id: compositionId }
    });

    if (!composition) {
      return NextResponse.json(
        { error: 'Composição não encontrada' },
        { status: 404 }
      );
    }

    // Alternar entre active e inactive
    const newStatus = composition.status === 'active' ? 'inactive' : 'active';

    const updatedComposition = await db.composition.update({
      where: { id: compositionId },
      data: { status: newStatus },
      include: {
        workspace: true,
        agents: true
      }
    });

    return NextResponse.json(updatedComposition);

  } catch (error) {
    console.error('Erro ao arquivar/desarquivar composição:', error);
    return NextResponse.json(
      { error: 'Erro ao arquivar/desarquivar composição' },
      { status: 500 }
    );
  }
}