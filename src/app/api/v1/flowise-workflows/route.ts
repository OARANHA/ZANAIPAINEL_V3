import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { transformAgentToFlowiseWorkflow } from '@/lib/agent-to-flowise-transformer';

// Interface para dados do workflow Flowise
interface FlowiseWorkflow {
  id: string;
  name: string;
  flowData: string;
  deployed?: boolean;
  isPublic?: boolean;
  type: 'CHATFLOW' | 'AGENTFLOW' | 'MULTIAGENT' | 'ASSISTANT';
  workspaceId?: string;
  createdDate: Date;
  updatedDate: Date;
  category?: string;
  chatbotConfig?: string;
  apiConfig?: string;
}

// Interface para análise de complexidade
interface ComplexityAnalysis {
  nodeCount: number;
  edgeCount: number;
  maxDepth: number;
  parallelPaths: number;
  criticalPath: string[];
  bottlenecks: string[];
  complexityScore: number;
  optimizationSuggestions: string[];
}

// Interface para capacidades identificadas
interface WorkflowCapabilities {
  canHandleFileUpload: boolean;
  hasStreaming: boolean;
  supportsMultiLanguage: boolean;
  hasMemory: boolean;
  usesExternalAPIs: boolean;
  hasAnalytics: boolean;
  supportsParallelProcessing: boolean;
  hasErrorHandling: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'register_workflow':
        return await registerWorkflow(data);
      case 'sync_workflows':
        return await syncWorkflows(data);
      case 'analyze_complexity':
        return await analyzeComplexity(data);
      case 'get_workflows':
        return await getWorkflows(data);
      case 'update_workflow':
        return await updateWorkflow(data);
      case 'delete_workflow':
        return await deleteWorkflow(data);
      case 'debug_workflow':
        return await debugWorkflow(data);
      default:
        return NextResponse.json({ error: 'Ação não suportada' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro na API de workflows Flowise:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Registrar novo workflow do Flowise
async function registerWorkflow(workflowData: FlowiseWorkflow) {
  try {
    // Analisar complexidade do workflow
    const complexity = analyzeWorkflowComplexity(workflowData.flowData);
    
    // Identificar capacidades
    const capabilities = identifyCapabilities(workflowData.flowData);
    
    // Extrair nós e conexões
    const { nodes, connections } = extractWorkflowStructure(workflowData.flowData);
    
    // Gerar descrição automática
    const description = generateDescription(workflowData, complexity, capabilities);
    
    // Verificar se o workflow já existe
    const existingWorkflow = await db.flowiseWorkflow.findUnique({
      where: { flowiseId: workflowData.id }
    });

    let savedWorkflow;
    let action = 'WORKFLOW_REGISTERED';
    
    if (existingWorkflow) {
      // Atualizar workflow existente
      savedWorkflow = await db.flowiseWorkflow.update({
        where: { flowiseId: workflowData.id },
        data: {
          name: workflowData.name,
          description: description,
          type: workflowData.type,
          flowData: workflowData.flowData,
          deployed: workflowData.deployed || false,
          isPublic: workflowData.isPublic || false,
          category: workflowData.category || 'general',
          workspaceId: workflowData.workspaceId,
          complexityScore: complexity.complexityScore,
          nodeCount: complexity.nodeCount,
          edgeCount: complexity.edgeCount,
          maxDepth: complexity.maxDepth,
          capabilities: JSON.stringify(capabilities || {}),
          nodes: JSON.stringify(nodes || []),
          connections: JSON.stringify(connections || []),
          criticalPath: JSON.stringify(complexity.criticalPath || []),
          bottlenecks: JSON.stringify(complexity.bottlenecks || []),
          optimizationSuggestions: JSON.stringify(complexity.optimizationSuggestions || []),
          lastSyncAt: new Date(),
          updatedAt: workflowData.updatedDate
        }
      });
      action = 'WORKFLOW_UPDATED';
    } else {
      // Criar novo workflow
      savedWorkflow = await db.flowiseWorkflow.create({
        data: {
          flowiseId: workflowData.id,
          name: workflowData.name,
          description: description,
          type: workflowData.type,
          flowData: workflowData.flowData,
          deployed: workflowData.deployed || false,
          isPublic: workflowData.isPublic || false,
          category: workflowData.category || 'general',
          workspaceId: workflowData.workspaceId,
          complexityScore: complexity.complexityScore,
          nodeCount: complexity.nodeCount,
          edgeCount: complexity.edgeCount,
          maxDepth: complexity.maxDepth,
          capabilities: JSON.stringify(capabilities || {}),
          nodes: JSON.stringify(nodes || []),
          connections: JSON.stringify(connections || []),
          criticalPath: JSON.stringify(complexity.criticalPath || []),
          bottlenecks: JSON.stringify(complexity.bottlenecks || []),
          optimizationSuggestions: JSON.stringify(complexity.optimizationSuggestions || []),
          lastSyncAt: new Date(),
          createdAt: workflowData.createdDate,
          updatedAt: workflowData.updatedDate
        }
      });
    }

    // Registrar evento de sincronização
    await db.syncLog.create({
      data: {
        action: action,
        flowiseId: workflowData.id,
        details: JSON.stringify({
          name: workflowData.name,
          type: workflowData.type,
          complexity: complexity.complexityScore,
          wasExisting: !!existingWorkflow
        }),
        status: 'SUCCESS'
      }
    });

    return NextResponse.json({
      success: true,
      workflow: savedWorkflow,
      analysis: {
        complexity,
        capabilities,
        suggestions: complexity.optimizationSuggestions
      }
    });

  } catch (error) {
    console.error('Erro ao registrar workflow:', error);
    
    // Registrar erro
    await db.syncLog.create({
      data: {
        action: action || 'WORKFLOW_REGISTERED',
        flowiseId: workflowData.id,
        details: JSON.stringify({ 
          error: error.message,
          wasExisting: !!existingWorkflow 
        }),
        status: 'ERROR'
      }
    });

    return NextResponse.json(
      { error: 'Falha ao registrar workflow' },
      { status: 500 }
    );
  }
}

// Sincronizar múltiplos workflows
async function syncWorkflows({ workflows }: { workflows: FlowiseWorkflow[] }) {
  try {
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const workflow of workflows) {
      try {
        // Verificar se já existe
        const existing = await db.flowiseWorkflow.findUnique({
          where: { flowiseId: workflow.id }
        });

        if (existing) {
          // Atualizar existente
          const updated = await updateExistingWorkflow(existing, workflow);
          results.push({ id: workflow.id, status: 'updated', workflow: updated });
          successCount++;
        } else {
          // Criar novo
          const created = await registerWorkflow(workflow);
          results.push({ id: workflow.id, status: 'created', workflow: created });
          successCount++;
        }
      } catch (error) {
        console.error(`Erro ao sincronizar workflow ${workflow.id}:`, error);
        results.push({ id: workflow.id, status: 'error', error: error.message });
        errorCount++;
      }
    }

    // Registrar evento de sincronização em lote
    await db.syncLog.create({
      data: {
        action: 'BATCH_SYNC',
        details: JSON.stringify({
          total: workflows.length,
          success: successCount,
          errors: errorCount
        }),
        status: errorCount === 0 ? 'SUCCESS' : 'PARTIAL'
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        total: workflows.length,
        success: successCount,
        errors: errorCount
      },
      results
    });

  } catch (error) {
    console.error('Erro na sincronização em lote:', error);
    return NextResponse.json(
      { error: 'Falha na sincronização em lote' },
      { status: 500 }
    );
  }
}

// Analisar complexidade de workflow
async function analyzeComplexity({ flowData }: { flowData: string }) {
  try {
    const complexity = analyzeWorkflowComplexity(flowData);
    
    return NextResponse.json({
      success: true,
      complexity
    });

  } catch (error) {
    console.error('Erro ao analisar complexidade:', error);
    return NextResponse.json(
      { error: 'Falha na análise de complexidade' },
      { status: 500 }
    );
  }
}

// Obter workflows registrados e agentes disponíveis para exportação
async function getWorkflows({ filters = {}, page = 1, limit = 20, includeAgents = true }) {
  try {
    const where: any = {};
    
    if (filters.type) where.type = filters.type;
    if (filters.category) where.category = filters.category;
    if (filters.workspaceId) where.workspaceId = filters.workspaceId;
    if (filters.minComplexity) where.complexityScore = { gte: filters.minComplexity };
    if (filters.maxComplexity) where.complexityScore = { lte: filters.maxComplexity };

    // Buscar workflows Flowise existentes
    const [flowiseWorkflows, flowiseTotal] = await Promise.all([
      db.flowiseWorkflow.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' }
      }),
      db.flowiseWorkflow.count({ where })
    ]);

    let allWorkflows = [...flowiseWorkflows];
    let agents: any[] = [];
    
    // Se solicitado, buscar também agentes para exportação
    if (includeAgents && (!filters.type || filters.type === 'ALL')) {
      console.log('⚠️ Transformação de agentes temporariamente desabilitada');
      // TEMPORÁRIO: Desabilitar completamente a transformação de agentes
      // para evitar travamento do sistema
      console.log('📋 Transformação de agentes desabilitada temporariamente para estabilidade do sistema');
    }

    // Calcular paginação considerando workflows transformados
    const total = flowiseTotal + (includeAgents ? agents.length : 0);
    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      workflows: allWorkflows,
      pagination: {
        page,
        limit,
        total,
        pages
      },
      meta: {
        flowiseWorkflows: flowiseWorkflows.length,
        transformedAgents: includeAgents ? agents.length : 0,
        totalWorkflows: allWorkflows.length
      }
    });

  } catch (error) {
    console.error('Erro ao obter workflows:', error);
    return NextResponse.json(
      { error: 'Falha ao obter workflows' },
      { status: 500 }
    );
  }
}

// Função auxiliar para extrair campos adicionais do config do agente
function extractAgentAdditionalFields(config: string): any {
  try {
    // Tentar fazer parse como JSON primeiro
    const parsed = JSON.parse(config);
    return {
      roleDefinition: parsed.roleDefinition || '',
      customInstructions: parsed.customInstructions || '',
      groups: parsed.groups || []
    };
  } catch (jsonError) {
    // Se falhar, tentar extrair de YAML ou texto simples
    try {
      const fields: any = {
        roleDefinition: '',
        customInstructions: '',
        groups: []
      };
      
      // Extrair roleDefinition (procurar por padrões comuns)
      const roleMatch = config.match(/(?:roleDefinition|role|definição):\s*([\s\S]*?)(?=\n\w+:|$)/i);
      if (roleMatch) {
        fields.roleDefinition = roleMatch[1].trim();
      }
      
      // Extrair customInstructions
      const instructionsMatch = config.match(/(?:customInstructions|instructions|instruções):\s*([\s\S]*?)(?=\n\w+:|$)/i);
      if (instructionsMatch) {
        fields.customInstructions = instructionsMatch[1].trim();
      }
      
      return fields;
    } catch (extractError) {
      console.warn('Não foi possível extrair campos adicionais do config:', extractError);
      return {
        roleDefinition: '',
        customInstructions: '',
        groups: []
      };
    }
  }
}

// Atualizar workflow existente
async function updateWorkflow({ flowiseId, data }: { flowiseId: string; data: Partial<FlowiseWorkflow> }) {
  try {
    const existing = await db.flowiseWorkflow.findUnique({
      where: { flowiseId }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Workflow não encontrado' },
        { status: 404 }
      );
    }

    // Reanalisar complexidade e capacidades
    const complexity = analyzeWorkflowComplexity(data.flowData || existing.flowData);
    const capabilities = identifyCapabilities(data.flowData || existing.flowData);
    const { nodes, connections } = extractWorkflowStructure(data.flowData || existing.flowData);

    const updated = await db.flowiseWorkflow.update({
      where: { flowiseId },
      data: {
        name: data.name || existing.name,
        flowData: data.flowData || existing.flowData,
        deployed: data.deployed ?? existing.deployed,
        isPublic: data.isPublic ?? existing.isPublic,
        type: data.type || existing.type,
        category: data.category || existing.category,
        workspaceId: data.workspaceId || existing.workspaceId,
        complexityScore: complexity.complexityScore,
        nodeCount: complexity.nodeCount,
        edgeCount: complexity.edgeCount,
        maxDepth: complexity.maxDepth,
        capabilities: JSON.stringify(capabilities || {}),
        nodes: JSON.stringify(nodes || []),
        connections: JSON.stringify(connections || []),
        criticalPath: JSON.stringify(complexity.criticalPath || []),
        bottlenecks: JSON.stringify(complexity.bottlenecks || []),
        optimizationSuggestions: JSON.stringify(complexity.optimizationSuggestions || []),
        lastSyncAt: new Date(),
        updatedAt: data.updatedDate || new Date()
      }
    });

    // Registrar evento de atualização
    await db.syncLog.create({
      data: {
        action: 'WORKFLOW_UPDATED',
        flowiseId,
        details: JSON.stringify({
          name: updated.name,
          changes: Object.keys(data).filter(key => data[key] !== existing[key])
        }),
        status: 'SUCCESS'
      }
    });

    return NextResponse.json({
      success: true,
      workflow: updated
    });

  } catch (error) {
    console.error('Erro ao atualizar workflow:', error);
    return NextResponse.json(
      { error: 'Falha ao atualizar workflow' },
      { status: 500 }
    );
  }
}

// Deletar workflow
async function deleteWorkflow({ flowiseId }: { flowiseId: string }) {
  try {
    const deleted = await db.flowiseWorkflow.delete({
      where: { flowiseId }
    });

    // Registrar evento de deleção
    await db.syncLog.create({
      data: {
        action: 'WORKFLOW_DELETED',
        flowiseId,
        details: JSON.stringify({ name: deleted.name }),
        status: 'SUCCESS'
      }
    });

    return NextResponse.json({
      success: true,
      deleted
    });

  } catch (error) {
    console.error('Erro ao deletar workflow:', error);
    return NextResponse.json(
      { error: 'Falha ao deletar workflow' },
      { status: 500 }
    );
  }
}

// Funções utilitárias

function analyzeWorkflowComplexity(flowData: string): ComplexityAnalysis {
  try {
    const parsed = JSON.parse(flowData);
    const nodes = parsed.nodes || [];
    const edges = parsed.edges || [];

    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    
    // Calcular profundidade máxima
    const maxDepth = calculateMaxDepth(nodes, edges);
    
    // Contar caminhos paralelos
    const parallelPaths = countParallelPaths(edges);
    
    // Identificar caminho crítico
    const criticalPath = identifyCriticalPath(nodes, edges);
    
    // Identificar gargalos
    const bottlenecks = identifyBottlenecks(nodes, edges);
    
    // Calcular score de complexidade (0-100)
    const complexityScore = calculateComplexityScore({
      nodeCount,
      edgeCount,
      maxDepth,
      parallelPaths,
      bottleneckCount: bottlenecks.length
    });

    // Gerar sugestões de otimização
    const optimizationSuggestions = generateOptimizationSuggestions({
      nodes,
      edges,
      complexityScore,
      bottlenecks
    });

    return {
      nodeCount,
      edgeCount,
      maxDepth,
      parallelPaths,
      criticalPath,
      bottlenecks,
      complexityScore,
      optimizationSuggestions
    };

  } catch (error) {
    console.error('Erro ao analisar complexidade:', error);
    return {
      nodeCount: 0,
      edgeCount: 0,
      maxDepth: 0,
      parallelPaths: 0,
      criticalPath: [],
      bottlenecks: [],
      complexityScore: 0,
      optimizationSuggestions: []
    };
  }
}

function identifyCapabilities(flowData: string): WorkflowCapabilities {
  try {
    const parsed = JSON.parse(flowData);
    const nodes = parsed.nodes || [];

    const capabilities: WorkflowCapabilities = {
      canHandleFileUpload: false,
      hasStreaming: false,
      supportsMultiLanguage: false,
      hasMemory: false,
      usesExternalAPIs: false,
      hasAnalytics: false,
      supportsParallelProcessing: false,
      hasErrorHandling: false
    };

    // Analisar nós para identificar capacidades
    nodes.forEach(node => {
      const category = node.data?.category || '';
      const name = node.data?.name || '';

      // Upload de arquivos
      if (category.includes('File') || name.includes('Upload') || name.includes('File')) {
        capabilities.canHandleFileUpload = true;
      }

      // Streaming
      if (category.includes('Streaming') || name.includes('Stream')) {
        capabilities.hasStreaming = true;
      }

      // Multi-idioma
      if (category.includes('Language') || name.includes('Translate') || name.includes('i18n')) {
        capabilities.supportsMultiLanguage = true;
      }

      // Memória
      if (category.includes('Memory') || name.includes('Buffer') || name.includes('Store')) {
        capabilities.hasMemory = true;
      }

      // APIs externas
      if (category.includes('API') || name.includes('HTTP') || name.includes('Request')) {
        capabilities.usesExternalAPIs = true;
      }

      // Analytics
      if (category.includes('Analytics') || name.includes('Metrics') || name.includes('Stats')) {
        capabilities.hasAnalytics = true;
      }

      // Processamento paralelo
      if (category.includes('Parallel') || name.includes('Concurrent')) {
        capabilities.supportsParallelProcessing = true;
      }

      // Tratamento de erros
      if (category.includes('Error') || name.includes('Catch') || name.includes('Try')) {
        capabilities.hasErrorHandling = true;
      }
    });

    return capabilities;

  } catch (error) {
    console.error('Erro ao identificar capacidades:', error);
    return {
      canHandleFileUpload: false,
      hasStreaming: false,
      supportsMultiLanguage: false,
      hasMemory: false,
      usesExternalAPIs: false,
      hasAnalytics: false,
      supportsParallelProcessing: false,
      hasErrorHandling: false
    };
  }
}

function extractWorkflowStructure(flowData: string) {
  try {
    const parsed = JSON.parse(flowData);
    const nodes = parsed.nodes || [];
    const edges = parsed.edges || [];

    const simplifiedNodes = nodes.map(node => ({
      id: node.id,
      type: node.type,
      category: node.data?.category || '',
      name: node.data?.name || '',
      position: node.position,
      inputs: node.data?.inputs || [],
      outputs: node.data?.outputs || []
    }));

    const simplifiedConnections = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle
    }));

    return { nodes: simplifiedNodes, connections: simplifiedConnections };

  } catch (error) {
    console.error('Erro ao extrair estrutura:', error);
    return { nodes: [], connections: [] };
  }
}

function generateDescription(workflow: FlowiseWorkflow, complexity: ComplexityAnalysis, capabilities: WorkflowCapabilities): string {
  const typeMap = {
    'CHATFLOW': 'Chatbot',
    'AGENTFLOW': 'Agente de IA',
    'MULTIAGENT': 'Multi-Agentes',
    'ASSISTANT': 'Assistente'
  };

  const caps = [];
  if (capabilities.canHandleFileUpload) caps.push('Upload de Arquivos');
  if (capabilities.hasStreaming) caps.push('Respostas em Tempo Real');
  if (capabilities.supportsMultiLanguage) caps.push('Multi-idioma');
  if (capabilities.hasMemory) caps.push('Memória de Contexto');
  if (capabilities.usesExternalAPIs) caps.push('Integração com APIs');
  if (capabilities.hasAnalytics) caps.push('Análise de Dados');
  if (capabilities.supportsParallelProcessing) caps.push('Processamento Paralelo');
  if (capabilities.hasErrorHandling) caps.push('Tratamento de Erros');

  return `${typeMap[workflow.type]} "${workflow.name}" com ${complexity.nodeCount} nós e ${complexity.edgeCount} conexões. 
Complexidade: ${complexity.complexityScore}/100. 
Capacidades: ${caps.join(', ') || 'Básico'}. 
${complexity.optimizationSuggestions.length > 0 ? `Sugestões: ${complexity.optimizationSuggestions.slice(0, 2).join(', ')}.` : ''}`;
}

// Funções de cálculo auxiliares

function calculateMaxDepth(nodes: any[], edges: any[]): number {
  // Implementação simplificada - calcular profundidade máxima do grafo
  const graph = buildGraph(nodes, edges);
  let maxDepth = 0;
  
  const visited = new Set();
  const dfs = (nodeId: string, depth: number) => {
    if (depth > maxDepth) maxDepth = depth;
    visited.add(nodeId);
    
    const neighbors = graph[nodeId] || [];
    neighbors.forEach((neighborId: string) => {
      if (!visited.has(neighborId)) {
        dfs(neighborId, depth + 1);
      }
    });
  };
  
  // Encontrar nós iniciais (sem arestas de entrada)
  const startNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id)
  );
  
  startNodes.forEach(node => dfs(node.id, 1));
  
  return maxDepth;
}

function countParallelPaths(edges: any[]): number {
  // Contar caminhos paralelos (nós com múltiplas saídas)
  const targetCounts: Record<string, number> = {};
  
  edges.forEach(edge => {
    targetCounts[edge.target] = (targetCounts[edge.target] || 0) + 1;
  });
  
  return Object.values(targetCounts).filter(count => count > 1).length;
}

function identifyCriticalPath(nodes: any[], edges: any[]): string[] {
  // Implementação simplificada - retornar caminho mais longo
  const graph = buildGraph(nodes, edges);
  const paths: string[][] = [];
  
  const findPaths = (currentNode: string, currentPath: string[]) => {
    const newPath = [...currentPath, currentNode];
    const neighbors = graph[currentNode] || [];
    
    if (neighbors.length === 0) {
      paths.push(newPath);
    } else {
      neighbors.forEach(neighbor => {
        findPaths(neighbor, newPath);
      });
    }
  };
  
  // Encontrar nós iniciais
  const startNodes = nodes.filter(node => 
    !edges.some(edge => edge.target === node.id)
  );
  
  startNodes.forEach(node => findPaths(node.id, []));
  
  // Retornar caminho mais longo
  return paths.reduce((longest, current) => 
    current.length > longest.length ? current : longest, []
  );
}

function identifyBottlenecks(nodes: any[], edges: any[]): string[] {
  const bottlenecks: string[] = [];
  
  // Identificar nós com muitas conexões de entrada
  const inputCounts: Record<string, number> = {};
  edges.forEach(edge => {
    inputCounts[edge.target] = (inputCounts[edge.target] || 0) + 1;
  });
  
  // Identificar nós com muitas conexões de saída
  const outputCounts: Record<string, number> = {};
  edges.forEach(edge => {
    outputCounts[edge.source] = (outputCounts[edge.source] || 0) + 1;
  });
  
  // Nós com mais de 3 conexões de entrada são potenciais gargalos
  Object.entries(inputCounts).forEach(([nodeId, count]) => {
    if (count > 3) {
      const node = nodes.find(n => n.id === nodeId);
      if (node) bottlenecks.push(node.data?.name || nodeId);
    }
  });
  
  return bottlenecks;
}

function calculateComplexityScore(params: {
  nodeCount: number;
  edgeCount: number;
  maxDepth: number;
  parallelPaths: number;
  bottleneckCount: number;
}): number {
  let score = 0;
  
  // Ponderação de fatores
  score += Math.min(params.nodeCount * 2, 30); // Máx 30 pontos para nós
  score += Math.min(params.edgeCount * 1.5, 25); // Máx 25 pontos para arestas
  score += Math.min(params.maxDepth * 5, 20); // Máx 20 pontos para profundidade
  score += Math.min(params.parallelPaths * 3, 15); // Máx 15 pontos para paralelismo
  score += Math.min(params.bottleneckCount * 10, 10); // Máx 10 pontos para gargalos
  
  return Math.min(Math.round(score), 100);
}

function generateOptimizationSuggestions(params: {
  nodes: any[];
  edges: any[];
  complexityScore: number;
  bottlenecks: string[];
}): string[] {
  const suggestions: string[] = [];
  
  if (params.complexityScore > 80) {
    suggestions.push('Considere dividir o workflow em partes menores');
  }
  
  if (params.bottlenecks.length > 0) {
    suggestions.push(`Otimize nós com gargalos: ${params.bottlenecks.join(', ')}`);
  }
  
  if (params.nodes.length > 20) {
    suggestions.push('Agrupe nós similares em sub-workflows');
  }
  
  if (params.edges.length > params.nodes.length * 2) {
    suggestions.push('Simplifique as conexões entre nós');
  }
  
  // Verificar padrões específicos
  const hasFileNodes = params.nodes.some(node => 
    node.data?.category?.includes('File')
  );
  
  if (hasFileNodes) {
    suggestions.push('Implemente cache para operações com arquivos');
  }
  
  const hasApiNodes = params.nodes.some(node => 
    node.data?.category?.includes('API')
  );
  
  if (hasApiNodes) {
    suggestions.push('Adicione tratamento de erros e retries para chamadas de API');
  }
  
  return suggestions;
}

function buildGraph(nodes: any[], edges: any[]): Record<string, string[]> {
  const graph: Record<string, string[]> = {};
  
  nodes.forEach(node => {
    graph[node.id] = [];
  });
  
  edges.forEach(edge => {
    if (graph[edge.source]) {
      graph[edge.source].push(edge.target);
    }
  });
  
  return graph;
}

async function updateExistingWorkflow(existing: any, workflow: FlowiseWorkflow) {
  // Similar à função updateWorkflow mas para uso interno
  const complexity = analyzeWorkflowComplexity(workflow.flowData);
  const capabilities = identifyCapabilities(workflow.flowData);
  const { nodes, connections } = extractWorkflowStructure(workflow.flowData);

  return await db.flowiseWorkflow.update({
    where: { id: existing.id },
    data: {
      name: workflow.name,
      flowData: workflow.flowData,
      deployed: workflow.deployed,
      isPublic: workflow.isPublic,
      type: workflow.type,
      category: workflow.category,
      workspaceId: workflow.workspaceId,
      complexityScore: complexity.complexityScore,
      nodeCount: complexity.nodeCount,
      edgeCount: complexity.edgeCount,
      maxDepth: complexity.maxDepth,
      capabilities: JSON.stringify(capabilities || {}),
      nodes: JSON.stringify(nodes || []),
      connections: JSON.stringify(connections || []),
      criticalPath: JSON.stringify(complexity.criticalPath || []),
      bottlenecks: JSON.stringify(complexity.bottlenecks || []),
      optimizationSuggestions: JSON.stringify(complexity.optimizationSuggestions || []),
      lastSyncAt: new Date(),
      updatedAt: workflow.updatedDate
    }
  });
}

// Função de debug para analisar workflow específico
async function debugWorkflow({ flowiseId }: { flowiseId: string }) {
  try {
    console.log('🔍 Debugando workflow:', flowiseId);
    
    // Buscar workflow no banco de dados
    const workflow = await db.flowiseWorkflow.findUnique({
      where: { flowiseId }
    });

    if (!workflow) {
      return NextResponse.json({
        success: false,
        error: 'Workflow não encontrado'
      }, { status: 404 });
    }

    // Analisar os dados do workflow
    let flowDataParsed = null;
    let nodes = [];
    let connections = [];
    let capabilities = {};

    try {
      flowDataParsed = JSON.parse(workflow.flowData);
      nodes = flowDataParsed.nodes || [];
      connections = flowDataParsed.edges || [];
    } catch (e) {
      console.warn('Erro ao fazer parse do flowData:', e);
    }

    try {
      capabilities = workflow.capabilities ? JSON.parse(workflow.capabilities) : {};
    } catch (e) {
      console.warn('Erro ao fazer parse das capabilities:', e);
    }

    const debugInfo = {
      workflow: {
        id: workflow.id,
        flowiseId: workflow.flowiseId,
        name: workflow.name,
        type: workflow.type,
        category: workflow.category,
        deployed: workflow.deployed,
        isPublic: workflow.isPublic,
        complexityScore: workflow.complexityScore,
        nodeCount: workflow.nodeCount,
        edgeCount: workflow.edgeCount,
        maxDepth: workflow.maxDepth,
        lastSyncAt: workflow.lastSyncAt,
        createdAt: workflow.createdAt,
        updatedAt: workflow.updatedAt
      },
      flowData: {
        parsed: !!flowDataParsed,
        nodesCount: nodes.length,
        connectionsCount: connections.length,
        nodesSample: nodes.slice(0, 2).map(n => ({ id: n.id, type: n.type, position: n.position })),
        connectionsSample: connections.slice(0, 2).map(c => ({ id: c.id, source: c.source, target: c.target }))
      },
      capabilities: capabilities,
      rawFields: {
        flowDataLength: workflow.flowData.length,
        nodesLength: workflow.nodes?.length || 0,
        connectionsLength: workflow.connections?.length || 0,
        capabilitiesLength: workflow.capabilities?.length || 0
      }
    };

    console.log('✅ Debug info gerado:', {
      name: debugInfo.workflow.name,
      nodesCount: debugInfo.flowData.nodesCount,
      connectionsCount: debugInfo.flowData.connectionsCount,
      hasFlowData: debugInfo.flowData.parsed
    });

    return NextResponse.json({
      success: true,
      debug: debugInfo
    });

  } catch (error) {
    console.error('Erro no debug do workflow:', error);
    return NextResponse.json(
      { error: 'Falha no debug do workflow', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}