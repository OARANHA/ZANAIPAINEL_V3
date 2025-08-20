import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { type, data, feedback, executionId } = await request.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      );
    }

    // Verificar se o agente existe
    const agent = await db.agent.findUnique({
      where: { id: params.id }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Criar registro de aprendizado
    const learning = await db.learning.create({
      data: {
        agentId: params.id,
        type, // 'feedback', 'pattern', 'adaptation'
        data: JSON.stringify(data),
        confidence: calculateConfidence(type, feedback)
      }
    });

    // Atualizar o conhecimento do agente com base no feedback
    if (type === 'feedback' && feedback) {
      await updateAgentKnowledge(params.id, feedback, data);
    }

    return NextResponse.json({
      message: 'Learning data recorded successfully',
      learningId: learning.id,
      type,
      confidence: learning.confidence
    });

  } catch (error) {
    console.error('Error recording learning data:', error);
    return NextResponse.json(
      { error: 'Failed to record learning data' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Verificar se o agente existe
    const agent = await db.agent.findUnique({
      where: { id: params.id }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    const whereClause = type ? { agentId: params.id, type } : { agentId: params.id };

    const learningData = await db.learning.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    // Calcular estatísticas de aprendizado
    const stats = await calculateLearningStats(params.id);

    return NextResponse.json({
      learningData,
      stats,
      agent: {
        id: agent.id,
        name: agent.name,
        type: agent.type
      }
    });

  } catch (error) {
    console.error('Error fetching learning data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learning data' },
      { status: 500 }
    );
  }
}

function calculateConfidence(type: string, feedback?: any): number {
  // Calcular confiança baseada no tipo de aprendizado e feedback
  let baseConfidence = 0.5;
  
  switch (type) {
    case 'feedback':
      baseConfidence = feedback?.rating ? feedback.rating / 5 : 0.7;
      break;
    case 'pattern':
      baseConfidence = 0.8;
      break;
    case 'adaptation':
      baseConfidence = 0.6;
      break;
    default:
      baseConfidence = 0.5;
  }

  return Math.min(Math.max(baseConfidence, 0.0), 1.0);
}

async function updateAgentKnowledge(agentId: string, feedback: any, data: any) {
  try {
    const agent = await db.agent.findUnique({
      where: { id: agentId }
    });

    if (!agent) return;

    // Criar novo conteúdo de conhecimento baseado no feedback
    const newKnowledge = generateKnowledgeFromFeedback(feedback, data);
    
    // Adicionar ao conhecimento existente
    const updatedKnowledge = agent.knowledge 
      ? `${agent.knowledge}\n\n${newKnowledge}`
      : newKnowledge;

    await db.agent.update({
      where: { id: agentId },
      data: { knowledge: updatedKnowledge }
    });

  } catch (error) {
    console.error('Error updating agent knowledge:', error);
  }
}

function generateKnowledgeFromFeedback(feedback: any, data: any): string {
  const timestamp = new Date().toISOString();
  
  return `## Aprendizado em ${timestamp}

### Tipo de Feedback
${feedback.type || 'Não especificado'}

### Conteúdo do Aprendizado
${feedback.content || 'Conteúdo não especificado'}

### Contexto
- Input: ${data.input || 'Não disponível'}
- Output: ${data.output || 'Não disponível'}
- Execução ID: ${data.executionId || 'Não disponível'}

### Melhorias Sugeridas
${feedback.suggestions ? feedback.suggestions.map((s: string) => `- ${s}`).join('\n') : 'Nenhuma sugestão específica'}

### Próximos Passos
${feedback.nextSteps ? feedback.nextSteps.map((s: string) => `- ${s}`).join('\n') : 'Continuar monitorando performance'}

---
`;
}

async function calculateLearningStats(agentId: string) {
  const [totalLearning, typeStats, avgConfidence] = await Promise.all([
    db.learning.count({ where: { agentId } }),
    db.learning.groupBy({
      by: ['type'],
      where: { agentId },
      _count: { type: true },
      _avg: { confidence: true }
    }),
    db.learning.aggregate({
      where: { agentId },
      _avg: { confidence: true }
    })
  ]);

  return {
    totalLearning,
    typeBreakdown: typeStats.reduce((acc, stat) => {
      acc[stat.type] = {
        count: stat._count.type,
        avgConfidence: stat._avg.confidence || 0
      };
      return acc;
    }, {} as any),
    averageConfidence: avgConfidence._avg.confidence || 0
  };
}