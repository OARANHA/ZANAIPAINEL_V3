import { NextRequest, NextResponse } from 'next/server';
import { FlowiseConfigManager } from '@/lib/flowise-config';

const flowiseConfig = new FlowiseConfigManager();

export async function POST(request: NextRequest) {
  try {
    // Validar configuração
    const validation = flowiseConfig.validate();
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Configuração inválida',
        details: validation.errors
      }, { status: 400 });
    }

    // Obter dados do formulário
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = formData.get('metadata');

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Arquivo é obrigatório'
      }, { status: 400 });
    }

    // Preparar FormData para enviar para Flowise
    const flowiseFormData = new FormData();
    flowiseFormData.append('file', file);
    
    if (metadata) {
      try {
        const parsedMetadata = JSON.parse(metadata as string);
        flowiseFormData.append('metadata', JSON.stringify(parsedMetadata));
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: 'Metadata inválido (deve ser JSON)'
        }, { status: 400 });
      }
    }

    // Enviar para Flowise
    const response = await fetch(flowiseConfig.buildUrl('attachments', 'upload'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flowiseConfig.getApiKey()}`
      },
      body: flowiseFormData
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: 'Erro no upload para Flowise',
        details: errorText
      }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        originalFilename: file.name,
        fileSize: file.size,
        mimeType: file.type
      }
    });

  } catch (error) {
    console.error('Erro no upload de arquivo:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    }, { status: 500 });
  }
}