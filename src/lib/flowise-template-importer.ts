/**
 * Importador de Templates do Flowise
 * Analisa templates do Flowise e extrai informações estruturadas para o Zanai
 */

import { promises as fs } from 'fs';
import path from 'path';

// Interface para dados estruturados do template importado
export interface ImportedFlowiseTemplate {
  // Metadados básicos
  id: string;
  name: string;
  description?: string;
  type: 'CHATFLOW' | 'AGENTFLOW' | 'MULTIAGENT' | 'ASSISTANT';
  category?: string;
  
  // Estrutura do workflow
  nodes: ImportedFlowiseNode[];
  edges: ImportedFlowiseEdge[];
  viewport?: { x: number; y: number; zoom: number };
  
  // Configurações
  chatbotConfig?: any;
  apiConfig?: any;
  
  // Análise estrutural
  analysis: {
    totalNodes: number;
    totalEdges: number;
    nodeTypes: Record<string, number>;
    edgeTypes: Record<string, number>;
    categories: Record<string, number>;
    inputParams: Record<string, any[]>;
    outputAnchors: Record<string, any[]>;
    complexity: 'simple' | 'medium' | 'complex';
    patterns: string[];
  };
  
  // Mapeamento para Zanai
  zanaiMapping: {
    suggestedAgentType: 'template' | 'custom' | 'composed';
    suggestedComponents: ZanaiComponent[];
    requiredConfig: string[];
    suggestedTools: string[];
    workflowType: 'chat' | 'agent' | 'multi' | 'assistant';
  };
}

// Interface para nó do Flowise importado
export interface ImportedFlowiseNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  positionAbsolute?: { x: number; y: number };
  width?: number;
  height?: number;
  selected?: boolean;
  dragging?: boolean;
  data: {
    id: string;
    label: string;
    version?: number;
    name: string;
    type: string;
    baseClasses?: string[];
    category?: string;
    description?: string;
    inputParams?: FlowiseInputParam[];
    inputAnchors?: FlowiseAnchor[];
    inputs?: Record<string, any>;
    outputAnchors?: FlowiseAnchor[];
    outputs?: Record<string, any>;
    selected?: boolean;
    [key: string]: any;
  };
}

// Interface para parâmetro de entrada do Flowise
export interface FlowiseInputParam {
  label: string;
  name: string;
  type: string;
  description?: string;
  default?: any;
  optional?: boolean;
  additionalParams?: boolean;
  id?: string;
  rows?: number;
  placeholder?: string;
  step?: number;
  loadMethod?: string;
  credentialNames?: string[];
  options?: Array<{ label: string; name: string }>;
  display?: boolean;
  show?: Record<string, any>;
}

// Interface para âncora do Flowise
export interface FlowiseAnchor {
  id: string;
  name: string;
  label: string;
  type?: string;
  description?: string;
  optional?: boolean;
  list?: boolean;
  display?: boolean;
}

// Interface para conexão do Flowise
export interface ImportedFlowiseEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type?: string;
  data?: { label?: string };
}

// Interface para componente Zanai mapeado
export interface ZanaiComponent {
  type: 'input' | 'llm' | 'memory' | 'tool' | 'output' | 'reasoning' | 'analysis';
  name: string;
  description: string;
  config: Record<string, any>;
  connections: string[];
}

/**
 * Classe principal para importação de templates do Flowise
 */
export class FlowiseTemplateImporter {
  
  /**
   * Importa um template a partir de um arquivo JSON
   */
  async importFromFile(filePath: string): Promise<ImportedFlowiseTemplate> {
    try {
      console.log(`📁 Importando template do arquivo: ${filePath}`);
      
      // Ler arquivo
      const content = await fs.readFile(filePath, 'utf-8');
      const templateData = JSON.parse(content);
      
      return this.analyzeTemplate(templateData);
    } catch (error) {
      console.error('❌ Erro ao importar template do arquivo:', error);
      throw new Error(`Falha ao importar template: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
  
  /**
   * Importa um template a partir de um objeto JSON
   */
  importFromObject(templateData: any): ImportedFlowiseTemplate {
    console.log('📋 Importando template do objeto JSON');
    return this.analyzeTemplate(templateData);
  }
  
  /**
   * Analisa o template e extrai informações estruturadas
   */
  private analyzeTemplate(templateData: any): ImportedFlowiseTemplate {
    console.log('🔍 Analisando estrutura do template...');
    
    // Validar estrutura básica
    if (!templateData.nodes || !Array.isArray(templateData.nodes)) {
      throw new Error('Template inválido: deve conter um array de nodes');
    }
    
    if (!templateData.edges || !Array.isArray(templateData.edges)) {
      throw new Error('Template inválido: deve conter um array de edges');
    }
    
    // Extrair informações básicas
    const nodes = templateData.nodes.map((node: any) => this.normalizeNode(node));
    const edges = templateData.edges.map((edge: any) => this.normalizeEdge(edge));
    
    // Realizar análise estrutural
    const analysis = this.performStructuralAnalysis(nodes, edges);
    
    // Gerar mapeamento para Zanai
    const zanaiMapping = this.generateZanaiMapping(nodes, edges, analysis);
    
    // Determinar tipo e categoria
    const { type, category } = this.determineTemplateType(nodes, analysis);
    
    const result: ImportedFlowiseTemplate = {
      id: this.generateId(),
      name: this.extractTemplateName(nodes),
      description: this.extractTemplateDescription(nodes),
      type,
      category,
      nodes,
      edges,
      viewport: templateData.viewport || { x: 0, y: 0, zoom: 1 },
      chatbotConfig: templateData.chatbotConfig,
      apiConfig: templateData.apiConfig,
      analysis,
      zanaiMapping
    };
    
    console.log('✅ Template analisado com sucesso!');
    console.log('📊 Resumo da análise:', {
      name: result.name,
      type: result.type,
      totalNodes: analysis.totalNodes,
      totalEdges: analysis.totalEdges,
      complexity: analysis.complexity,
      suggestedAgentType: zanaiMapping.suggestedAgentType
    });
    
    return result;
  }
  
  /**
   * Normaliza um nó do Flowise
   */
  private normalizeNode(node: any): ImportedFlowiseNode {
    return {
      id: node.id,
      type: node.type,
      position: node.position,
      positionAbsolute: node.positionAbsolute,
      width: node.width,
      height: node.height,
      selected: node.selected,
      dragging: node.dragging,
      data: {
        id: node.data.id,
        label: node.data.label,
        version: node.data.version,
        name: node.data.name,
        type: node.data.type,
        baseClasses: node.data.baseClasses || [],
        category: node.data.category || 'Unknown',
        description: node.data.description || '',
        inputParams: node.data.inputParams || [],
        inputAnchors: node.data.inputAnchors || [],
        inputs: node.data.inputs || {},
        outputAnchors: node.data.outputAnchors || [],
        outputs: node.data.outputs || {},
        selected: node.data.selected || false,
        ...this.extractAdditionalData(node.data)
      }
    };
  }
  
  /**
   * Normaliza uma conexão do Flowise
   */
  private normalizeEdge(edge: any): ImportedFlowiseEdge {
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type,
      data: edge.data || {}
    };
  }
  
  /**
   * Extrai dados adicionais do nó
   */
  private extractAdditionalData(data: any): Record<string, any> {
    const additional: Record<string, any> = {};
    const excludedKeys = [
      'id', 'label', 'version', 'name', 'type', 'baseClasses', 
      'category', 'description', 'inputParams', 'inputAnchors', 
      'inputs', 'outputAnchors', 'outputs', 'selected'
    ];
    
    Object.keys(data).forEach(key => {
      if (!excludedKeys.includes(key)) {
        additional[key] = data[key];
      }
    });
    
    return additional;
  }
  
  /**
   * Realiza análise estrutural do template
   */
  private performStructuralAnalysis(nodes: ImportedFlowiseNode[], edges: ImportedFlowiseEdge[]) {
    const nodeTypes: Record<string, number> = {};
    const edgeTypes: Record<string, number> = {};
    const categories: Record<string, number> = {};
    const inputParams: Record<string, any[]> = {};
    const outputAnchors: Record<string, any[]> = {};
    
    // Analisar nós
    nodes.forEach(node => {
      // Contar tipos de nós
      const nodeType = node.type;
      nodeTypes[nodeType] = (nodeTypes[nodeType] || 0) + 1;
      
      // Contar categorias
      const category = node.data.category;
      categories[category] = (categories[category] || 0) + 1;
      
      // Coletar inputParams
      if (node.data.inputParams) {
        inputParams[node.id] = node.data.inputParams;
      }
      
      // Coletar outputAnchors
      if (node.data.outputAnchors) {
        outputAnchors[node.id] = node.data.outputAnchors;
      }
    });
    
    // Analisar conexões
    edges.forEach(edge => {
      const edgeType = edge.type || 'default';
      edgeTypes[edgeType] = (edgeTypes[edgeType] || 0) + 1;
    });
    
    // Determinar complexidade
    const complexity = this.determineComplexity(nodes, edges, nodeTypes);
    
    // Identificar padrões
    const patterns = this.identifyPatterns(nodes, edges, nodeTypes);
    
    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodeTypes,
      edgeTypes,
      categories,
      inputParams,
      outputAnchors,
      complexity,
      patterns
    };
  }
  
  /**
   * Determina a complexidade do template
   */
  private determineComplexity(nodes: ImportedFlowiseNode[], edges: ImportedFlowiseEdge[], nodeTypes: Record<string, number>): 'simple' | 'medium' | 'complex' {
    const totalNodes = nodes.length;
    const totalEdges = edges.length;
    const hasTools = Object.keys(nodeTypes).some(type => type.toLowerCase().includes('tool') || type.toLowerCase().includes('agent'));
    const hasMemory = Object.keys(nodeTypes).some(type => type.toLowerCase().includes('memory'));
    const hasMultipleLLMs = Object.keys(nodeTypes).filter(type => type.toLowerCase().includes('chat') || type.toLowerCase().includes('llm')).length > 1;
    
    if (totalNodes <= 3 && totalEdges <= 2 && !hasTools && !hasMemory) {
      return 'simple';
    } else if (totalNodes <= 6 && totalEdges <= 5 && hasTools && !hasMultipleLLMs) {
      return 'medium';
    } else {
      return 'complex';
    }
  }
  
  /**
   * Identifica padrões no template
   */
  private identifyPatterns(nodes: ImportedFlowiseNode[], edges: ImportedFlowiseEdge[], nodeTypes: Record<string, number>): string[] {
    const patterns: string[] = [];
    
    // Verificar padrões comuns
    if (nodeTypes['customNode'] && nodeTypes['customNode'] > 0) {
      patterns.push('custom-node-based');
    }
    
    if (nodeTypes['chatInput'] && nodeTypes['chatOutput']) {
      patterns.push('chat-flow');
    }
    
    if (Object.keys(nodeTypes).some(type => type.toLowerCase().includes('agent'))) {
      patterns.push('agent-based');
    }
    
    if (Object.keys(nodeTypes).some(type => type.toLowerCase().includes('memory'))) {
      patterns.push('with-memory');
    }
    
    if (Object.keys(nodeTypes).some(type => type.toLowerCase().includes('tool'))) {
      patterns.push('with-tools');
    }
    
    if (edges.length > nodes.length) {
      patterns.push('highly-connected');
    }
    
    return patterns;
  }
  
  /**
   * Gera mapeamento para o Zanai
   */
  private generateZanaiMapping(nodes: ImportedFlowiseNode[], edges: ImportedFlowiseEdge[], analysis: any): ImportedFlowiseTemplate['zanaiMapping'] {
    const { complexity, patterns, nodeTypes } = analysis;
    
    // Determinar tipo de agente sugerido
    let suggestedAgentType: 'template' | 'custom' | 'composed';
    let workflowType: 'chat' | 'agent' | 'multi' | 'assistant';
    
    if (complexity === 'simple') {
      suggestedAgentType = 'template';
      workflowType = 'chat';
    } else if (complexity === 'medium' || patterns.includes('with-tools')) {
      suggestedAgentType = 'custom';
      workflowType = 'agent';
    } else {
      suggestedAgentType = 'composed';
      workflowType = 'multi';
    }
    
    // Mapear componentes
    const suggestedComponents = this.mapComponents(nodes);
    
    // Extrair configurações requeridas
    const requiredConfig = this.extractRequiredConfig(nodes);
    
    // Sugerir ferramentas
    const suggestedTools = this.suggestTools(nodes, patterns);
    
    return {
      suggestedAgentType,
      suggestedComponents,
      requiredConfig,
      suggestedTools,
      workflowType
    };
  }
  
  /**
   * Mapeia componentes do Flowise para Zanai
   */
  private mapComponents(nodes: ImportedFlowiseNode[]): ZanaiComponent[] {
    return nodes.map(node => {
      let type: ZanaiComponent['type'] = 'input';
      
      // Determinar tipo baseado na categoria e tipo do nó
      if (node.data.category?.toLowerCase().includes('input') || node.type?.toLowerCase().includes('input')) {
        type = 'input';
      } else if (node.data.category?.toLowerCase().includes('chat') || node.type?.toLowerCase().includes('chat') || node.type?.toLowerCase().includes('llm')) {
        type = 'llm';
      } else if (node.data.category?.toLowerCase().includes('memory')) {
        type = 'memory';
      } else if (node.data.category?.toLowerCase().includes('tool')) {
        type = 'tool';
      } else if (node.data.category?.toLowerCase().includes('output')) {
        type = 'output';
      } else if (node.data.category?.toLowerCase().includes('agent')) {
        type = 'reasoning';
      } else if (node.data.category?.toLowerCase().includes('analysis')) {
        type = 'analysis';
      }
      
      return {
        type,
        name: node.data.label,
        description: node.data.description || `Componente ${node.data.name}`,
        config: node.data.inputs || {},
        connections: []
      };
    });
  }
  
  /**
   * Extrai configurações requeridas
   */
  private extractRequiredConfig(nodes: ImportedFlowiseNode[]): string[] {
    const config: string[] = [];
    
    nodes.forEach(node => {
      if (node.data.inputParams) {
        node.data.inputParams.forEach(param => {
          if (!param.optional && param.type !== 'credential') {
            config.push(`${node.data.name}.${param.name}`);
          }
        });
      }
    });
    
    return [...new Set(config)]; // Remover duplicados
  }
  
  /**
   * Sugere ferramentas baseado nos nós
   */
  private suggestTools(nodes: ImportedFlowiseNode[], patterns: string[]): string[] {
    const tools: string[] = [];
    
    nodes.forEach(node => {
      if (node.data.category?.toLowerCase().includes('tool')) {
        tools.push(node.data.name);
      }
    });
    
    // Adicionar ferramentas baseado em padrões
    if (patterns.includes('with-tools')) {
      tools.push('general-tool-set');
    }
    
    return [...new Set(tools)];
  }
  
  /**
   * Determina o tipo e categoria do template
   */
  private determineTemplateType(nodes: ImportedFlowiseNode[], analysis: any): { type: ImportedFlowiseTemplate['type'], category?: string } {
    const { complexity, patterns, nodeTypes } = analysis;
    
    // Determinar tipo principal
    let type: ImportedFlowiseTemplate['type'] = 'CHATFLOW';
    
    if (patterns.includes('agent-based') || complexity === 'complex') {
      type = 'AGENTFLOW';
    } else if (patterns.includes('highly-connected') || Object.keys(nodeTypes).some(key => key.toLowerCase().includes('multi'))) {
      type = 'MULTIAGENT';
    }
    
    // Determinar categoria mais comum
    const categoryCounts: Record<string, number> = {};
    nodes.forEach(node => {
      const category = node.data.category || 'Unknown';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    const mostCommonCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    return {
      type,
      category: mostCommonCategory
    };
  }
  
  /**
   * Extrai o nome do template
   */
  private extractTemplateName(nodes: ImportedFlowiseNode[]): string {
    // Procurar por nós que possam conter o nome
    const agentNodes = nodes.filter(node => 
      node.data.category?.toLowerCase().includes('agent') ||
      node.type?.toLowerCase().includes('agent')
    );
    
    if (agentNodes.length > 0) {
      return agentNodes[0].data.label || 'Imported Agent';
    }
    
    // Se não encontrar agente, usar o label do primeiro nó
    return nodes[0]?.data.label || 'Imported Template';
  }
  
  /**
   * Extrai a descrição do template
   */
  private extractTemplateDescription(nodes: ImportedFlowiseNode[]): string {
    const agentNodes = nodes.filter(node => 
      node.data.category?.toLowerCase().includes('agent') ||
      node.type?.toLowerCase().includes('agent')
    );
    
    if (agentNodes.length > 0) {
      return agentNodes[0].data.description || '';
    }
    
    return '';
  }
  
  /**
   * Gera um ID único
   */
  private generateId(): string {
    return `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Exportar instância padrão
export const flowiseTemplateImporter = new FlowiseTemplateImporter();