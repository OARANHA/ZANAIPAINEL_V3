// Cliente para integração com Flowise API
export interface FlowiseConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface FlowiseWorkflow {
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

export interface FlowiseExecution {
  id: string;
  executionData: string;
  state: 'INPROGRESS' | 'FINISHED' | 'ERROR' | 'TERMINATED' | 'TIMEOUT' | 'STOPPED';
  agentflowId: string;
  sessionId: string;
  action?: string;
  isPublic?: boolean;
  createdDate: Date;
  updatedDate: Date;
  stoppedDate?: Date;
}

export interface FlowiseTool {
  id: string;
  name: string;
  description: string;
  category: string;
  inputs: any[];
  outputs: any[];
  capabilities: string[];
}

export class FlowiseClient {
  private config: FlowiseConfig;

  constructor(config: FlowiseConfig) {
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      ...config
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    let lastError: Error;
    
    for (let attempt = 1; attempt <= (this.config.retryAttempts || 3); attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: AbortSignal.timeout(this.config.timeout || 30000)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === (this.config.retryAttempts || 3)) {
          break;
        }
        
        // Esperar antes de tentar novamente (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }

    throw lastError || new Error('Request failed');
  }

  // Métodos para Chatflows
  async getChatflows(filters?: {
    type?: string;
    workspaceId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: FlowiseWorkflow[]; total: number }> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.workspaceId) params.append('workspaceId', filters.workspaceId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const endpoint = `/api/v1/chatflows${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<{ data: FlowiseWorkflow[]; total: number }>(endpoint);
  }

  async getChatflow(id: string): Promise<FlowiseWorkflow> {
    return this.request<FlowiseWorkflow>(`/api/v1/chatflows/${id}`);
  }

  async createChatflow(chatflow: Partial<FlowiseWorkflow>): Promise<FlowiseWorkflow> {
    return this.request<FlowiseWorkflow>('/api/v1/chatflows', {
      method: 'POST',
      body: JSON.stringify(chatflow)
    });
  }

  async updateChatflow(id: string, chatflow: Partial<FlowiseWorkflow>): Promise<FlowiseWorkflow> {
    return this.request<FlowiseWorkflow>(`/api/v1/chatflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chatflow)
    });
  }

  async deleteChatflow(id: string): Promise<void> {
    return this.request<void>(`/api/v1/chatflows/${id}`, {
      method: 'DELETE'
    });
  }

  // Métodos para Execuções
  async getExecutions(filters?: {
    agentflowId?: string;
    sessionId?: string;
    state?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: FlowiseExecution[]; total: number }> {
    const params = new URLSearchParams();
    
    if (filters?.agentflowId) params.append('agentflowId', filters.agentflowId);
    if (filters?.sessionId) params.append('sessionId', filters.sessionId);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const endpoint = `/api/v1/executions${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request<{ data: FlowiseExecution[]; total: number }>(endpoint);
  }

  async getExecution(id: string): Promise<FlowiseExecution> {
    return this.request<FlowiseExecution>(`/api/v1/executions/${id}`);
  }

  async createExecution(execution: Partial<FlowiseExecution>): Promise<FlowiseExecution> {
    return this.request<FlowiseExecution>('/api/v1/executions', {
      method: 'POST',
      body: JSON.stringify(execution)
    });
  }

  // Métodos para Ferramentas
  async getTools(): Promise<FlowiseTool[]> {
    return this.request<FlowiseTool[]>('/api/v1/tools');
  }

  async getTool(id: string): Promise<FlowiseTool> {
    return this.request<FlowiseTool>(`/api/v1/tools/${id}`);
  }

  // Métodos para Nós
  async getNodes(): Promise<any[]> {
    return this.request<any[]>('/api/v1/nodes');
  }

  async getNode(id: string): Promise<any> {
    return this.request<any>(`/api/v1/nodes/${id}`);
  }

  // Métodos para Credenciais
  async getCredentials(): Promise<any[]> {
    return this.request<any[]>('/api/v1/credentials');
  }

  async createCredential(credential: any): Promise<any> {
    return this.request<any>('/api/v1/credentials', {
      method: 'POST',
      body: JSON.stringify(credential)
    });
  }

  // Métodos utilitários
  async testConnection(): Promise<boolean> {
    try {
      await this.request('/ping');
      return true;
    } catch {
      return false;
    }
  }

  async getHealth(): Promise<{
    status: 'healthy' | 'unhealthy';
    uptime: number;
    version: string;
    chatflowCount: number;
  }> {
    return this.request('/api/v1/health');
  }

  // Sincronização em lote
  async syncAllWorkflows(): Promise<{
    total: number;
    synced: number;
    errors: number;
    workflows: FlowiseWorkflow[];
  }> {
    try {
      // Obter todos workflows
      const { data: workflows } = await this.getChatflows({ limit: 1000 });
      
      let synced = 0;
      let errors = 0;

      // Enviar para API local do Zanai
      for (const workflow of workflows) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/v1/flowise-workflows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'register_workflow',
              data: workflow
            })
          });
          synced++;
        } catch (error) {
          console.error(`Erro ao sincronizar workflow ${workflow.id}:`, error);
          errors++;
        }
      }

      return {
        total: workflows.length,
        synced,
        errors,
        workflows
      };
    } catch (error) {
      console.error('Erro na sincronização em lote:', error);
      return {
        total: 0,
        synced: 0,
        errors: 1,
        workflows: []
      };
    }
  }

  // Executar workflow
  async executeWorkflow(chatflowId: string, input: any, options?: {
    sessionId?: string;
    streaming?: boolean;
  }): Promise<any> {
    const endpoint = `/api/v1/prediction/${chatflowId}`;
    
    const body = {
      input,
      sessionId: options?.sessionId,
      streaming: options?.streaming || false
    };

    return this.request<any>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // Obter configuração do chatbot
  async getChatbotConfig(chatflowId: string): Promise<any> {
    return this.request<any>(`/api/v1/public-chatbotConfig/${chatflowId}`);
  }

  // Verificar mudanças no workflow
  async checkForChanges(chatflowId: string, lastUpdatedDateTime: string): Promise<{
    hasChanged: boolean;
    lastUpdated: string;
  }> {
    return this.request<{
      hasChanged: boolean;
      lastUpdated: string;
    }>(`/api/v1/chatflows/has-changed/${chatflowId}/${lastUpdatedDateTime}`);
  }
}

// Factory function para criar cliente
export function createFlowiseClient(config: FlowiseConfig): FlowiseClient {
  return new FlowiseClient(config);
}

// Configuração padrão
export const defaultFlowiseConfig: FlowiseConfig = {
  baseUrl: process.env.NEXT_PUBLIC_FLOWISE_URL || 'http://localhost:3001',
  apiKey: process.env.FLOWISE_API_KEY,
  timeout: 30000,
  retryAttempts: 3
};