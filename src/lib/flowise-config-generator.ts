/**
 * Enhanced Flowise Configuration Generator
 * 
 * Gera configurações do Flowise com integração de APIs reais
 */

import { apiConfigManager } from './api-config';
import { FlowiseNode } from './flowise-node-catalog';

export interface FlowiseAgentConfig {
  name: string;
  description: string;
  nodes: FlowiseNodeConfig[];
  edges: FlowiseEdgeConfig[];
  flows: any[];
  apiConfig: any;
}

export interface FlowiseNodeConfig {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

export interface FlowiseEdgeConfig {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export class FlowiseConfigGenerator {
  /**
   * Gera configuração completa do Flowise com APIs reais
   */
  static async generateCompleteConfig(agentData: any): Promise<FlowiseAgentConfig> {
    const apiConfig = apiConfigManager.getFlowiseConfig();
    const defaultProvider = apiConfigManager.getDefaultProvider();
    
    if (!defaultProvider) {
      throw new Error('Nenhum provedor de API configurado');
    }

    const config: FlowiseAgentConfig = {
      name: agentData.name || 'Agente sem nome',
      description: agentData.description || 'Agente gerado pelo Zanai',
      nodes: [],
      edges: [],
      flows: [],
      apiConfig
    };

    // Gerar configuração baseada no tipo de agente
    switch (agentData.type?.toLowerCase()) {
      case 'chat':
        this.generateChatConfig(config, agentData, defaultProvider);
        break;
      case 'rag':
        this.generateRagConfig(config, agentData, defaultProvider);
        break;
      case 'assistant':
        this.generateAssistantConfig(config, agentData, defaultProvider);
        break;
      default:
        this.generateDefaultConfig(config, agentData, defaultProvider);
    }

    return config;
  }

  /**
   * Gera configuração para agente de chat
   */
  private static generateChatConfig(
    config: FlowiseAgentConfig, 
    agentData: any, 
    provider: any
  ): void {
    const { nodes, edges } = config;
    
    // Chat Input Node
    nodes.push({
      id: 'chat-input',
      type: 'Chat Input',
      position: { x: 0, y: 0 },
      data: {
        label: 'Chat Input',
        message: ''
      }
    });

    // Prompt Template Node
    nodes.push({
      id: 'prompt-template',
      type: 'Prompt Template',
      position: { x: 300, y: 0 },
      data: {
        label: 'Prompt Template',
        template: agentData.systemPrompt || 'You are a helpful assistant.',
        inputVariables: ['question']
      }
    });

    // LLM Node com configuração real da API
    nodes.push({
      id: 'llm',
      type: 'OpenAI' || provider.name,
      position: { x: 600, y: 0 },
      data: {
        label: provider.name,
        modelName: agentData.model || provider.models[0] || 'gpt-4',
        apiKey: provider.apiKey,
        baseUrl: provider.baseUrl,
        temperature: agentData.temperature || 0.7,
        maxTokens: agentData.maxTokens || 1000,
        topP: agentData.topP || 1,
        frequencyPenalty: agentData.frequencyPenalty || 0,
        presencePenalty: agentData.presencePenalty || 0
      }
    });

    // Chat Output Node
    nodes.push({
      id: 'chat-output',
      type: 'Chat Output',
      position: { x: 900, y: 0 },
      data: {
        label: 'Chat Output'
      }
    });

    // Conexões
    edges.push(
      { id: 'e1-2', source: 'chat-input', target: 'prompt-template' },
      { id: 'e2-3', source: 'prompt-template', target: 'llm' },
      { id: 'e3-4', source: 'llm', target: 'chat-output' }
    );
  }

  /**
   * Gera configuração para agente RAG
   */
  private static generateRagConfig(
    config: FlowiseAgentConfig, 
    agentData: any, 
    provider: any
  ): void {
    const { nodes, edges } = config;
    
    // Document Loader
    nodes.push({
      id: 'doc-loader',
      type: 'Document Loader',
      position: { x: 0, y: 0 },
      data: {
        label: 'Document Loader',
        documentPaths: agentData.documents || []
      }
    });

    // Text Splitter
    nodes.push({
      id: 'text-splitter',
      type: 'Recursive Character Text Splitter',
      position: { x: 300, y: 0 },
      data: {
        label: 'Text Splitter',
        chunkSize: 1000,
        chunkOverlap: 200
      }
    });

    // Embeddings
    nodes.push({
      id: 'embeddings',
      type: 'OpenAI Embeddings',
      position: { x: 600, y: 0 },
      data: {
        label: 'Embeddings',
        apiKey: provider.apiKey,
        baseUrl: provider.baseUrl,
        modelName: 'text-embedding-ada-002'
      }
    });

    // Vector Store
    nodes.push({
      id: 'vector-store',
      type: 'Vector Store',
      position: { x: 900, y: 0 },
      data: {
        label: 'Vector Store',
        indexName: agentData.indexName || 'default'
      }
    });

    // Retriever
    nodes.push({
      id: 'retriever',
      type: 'Vector Store Retriever',
      position: { x: 600, y: 200 },
      data: {
        label: 'Retriever',
        k: agentData.topK || 4
      }
    });

    // Prompt Template
    nodes.push({
      id: 'prompt-template',
      type: 'Prompt Template',
      position: { x: 900, y: 200 },
      data: {
        label: 'Prompt Template',
        template: agentData.systemPrompt || `Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}

Question: {question}

Answer:`,
        inputVariables: ['context', 'question']
      }
    });

    // LLM
    nodes.push({
      id: 'llm',
      type: 'OpenAI' || provider.name,
      position: { x: 1200, y: 200 },
      data: {
        label: provider.name,
        modelName: agentData.model || provider.models[0] || 'gpt-4',
        apiKey: provider.apiKey,
        baseUrl: provider.baseUrl,
        temperature: agentData.temperature || 0.7
      }
    });

    // Chat Input/Output
    nodes.push({
      id: 'chat-input',
      type: 'Chat Input',
      position: { x: 300, y: 200 },
      data: {
        label: 'Chat Input',
        message: ''
      }
    });

    nodes.push({
      id: 'chat-output',
      type: 'Chat Output',
      position: { x: 1500, y: 200 },
      data: {
        label: 'Chat Output'
      }
    });

    // Conexões
    edges.push(
      // Document processing pipeline
      { id: 'e1-2', source: 'doc-loader', target: 'text-splitter' },
      { id: 'e2-3', source: 'text-splitter', target: 'embeddings' },
      { id: 'e3-4', source: 'embeddings', target: 'vector-store' },
      
      // Chat pipeline
      { id: 'e5-6', source: 'chat-input', target: 'retriever' },
      { id: 'e4-6', source: 'vector-store', target: 'retriever' },
      { id: 'e6-7', source: 'retriever', target: 'prompt-template' },
      { id: 'e7-8', source: 'prompt-template', target: 'llm' },
      { id: 'e8-9', source: 'llm', target: 'chat-output' }
    );
  }

  /**
   * Gera configuração para agente assistente
   */
  private static generateAssistantConfig(
    config: FlowiseAgentConfig, 
    agentData: any, 
    provider: any
  ): void {
    const { nodes, edges } = config;
    
    // Chat Input
    nodes.push({
      id: 'chat-input',
      type: 'Chat Input',
      position: { x: 0, y: 0 },
      data: {
        label: 'Chat Input',
        message: ''
      }
    });

    // Agent Executor
    nodes.push({
      id: 'agent-executor',
      type: 'Agent Executor',
      position: { x: 300, y: 0 },
      data: {
        label: 'Agent Executor',
        agentName: agentData.name || 'Assistant'
      }
    });

    // LLM
    nodes.push({
      id: 'llm',
      type: 'OpenAI' || provider.name,
      position: { x: 600, y: 0 },
      data: {
        label: provider.name,
        modelName: agentData.model || provider.models[0] || 'gpt-4',
        apiKey: provider.apiKey,
        baseUrl: provider.baseUrl,
        temperature: agentData.temperature || 0.7
      }
    });

    // Tools (exemplo: Calculator)
    nodes.push({
      id: 'calculator',
      type: 'Calculator',
      position: { x: 300, y: 200 },
      data: {
        label: 'Calculator'
      }
    });

    // Search Tool
    nodes.push({
      id: 'search',
      type: 'Google Search',
      position: { x: 600, y: 200 },
      data: {
        label: 'Google Search',
        apiKey: process.env.GOOGLE_API_KEY || '',
        searchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID || ''
      }
    });

    // Chat Output
    nodes.push({
      id: 'chat-output',
      type: 'Chat Output',
      position: { x: 900, y: 0 },
      data: {
        label: 'Chat Output'
      }
    });

    // Conexões
    edges.push(
      { id: 'e1-2', source: 'chat-input', target: 'agent-executor' },
      { id: 'e2-3', source: 'agent-executor', target: 'llm' },
      { id: 'e3-4', source: 'llm', target: 'chat-output' },
      { id: 'e2-5', source: 'agent-executor', target: 'calculator' },
      { id: 'e2-6', source: 'agent-executor', target: 'search' }
    );
  }

  /**
   * Gera configuração padrão
   */
  private static generateDefaultConfig(
    config: FlowiseAgentConfig, 
    agentData: any, 
    provider: any
  ): void {
    this.generateChatConfig(config, agentData, provider);
  }

  /**
   * Valida a configuração gerada
   */
  static validateConfig(config: FlowiseAgentConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.name || config.name.trim() === '') {
      errors.push('Nome do agente é obrigatório');
    }

    if (!config.nodes || config.nodes.length === 0) {
      errors.push('Pelo menos um node é obrigatório');
    }

    if (!config.edges || config.edges.length === 0) {
      errors.push('Pelo menos uma conexão é obrigatória');
    }

    // Validar se há um node LLM com configuração de API
    const llmNode = config.nodes.find(node => 
      node.type.includes('OpenAI') || 
      node.type.includes('LLM') || 
      node.type.includes('Z.AI')
    );

    if (!llmNode) {
      errors.push('É necessário um node LLM para o agente funcionar');
    } else if (!llmNode.data.apiKey) {
      errors.push('O node LLM precisa de uma API key configurada');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Exporta configuração para formato JSON
   */
  static exportToJSON(config: FlowiseAgentConfig): string {
    return JSON.stringify(config, null, 2);
  }

  /**
   * Importa configuração de formato JSON
   */
  static importFromJSON(jsonString: string): FlowiseAgentConfig {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error('Formato JSON inválido');
    }
  }
}