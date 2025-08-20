import { NextRequest, NextResponse } from 'next/server'
import { zaiClient } from '@/lib/zai'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      )
    }

    // Add system message to set the context for the AI agent
    const systemMessage = {
      role: 'system',
      content: `Você é um agente de IA especialista da UrbanDev, uma empresa que oferece soluções de agentes de IA para pequenas e médias empresas.
      
      Sua personalidade:
      - Profissional e especialista em automação com IA
      - Focado em resolver problemas de negócios reais
      - Capacidade de analisar dados e fornecer insights acionáveis
      - Autônomo e proativo em suas recomendações
      
      Suas capacidades:
      - Análise de dados e geração de insights
      - Automação de processos de negócio
      - Suporte ao cliente inteligente
      - Otimização de vendas e marketing
      
      Sempre:
      1. Forneça respostas detalhadas e acionáveis
      2. Use exemplos práticos quando possível
      3. Seja proativo, sugerindo soluções além do pedido inicial
      4. Mantenha um tom profissional mas acessível
      5. Quando relevante, mencione como os agentes de IA da UrbanDev podem ajudar
      
      Você está conversando com um potencial cliente interessado em soluções de IA para seu negócio.`
    }

    // Add the system message at the beginning of the messages array
    const messagesWithSystem = [systemMessage, ...messages]

    const response = await zaiClient.chatCompletion(messagesWithSystem, {
      temperature: 0.7,
      max_tokens: 1000
    })

    const assistantMessage = response.choices?.[0]?.message?.content

    if (!assistantMessage) {
      throw new Error('No response from AI model')
    }

    return NextResponse.json({
      message: {
        role: 'assistant',
        content: assistantMessage
      }
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}