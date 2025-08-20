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

    // Criar objeto de exportação no formato KiloCode
    const exportData = {
      customModes: [
        {
          slug: agent.slug || agent.name.toLowerCase().replace(/\s+/g, '-'),
          name: agent.name,
          roleDefinition: agent.description || `Você é um agente especialista chamado ${agent.name}`,
          groups: [
            "read",
            ["edit", { "fileRegex": "\\.(md|ts|js|py|java|cpp|c|h|go|rs|php|rb)$", "description": "Arquivos de código e documentação" }]
          ],
          customInstructions: agent.config?.instructions || `Siga as diretrizes do agente ${agent.name}`
        }
      ],
      rules: agent.knowledge ? [
        {
          filename: "knowledge.md",
          content: agent.knowledge
        }
      ] : []
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting agent:', error);
    return NextResponse.json(
      { error: 'Failed to export agent' },
      { status: 500 }
    );
  }
}