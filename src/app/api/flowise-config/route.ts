import { NextRequest, NextResponse } from 'next/server';
import { FlowiseConfigGenerator } from '@/lib/flowise-config-generator';
import { apiConfigManager } from '@/lib/api-config';

export async function POST(request: NextRequest) {
  try {
    const agentData = await request.json();
    
    // Validar dados básicos do agente
    if (!agentData.name) {
      return NextResponse.json(
        { error: 'Nome do agente é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se há provedores de API configurados
    const providers = apiConfigManager.getActiveProviders();
    if (providers.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum provedor de API configurado' },
        { status: 400 }
      );
    }

    // Gerar configuração do Flowise
    const config = await FlowiseConfigGenerator.generateCompleteConfig(agentData);
    
    // Validar configuração gerada
    const validation = FlowiseConfigGenerator.validateConfig(config);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Configuração inválida',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Retornar configuração gerada
    return NextResponse.json({
      success: true,
      config,
      validation,
      exportFormats: {
        json: FlowiseConfigGenerator.exportToJSON(config),
        flowise: config // Formato nativo para importação no Flowise
      }
    });

  } catch (error) {
    console.error('Erro ao gerar configuração do Flowise:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Retornar informações sobre os provedores disponíveis
    const providers = apiConfigManager.getActiveProviders();
    const defaultProvider = apiConfigManager.getDefaultProvider();
    
    return NextResponse.json({
      providers: providers.map(p => ({
        id: p.id,
        name: p.name,
        models: p.models,
        isDefault: p.id === defaultProvider?.id
      })),
      defaultProvider: defaultProvider ? {
        id: defaultProvider.id,
        name: defaultProvider.name,
        models: defaultProvider.models
      } : null,
      agentTypes: [
        { value: 'chat', label: 'Chat Simples', description: 'Agente de conversação básico' },
        { value: 'rag', label: 'RAG', description: 'Agente com recuperação de documentos' },
        { value: 'assistant', label: 'Assistente', description: 'Agente com ferramentas' }
      ]
    });

  } catch (error) {
    console.error('Erro ao obter informações de configuração:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}