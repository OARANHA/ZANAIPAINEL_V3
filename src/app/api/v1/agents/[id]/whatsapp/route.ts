import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface WhatsAppRequest {
  phoneNumber: string;
  message: string;
  mediaUrl?: string;
  context?: {
    sessionId?: string;
    metadata?: Record<string, any>;
  };
}

interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  chatSessionId?: string;
  timestamp: string;
  metadata?: {
    deliveryStatus?: 'pending' | 'sent' | 'delivered' | 'read';
    whatsappApiStatus?: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const agentId = params.id;
    const body = await request.json();
    const { phoneNumber, message, mediaUrl, context }: WhatsAppRequest = body;

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    // Validar formato do número de telefone
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!formattedPhone) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Buscar agente e verificar permissões
    const agent = await db.agent.findFirst({
      where: {
        id: agentId,
        OR: [
          { userId: session.user.id },
          { workspace: { userId: session.user.id } }
        ]
      }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found or access denied' },
        { status: 404 }
      );
    }

    if (agent.status !== 'active') {
      return NextResponse.json(
        { error: 'Agent is not active' },
        { status: 400 }
      );
    }

    // Parse configuração do agente
    const agentConfig = JSON.parse(agent.config);
    const sessionId = context?.sessionId || generateWhatsAppSessionId();

    console.log(`📱 Sending WhatsApp message via agent ${agent.name} to ${formattedPhone}`);

    try {
      // Executar agente para processar a mensagem se necessário
      let processedMessage = message;
      if (shouldProcessWithAgent(message)) {
        const agentResponse = await executeAgentWithZAI(agentConfig, message, context);
        processedMessage = agentResponse.text;
      }

      // Enviar mensagem via WhatsApp API
      const whatsappResult = await sendWhatsAppMessage({
        to: formattedPhone,
        message: processedMessage,
        mediaUrl,
        agentId: agent.id,
        sessionId
      });

      // Registrar execução do agente para WhatsApp
      await db.agentExecution.create({
        data: {
          agentId: agent.id,
          input: `WhatsApp to ${formattedPhone}: ${message}`,
          output: processedMessage,
          status: 'completed',
          context: JSON.stringify({
            channel: 'whatsapp',
            sessionId,
            phoneNumber: formattedPhone,
            userId: session.user.id,
            ...context?.metadata
          }),
          result: JSON.stringify({
            whatsappMessageId: whatsappResult.messageId,
            deliveryStatus: whatsappResult.status,
            timestamp: whatsappResult.timestamp
          }),
          startedAt: new Date(),
          completedAt: new Date()
        }
      });

      // Registrar métricas
      await db.agentMetrics.create({
        data: {
          timestamp: BigInt(Date.now()),
          agentId: agent.id,
          metricName: 'whatsapp_messages_sent',
          metricValue: 1,
          tags: JSON.stringify({
            sessionId,
            phoneNumber: formattedPhone,
            userId: session.user.id
          })
        }
      });

      const response: WhatsAppResponse = {
        success: true,
        messageId: whatsappResult.messageId,
        chatSessionId: sessionId,
        timestamp: new Date().toISOString(),
        metadata: {
          deliveryStatus: whatsappResult.status,
          whatsappApiStatus: whatsappResult.apiStatus
        }
      };

      console.log(`✅ WhatsApp message sent successfully to ${formattedPhone}`);

      return NextResponse.json(response);

    } catch (error) {
      console.error(`❌ WhatsApp sending error for agent ${agent.name}:`, error);

      // Registrar execução com erro
      await db.agentExecution.create({
        data: {
          agentId: agent.id,
          input: `WhatsApp to ${formattedPhone}: ${message}`,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          context: JSON.stringify({
            channel: 'whatsapp',
            sessionId,
            phoneNumber: formattedPhone,
            userId: session.user.id
          }),
          startedAt: new Date(),
          completedAt: new Date()
        }
      });

      return NextResponse.json(
        { 
          error: 'WhatsApp message sending failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ WhatsApp API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Webhook para receber mensagens do WhatsApp
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Verificação do webhook do WhatsApp
    if (mode === 'subscribe' && token) {
      const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'zanai-whatsapp-2024';
      
      if (token === expectedToken) {
        console.log('✅ WhatsApp webhook verified successfully');
        return new NextResponse(challenge, { status: 200 });
      } else {
        console.error('❌ Invalid WhatsApp verify token');
        return NextResponse.json(
          { error: 'Invalid verification token' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ WhatsApp webhook verification error:', error);
    
    return NextResponse.json(
      { 
        error: 'Webhook verification failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Função para formatar número de telefone
function formatPhoneNumber(phone: string): string | null {
  // Remover caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Verificar se é um número válido (com código do país)
  if (cleaned.length < 10 || cleaned.length > 15) {
    return null;
  }
  
  // Garantir que comece com código do país
  if (!cleaned.startsWith('55') && cleaned.length === 11) {
    // Assumir Brasil se não tiver código do país e tiver 11 dígitos
    return `55${cleaned}`;
  }
  
  return cleaned;
}

// Função para gerar ID de sessão WhatsApp
function generateWhatsAppSessionId(): string {
  return `wa_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Função para verificar se a mensagem deve ser processada pelo agente
function shouldProcessWithAgent(message: string): boolean {
  const agentTriggers = [
    'analise', 'analise', 'analyze', 'ajuda', 'help', 
    'recomende', 'recommend', 'sugira', 'suggest',
    'o que você acha', 'what do you think', 'como resolver'
  ];
  
  const lowerMessage = message.toLowerCase();
  return agentTriggers.some(trigger => lowerMessage.includes(trigger));
}

// Função para executar agente com ZAI SDK
async function executeAgentWithZAI(agentConfig: any, message: string, context?: any) {
  try {
    const ZAI = await import('z-ai-web-dev-sdk');
    const zai = await ZAI.create();

    const messages = [
      {
        role: 'system',
        content: `${agentConfig.systemPrompt || 'You are a helpful assistant.'}\n\nIMPORTANTE: Você está respondendo via WhatsApp. Mantenha as respostas concisas, diretas e formatadas para fácil leitura em dispositivo móvel. Use emojis quando apropriado e evite textos muito longos.`
      },
      {
        role: 'user',
        content: `Processar esta mensagem para WhatsApp: ${message}`
      }
    ];

    const completion = await zai.chat.completions.create({
      messages,
      model: agentConfig.model || 'gpt-4',
      temperature: agentConfig.temperature ?? 0.7,
      max_tokens: agentConfig.maxTokens ?? 1000, // Limitar para WhatsApp
    });

    const responseText = completion.choices[0]?.message?.content || 'No response generated';
    
    return {
      text: responseText,
      model: agentConfig.model || 'gpt-4',
      tokensUsed: Math.ceil((agentConfig.systemPrompt?.length || 0 + message.length + responseText.length) / 4),
      rawResponse: completion
    };

  } catch (error) {
    console.error('❌ ZAI SDK execution error:', error);
    
    return {
      text: 'Desculpe, não consegui processar sua mensagem no momento. Tente novamente mais tarde.',
      model: agentConfig?.model || 'gpt-4',
      tokensUsed: 20,
      rawResponse: null
    };
  }
}

// Função para enviar mensagem via WhatsApp API
async function sendWhatsAppMessage(params: {
  to: string;
  message: string;
  mediaUrl?: string;
  agentId: string;
  sessionId: string;
}) {
  // Implementação simulada - em produção, integrar com API real do WhatsApp Business
  // como Twilio, MessageBird, ou WhatsApp Business API diretamente
  
  console.log(`📤 Simulating WhatsApp send to ${params.to}: ${params.message.substring(0, 50)}...`);
  
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Gerar ID de mensagem simulado
  const messageId = `wa_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    messageId,
    status: 'sent' as const,
    apiStatus: 'success',
    timestamp: new Date().toISOString()
  };
}

// Função para processar webhooks do WhatsApp (para uso futuro)
export async function handleWhatsAppWebhook(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📥 Received WhatsApp webhook:', JSON.stringify(body, null, 2));
    
    // Processar diferentes tipos de eventos do WhatsApp
    if (body.object === 'whatsapp_business_account') {
      const entries = body.entry || [];
      
      for (const entry of entries) {
        const changes = entry.changes || [];
        
        for (const change of changes) {
          if (change.field === 'messages') {
            const messages = change.value.messages || [];
            
            for (const message of messages) {
              if (message.type === 'text' || message.type === 'interactive') {
                await processIncomingWhatsAppMessage(message);
              }
            }
          }
        }
      }
    }
    
    return NextResponse.json({ status: 'ok' });
    
  } catch (error) {
    console.error('❌ WhatsApp webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Função para processar mensagens recebidas do WhatsApp
async function processIncomingWhatsAppMessage(message: any) {
  try {
    const from = message.from;
    const text = message.text?.body || '';
    const messageId = message.id;
    const timestamp = message.timestamp;
    
    console.log(`📨 Processing WhatsApp message from ${from}: ${text}`);
    
    // Aqui você pode implementar lógica para:
    // 1. Identificar o agente responsável
    // 2. Processar a mensagem com o agente
    // 3. Enviar resposta de volta ao WhatsApp
    
    // Por enquanto, apenas logamos a mensagem
    await db.auditLog.create({
      data: {
        action: 'whatsapp_message_received',
        entityType: 'whatsapp',
        entityId: messageId,
        newValues: JSON.stringify({
          from,
          text,
          timestamp
        })
      }
    });
    
  } catch (error) {
    console.error('❌ Error processing WhatsApp message:', error);
  }
}