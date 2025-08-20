import { NextRequest, NextResponse } from 'next/server'

const FLOWISE_API_URL = process.env.FLOWISE_API_URL || 'http://localhost:3001'
const FLOWISE_API_KEY = process.env.FLOWISE_API_KEY

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  flowiseId?: string
  agentType?: string
}

interface FlowisePredictionRequest {
  question: string
  overrideConfig?: {
    systemMessage?: string
    temperature?: number
    maxTokens?: number
  }
}

interface FlowiseChatflow {
  id: string
  name: string
  type: 'chatflow' | 'agentflow'
  category?: string
}

// Mapeamento de tipos de agentes para IDs de chatflows do Flowise
const AGENT_FLOWS: Record<string, string> = {
  vendas: process.env.FLOWISE_VENDAS_FLOW_ID || '',
  suporte: process.env.FLOWISE_SUPORTE_FLOW_ID || '',
  marketing: process.env.FLOWISE_MARKETING_FLOW_ID || '',
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, flowiseId, agentType } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma mensagem fornecida' },
        { status: 400 }
      )
    }

    // Determinar o ID do flow a ser usado
    let targetFlowId = flowiseId
    if (!targetFlowId && agentType && AGENT_FLOWS[agentType]) {
      targetFlowId = AGENT_FLOWS[agentType]
    }

    if (!targetFlowId) {
      return NextResponse.json(
        { error: 'ID do flow ou tipo de agente não fornecido' },
        { status: 400 }
      )
    }

    // Obter a última mensagem do usuário
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Última mensagem deve ser do usuário' },
        { status: 400 }
      )
    }

    // Preparar contexto do histórico de mensagens
    const contextMessages = messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`)
      .join('\n')

    // Configurar a requisição para o Flowise
    const flowiseRequest: FlowisePredictionRequest = {
      question: lastMessage.content,
      overrideConfig: {
        systemMessage: `Você é um agente de IA especializado${agentType ? ` em ${agentType}` : ''}. 
        Use o contexto da conversa anterior para fornecer respostas coerentes e personalizadas.
        
        Contexto da conversa:
        ${contextMessages}
        
        Responda de forma profissional, útil e alinhada com o seu papel como agente.`,
        temperature: 0.7,
        maxTokens: 1000,
      },
    }

    // Fazer a requisição para o Flowise
    const response = await fetch(`${FLOWISE_API_URL}/api/v1/prediction/${targetFlowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(FLOWISE_API_KEY && { 'Authorization': `Bearer ${FLOWISE_API_KEY}` }),
      },
      body: JSON.stringify(flowiseRequest),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro do Flowise:', errorText)
      return NextResponse.json(
        { error: 'Erro ao comunicar com o Flowise' },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    // Extrair a resposta do Flowise
    const assistantResponse = data.text || data.answer || data.response || 'Desculpe, não consegui processar sua solicitação.'

    return NextResponse.json({
      response: assistantResponse,
      agentType,
      flowiseId: targetFlowId,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Erro na API de chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Endpoint para listar os chatflows disponíveis
export async function GET() {
  try {
    const response = await fetch(`${FLOWISE_API_URL}/api/v1/chatflows`, {
      headers: {
        ...(FLOWISE_API_KEY && { 'Authorization': `Bearer ${FLOWISE_API_KEY}` }),
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao buscar chatflows' },
        { status: 500 }
      )
    }

    const chatflows: FlowiseChatflow[] = await response.json()
    
    // Filtrar apenas os flows relevantes para agentes
    const agentFlows = chatflows.filter(flow => 
      flow.type === 'agentflow' || 
      flow.category?.toLowerCase().includes('agente') ||
      flow.name.toLowerCase().includes('agente')
    )

    return NextResponse.json({
      chatflows: agentFlows,
      agentTypes: Object.keys(AGENT_FLOWS).map(key => ({
        id: key,
        name: key.charAt(0).toUpperCase() + key.slice(1),
        flowId: AGENT_FLOWS[key],
      })),
    })

  } catch (error) {
    console.error('Erro ao listar chatflows:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}