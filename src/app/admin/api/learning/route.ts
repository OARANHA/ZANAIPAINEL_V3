import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const learningData = await db.learning.findMany({
      include: {
        agent: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limitar para evitar sobrecarga
    });

    return NextResponse.json(learningData);
  } catch (error) {
    console.error('Erro ao buscar dados de aprendizado:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados de aprendizado' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { agentId, type, data, confidence } = await request.json();

    if (!agentId || !type || !data) {
      return NextResponse.json(
        { error: 'Agente, tipo e dados são obrigatórios' },
        { status: 400 }
      );
    }

    const learning = await db.learning.create({
      data: {
        agentId,
        type,
        data: JSON.stringify(data),
        confidence: confidence || 0.0
      }
    });

    return NextResponse.json(learning, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar registro de aprendizado:', error);
    return NextResponse.json(
      { error: 'Erro ao criar registro de aprendizado' },
      { status: 500 }
    );
  }
}