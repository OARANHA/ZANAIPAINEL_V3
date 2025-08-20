/**
 * Cliente unificado para integração Flowise no projeto Zania
 * Fornece uma interface simplificada para operações comuns
 */

import { FlowiseClientFactory, FlowiseClientConfig } from './flowise-client-factory';
import { FlowiseAssistantsClient } from './flowise-assistants-client';
import { FlowiseAttachmentsClient } from './flowise-attachments-client';
import { FlowiseDocumentStoreClient } from './flowise-document-store-client';

export interface ZaniaFlowiseConfig extends FlowiseClientConfig {
  enableCaching?: boolean;
  enableRetry?: boolean;
  enableLogging?: boolean;
}

export interface CreateAgentOptions {
  name: string;
  description: string;
  type: 'chat' | 'tool' | 'composed' | 'knowledge';
  systemPrompt?: string;
  knowledge?: string;
  tools?: string[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ProcessMessageOptions {
  message: string;
  attachments?: File[];
  sessionId?: string;
  context?: Record<string, any>;
  streaming?: boolean;
}

export interface ProcessMessageResult {
  response: string;
  attachments?: any[];
  confidence: number;
  processingTime: number;
  metadata: Record<string, any>;
  stream?: ReadableStream; // Para respostas streaming
}

export interface CreateKnowledgeBaseOptions {
  title: string;
  content: string;
  metadata?: Record<string, any>;
  generateEmbeddings?: boolean;
  chunkSize?: number;
  chunkOverlap?: number;
}

export class ZaniaFlowiseClient {
  private factory: FlowiseClientFactory;
  private config: ZaniaFlowiseConfig;

  constructor(config: ZaniaFlowiseConfig) {
    this.config = {
      enableCaching: true,
      enableRetry: true,
      enableLogging: true,
      ...config
    };

    this.factory = FlowiseClientFactory.getInstance(config);
  }

  // Propriedades para acessar clientes específicos
  get assistants(): FlowiseAssistantsClient {
    return this.factory.getAssistantsClient();
  }

  get attachments(): FlowiseAttachmentsClient {
    return this.factory.getAttachmentsClient();
  }

  get documents(): FlowiseDocumentStoreClient {
    return this.factory.getDocumentStoreClient();
  }

  // Métodos de alta ordem para operações comuns no Zania

  /**
   * Verificar saúde da integração Flowise
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    services: Record<string, boolean>;
    details?: Record<string, any>;
  }> {
    try {
      const serviceHealth = await this.factory.healthCheck();
      const allHealthy = Object.values(serviceHealth).every(healthy => healthy);

      return {
        healthy: allHealthy,
        services: serviceHealth,
        details: {
          timestamp: new Date().toISOString(),
          config: {
            baseUrl: this.config.baseUrl,
            enableCaching: this.config.enableCaching,
            enableRetry: this.config.enableRetry
          }
        }
      };
    } catch (error) {
      return {
        healthy: false,
        services: {},
        details: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * Criar agente com conhecimento integrado
   */
  async createAgentWithKnowledge(options: CreateAgentOptions): Promise<{
    agent: any;
    knowledgeBase?: any;
    success: boolean;
    error?: string;
  }> {
    try {
      // Criar assistente
      const agent = await this.assistants.createAssistant({
        name: options.name,
        description: options.description,
        type: options.type,
        configuration: {
          model: options.model || 'gpt-4',
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 2000,
          systemPrompt: options.systemPrompt || `Você é um assistente especializado chamado ${options.name}.`,
          tools: options.tools
        }
      });

      let knowledgeBase;
      
      // Adicionar documento à base de conhecimento se fornecido
      if (options.knowledge) {
        knowledgeBase = await this.documents.upsertDocument({
          title: `Base de Conhecimento - ${options.name}`,
          content: options.knowledge,
          metadata: {
            source: 'zania',
            agentId: agent.id,
            agentName: options.name,
            type: 'knowledge_base',
            category: 'agent_knowledge'
          },
          generateEmbeddings: true
        });
      }

      return {
        agent,
        knowledgeBase,
        success: true
      };
    } catch (error) {
      return {
        agent: null,
        knowledgeBase: null,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Processar mensagem com anexos
   */
  async processMessage(options: ProcessMessageOptions): Promise<ProcessMessageResult> {
    const { message, attachments, sessionId, context, streaming } = options;

    try {
      // Processar anexos se existirem
      const processedAttachments = [];
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const attachment = await this.attachments.uploadAttachment(file, {
            sessionId,
            source: 'message_processing'
          });
          
          // Processar o anexo para extrair texto e metadados
          const processed = await this.attachments.processAttachment(attachment.id, {
            extractText: true,
            extractEntities: true,
            classifyContent: true
          });
          
          processedAttachments.push({
            attachment,
            processed
          });
        }
      }

      // Preparar contexto para a previsão
      const predictionContext = {
        ...context,
        attachments: processedAttachments,
        sessionId,
        processedAt: new Date().toISOString()
      };

      if (streaming) {
        // Para streaming, retornar o stream diretamente
        const stream = await this.assistants.streamAssistant(
          'default', // ID do assistente padrão ou usar um específico
          {
            message,
            context: predictionContext,
            sessionId
          }
        );

        return {
          response: '',
          attachments: processedAttachments,
          confidence: 0,
          processingTime: 0,
          metadata: { streaming: true },
          stream
        };
      } else {
        // Para resposta normal
        const prediction = await this.assistants.executeAssistant(
          'default', // ID do assistente padrão ou usar um específico
          {
            message,
            context: predictionContext,
            sessionId
          }
        );

        return {
          response: prediction.response,
          attachments: processedAttachments,
          confidence: prediction.confidence,
          processingTime: prediction.processingTime,
          metadata: prediction.metadata
        };
      }
    } catch (error) {
      throw new Error(`Erro ao processar mensagem: ${error.message}`);
    }
  }

  /**
   * Criar base de conhecimento
   */
  async createKnowledgeBase(options: CreateKnowledgeBaseOptions): Promise<{
    document: any;
    success: boolean;
    error?: string;
    stats?: {
      chunks: number;
      embeddingsGenerated: boolean;
      processingTime: number;
    };
  }> {
    try {
      const startTime = Date.now();
      
      const document = await this.documents.upsertDocument({
        title: options.title,
        content: options.content,
        metadata: {
          ...options.metadata,
          source: 'zania',
          type: 'knowledge_base',
          createdAt: new Date().toISOString()
        },
        generateEmbeddings: options.generateEmbeddings ?? true,
        chunkSize: options.chunkSize || 1000,
        chunkOverlap: options.chunkOverlap || 200
      });

      const processingTime = Date.now() - startTime;

      // Obter chunks do documento para estatísticas
      let chunkCount = 0;
      try {
        const chunks = await this.documents.getDocumentChunks(document.id, { limit: 1 });
        chunkCount = chunks.length;
      } catch {
        // Ignorar erro ao obter chunks
      }

      return {
        document,
        success: true,
        stats: {
          chunks: chunkCount,
          embeddingsGenerated: options.generateEmbeddings ?? true,
          processingTime
        }
      };
    } catch (error) {
      return {
        document: null,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Buscar em bases de conhecimento
   */
  async searchKnowledge(query: string, options?: {
    limit?: number;
    threshold?: number;
    filters?: Record<string, any>;
    searchType?: 'semantic' | 'keyword' | 'hybrid';
  }): Promise<{
    results: any[];
    total: number;
    query: string;
    searchType: string;
    processingTime: number;
  }> {
    try {
      const startTime = Date.now();
      const searchType = options?.searchType || 'semantic';
      
      let results;
      
      switch (searchType) {
        case 'semantic':
          results = await this.documents.searchDocuments(query, {
            limit: options?.limit || 10,
            threshold: options?.threshold || 0.5,
            filters: options?.filters
          });
          break;
          
        case 'keyword':
          results = await this.documents.listDocuments({
            limit: options?.limit || 10,
            filters: {
              ...options?.filters,
              content: { $contains: query }
            }
          });
          break;
          
        case 'hybrid':
          const hybrid = await this.documents.hybridSearch(query, {
            limit: options?.limit || 10,
            threshold: options?.threshold || 0.5,
            filters: options?.filters
          });
          results = hybrid.combinedResults;
          break;
          
        default:
          throw new Error(`Tipo de busca não suportado: ${searchType}`);
      }

      const processingTime = Date.now() - startTime;

      return {
        results,
        total: results.length,
        query,
        searchType,
        processingTime
      };
    } catch (error) {
      throw new Error(`Erro ao buscar conhecimento: ${error.message}`);
    }
  }

  /**
   * Obter estatísticas da integração
   */
  async getIntegrationStats(): Promise<{
    agents: any;
    documents: any;
    attachments: any;
    health: any;
    timestamp: string;
  }> {
    try {
      const [agentsStats, documentsStats, attachmentsStats, health] = await Promise.allSettled([
        this.assistants.listAssistants({ limit: 1000 }),
        this.documents.getDocumentStats(),
        this.attachments.getAttachmentStats(),
        this.healthCheck()
      ]);

      return {
        agents: agentsStats.status === 'fulfilled' ? agentsStats.value : { error: agentsStats.reason.message },
        documents: documentsStats.status === 'fulfilled' ? documentsStats.value : { error: documentsStats.reason.message },
        attachments: attachmentsStats.status === 'fulfilled' ? attachmentsStats.value : { error: attachmentsStats.reason.message },
        health: health.status === 'fulfilled' ? health.value : { error: health.reason.message },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }

  /**
   * Limpar recursos e desconectar
   */
  async cleanup(): Promise<void> {
    this.factory.clear();
  }
}

/**
 * Função utilitária para criar cliente Zania Flowise
 */
export function createZaniaFlowiseClient(config: ZaniaFlowiseConfig): ZaniaFlowiseClient {
  return new ZaniaFlowiseClient(config);
}