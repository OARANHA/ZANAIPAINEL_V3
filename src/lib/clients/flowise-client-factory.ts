/**
 * Factory pattern para criação de clientes Flowise
 * Gerencia instâncias singleton de cada cliente
 */

import { FlowiseClientConfig } from './flowise-base-client';
import { FlowiseAssistantsClient } from './flowise-assistants-client';
import { FlowiseAttachmentsClient } from './flowise-attachments-client';
import { FlowiseDocumentStoreClient } from './flowise-document-store-client';

// Importar outros clientes quando forem criados
// import { FlowiseLeadsClient } from './flowise-leads-client';
// import { FlowisePingClient } from './flowise-ping-client';
// import { FlowisePredictionClient } from './flowise-prediction-client';
// import { FlowiseToolsClient } from './flowise-tools-client';
// import { FlowiseUpsertHistoryClient } from './flowise-upsert-history-client';
// import { FlowiseVariablesClient } from './flowise-variables-client';
// import { FlowiseVectorClient } from './flowise-vector-client';

export class FlowiseClientFactory {
  private static instance: FlowiseClientFactory;
  private clients: Map<string, any> = new Map();
  private config: FlowiseClientConfig;

  private constructor(config: FlowiseClientConfig) {
    this.config = config;
  }

  static getInstance(config?: FlowiseClientConfig): FlowiseClientFactory {
    if (!FlowiseClientFactory.instance) {
      if (!config) {
        throw new Error('Config is required for first initialization');
      }
      FlowiseClientFactory.instance = new FlowiseClientFactory(config);
    }
    return FlowiseClientFactory.instance;
  }

  /**
   * Obter cliente de Assistants
   */
  getAssistantsClient(): FlowiseAssistantsClient {
    return this.getClient('assistants', FlowiseAssistantsClient);
  }

  /**
   * Obter cliente de Attachments
   */
  getAttachmentsClient(): FlowiseAttachmentsClient {
    return this.getClient('attachments', FlowiseAttachmentsClient);
  }

  /**
   * Obter cliente de Document Store
   */
  getDocumentStoreClient(): FlowiseDocumentStoreClient {
    return this.getClient('documentStore', FlowiseDocumentStoreClient);
  }

  /**
   * Obter cliente de Leads
   */
  getLeadsClient() {
    return this.getClient('leads', () => import('./flowise-leads-client').then(m => new m.FlowiseLeadsClient(this.config)));
  }

  /**
   * Obter cliente de Ping
   */
  getPingClient() {
    return this.getClient('ping', () => import('./flowise-ping-client').then(m => new m.FlowisePingClient(this.config)));
  }

  /**
   * Obter cliente de Prediction
   */
  getPredictionClient() {
    return this.getClient('prediction', () => import('./flowise-prediction-client').then(m => new m.FlowisePredictionClient(this.config)));
  }

  /**
   * Obter cliente de Tools
   */
  getToolsClient() {
    return this.getClient('tools', () => import('./flowise-tools-client').then(m => new m.FlowiseToolsClient(this.config)));
  }

  /**
   * Obter cliente de Upsert History
   */
  getUpsertHistoryClient() {
    return this.getClient('upsertHistory', () => import('./flowise-upsert-history-client').then(m => new m.FlowiseUpsertHistoryClient(this.config)));
  }

  /**
   * Obter cliente de Variables
   */
  getVariablesClient() {
    return this.getClient('variables', () => import('./flowise-variables-client').then(m => new m.FlowiseVariablesClient(this.config)));
  }

  /**
   * Obter cliente de Vector
   */
  getVectorClient() {
    return this.getClient('vector', () => import('./flowise-vector-client').then(m => new m.FlowiseVectorClient(this.config)));
  }

  /**
   * Método genérico para obter ou criar cliente
   */
  private getClient<T>(key: string, ClientClassOrFactory: new (config: FlowiseClientConfig) => T | (() => Promise<T>)): T {
    if (!this.clients.has(key)) {
      try {
        if (typeof ClientClassOrFactory === 'function' && ClientClassOrFactory.prototype) {
          // É uma classe construtora
          const ClientClass = ClientClassOrFactory as new (config: FlowiseClientConfig) => T;
          this.clients.set(key, new ClientClass(this.config));
        } else {
          // É uma função factory que retorna uma Promise
          throw new Error(`Dynamic import not implemented for ${key}. Please implement the client first.`);
        }
      } catch (error) {
        console.error(`Error creating client ${key}:`, error);
        throw new Error(`Failed to create client ${key}: ${error.message}`);
      }
    }
    
    return this.clients.get(key);
  }

  /**
   * Atualizar configuração de todos os clientes
   */
  updateConfig(newConfig: Partial<FlowiseClientConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Limpar clientes existentes para que sejam recriados com nova configuração
    this.clear();
  }

  /**
   * Limpar todos os clientes (útil para testes ou reconfiguração)
   */
  clear(): void {
    this.clients.clear();
  }

  /**
   * Verificar saúde de todos os clientes
   */
  async healthCheck(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    // Testar clientes básicos
    try {
      await this.getAssistantsClient().listAssistants({ limit: 1 });
      results.assistants = true;
    } catch {
      results.assistants = false;
    }

    try {
      await this.getAttachmentsClient().listAttachments({ limit: 1 });
      results.attachments = true;
    } catch {
      results.attachments = false;
    }

    try {
      await this.getDocumentStoreClient().listDocuments({ limit: 1 });
      results.documentStore = true;
    } catch {
      results.documentStore = false;
    }

    // Testar cliente de ping se disponível
    try {
      const pingClient = this.getPingClient();
      if (pingClient && typeof pingClient.ping === 'function') {
        await pingClient.ping();
        results.ping = true;
      }
    } catch {
      results.ping = false;
    }

    return results;
  }

  /**
   * Obter estatísticas de uso dos clientes
   */
  getUsageStats(): Record<string, any> {
    return {
      totalClients: this.clients.size,
      clientTypes: Array.from(this.clients.keys()),
      config: {
        baseUrl: this.config.baseUrl,
        timeout: this.config.timeout,
        retries: this.config.retries
      }
    };
  }
}

/**
 * Função utilitária para criar instância da factory
 */
export function createFlowiseClientFactory(config: FlowiseClientConfig): FlowiseClientFactory {
  return FlowiseClientFactory.getInstance(config);
}

/**
 * Função utilitária para obter instância existente da factory
 */
export function getFlowiseClientFactory(): FlowiseClientFactory {
  return FlowiseClientFactory.getInstance();
}