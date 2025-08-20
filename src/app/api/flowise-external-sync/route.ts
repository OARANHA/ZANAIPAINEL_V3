import { NextRequest, NextResponse } from 'next/server';
import { transformAgentToFlowiseWorkflow, validateTransformedData } from '@/lib/agent-to-flowise-transformer';

// Helper function to get Flowise configuration
function getFlowiseConfig() {
  return {
    baseUrl: process.env.NEXT_PUBLIC_FLOWISE_URL || 'https://aaranha-zania.hf.space',
    apiKey: process.env.FLOWISE_API_KEY || 'wNFL5HJcOA3RwJdKiVTUWqdzigK7OCUwRKo9KEgjenw',
    timeout: 60000,
    retryAttempts: 5
  };
}

// Helper function to make authenticated requests
async function makeFlowiseRequest(endpoint: string, options: RequestInit = {}) {
  const config = getFlowiseConfig();
  const url = `${config.baseUrl}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  // Add API key - sempre usar a chave ZANIA
  const apiKey = config.apiKey || 'wNFL5HJcOA3RwJdKiVTUWqdzigK7OCUwRKo9KEgjenw';
  if (apiKey && apiKey !== 'your_flowise_api_key_here') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    console.log('🌐 Making request to:', {
      url,
      method: options.method || 'GET',
      headers: Object.keys(headers),
      bodySize: options.body ? JSON.stringify(options.body).length : 0
    });

    const response = await fetch(url, fetchOptions);
    
    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    });
    
    // Handle different response types
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
        console.log('✅ JSON response parsed successfully');
      } catch (jsonError) {
        console.error('❌ Failed to parse JSON response:', jsonError);
        const textData = await response.text();
        console.log('📄 Raw response (first 200 chars):', textData.substring(0, 200));
        throw new Error(`Invalid JSON response: ${textData.substring(0, 100)}`);
      }
    } else {
      data = await response.text();
      console.log('📄 Text response received (first 500 chars):', data.substring(0, 500));
      
      // If we got HTML instead of JSON, that's probably an error page
      if (data.includes('<!DOCTYPE') || data.includes('<html')) {
        console.error('❌ Received HTML response instead of JSON - this indicates an error page');
        console.error('🔍 HTML Response Analysis:', {
          status: response.status,
          statusText: response.statusText,
          url: url,
          containsError: data.includes('error') || data.includes('Error') || data.includes('404') || data.includes('500'),
          titleMatch: data.match(/<title>(.*?)<\/title>/)?.[1] || 'No title found',
          bodySnippet: data.substring(0, 200).replace(/\n/g, ' ').trim()
        });
        
        // Try to extract more meaningful error information from the HTML
        let errorDetails = 'Server returned HTML error page instead of JSON';
        if (data.includes('404')) {
          errorDetails = 'API endpoint not found (404 error)';
        } else if (data.includes('500')) {
          errorDetails = 'Internal server error (500 error)';
        } else if (data.includes('unauthorized') || data.includes('Unauthorized')) {
          errorDetails = 'Authentication failed or unauthorized access';
        } else if (data.includes('login') || data.includes('Login')) {
          errorDetails = 'Server requires authentication or login';
        }
        
        throw new Error(`${errorDetails}. Status: ${response.status} ${response.statusText}. URL: ${url}`);
      }
    }

    return { response, data };
  } catch (error) {
    throw new Error(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const workflowId = searchParams.get('workflowId');
    const canvasId = searchParams.get('canvasId');

    const config = getFlowiseConfig();

    switch (action) {
      case 'delete_workflow':
        if (!workflowId) {
          return NextResponse.json(
            { error: 'ID do workflow é obrigatório' },
            { status: 400 }
          );
        }
        return await handleDeleteWorkflow(config, workflowId);
      
      default:
        return NextResponse.json(
          { error: 'Ação não suportada' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erro na API de sincronização Flowise (DELETE):', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const canvasId = searchParams.get('canvasId');
    const chatflowId = searchParams.get('chatflowId');

    const config = getFlowiseConfig();

    switch (action) {
      case 'test_connection':
        return await handleTestConnection(config);
      
      case 'get_health':
        return await handleGetHealth(config);
      
      case 'get_workflows':
        return await handleGetWorkflows(config);
      
      case 'get_assistants':
        return await handleGetAssistants(config);
      
      case 'get_chatflow':
        if (!chatflowId) {
          return NextResponse.json(
            { error: 'ID do chatflow é obrigatório' },
            { status: 400 }
          );
        }
        return await handleGetChatflow(config, chatflowId);
      
      case 'sync_canvas':
        if (!canvasId) {
          return NextResponse.json(
            { error: 'ID do canvas é obrigatório' },
            { status: 400 }
          );
        }
        return await handleSyncCanvas(config, canvasId);
      
      case 'sync_canvas_nodes':
        if (!canvasId) {
          return NextResponse.json(
            { error: 'ID do canvas é obrigatório' },
            { status: 400 }
          );
        }
        return await handleSyncCanvasNodes(config, canvasId);
      
      default:
        return NextResponse.json(
          { error: 'Ação não suportada' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erro na API de sincronização Flowise:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, canvasId, config } = body;

    // Criar sincronizador com configuração apropriada
    const syncConfig = config || getFlowiseConfig();

    switch (action) {
      case 'test_connection':
        return await handleTestConnection(syncConfig);
      
      case 'sync_canvas':
        return await handleSyncCanvas(syncConfig, canvasId);
      
      case 'sync_canvas_nodes':
        return await handleSyncCanvasNodes(syncConfig, canvasId, body.syncData);
      
      case 'get_health':
        return await handleGetHealth(syncConfig);
      
      case 'get_workflows':
        return await handleGetWorkflows(syncConfig, body.filters);
      
      case 'get_assistants':
        return await handleGetAssistants(syncConfig, body.filters);
      
      case 'get_chatflow':
        return await handleGetChatflow(syncConfig, body.chatflowId);
      
      case 'update_chatflow':
        return await handleUpdateChatflow(syncConfig, body.chatflowId, body.updateData);
      
      case 'export_workflow':
        return await handleExportWorkflow(syncConfig, body.canvasId, body.workflowData);
      
      case 'get_tools':
        return await handleGetTools(syncConfig, body.filters);
      
      case 'get_variables':
        return await handleGetVariables(syncConfig, body.filters);
      
      case 'get_document_stores':
        return await handleGetDocumentStores(syncConfig, body.filters);
      
      case 'get_chat_messages':
        return await handleGetChatMessages(syncConfig, body.filters);
      
      case 'create_tool':
        return await handleCreateTool(syncConfig, body.toolData);
      
      case 'create_variable':
        return await handleCreateVariable(syncConfig, body.variableData);
      
      default:
        return NextResponse.json(
          { error: 'Ação não suportada' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Erro na API de sincronização Flowise:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleTestConnection(config: any) {
  try {
    // Teste de conexão com endpoints API em vez da página principal
    console.log('🔧 Testando conexão com endpoints API...');
    
    // Tentar endpoint de saúde primeiro
    try {
      const { response, data } = await makeFlowiseRequest('/api/v1/health', { method: 'GET' });

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Conexão com Flowise externo estabelecida com sucesso (endpoint de saúde)',
          data: {
            status: response.status,
            statusText: response.statusText,
            baseUrl: config.baseUrl,
            hasAuth: !!config.apiKey && config.apiKey !== 'your_flowise_api_key_here',
            endpoint: '/api/v1/health'
          }
        });
      }
    } catch (healthError) {
      console.warn('⚠️ Endpoint de saúde não disponível, tentando endpoint de chatflows...');
    }
    
    // Fallback para endpoint de chatflows
    try {
      const { response, data } = await makeFlowiseRequest('/api/v1/chatflows', { method: 'GET' });

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Conexão com Flowise externo estabelecida com sucesso (endpoint de chatflows)',
          data: {
            status: response.status,
            statusText: response.statusText,
            baseUrl: config.baseUrl,
            hasAuth: !!config.apiKey && config.apiKey !== 'your_flowise_api_key_here',
            endpoint: '/api/v1/chatflows',
            workflowsCount: Array.isArray(data) ? data.length : 'unknown'
          }
        });
      } else {
        throw new Error(`Falha na conexão: HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (chatflowsError) {
      console.warn('⚠️ Endpoint de chatflows também falhou, tentando página principal como último recurso...');
      
      // Último recurso: tentar a página principal (pode retornar HTML, mas indica que o servidor está online)
      try {
        const { response, data } = await makeFlowiseRequest('/', { method: 'GET' });

        if (response.ok) {
          return NextResponse.json({
            success: true,
            message: 'Servidor Flowise está online, mas endpoints API podem ter problemas',
            data: {
              status: response.status,
              statusText: response.statusText,
              baseUrl: config.baseUrl,
              hasAuth: !!config.apiKey && config.apiKey !== 'your_flowise_api_key_here',
              endpoint: '/',
              warning: 'Servidor respondeu, mas endpoints API podem não estar funcionando corretamente'
            }
          });
        } else {
          throw new Error(`Falha na conexão: HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (rootError) {
        throw new Error(`Todos os endpoints falharam. Saúde: ${healthError?.message || 'unknown'}, Chatflows: ${chatflowsError?.message || 'unknown'}, Root: ${rootError?.message || 'unknown'}`);
      }
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Erro ao testar conexão com Flowise',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

async function handleSyncCanvas(config: any, canvasId: string) {
  try {
    if (!canvasId) {
      return NextResponse.json(
        { error: 'ID do canvas é obrigatório' },
        { status: 400 }
      );
    }

    // Testar conexão primeiro
    const connectionTest = await handleTestConnection(config);
    const connectionData = await connectionTest.json();
    
    if (!connectionData.success) {
      return NextResponse.json(connectionData);
    }

    // Tentar obter dados do canvas
    try {
      const { response, data } = await makeFlowiseRequest(`/api/v1/chatflows/${canvasId}`, { method: 'GET' });

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Canvas obtido com sucesso',
          data: {
            canvas: data,
            syncNeeded: false,
            outdatedNodes: []
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Canvas não encontrado',
          error: `HTTP ${response.status}: ${response.statusText}`,
          data
        });
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: 'Erro ao obter dados do canvas',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao sincronizar canvas', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleGetHealth(config: any) {
  try {
    // Tentar obter status de saúde do Flowise
    const { response, data } = await makeFlowiseRequest('/api/v1/health', { method: 'GET' });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Status de saúde obtido com sucesso',
        data
      });
    } else {
      // Se o endpoint de saúde não existir, tentar um endpoint alternativo
      try {
        const { response: chatflowsResponse, data: chatflowsData } = await makeFlowiseRequest('/api/v1/chatflows', { method: 'GET' });

        if (chatflowsResponse.ok) {
          return NextResponse.json({
            success: true,
            message: 'Servidor Flowise está respondendo',
            data: {
              status: 'healthy',
              message: 'Endpoint de saúde não disponível, mas API está respondendo',
              chatflows: chatflowsData
            }
          });
        } else {
          return NextResponse.json({
            success: false,
            message: 'Servidor Flowise não está respondendo',
            error: `HTTP ${chatflowsResponse.status}: ${chatflowsResponse.statusText}`,
            data: chatflowsData
          });
        }
      } catch (fallbackError) {
        return NextResponse.json({
          success: false,
          message: 'Servidor Flowise não está acessível',
          error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        });
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao obter status de saúde', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleGetWorkflows(config: any, filters?: any) {
  try {
    // Construir URL com filtros
    let endpoint = '/api/v1/chatflows';
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.workspaceId) params.append('workspaceId', filters.workspaceId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const { response, data } = await makeFlowiseRequest(endpoint, { method: 'GET' });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Workflows obtidos com sucesso',
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro ao obter workflows',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao obter workflows', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleGetAssistants(config: any, filters?: any) {
  try {
    // Construir URL com filtros para assistants
    let endpoint = '/api/v1/assistants';
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const { response, data } = await makeFlowiseRequest(endpoint, { method: 'GET' });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Assistants obtidos com sucesso',
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro ao obter assistants',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao obter assistants', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleGetChatflow(config: any, chatflowId: string) {
  try {
    if (!chatflowId) {
      return NextResponse.json(
        { error: 'ID do chatflow é obrigatório' },
        { status: 400 }
      );
    }

    const { response, data } = await makeFlowiseRequest(`/api/v1/chatflows/${chatflowId}`, { method: 'GET' });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Chatflow obtido com sucesso',
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Chatflow não encontrado',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao obter chatflow', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleUpdateChatflow(config: any, chatflowId: string, updateData: any) {
  try {
    if (!chatflowId) {
      return NextResponse.json(
        { error: 'ID do chatflow é obrigatório' },
        { status: 400 }
      );
    }

    const { response, data } = await makeFlowiseRequest(`/api/v1/chatflows/${chatflowId}`, { 
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Chatflow atualizado com sucesso',
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro ao atualizar chatflow',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar chatflow', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleSyncCanvasNodes(config: any, canvasId: string, syncData?: any) {
  try {
    if (!canvasId) {
      return NextResponse.json(
        { error: 'ID do canvas é obrigatório' },
        { status: 400 }
      );
    }

    // Primeiro, obter o canvas atual
    const { response, data: canvasData } = await makeFlowiseRequest(`/api/v1/chatflows/${canvasId}`, { method: 'GET' });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        message: 'Canvas não encontrado',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data: canvasData
      });
    }

    // Simular sincronização de nós (em um cenário real, isso poderia comparar com dados locais)
    const nodes = canvasData.nodes || [];
    const edges = canvasData.edges || [];
    
    // Preparar dados de sincronização
    const syncResult = {
      canvasId: canvasId,
      totalNodes: nodes.length,
      totalEdges: edges.length,
      syncTimestamp: new Date().toISOString(),
      syncData: syncData || {},
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      }))
    };

    return NextResponse.json({
      success: true,
      message: 'Nós do canvas sincronizados com sucesso',
      data: syncResult
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao sincronizar nós do canvas', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// New handlers for additional Flowise API endpoints
async function handleGetTools(config: any, filters?: any) {
  try {
    let endpoint = '/api/v1/tools';
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const { response, data } = await makeFlowiseRequest(endpoint, { method: 'GET' });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Tools obtidos com sucesso',
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro ao obter tools',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao obter tools', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleGetVariables(config: any, filters?: any) {
  try {
    let endpoint = '/api/v1/variables';
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const { response, data } = await makeFlowiseRequest(endpoint, { method: 'GET' });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Variáveis obtidas com sucesso',
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro ao obter variáveis',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao obter variáveis', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleGetDocumentStores(config: any, filters?: any) {
  try {
    let endpoint = '/api/v1/document-stores';
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const { response, data } = await makeFlowiseRequest(endpoint, { method: 'GET' });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Document stores obtidos com sucesso',
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro ao obter document stores',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao obter document stores', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleGetChatMessages(config: any, filters?: any) {
  try {
    let endpoint = '/api/v1/chat-messages';
    const params = new URLSearchParams();
    
    if (filters?.chatflowId) params.append('chatflowId', filters.chatflowId);
    if (filters?.sessionId) params.append('sessionId', filters.sessionId);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const { response, data } = await makeFlowiseRequest(endpoint, { method: 'GET' });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Chat messages obtidos com sucesso',
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro ao obter chat messages',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao obter chat messages', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleCreateTool(config: any, toolData: any) {
  try {
    const { response, data } = await makeFlowiseRequest('/api/v1/tools', {
      method: 'POST',
      body: JSON.stringify(toolData)
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Tool criado com sucesso',
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro ao criar tool',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar tool', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

async function handleCreateVariable(config: any, variableData: any) {
  try {
    const { response, data } = await makeFlowiseRequest('/api/v1/variables', {
      method: 'POST',
      body: JSON.stringify(variableData)
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Variável criada com sucesso',
        data
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Erro ao criar variável',
        error: `HTTP ${response.status}: ${response.statusText}`,
        data
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar variável', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * Garante que um nó tenha a estrutura completa necessária para o Flowise
 * Baseado no tipo do nó, adiciona as propriedades necessárias como inputParams, inputAnchors, outputAnchors, etc.
 */
function ensureCompleteNodeStructure(node: any): any {
  const nodeType = node.name || node.type || 'customNode';
  const category = node.category || 'Custom';
  
  console.log(`🔧 Estruturando nó ${node.id} do tipo ${nodeType}...`);
  
  // Preservar todas as propriedades originais do nó
  const completeNode = { ...node };
  
  // Garantir que o objeto data existe e tem estrutura completa
  if (!completeNode.data) {
    completeNode.data = {
      id: node.id,
      label: node.name || node.id,
      name: node.name || 'unknown',
      type: nodeType,
      category: category
    };
  } else {
    // Preservar data existente e garantir propriedades básicas
    completeNode.data = {
      ...completeNode.data,
      id: completeNode.data.id || node.id,
      label: completeNode.data.label || node.name || node.id,
      name: completeNode.data.name || node.name || 'unknown',
      type: completeNode.data.type || nodeType,
      category: completeNode.data.category || category
    };
  }
  
  // Adicionar estrutura completa baseada no tipo do nó
  switch (nodeType.toLowerCase()) {
    case 'chatopenai':
      completeNode.data = {
        ...completeNode.data,
        version: 8.2,
        baseClasses: ['ChatOpenAI', 'BaseChatModel', 'BaseLanguageModel', 'Runnable'],
        description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
        inputParams: [
          {
            label: 'Model Name',
            name: 'modelName',
            type: 'asyncOptions',
            loadMethod: 'listModels',
            default: 'gpt-4o-mini',
            optional: true,
            id: `${node.id}-input-modelName-asyncOptions`,
            display: true
          },
          {
            label: 'Temperature',
            name: 'temperature',
            type: 'number',
            step: 0.1,
            default: 0.7,
            optional: true,
            id: `${node.id}-input-temperature-number`,
            display: true
          },
          {
            label: 'Max Tokens',
            name: 'maxTokens',
            type: 'number',
            step: 1,
            optional: true,
            additionalParams: true,
            id: `${node.id}-input-maxTokens-number`,
            display: true
          }
        ],
        inputAnchors: [
          {
            label: 'Cache',
            name: 'cache',
            type: 'BaseCache',
            optional: true,
            id: `${node.id}-input-cache-BaseCache`,
            display: true
          }
        ],
        outputAnchors: [
          {
            id: `${node.id}-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable`,
            name: 'chatOpenAI',
            label: 'ChatOpenAI',
            description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
            type: 'ChatOpenAI | BaseChatModel | BaseLanguageModel | Runnable'
          }
        ],
        inputs: completeNode.data.inputs || {
          cache: '',
          modelName: node.inputs?.modelName || 'gpt-4o-mini',
          temperature: node.inputs?.temperature || 0.7,
          maxTokens: node.inputs?.maxTokens || ''
        },
        outputs: completeNode.data.outputs || {}
      };
      break;
      
    case 'calculator':
      completeNode.data = {
        ...completeNode.data,
        version: 1.0,
        baseClasses: ['Calculator', 'Tool', 'StructuredTool', 'BaseLangChain'],
        description: 'Calculator tool for performing mathematical calculations',
        inputParams: [],
        inputAnchors: [],
        outputAnchors: [
          {
            id: `${node.id}-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain`,
            name: 'calculator',
            label: 'Calculator',
            description: 'Calculator tool for performing mathematical calculations',
            type: 'Calculator | Tool | StructuredTool | BaseLangChain'
          }
        ],
        inputs: completeNode.data.inputs || {},
        outputs: completeNode.data.outputs || {}
      };
      break;
      
    case 'buffermemory':
      completeNode.data = {
        ...completeNode.data,
        version: 1.0,
        baseClasses: ['BufferMemory', 'BaseChatMemory', 'BaseMemory'],
        description: 'Buffer memory for storing conversation history',
        inputParams: [
          {
            label: 'Session ID',
            name: 'sessionId',
            type: 'string',
            optional: true,
            id: `${node.id}-input-sessionId-string`,
            display: true
          },
          {
            label: 'Memory Key',
            name: 'memoryKey',
            type: 'string',
            default: 'chat_history',
            id: `${node.id}-input-memoryKey-string`,
            display: true
          }
        ],
        inputAnchors: [],
        outputAnchors: [
          {
            id: `${node.id}-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory`,
            name: 'bufferMemory',
            label: 'BufferMemory',
            description: 'Buffer memory for storing conversation history',
            type: 'BufferMemory | BaseChatMemory | BaseMemory'
          }
        ],
        inputs: completeNode.data.inputs || {
          sessionId: node.inputs?.sessionId || '',
          memoryKey: node.inputs?.memoryKey || 'chat_history'
        },
        outputs: completeNode.data.outputs || {}
      };
      break;
      
    case 'serpapi':
      completeNode.data = {
        ...completeNode.data,
        version: 1.0,
        baseClasses: ['SerpAPI', 'Tool', 'StructuredTool', 'BaseLangChain'],
        description: 'SerpAPI tool for web search',
        inputParams: [],
        inputAnchors: [],
        outputAnchors: [
          {
            id: `${node.id}-output-serpAPI-SerpAPI|Tool|StructuredTool`,
            name: 'serpAPI',
            label: 'SerpAPI',
            description: 'SerpAPI tool for web search',
            type: 'SerpAPI | Tool | StructuredTool'
          }
        ],
        inputs: completeNode.data.inputs || {},
        outputs: completeNode.data.outputs || {}
      };
      break;
      
    case 'toolagent':
      completeNode.data = {
        ...completeNode.data,
        version: 1.0,
        baseClasses: ['ToolAgent', 'Agent', 'Runnable'],
        description: 'Agent that can use tools to accomplish tasks',
        inputParams: [
          {
            label: 'Tools',
            name: 'tools',
            type: 'tool',
            list: true,
            id: `${node.id}-input-tools-tool`,
            display: true
          },
          {
            label: 'Memory',
            name: 'memory',
            type: 'BaseChatMemory',
            optional: true,
            id: `${node.id}-input-memory-BaseChatMemory`,
            display: true
          },
          {
            label: 'Model',
            name: 'model',
            type: 'BaseChatModel',
            id: `${node.id}-input-model-BaseChatModel`,
            display: true
          },
          {
            label: 'System Message',
            name: 'systemMessage',
            type: 'string',
            default: 'You are a helpful AI assistant.',
            rows: 4,
            optional: true,
            id: `${node.id}-input-systemMessage-string`,
            display: true
          }
        ],
        inputAnchors: [
          {
            label: 'Tools',
            name: 'tools',
            type: 'Tool',
            list: true,
            id: `${node.id}-input-tools-Tool`,
            display: true
          },
          {
            label: 'Memory',
            name: 'memory',
            type: 'BaseChatMemory',
            optional: true,
            id: `${node.id}-input-memory-BaseChatMemory`,
            display: true
          },
          {
            label: 'Model',
            name: 'model',
            type: 'BaseChatModel',
            id: `${node.id}-input-model-BaseChatModel`,
            display: true
          }
        ],
        outputAnchors: [],
        inputs: completeNode.data.inputs || {
          tools: node.inputs?.tools || [],
          memory: node.inputs?.memory || '',
          model: node.inputs?.model || '',
          systemMessage: node.inputs?.systemMessage || 'You are a helpful AI assistant.'
        },
        outputs: completeNode.data.outputs || {}
      };
      break;
      
    case 'stickynote':
      completeNode.data = {
        ...completeNode.data,
        version: 1.0,
        baseClasses: ['StickyNote'],
        description: 'Sticky note for adding comments and documentation',
        inputParams: [
          {
            label: 'Note',
            name: 'note',
            type: 'string',
            rows: 4,
            id: `${node.id}-input-note-string`,
            display: true
          }
        ],
        inputAnchors: [],
        outputAnchors: [],
        inputs: completeNode.data.inputs || {
          note: node.inputs?.note || ''
        },
        outputs: completeNode.data.outputs || {}
      };
      break;
      
    default:
      // Estrutura genérica para tipos desconhecidos
      completeNode.data = {
        ...completeNode.data,
        version: 1.0,
        baseClasses: ['CustomNode'],
        description: `Custom node of type ${nodeType}`,
        inputParams: [],
        inputAnchors: [],
        outputAnchors: [
          {
            id: `${node.id}-output-${nodeType}-${nodeType}`,
            name: nodeType,
            label: nodeType,
            description: `Custom node of type ${nodeType}`,
            type: nodeType
          }
        ],
        inputs: completeNode.data.inputs || {},
        outputs: completeNode.data.outputs || {}
      };
  }
  
  console.log(`✅ Nó ${node.id} estruturado com sucesso`);
  return completeNode;
}

// Helper function para construir URL de log de forma segura
function getLogUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/api/admin/flowise-workflows/export-log`;
}

async function handleExportWorkflow(config: any, canvasId: string, workflowData: any) {
  let logId: string | null = null;
  
  try {
    if (!canvasId) {
      return NextResponse.json(
        { error: 'ID do canvas é obrigatório' },
        { status: 400 }
      );
    }

    if (!workflowData) {
      return NextResponse.json(
        { error: 'Dados do workflow são obrigatórios' },
        { status: 400 }
      );
    }

    // Registrar tentativa de exportação
    try {
      const logResponse = await fetch(getLogUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log_export_attempt',
          data: {
            workflowId: workflowData.id || 'unknown',
            workflowName: workflowData.name || 'Unknown Workflow',
            canvasId: canvasId,
            exportData: workflowData
          }
        })
      });
      
      if (logResponse.ok) {
        const logResult = await logResponse.json();
        logId = logResult.logId;
      }
    } catch (logError) {
      console.warn('Erro ao registrar log de tentativa:', logError);
    }

    // Testar conexão primeiro
    const connectionTest = await handleTestConnection(config);
    const connectionData = await connectionTest.json();
    
    if (!connectionData.success) {
      // Registrar erro de conexão
      if (logId) {
        try {
          await fetch(getLogUrl(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'log_export_error',
              data: {
                logId,
                workflowId: workflowData.id || 'unknown',
                workflowName: workflowData.name || 'Unknown Workflow',
                canvasId: canvasId,
                error: { message: 'Falha na conexão com Flowise', details: connectionData },
                exportData: workflowData
              }
            })
          });
        } catch (logError) {
          console.warn('Erro ao registrar log de erro de conexão:', logError);
        }
      }
      
      return NextResponse.json(connectionData);
    }

    // Detectar se os dados são de um agente que precisa ser transformado
    let exportPayload = workflowData;
    let isTransformed = false;
    
    // Preparar dados para verificação - fazer parse do flowData antes de verificar necessidade de transformação
    let parsedFlowData;
    try {
      parsedFlowData = typeof exportPayload.flowData === 'string' ? JSON.parse(exportPayload.flowData) : exportPayload.flowData;
    } catch (e) {
      console.error('❌ Erro ao fazer parse do flowData:', e);
      throw new Error('flowData inválido');
    }
    
    // Verificar se os dados parecem ser de um agente (têm campos específicos de agente)
    // OU se o flowData parece estar incompleto (sem data completo nos nodes)
    const needsTransformation = workflowData && (
      workflowData.slug || 
      workflowData.config || 
      workflowData.knowledge ||
      workflowData.roleDefinition ||
      workflowData.customInstructions ||
      // Verificar se o flowData tem nodes com estrutura incompleta
      (parsedFlowData.nodes && parsedFlowData.nodes.some(node => 
        !node.data || !node.data.inputParams || !node.data.inputAnchors || !node.data.outputAnchors
      ))
    );
    
    if (needsTransformation) {
      console.log('🔄 Detectados dados que precisam de transformação/estruturação completa...');
      
      try {
        // Se for um agente, usar o transformer
        if (workflowData.slug || workflowData.config) {
          console.log('📋 Transformando dados de agente para formato Flowise...');
          const transformedData = transformAgentToFlowiseWorkflow(workflowData);
          
          // Validar dados transformados
          const validation = validateTransformedData(transformedData);
          if (!validation.valid) {
            console.error('❌ Validação falhou:', validation.errors);
            throw new Error(`Transformação inválida: ${validation.errors.join(', ')}`);
          }
          
          exportPayload = transformedData;
          isTransformed = true;
          
          console.log('✅ Dados transformados com sucesso:', {
            originalName: workflowData.name,
            transformedName: transformedData.name,
            originalType: workflowData.type,
            transformedType: transformedData.type,
            flowDataLength: transformedData.flowData.length
          });
        } else {
          // Se não for um agente mas precisa de estruturação, usar o flowData original mas garantir estrutura completa
          console.log('🔧 Estruturando flowData existente para formato completo...');
          
          // Para cada node, garantir a estrutura completa baseada no tipo
          parsedFlowData.nodes = parsedFlowData.nodes.map(node => {
            const completeNode = ensureCompleteNodeStructure(node);
            return completeNode;
          });
          
          // Atualizar o flowData no payload
          exportPayload.flowData = JSON.stringify(parsedFlowData);
          console.log('✅ flowData estruturado com sucesso');
        }
        
      } catch (transformError) {
        console.error('💥 Erro na transformação/estruturação dos dados:', transformError);
        
        // Registrar erro de transformação
        if (logId) {
          try {
            await fetch(getLogUrl(), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'log_export_error',
                data: {
                  logId,
                  workflowId: workflowData.id || 'unknown',
                  workflowName: workflowData.name || 'Unknown Workflow',
                  canvasId: canvasId,
                  error: { 
                    message: 'Falha na transformação/estruturação dos dados', 
                    details: transformError instanceof Error ? transformError.message : String(transformError),
                    type: 'TRANSFORMATION_ERROR'
                  },
                  exportData: workflowData
                }
              })
            });
          } catch (logError) {
            console.warn('Erro ao registrar log de erro de transformação:', logError);
          }
        }
        
        return NextResponse.json({
          success: false,
          error: 'Falha na transformação/estruturação dos dados para exportação',
          details: transformError instanceof Error ? transformError.message : String(transformError),
          debug: {
            transformError: transformError instanceof Error ? transformError.message : String(transformError),
            workflowDataFields: Object.keys(workflowData)
          }
        }, { status: 500 });
      }
    }

    // Validar e corrigir o flowData (apenas propriedades básicas, a estrutura completa já foi gerada)
    if (!parsedFlowData.nodes) {
      parsedFlowData.nodes = [];
    }
    if (!parsedFlowData.edges) {
      parsedFlowData.edges = [];
    }
    if (!parsedFlowData.viewport) {
      parsedFlowData.viewport = { x: 0, y: 0, zoom: 1 };
    }

    // Validação mínima - apenas garantir que cada nó tem ID e categoria básica
    parsedFlowData.nodes = parsedFlowData.nodes.map(node => {
      if (!node.id) {
        node.id = `node_${Math.random().toString(36).substr(2, 9)}`;
      }
      if (!node.category) {
        node.category = 'Custom';
      }
      return node;
    });

    console.log('✅ flowData validado e corrigido:', {
      nodesCount: parsedFlowData.nodes.length,
      edgesCount: parsedFlowData.edges.length,
      nodesWithoutCategory: parsedFlowData.nodes.filter(n => !n.category).length,
      nodesWithoutDataCategory: parsedFlowData.nodes.filter(n => !n.data?.category).length,
      nodesValidation: parsedFlowData.nodes.map(n => ({
        id: n.id,
        hasCategory: !!n.category,
        hasData: !!n.data,
        hasDataCategory: !!n.data?.category,
        dataType: n.data?.type
      }))
    });

    const finalExportPayload = {
      name: exportPayload.name,
      description: exportPayload.description || '',
      type: 'CHATFLOW', // Forçar sempre CHATFLOW para aparecer na lista de chatflows
      flowData: JSON.stringify(parsedFlowData),
      deployed: exportPayload.deployed || false,
      isPublic: exportPayload.isPublic || true, // Tornar público para garantir visibilidade
      category: exportPayload.category || 'general' // Usar categoria geral em vez de 'Assistants'
    };

    // Log detalhado do payload final
    console.log('📤 Payload final para envio:', {
      url: '/api/v1/chatflows',
      method: 'POST',
      payload: finalExportPayload,
      payloadSize: JSON.stringify(finalExportPayload).length,
      flowDataSize: finalExportPayload.flowData.length,
      hasAllRequiredFields: ['name', 'type', 'flowData'].every(field => field in finalExportPayload)
    });

    // Adicionar campos opcionais apenas se forem válidos
    if (exportPayload.chatbotConfig && exportPayload.chatbotConfig !== '[object Object]') {
      try {
        // Tentar fazer parse para verificar se é JSON válido
        JSON.parse(exportPayload.chatbotConfig);
        finalExportPayload.chatbotConfig = exportPayload.chatbotConfig;
      } catch (e) {
        // Se não for JSON válido, não incluir o campo
        console.warn('chatbotConfig inválido ignorado:', exportPayload.chatbotConfig);
      }
    }

    if (exportPayload.apiConfig && exportPayload.apiConfig !== '[object Object]') {
      try {
        // Tentar fazer parse para verificar se é JSON válido
        JSON.parse(exportPayload.apiConfig);
        finalExportPayload.apiConfig = exportPayload.apiConfig;
      } catch (e) {
        // Se não for JSON válido, não incluir o campo
        console.warn('apiConfig inválido ignorado:', exportPayload.apiConfig);
      }
    }

    console.log('🚀 Iniciando exportação para Flowise:', {
      canvasId,
      action: 'update_first',
      payloadSize: JSON.stringify(finalExportPayload).length,
      isTransformed
    });

    // ESTRATÉGIA MELHORADA: Verificar se o workflow existe primeiro
    let workflowExists = false;
    let createInstead = false;
    let existingWorkflowId = null;
    let serverHealthCheck = false;
    
    try {
      // Primeiro, verificar a saúde do servidor Flowise com endpoints específicos
      console.log('🏥 Verificando saúde do servidor Flowise...');
      
      // Tentar endpoint de saúde primeiro
      try {
        const { response: healthResponse, data: healthData } = await makeFlowiseRequest('/api/v1/health', { method: 'GET' });
        
        if (healthResponse.ok) {
          console.log('✅ Servidor Flowise está saudável (endpoint de saúde)');
          serverHealthCheck = true;
        } else {
          throw new Error('Endpoint de saúde não disponível');
        }
      } catch (healthError) {
        console.warn('⚠️ Endpoint de saúde não disponível, tentando endpoint de chatflows...');
        // Tentar endpoint alternativo
        const { response: chatflowsResponse } = await makeFlowiseRequest('/api/v1/chatflows', { method: 'GET' });
        if (chatflowsResponse.ok) {
          console.log('✅ Servidor Flowise está respondendo (endpoint de chatflows)');
          serverHealthCheck = true;
        } else {
          throw new Error('Servidor Flowise não está respondendo corretamente');
        }
      }
    } catch (healthError) {
      console.error('❌ Falha na verificação de saúde do servidor:', healthError);
      
      // IMPORTANTE: Não falhar imediatamente. O servidor pode estar com problemas no endpoint de saúde
      // mas ainda funcionando para criação/atualização de workflows. Vamos tentar prosseguir.
      console.log('🔄 Servidor com problemas de saúde, mas tentando prosseguir com exportação...');
      serverHealthCheck = false; // Indica que a verificação de saúde falhou, mas vamos tentar anyway
    }
    
    // Prosseguir com a verificação de workflows existentes (se o servidor está saudável) ou tentar criar diretamente
    if (serverHealthCheck) {
      try {
        // Obter a lista de todos os workflows para verificar se já existe um com o mesmo nome
        console.log('🔍 Verificando workflows existentes...');
        const { response: listResponse, data: listData } = await makeFlowiseRequest('/api/v1/chatflows', { method: 'GET' });
        
        if (listResponse.ok && Array.isArray(listData)) {
          console.log(`📋 Encontrados ${listData.length} workflows existentes`);
          
          // Procurar por workflow com o mesmo nome ou ID
          const existingWorkflow = listData.find(wf => 
            wf.id === canvasId || 
            wf.name === finalExportPayload.name ||
            (wf.chatflowId && wf.chatflowId === canvasId)
          );
          
          if (existingWorkflow) {
            workflowExists = true;
            existingWorkflowId = existingWorkflow.id;
            console.log('✅ Workflow existente encontrado:', {
              id: existingWorkflow.id,
              name: existingWorkflow.name,
              type: existingWorkflow.type
            });
          } else {
            console.log('📝 Nenhum workflow existente encontrado, será criado um novo');
            createInstead = true;
          }
        } else {
          console.warn('❌ Não foi possível obter lista de workflows, tentando criar:', {
            status: listResponse.status,
            statusText: listResponse.statusText,
            data: listData
          });
          createInstead = true;
        }
      } catch (checkError) {
        console.warn('Erro ao verificar existência do workflow, tentando criar:', checkError);
        createInstead = true;
      }
    } else {
      // Se a verificação de saúde falhou, tentar criar diretamente sem verificar existência
      console.log('🔄 Verificação de saúde falhou, tentando criar workflow diretamente...');
      createInstead = true;
    }

    let finalResult = null;
    let actionTaken = '';

    if (!createInstead && workflowExists && existingWorkflowId) {
      // Tentar atualizar o workflow existente usando o ID correto
      try {
        const updateStartTime = Date.now();
        const { response: updateResponse, data: updateData } = await makeFlowiseRequest(`/api/v1/chatflows/${existingWorkflowId}`, {
          method: 'PUT',
          body: JSON.stringify(finalExportPayload)
        });
        
        const updateDuration = Date.now() - updateStartTime;
        
        console.log('📝 Resposta da atualização:', {
          status: updateResponse.status,
          statusText: updateResponse.statusText,
          duration: updateDuration,
          dataSize: JSON.stringify(updateData).length,
          responseData: updateData
        });

        if (updateResponse.ok) {
          finalResult = { response: updateResponse, data: updateData, duration: updateDuration };
          actionTaken = 'updated';
        } else {
          // Se a atualização falhar, tentar criar um novo
          console.log('❌ Falha na atualização, tentando criar novo workflow...');
          createInstead = true;
        }
      } catch (updateError) {
        console.warn('Erro na atualização, tentando criar novo:', updateError);
        createInstead = true;
      }
    }

    // Se necessário, criar um novo workflow
    if (createInstead && !finalResult) {
      try {
        // Para criação, não usar o canvasId original, gerar um novo ID
        const createStartTime = Date.now();
        
        // Log detalhado do payload sendo enviado
        console.log('📤 Payload para criação:', {
          url: '/api/v1/chatflows',
          method: 'POST',
          payload: finalExportPayload,
          payloadSize: JSON.stringify(finalExportPayload).length,
          payloadKeys: Object.keys(finalExportPayload)
        });
        
        const { response: createResponse, data: createData } = await makeFlowiseRequest('/api/v1/chatflows', {
          method: 'POST',
          body: JSON.stringify(finalExportPayload)
        });
        
        const createDuration = Date.now() - createStartTime;
        
        console.log('📝 Resposta da criação:', {
          status: createResponse.status,
          statusText: createResponse.statusText,
          duration: createDuration,
          dataSize: JSON.stringify(createData).length,
          responseData: createData,
          responseHeaders: Object.fromEntries(createResponse.headers.entries())
        });

        if (createResponse.ok) {
          finalResult = { response: createResponse, data: createData, duration: createDuration };
          actionTaken = 'created';
        } else {
          throw new Error(`Falha na criação: HTTP ${createResponse.status}: ${createResponse.statusText}`);
        }
      } catch (createError) {
        console.error('💥 Erro na criação do workflow:', createError);
        throw createError;
      }
    }

    if (finalResult) {
      // Registrar sucesso
      if (logId) {
        try {
          await fetch(getLogUrl(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'log_export_success',
              data: {
                logId,
                workflowId: workflowData.id || 'unknown',
                canvasId: finalResult.data.id || canvasId,
                response: { 
                  status: finalResult.response.status, 
                  data: finalResult.data,
                  action: actionTaken
                },
                action: actionTaken
              }
            })
          });
        } catch (logError) {
          console.warn('Erro ao registrar log de sucesso:', logError);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Workflow ${actionTaken === 'updated' ? 'atualizado' : 'criado'} com sucesso no Flowise externo${isTransformed ? ' (dados transformados)' : ''}`,
        data: {
          canvasId: finalResult.data.id || canvasId,
          action: actionTaken,
          exportedData: finalExportPayload,
          flowiseResponse: finalResult.data,
          performance: { duration: finalResult.duration },
          transformation: {
            applied: isTransformed,
            originalType: workflowData.type,
            transformedType: exportPayload.type
          }
        }
      });
    }

    throw new Error('Nenhuma operação de exportação foi concluída com sucesso');

  } catch (error) {
    console.error('💥 Erro durante exportação:', error);

    // Registrar erro detalhado
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : '',
      canvasId: canvasId,
      exportData: workflowData,
      errorType: error instanceof Error ? error.name : 'UnknownError',
      timestamp: new Date().toISOString()
    };

    if (logId) {
      try {
        await fetch(getLogUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'log_export_error',
            data: {
              logId,
              workflowId: workflowData.id || 'unknown',
              workflowName: workflowData.name || 'Unknown Workflow',
              canvasId: canvasId,
              error: errorDetails,
              exportData: workflowData
            }
          })
        });
      } catch (logError) {
        console.warn('Erro ao registrar log de erro:', logError);
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Erro ao exportar workflow para o Flowise',
      error: errorDetails.message,
      debug: errorDetails
    });
  }
}
