import { NextRequest, NextResponse } from 'next/server';
import { FlowiseConfigManager } from '@/lib/flowise-config';

// Configuração Flowise
const flowiseConfig = new FlowiseConfigManager();

// Handler principal para todas as operações Flowise
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const operation = searchParams.get('operation');
    const api = searchParams.get('api');

    // Validar configuração
    const validation = flowiseConfig.validate();
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Configuração inválida',
        details: validation.errors
      }, { status: 400 });
    }

    // Roteamento baseado na API e operação
    switch (api) {
      case 'assistants':
        return await handleAssistants(operation, searchParams);
      case 'attachments':
        return await handleAttachments(operation, searchParams);
      case 'documents':
        return await handleDocuments(operation, searchParams);
      case 'leads':
        return await handleLeads(operation, searchParams);
      case 'ping':
        return await handlePing(operation);
      case 'prediction':
        return await handlePrediction(operation, searchParams);
      case 'tools':
        return await handleTools(operation, searchParams);
      case 'variables':
        return await handleVariables(operation, searchParams);
      case 'vector':
        return await handleVector(operation, searchParams);
      default:
        return NextResponse.json({
          success: false,
          error: 'API não especificada ou inválida'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro na API Flowise:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operation, api, data } = body;

    // Validar configuração
    const validation = flowiseConfig.validate();
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: 'Configuração inválida',
        details: validation.errors
      }, { status: 400 });
    }

    // Roteamento baseado na API e operação
    switch (api) {
      case 'assistants':
        return await handleAssistantsPost(operation, data);
      case 'attachments':
        return await handleAttachmentsPost(operation, data);
      case 'documents':
        return await handleDocumentsPost(operation, data);
      case 'leads':
        return await handleLeadsPost(operation, data);
      case 'prediction':
        return await handlePredictionPost(operation, data);
      case 'tools':
        return await handleToolsPost(operation, data);
      case 'variables':
        return await handleVariablesPost(operation, data);
      case 'vector':
        return await handleVectorPost(operation, data);
      default:
        return NextResponse.json({
          success: false,
          error: 'API não especificada ou inválida'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro na API Flowise (POST):', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    }, { status: 500 });
  }
}

// ============================================
// HANDLERS PARA CADA API (GET)
// ============================================

// Assistants API - GET
async function handleAssistants(operation: string | null, searchParams: URLSearchParams) {
  const url = flowiseConfig.buildUrl('assistants');
  
  switch (operation) {
    case 'list':
      const response = await fetch(url, {
        headers: flowiseConfig.getHeaders()
      });
      const data = await response.json();
      return NextResponse.json({ success: true, data });
      
    case 'get':
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'ID do assistente é obrigatório'
        }, { status: 400 });
      }
      
      const getResponse = await fetch(`${url}/${id}`, {
        headers: flowiseConfig.getHeaders()
      });
      const getData = await getResponse.json();
      return NextResponse.json({ success: true, data: getData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Assistants API'
      }, { status: 400 });
  }
}

// Attachments API - GET
async function handleAttachments(operation: string | null, searchParams: URLSearchParams) {
  const url = flowiseConfig.buildUrl('attachments');
  
  switch (operation) {
    case 'list':
      const response = await fetch(url, {
        headers: flowiseConfig.getHeaders()
      });
      const data = await response.json();
      return NextResponse.json({ success: true, data });
      
    case 'get':
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'ID do anexo é obrigatório'
        }, { status: 400 });
      }
      
      const getResponse = await fetch(`${url}/${id}`, {
        headers: flowiseConfig.getHeaders()
      });
      const getData = await getResponse.json();
      return NextResponse.json({ success: true, data: getData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Attachments API'
      }, { status: 400 });
  }
}

// Documents API - GET
async function handleDocuments(operation: string | null, searchParams: URLSearchParams) {
  const baseUrl = flowiseConfig.buildUrl('documentStore');
  
  switch (operation) {
    case 'list':
      const response = await fetch(baseUrl, {
        headers: flowiseConfig.getHeaders()
      });
      const data = await response.json();
      return NextResponse.json({ success: true, data });
      
    case 'get':
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'ID do documento é obrigatório'
        }, { status: 400 });
      }
      
      const getResponse = await fetch(`${baseUrl}/${id}`, {
        headers: flowiseConfig.getHeaders()
      });
      const getData = await getResponse.json();
      return NextResponse.json({ success: true, data: getData });
      
    case 'search':
      const query = searchParams.get('query');
      if (!query) {
        return NextResponse.json({
          success: false,
          error: 'Query de busca é obrigatória'
        }, { status: 400 });
      }
      
      const searchParamsObj = new URLSearchParams();
      searchParamsObj.append('query', query);
      
      // Adicionar parâmetros opcionais
      const limit = searchParams.get('limit');
      const threshold = searchParams.get('threshold');
      if (limit) searchParamsObj.append('limit', limit);
      if (threshold) searchParamsObj.append('threshold', threshold);
      
      const searchResponse = await fetch(`${baseUrl}/search?${searchParamsObj.toString()}`, {
        headers: flowiseConfig.getHeaders()
      });
      const searchData = await searchResponse.json();
      return NextResponse.json({ success: true, data: searchData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Documents API'
      }, { status: 400 });
  }
}

// Leads API - GET
async function handleLeads(operation: string | null, searchParams: URLSearchParams) {
  const url = flowiseConfig.buildUrl('leads');
  
  switch (operation) {
    case 'list':
      const response = await fetch(url, {
        headers: flowiseConfig.getHeaders()
      });
      const data = await response.json();
      return NextResponse.json({ success: true, data });
      
    case 'get':
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'ID do lead é obrigatório'
        }, { status: 400 });
      }
      
      const getResponse = await fetch(`${url}/${id}`, {
        headers: flowiseConfig.getHeaders()
      });
      const getData = await getResponse.json();
      return NextResponse.json({ success: true, data: getData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Leads API'
      }, { status: 400 });
  }
}

// Ping API - GET
async function handlePing(operation: string | null) {
  const baseUrl = flowiseConfig.buildUrl('ping');
  
  switch (operation) {
    case 'ping':
      const response = await fetch(baseUrl, {
        headers: flowiseConfig.getHeaders()
      });
      const data = await response.json();
      return NextResponse.json({ success: true, data });
      
    case 'health':
      const healthResponse = await fetch(`${baseUrl}/health`, {
        headers: flowiseConfig.getHeaders()
      });
      const healthData = await healthResponse.json();
      return NextResponse.json({ success: true, data: healthData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Ping API'
      }, { status: 400 });
  }
}

// Prediction API - GET
async function handlePrediction(operation: string | null, searchParams: URLSearchParams) {
  const url = flowiseConfig.buildUrl('prediction');
  
  switch (operation) {
    case 'history':
      const response = await fetch(`${url}/history`, {
        headers: flowiseConfig.getHeaders()
      });
      const data = await response.json();
      return NextResponse.json({ success: true, data });
      
    case 'get':
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'ID da previsão é obrigatório'
        }, { status: 400 });
      }
      
      const getResponse = await fetch(`${url}/${id}`, {
        headers: flowiseConfig.getHeaders()
      });
      const getData = await getResponse.json();
      return NextResponse.json({ success: true, data: getData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Prediction API'
      }, { status: 400 });
  }
}

// Tools API - GET
async function handleTools(operation: string | null, searchParams: URLSearchParams) {
  const baseUrl = flowiseConfig.buildUrl('tools');
  
  switch (operation) {
    case 'list':
      const response = await fetch(baseUrl, {
        headers: flowiseConfig.getHeaders()
      });
      const data = await response.json();
      return NextResponse.json({ success: true, data });
      
    case 'get':
      const toolName = searchParams.get('toolName');
      if (!toolName) {
        return NextResponse.json({
          success: false,
          error: 'Nome da ferramenta é obrigatório'
        }, { status: 400 });
      }
      
      const getResponse = await fetch(`${baseUrl}/${toolName}`, {
        headers: flowiseConfig.getHeaders()
      });
      const getData = await getResponse.json();
      return NextResponse.json({ success: true, data: getData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Tools API'
      }, { status: 400 });
  }
}

// Variables API - GET
async function handleVariables(operation: string | null, searchParams: URLSearchParams) {
  const baseUrl = flowiseConfig.buildUrl('variables');
  
  switch (operation) {
    case 'list':
      const response = await fetch(baseUrl, {
        headers: flowiseConfig.getHeaders()
      });
      const data = await response.json();
      return NextResponse.json({ success: true, data });
      
    case 'get':
      const key = searchParams.get('key');
      if (!key) {
        return NextResponse.json({
          success: false,
          error: 'Chave da variável é obrigatória'
        }, { status: 400 });
      }
      
      const getResponse = await fetch(`${baseUrl}/${key}`, {
        headers: flowiseConfig.getHeaders()
      });
      const getData = await getResponse.json();
      return NextResponse.json({ success: true, data: getData });
      
    case 'category':
      const category = searchParams.get('category');
      if (!category) {
        return NextResponse.json({
          success: false,
          error: 'Categoria é obrigatória'
        }, { status: 400 });
      }
      
      const categoryResponse = await fetch(`${baseUrl}/category/${category}`, {
        headers: flowiseConfig.getHeaders()
      });
      const categoryData = await categoryResponse.json();
      return NextResponse.json({ success: true, data: categoryData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Variables API'
      }, { status: 400 });
  }
}

// Vector API - GET
async function handleVector(operation: string | null, searchParams: URLSearchParams) {
  const baseUrl = flowiseConfig.buildUrl('vectorUpsert');
  
  switch (operation) {
    case 'get':
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'ID do vetor é obrigatório'
        }, { status: 400 });
      }
      
      const getResponse = await fetch(`${baseUrl}/${id}`, {
        headers: flowiseConfig.getHeaders()
      });
      const getData = await getResponse.json();
      return NextResponse.json({ success: true, data: getData });
      
    case 'search':
      const query = searchParams.get('query');
      if (!query) {
        return NextResponse.json({
          success: false,
          error: 'Query de busca é obrigatória'
        }, { status: 400 });
      }
      
      const searchParamsObj = new URLSearchParams();
      searchParamsObj.append('query', query);
      
      // Adicionar parâmetros opcionais
      const limit = searchParams.get('limit');
      const threshold = searchParams.get('threshold');
      if (limit) searchParamsObj.append('limit', limit);
      if (threshold) searchParamsObj.append('threshold', threshold);
      
      const searchResponse = await fetch(`${baseUrl}/search?${searchParamsObj.toString()}`, {
        headers: flowiseConfig.getHeaders()
      });
      const searchData = await searchResponse.json();
      return NextResponse.json({ success: true, data: searchData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Vector API'
      }, { status: 400 });
  }
}

// ============================================
// HANDLERS PARA CADA API (POST)
// ============================================

// Assistants API - POST
async function handleAssistantsPost(operation: string | null, data: any) {
  const baseUrl = flowiseConfig.buildUrl('assistants');
  
  switch (operation) {
    case 'create':
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      return NextResponse.json({ success: true, data: responseData });
      
    case 'execute':
      const { id, input, context } = data;
      if (!id || !input) {
        return NextResponse.json({
          success: false,
          error: 'ID e input são obrigatórios para execução'
        }, { status: 400 });
      }
      
      const executeResponse = await fetch(`${baseUrl}/${id}/execute`, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify({ input, context })
      });
      const executeData = await executeResponse.json();
      return NextResponse.json({ success: true, data: executeData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Assistants API'
      }, { status: 400 });
  }
}

// Attachments API - POST
async function handleAttachmentsPost(operation: string | null, data: any) {
  const baseUrl = flowiseConfig.buildUrl('attachments');
  
  switch (operation) {
    case 'upload':
      // Este endpoint precisa de FormData, não JSON
      return NextResponse.json({
        success: false,
        error: 'Use o endpoint específico para upload de arquivos'
      }, { status: 400 });
      
    case 'process':
      const { id, options } = data;
      if (!id) {
        return NextResponse.json({
          success: false,
          error: 'ID do anexo é obrigatório'
        }, { status: 400 });
      }
      
      const processResponse = await fetch(`${baseUrl}/${id}/process`, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify(options)
      });
      const processData = await processResponse.json();
      return NextResponse.json({ success: true, data: processData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Attachments API'
      }, { status: 400 });
  }
}

// Documents API - POST
async function handleDocumentsPost(operation: string | null, data: any) {
  const baseUrl = flowiseConfig.buildUrl('documentStore');
  
  switch (operation) {
    case 'upsert':
      const response = await fetch(`${baseUrl}/upsert`, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      return NextResponse.json({ success: true, data: responseData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Documents API'
      }, { status: 400 });
  }
}

// Leads API - POST
async function handleLeadsPost(operation: string | null, data: any) {
  const baseUrl = flowiseConfig.buildUrl('leads');
  
  switch (operation) {
    case 'create':
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      return NextResponse.json({ success: true, data: responseData });
      
    case 'qualify':
      const { id, criteria } = data;
      if (!id || !criteria) {
        return NextResponse.json({
          success: false,
          error: 'ID e critérios são obrigatórios'
        }, { status: 400 });
      }
      
      const qualifyResponse = await fetch(`${baseUrl}/${id}/qualify`, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify(criteria)
      });
      const qualifyData = await qualifyResponse.json();
      return NextResponse.json({ success: true, data: qualifyData });
      
    case 'convert':
      const { id: convertId, conversionData } = data;
      if (!convertId || !conversionData) {
        return NextResponse.json({
          success: false,
          error: 'ID e dados de conversão são obrigatórios'
        }, { status: 400 });
      }
      
      const convertResponse = await fetch(`${baseUrl}/${convertId}/convert`, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify(conversionData)
      });
      const convertData = await convertResponse.json();
      return NextResponse.json({ success: true, data: convertData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Leads API'
      }, { status: 400 });
  }
}

// Prediction API - POST
async function handlePredictionPost(operation: string | null, data: any) {
  const baseUrl = flowiseConfig.buildUrl('prediction');
  
  switch (operation) {
    case 'predict':
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      return NextResponse.json({ success: true, data: responseData });
      
    case 'batch':
      const { inputs } = data;
      if (!inputs || !Array.isArray(inputs)) {
        return NextResponse.json({
          success: false,
          error: 'Inputs deve ser um array'
        }, { status: 400 });
      }
      
      const batchResponse = await fetch(`${baseUrl}/batch`, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify({ inputs })
      });
      const batchData = await batchResponse.json();
      return NextResponse.json({ success: true, data: batchData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Prediction API'
      }, { status: 400 });
  }
}

// Tools API - POST
async function handleToolsPost(operation: string | null, data: any) {
  const baseUrl = flowiseConfig.buildUrl('tools');
  
  switch (operation) {
    case 'register':
      const response = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      return NextResponse.json({ success: true, data: responseData });
      
    case 'execute':
      const { toolName, parameters } = data;
      if (!toolName || !parameters) {
        return NextResponse.json({
          success: false,
          error: 'Nome da ferramenta e parâmetros são obrigatórios'
        }, { status: 400 });
      }
      
      const executeResponse = await fetch(`${baseUrl}/${toolName}/execute`, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify({ parameters })
      });
      const executeData = await executeResponse.json();
      return NextResponse.json({ success: true, data: executeData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Tools API'
      }, { status: 400 });
  }
}

// Variables API - POST
async function handleVariablesPost(operation: string | null, data: any) {
  const baseUrl = flowiseConfig.buildUrl('variables');
  
  switch (operation) {
    case 'set':
      const { key, value, ...options } = data;
      if (!key || value === undefined) {
        return NextResponse.json({
          success: false,
          error: 'Chave e valor são obrigatórios'
        }, { status: 400 });
      }
      
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify({ key, value, ...options })
      });
      const responseData = await response.json();
      return NextResponse.json({ success: true, data: responseData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Variables API'
      }, { status: 400 });
  }
}

// Vector API - POST
async function handleVectorPost(operation: string | null, data: any) {
  const baseUrl = flowiseConfig.buildUrl('vectorUpsert');
  
  switch (operation) {
    case 'upsert':
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: flowiseConfig.getHeaders(),
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      return NextResponse.json({ success: true, data: responseData });
      
    default:
      return NextResponse.json({
        success: false,
        error: 'Operação inválida para Vector API'
      }, { status: 400 });
  }
}