import { NextRequest, NextResponse } from 'next/server';

const FLOWISE_API_URL = 'https://aaranha-zania.hf.space';
const FLOWISE_API_KEY = 'wNFL5HJcOA3RwJdKiVTUWqdzigK7OCUwRKo9KEgjenw';

interface ZanaiAgentRequest {
  agentId: string;
  input: string;
  context?: any;
}

interface FlowisePredictionRequest {
  chatflowId: string;
  question: string;
  overrideConfig?: {
    agentId?: string;
    context?: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, input, context }: ZanaiAgentRequest = body;

    if (!agentId || !input) {
      return NextResponse.json(
        { error: 'agentId and input are required' },
        { status: 400 }
      );
    }

    console.log(`🚀 Executing Zanai agent via Flowise: ${agentId}`);

    // Mapeamento de agentes Zanai para chatflows Flowise
    // NOTA: Você precisará criar estes chatflows no seu Flowise primeiro
    const agentToChatflowMap: Record<string, string> = {
      'cmed1m191000fs4kjxpx0a0hy': 'architect-agent-flow', // Arquiteto de Software
      'cmed1m18o0003s4kje0n78m2f': 'datascientist-agent-flow', // Cientista de Dados  
      'cmed1m195000js4kjqyvhx9s1': 'devops-agent-flow', // Engenheiro de DevOps
    };

    const chatflowId = agentToChatflowMap[agentId];
    if (!chatflowId) {
      return NextResponse.json(
        { error: `No Flowise chatflow found for agent: ${agentId}` },
        { status: 404 }
      );
    }

    // Preparar requisição para Flowise API
    const flowiseRequest: FlowisePredictionRequest = {
      chatflowId: chatflowId,
      question: input,
      overrideConfig: {
        agentId: agentId,
        context: context || {}
      }
    };

    console.log('📡 Sending request to Flowise:', {
      url: `${FLOWISE_API_URL}/api/v1/prediction/${chatflowId}`,
      chatflowId,
      agentId,
      inputLength: input.length
    });

    // Fazer requisição para Flowise
    const response = await fetch(`${FLOWISE_API_URL}/api/v1/prediction/${chatflowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FLOWISE_API_KEY}`,
      },
      body: JSON.stringify(flowiseRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Flowise API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      return NextResponse.json(
        { 
          error: 'Flowise API request failed',
          details: errorText,
          status: response.status
        },
        { status: 500 }
      );
    }

    const flowiseResponse = await response.json();
    console.log('✅ Flowise Response:', {
      chatflowId,
      hasText: !!flowiseResponse.text,
      hasAnswer: !!flowiseResponse.answer,
      keys: Object.keys(flowiseResponse)
    });

    // Processar resposta do Flowise
    const processedResponse = {
      agentId,
      output: flowiseResponse.text || flowiseResponse.answer || 'No response from Flowise',
      rawResponse: flowiseResponse,
      timestamp: new Date().toISOString(),
      success: true
    };

    return NextResponse.json(processedResponse);

  } catch (error) {
    console.error('❌ Zanai-Flowise Integration Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Endpoint para testar a conexão com Flowise
export async function GET() {
  try {
    console.log('🔍 Testing Flowise connection...');

    const response = await fetch(`${FLOWISE_API_URL}/api/v1/chatflows`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${FLOWISE_API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Flowise connection test failed',
          status: response.status,
          statusText: response.statusText
        },
        { status: 500 }
      );
    }

    const chatflows = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Flowise connection successful',
      chatflowCount: Array.isArray(chatflows) ? chatflows.length : 0,
      chatflows: Array.isArray(chatflows) ? chatflows.slice(0, 5) : [], // Primeiros 5 chatflows
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Flowise Connection Test Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Flowise connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}