import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { topic, type, audience } = await request.json()

    if (!topic || !type) {
      return NextResponse.json(
        { error: 'Topic and type are required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    let prompt = ''
    
    switch (type) {
      case 'article':
        prompt = `Crie um artigo completo sobre "${topic}" para ${audience || 'empreendedores e gestores de negócios'}. 
        O artigo deve ter:
        1. Um título chamativo e SEO-friendly
        2. Introdução engajante que apresente o problema
        3. Desenvolvimento com pontos principais e exemplos práticos
        4. Conclusão com call-to-action
        5. Formato em markdown com headers, listas e ênfase onde necessário
        6. Tom profissional mas acessível
        7. Foco em aplicações práticas para pequenos e médios negócios
        8. Incluir dados e estatísticas relevantes quando possível
        
        O artigo deve ser em português e ter entre 800-1200 palavras.`
        break

      case 'tutorial':
        prompt = `Crie um tutorial passo a passo sobre "${topic}" para ${audience || 'iniciantes em tecnologia'}. 
        O tutorial deve incluir:
        1. Título claro e descritivo
        2. Introdução explicando o que será aprendido
        3. Pré-requisitos necessários
        4. Passos detalhados com exemplos de código quando aplicável
        5. Dicas e melhores práticas
        6. Solução de problemas comuns
        7. Conclusão com próximos passos
        8. Formato em markdown com headers, listas numeradas e blocos de código
        
        O tutorial deve ser em português, prático e fácil de seguir.`
        break

      case 'case_study':
        prompt = `Crie um estudo de caso sobre "${topic}" mostrando como empresas implementaram soluções de IA.
        O estudo de caso deve incluir:
        1. Título que destaque o resultado principal
        2. Contexto e desafio inicial
        3. Solução implementada (agentes de IA, automação, etc.)
        4. Processo de implementação
        5. Resultados quantificáveis com métricas específicas
        6. Lições aprendidas
        7. Recomendações para outras empresas
        8. Formato em markdown com headers, listas e destaques
        
        O estudo deve ser em português, baseado em cenários realistas e incluir dados concretos.`
        break

      case 'trends':
        prompt = `Crie uma análise de tendências sobre "${topic}" para o mercado brasileiro.
        A análise deve incluir:
        1. Título que reflita a principal tendência
        2. Introdução sobre a importância do tema
        3. Principais tendências atuais e emergentes
        4. Impacto nos negócios (oportunidades e desafios)
        5. Previsões para os próximos 2-3 anos
        6. Recomendações estratégicas
        7. Casos de exemplos reais quando possível
        8. Formato em markdown com headers, listas e destaques
        
        A análise deve ser em português, focada no mercado brasileiro e com dados atualizados.`
        break

      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        )
    }

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em conteúdo para negócios, com foco em inteligência artificial, automação e tecnologia para pequenos e médios negócios. Seu conteúdo deve ser prático, informativo e orientado para ação.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'Failed to generate content' },
        { status: 500 }
      )
    }

    // Extract title from the generated content
    const lines = content.split('\n')
    const title = lines.find(line => line.startsWith('# '))?.replace('# ', '').trim() || topic

    // Generate a summary
    const summaryPrompt = `Crie um resumo conciso (máximo 150 palavras) para este artigo sobre "${topic}":\n\n${content.substring(0, 500)}...`
    
    const summaryCompletion = await zai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: summaryPrompt
        }
      ],
      temperature: 0.5,
      max_tokens: 200
    })

    const summary = summaryCompletion.choices[0]?.message?.content || ''

    return NextResponse.json({
      title,
      content,
      summary,
      type,
      topic,
      audience: audience || 'Geral',
      createdAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating blog content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}