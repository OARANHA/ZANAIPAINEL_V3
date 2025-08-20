/**
 * Cliente para API de Assistants do Flowise
 * Gerencia assistentes virtuais especializados
 */

import { FlowiseBaseClient, FlowiseClientConfig } from './flowise-base-client';

export interface Assistant {
  id: string;
  name: string;
  description: string;
  type: 'chat' | 'tool' | 'composed' | 'knowledge';
  configuration: AssistantConfig;
  status: 'active' | 'inactive' | 'training';
  createdAt: string;
  updatedAt: string;
}

export interface AssistantConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools?: string[];
  knowledgeBase?: string;
}

export interface CreateAssistantRequest {
  name: string;
  description: string;
  type: Assistant['type'];
  configuration: AssistantConfig;
}

export interface UpdateAssistantRequest extends Partial<CreateAssistantRequest> {
  id: string;
}

export interface ExecuteInput {
  message: string;
  context?: Record<string, any>;
  sessionId?: string;
  attachments?: string[];
}

export interface ExecuteResponse {
  response: string;
  confidence: number;
  processingTime: number;
  tokensUsed: number;
  metadata: Record<string, any>;
}

export class FlowiseAssistantsClient extends FlowiseBaseClient {
  constructor(config: FlowiseClientConfig) {
    super(config);
  }

  /**
   * Criar novo assistente
   */
  async createAssistant(data: CreateAssistantRequest): Promise<Assistant> {
    return this.request('POST', '/api/v1/assistants', data);
  }

  /**
   * Listar todos os assistentes
   */
  async listAssistants(options?: {
    limit?: number;
    offset?: number;
    type?: Assistant['type'];
    status?: Assistant['status'];
  }): Promise<Assistant[]> {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = params.toString() 
      ? `/api/v1/assistants?${params.toString()}` 
      : '/api/v1/assistants';

    return this.request('GET', endpoint);
  }

  /**
   * Obter assistente específico
   */
  async getAssistant(id: string): Promise<Assistant> {
    return this.request('GET', `/api/v1/assistants/${id}`);
  }

  /**
   * Atualizar assistente
   */
  async updateAssistant(data: UpdateAssistantRequest): Promise<Assistant> {
    const { id, ...updateData } = data;
    return this.request('PUT', `/api/v1/assistants/${id}`, updateData);
  }

  /**
   * Deletar assistente
   */
  async deleteAssistant(id: string): Promise<void> {
    return this.request('DELETE', `/api/v1/assistants/${id}`);
  }

  /**
   * Executar assistente
   */
  async executeAssistant(id: string, input: ExecuteInput): Promise<ExecuteResponse> {
    return this.request('POST', `/api/v1/assistants/${id}/execute`, input);
  }

  /**
   * Executar assistente com streaming
   */
  async streamAssistant(id: string, input: ExecuteInput): Promise<ReadableStream> {
    return this.streamRequest('POST', `/api/v1/assistants/${id}/execute`, input);
  }

  /**
   * Ativar assistente
   */
  async activateAssistant(id: string): Promise<Assistant> {
    return this.request('POST', `/api/v1/assistants/${id}/activate`);
  }

  /**
   * Desativar assistente
   */
  async deactivateAssistant(id: string): Promise<Assistant> {
    return this.request('POST', `/api/v1/assistants/${id}/deactivate`);
  }

  /**
   * Treinar assistente
   */
  async trainAssistant(id: string, trainingData: {
    examples: Array<{
      input: string;
      output: string;
      context?: Record<string, any>;
    }>;
  }): Promise<Assistant> {
    return this.request('POST', `/api/v1/assistants/${id}/train`, trainingData);
  }

  /**
   * Obter estatísticas do assistente
   */
  async getAssistantStats(id: string): Promise<{
    totalExecutions: number;
    averageResponseTime: number;
    successRate: number;
    lastUsed: string;
  }> {
    return this.request('GET', `/api/v1/assistants/${id}/stats`);
  }

  /**
   * Clonar assistente
   */
  async cloneAssistant(id: string, newName?: string): Promise<Assistant> {
    const data = newName ? { name: newName } : {};
    return this.request('POST', `/api/v1/assistants/${id}/clone`, data);
  }

  /**
   * Exportar configuração do assistente
   */
  async exportAssistant(id: string): Promise<{
    configuration: AssistantConfig;
    metadata: Record<string, any>;
    exportDate: string;
  }> {
    return this.request('GET', `/api/v1/assistants/${id}/export`);
  }

  /**
   * Importar assistente
   */
  async importAssistant(data: {
    configuration: AssistantConfig;
    metadata?: Record<string, any>;
    name: string;
    description: string;
  }): Promise<Assistant> {
    return this.request('POST', '/api/v1/assistants/import', data);
  }
}