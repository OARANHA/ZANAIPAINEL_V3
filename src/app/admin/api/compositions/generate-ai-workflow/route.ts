import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, workflowType, complexity, workspaceId, availableAgents } = body;

    if (!description || !workspaceId) {
      return NextResponse.json(
        { error: 'Descrição e workspaceId são obrigatórios' },
        { status: 400 }
      );
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create();

    // Create a prompt for AI workflow generation
    const prompt = `
Você é um especialista em criação de workflows de IA. Com base na descrição fornecida, gere um workflow estruturado.

Descrição do workflow: ${description}
Tipo de workflow: ${workflowType}
Complexidade: ${complexity}
Agentes disponíveis: ${availableAgents.map((agent: any) => agent.name).join(', ')}

Gere um workflow no seguinte formato JSON:
{
  "name": "Nome do workflow gerado",
  "description": "Descrição detalhada do workflow",
  "nodes": [
    {
      "id": "node1",
      "type": "agent",
      "name": "Nome do nó",
      "description": "Descrição do nó",
      "config": {
        "agentId": "id_do_agente",
        "parameters": {}
      }
    }
  ],
  "edges": [
    {
      "source": "node1",
      "target": "node2",
      "type": "sequential"
    }
  ],
  "agents": ["id_do_agente1", "id_do_agente2"],
  "complexity": "${complexity}",
  "estimatedTime": "5-10 minutos"
}

Importante:
1. Use apenas os agentes disponíveis na lista fornecida
2. Crie nós e conexões lógicas baseadas no tipo de workflow (${workflowType})
3. A complexidade deve ser ${complexity}
4. Retorne APENAS o JSON válido, sem texto adicional
`;

    // Generate workflow using AI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em criação de workflows de IA que responde apenas com JSON válido.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    let workflow;
    try {
      // Extract JSON from the response
      const content = completion.choices[0]?.message?.content || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        workflow = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Não foi possível extrair JSON válido da resposta');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback to a basic workflow structure
      workflow = {
        name: "Workflow Gerado por IA",
        description: description,
        nodes: [
          {
            id: "node1",
            type: "agent",
            name: "Processamento Inicial",
            description: "Nó inicial do workflow",
            config: {
              agentId: availableAgents[0]?.id || "",
              parameters: {}
            }
          }
        ],
        edges: [],
        agents: availableAgents.slice(0, 1).map((agent: any) => agent.id),
        complexity: complexity,
        estimatedTime: "5-10 minutos"
      };
    }

    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Error generating AI workflow:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar workflow. Tente novamente.' },
      { status: 500 }
    );
  }
}