import { NextRequest, NextResponse } from 'next/server';

// Rota de teste para compatibilidade Flowise - sem autenticação
export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Iniciando teste de compatibilidade Flowise...');
    
    // Templates de teste para validar compatibilidade
    const testWorkflows = [
      {
        name: 'Simple Chat Test',
        type: 'simple-chat',
        description: 'Teste de workflow simples de chat',
        config: {
          nodes: [
            {
              id: 'chat-input',
              type: 'ChatInput',
              position: { x: 100, y: 100 },
              data: {
                label: 'Chat Input',
                name: 'chatInput',
                category: 'Input',
                inputs: [],
                outputs: [{ type: 'message', name: 'message' }]
              }
            },
            {
              id: 'openai',
              type: 'OpenAI',
              position: { x: 400, y: 100 },
              data: {
                label: 'OpenAI',
                name: 'openai',
                category: 'LLMs',
                inputs: [
                  { type: 'message', name: 'message' },
                  { type: 'systemPrompt', name: 'systemPrompt' }
                ],
                outputs: [{ type: 'message', name: 'response' }],
                modelName: 'gpt-3.5-turbo',
                temperature: 0.7,
                maxTokens: 1000,
                systemMessage: 'Você é um assistente útil e amigável.'
              }
            },
            {
              id: 'chat-output',
              type: 'ChatOutput',
              position: { x: 700, y: 100 },
              data: {
                label: 'Chat Output',
                name: 'chatOutput',
                category: 'Output',
                inputs: [{ type: 'message', name: 'message' }],
                outputs: []
              }
            }
          ],
          edges: [
            {
              id: 'e1',
              source: 'chat-input',
              target: 'openai',
              sourceHandle: 'message',
              targetHandle: 'message'
            },
            {
              id: 'e2',
              source: 'openai',
              target: 'chat-output',
              sourceHandle: 'response',
              targetHandle: 'message'
            }
          ]
        }
      },
      {
        name: 'Documentation Test',
        type: 'documentation',
        description: 'Teste de workflow de documentação',
        config: {
          nodes: [
            {
              id: 'file-upload',
              type: 'FileUpload',
              position: { x: 100, y: 100 },
              data: {
                label: 'File Upload',
                name: 'fileUpload',
                category: 'Input',
                inputs: [],
                outputs: [{ type: 'file', name: 'file' }],
                acceptedFileTypes: '.txt,.pdf,.doc,.docx',
                maxFileSize: '10MB'
              }
            },
            {
              id: 'document-loader',
              type: 'DocumentLoader',
              position: { x: 300, y: 100 },
              data: {
                label: 'Document Loader',
                name: 'documentLoader',
                category: 'Processing',
                inputs: [{ type: 'file', name: 'file' }],
                outputs: [{ type: 'documents', name: 'documents' }],
                chunkSize: 1000,
                chunkOverlap: 200
              }
            },
            {
              id: 'vector-store',
              type: 'VectorStore',
              position: { x: 500, y: 100 },
              data: {
                label: 'Vector Store',
                name: 'vectorStore',
                category: 'Memory',
                inputs: [{ type: 'documents', name: 'documents' }],
                outputs: [{ type: 'vectors', name: 'vectors' }],
                vectorStoreType: 'FAISS'
              }
            },
            {
              id: 'retrieval-qa',
              type: 'RetrievalQA',
              position: { x: 700, y: 100 },
              data: {
                label: 'Retrieval QA',
                name: 'retrievalQA',
                category: 'LLMs',
                inputs: [
                  { type: 'question', name: 'question' },
                  { type: 'vectors', name: 'vectors' }
                ],
                outputs: [{ type: 'answer', name: 'answer' }],
                modelName: 'gpt-3.5-turbo',
                temperature: 0.1,
                systemMessage: 'Você é um assistente especializado em documentação.'
              }
            },
            {
              id: 'chat-output',
              type: 'ChatOutput',
              position: { x: 900, y: 100 },
              data: {
                label: 'Chat Output',
                name: 'chatOutput',
                category: 'Output',
                inputs: [{ type: 'answer', name: 'answer' }],
                outputs: []
              }
            }
          ],
          edges: [
            {
              id: 'e1',
              source: 'file-upload',
              target: 'document-loader',
              sourceHandle: 'file',
              targetHandle: 'file'
            },
            {
              id: 'e2',
              source: 'document-loader',
              target: 'vector-store',
              sourceHandle: 'documents',
              targetHandle: 'documents'
            },
            {
              id: 'e3',
              source: 'vector-store',
              target: 'retrieval-qa',
              sourceHandle: 'vectors',
              targetHandle: 'vectors'
            },
            {
              id: 'e4',
              source: 'retrieval-qa',
              target: 'chat-output',
              sourceHandle: 'answer',
              targetHandle: 'answer'
            }
          ]
        }
      }
    ];

    // Função para validar estrutura dos workflows
    function validateWorkflowStructure(workflow) {
      const errors = [];
      const warnings = [];

      // Validar nodes
      if (!workflow.config.nodes || workflow.config.nodes.length === 0) {
        errors.push('Workflow sem nodes');
      } else {
        workflow.config.nodes.forEach((node, index) => {
          if (!node.id) errors.push(`Node ${index + 1} sem ID`);
          if (!node.type) errors.push(`Node ${index + 1} sem tipo`);
          if (!node.position) errors.push(`Node ${index + 1} sem posição`);
          if (!node.data) warnings.push(`Node ${index + 1} sem dados`);
        });
      }

      // Validar edges
      if (!workflow.config.edges || workflow.config.edges.length === 0) {
        warnings.push('Workflow sem edges');
      } else {
        workflow.config.edges.forEach((edge, index) => {
          if (!edge.source) errors.push(`Edge ${index + 1} sem source`);
          if (!edge.target) errors.push(`Edge ${index + 1} sem target`);
        });
      }

      // Validar conectividade
      if (workflow.config.nodes && workflow.config.edges) {
        const nodeIds = new Set(workflow.config.nodes.map(n => n.id));
        const disconnectedNodes = [];
        
        workflow.config.nodes.forEach(node => {
          const hasConnection = workflow.config.edges.some(e => 
            e.source === node.id || e.target === node.id
          );
          
          if (!hasConnection) {
            disconnectedNodes.push(node.id);
          }
        });
        
        if (disconnectedNodes.length > 0) {
          warnings.push(`Nodes desconectados: ${disconnectedNodes.join(', ')}`);
        }
      }

      return { errors, warnings };
    }

    // Validar todos os workflows
    const validationResults = [];
    
    for (const workflow of testWorkflows) {
      const validation = validateWorkflowStructure(workflow);
      validationResults.push({
        name: workflow.name,
        type: workflow.type,
        validation: validation
      });
    }

    // Verificar status do Flowise
    const flowiseStatus = {
      url: process.env.NEXT_PUBLIC_FLOWISE_URL || 'https://aaranha-zania.hf.space',
      configured: !!process.env.FLOWISE_API_KEY,
      reachable: false,
      version: null
    };

    try {
      // Tentar conectar ao Flowise - usar endpoint de chatflows que sabemos que funciona
      const flowiseResponse = await fetch(`${flowiseStatus.url}/api/v1/chatflows`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.FLOWISE_API_KEY}`
        }
      });

      if (flowiseResponse.ok) {
        flowiseStatus.reachable = true;
        const workflows = await flowiseResponse.json();
        flowiseStatus.version = 'unknown';
        flowiseStatus.existingWorkflows = workflows.length;
        console.log(`✅ Flowise acessível com ${workflows.length} workflows existentes`);
      } else {
        console.log(`❌ Flowise retornou status: ${flowiseResponse.status}`);
      }
    } catch (error) {
      console.log('⚠️  Flowise não está acessível:', error.message);
    }

    // Preparar resposta
    const response = {
      testResults: {
        workflowsValidated: validationResults.length,
        workflowsValid: validationResults.filter(r => r.validation.errors.length === 0).length,
        workflowsWithErrors: validationResults.filter(r => r.validation.errors.length > 0).length,
        workflowsWithWarnings: validationResults.filter(r => r.validation.warnings.length > 0).length,
        details: validationResults
      },
      flowiseStatus: flowiseStatus,
      systemStatus: {
        zanaiRunning: true,
        flowiseConfigured: flowiseStatus.configured,
        flowiseReachable: flowiseStatus.reachable,
        overall: flowiseStatus.reachable && flowiseStatus.configured
      },
      recommendations: []
    };

    // Gerar recomendações
    if (!flowiseStatus.configured) {
      response.recommendations.push('Configure FLOWISE_API_KEY nas variáveis de ambiente');
    }

    if (!flowiseStatus.reachable) {
      response.recommendations.push('Verifique se o Flowise está rodando em ' + flowiseStatus.url);
    }

    if (response.testResults.workflowsWithErrors > 0) {
      response.recommendations.push('Corrija os erros de estrutura dos workflows');
    }

    if (response.testResults.workflowsWithWarnings > 0) {
      response.recommendations.push('Analise os avisos de estrutura dos workflows');
    }

    if (response.systemStatus.overall && response.testResults.workflowsValid === response.testResults.workflowsValidated) {
      response.recommendations.push('Sistema pronto para testes de integração completa');
    }

    console.log('✅ Teste de compatibilidade concluído');
    console.log(`📊 Workflows validados: ${response.testResults.workflowsValid}/${response.testResults.workflowsValidated}`);
    console.log(`🔗 Flowise acessível: ${flowiseStatus.reachable}`);
    console.log(`🔑 Flowise configurado: ${flowiseStatus.configured}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Erro no teste de compatibilidade:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, workflowData } = body;

    if (action === 'test-export') {
      // Testar exportação real para o Flowise
      const flowiseUrl = process.env.NEXT_PUBLIC_FLOWISE_URL || 'https://aaranha-zania.hf.space';
      const flowiseApiKey = process.env.FLOWISE_API_KEY;

      if (!flowiseApiKey) {
        return NextResponse.json(
          { error: 'FLOWISE_API_KEY não configurada' },
          { status: 400 }
        );
      }

      try {
        // Criar workflow no Flowise
        const flowiseResponse = await fetch(`${flowiseUrl}/api/v1/chatflows`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${flowiseApiKey}`
          },
          body: JSON.stringify({
            name: workflowData.name || 'Test Export',
            description: workflowData.description || 'Test export from ZanAI',
            flowData: JSON.stringify(workflowData.config),
            type: 'CHATFLOW',
            category: workflowData.type || 'test',
            deployed: false,
            isPublic: false,
            workspaceId: 'a38d6158-637c-43f5-bc00-6429b4365f64' // Workspace ID padrão
          })
        });

        if (!flowiseResponse.ok) {
          throw new Error(`Flowise API error: ${flowiseResponse.status} ${flowiseResponse.statusText}`);
        }

        const flowiseWorkflow = await flowiseResponse.json();

        // Testar se o workflow pode ser acessado
        const workflowInfo = await fetch(`${flowiseUrl}/api/v1/chatflows/${flowiseWorkflow.id}`, {
          headers: {
            'Authorization': `Bearer ${flowiseApiKey}`
          }
        });

        if (!workflowInfo.ok) {
          throw new Error(`Cannot access created workflow: ${workflowInfo.status}`);
        }

        // Limpar workflow de teste
        await fetch(`${flowiseUrl}/api/v1/chatflows/${flowiseWorkflow.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${flowiseApiKey}`
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Workflow exportado e testado com sucesso',
          workflowId: flowiseWorkflow.id,
          embedUrl: `${flowiseUrl}/chat/${flowiseWorkflow.id}`
        });

      } catch (flowiseError) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Falha na exportação para Flowise',
            details: flowiseError instanceof Error ? flowiseError.message : 'Unknown error'
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Ação não suportada' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Erro no POST de teste:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}