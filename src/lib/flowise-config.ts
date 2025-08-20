// Configuração centralizada para integração com APIs Flowise
// Baseado na documentação oficial: https://docs.flowiseai.com/api-reference/

export interface FlowiseConfig {
  apiKey: string;
  baseUrl: string;
  timeout?: number;
  retries?: number;
  enableLogging?: boolean;
  enableCaching?: boolean;
}

export interface FlowiseApiEndpoints {
  assistants: string;
  attachments: string;
  documentStore: string;
  leads: string;
  ping: string;
  prediction: string;
  tools: string;
  upsertHistory: string;
  variables: string;
  vectorUpsert: string;
}

// Configuração padrão
export const DEFAULT_FLOWISE_CONFIG: FlowiseConfig = {
  apiKey: process.env.FLOWISE_API_KEY || '',
  baseUrl: process.env.FLOWISE_BASE_URL || 'https://api.flowiseai.com',
  timeout: 30000,
  retries: 3,
  enableLogging: true,
  enableCaching: true
};

// Endpoints das APIs Flowise
export const FLOWISE_ENDPOINTS: FlowiseApiEndpoints = {
  assistants: '/api/v1/assistants',
  attachments: '/api/v1/attachments',
  documentStore: '/api/v1/documents',
  leads: '/api/v1/leads',
  ping: '/api/v1/ping',
  prediction: '/api/v1/prediction',
  tools: '/api/v1/tools',
  upsertHistory: '/api/v1/upsert-history',
  variables: '/api/v1/variables',
  vectorUpsert: '/api/v1/vector-upsert'
};

// Classe de configuração para gerenciar integração Flowise
export class FlowiseConfigManager {
  private config: FlowiseConfig;
  private endpoints: FlowiseApiEndpoints;

  constructor(config: Partial<FlowiseConfig> = {}) {
    this.config = { ...DEFAULT_FLOWISE_CONFIG, ...config };
    this.endpoints = FLOWISE_ENDPOINTS;
  }

  // Obter configuração completa
  getConfig(): FlowiseConfig {
    return this.config;
  }

  // Obter endpoints
  getEndpoints(): FlowiseApiEndpoints {
    return this.endpoints;
  }

  // Construir URL completa para um endpoint
  buildUrl(endpoint: keyof FlowiseApiEndpoints, path?: string): string {
    const baseUrl = this.config.baseUrl;
    const endpointPath = this.endpoints[endpoint];
    const fullPath = path ? `${endpointPath}/${path}` : endpointPath;
    return `${baseUrl}${fullPath}`;
  }

  // Obter headers padrão para requisições
  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Zania-Platform/1.0.0'
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  // Validar configuração
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.apiKey) {
      errors.push('FLOWISE_API_KEY is required');
    }

    if (!this.config.baseUrl) {
      errors.push('FLOWISE_BASE_URL is required');
    }

    if (!this.config.baseUrl.startsWith('http')) {
      errors.push('FLOWISE_BASE_URL must start with http:// or https://');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Atualizar configuração
  updateConfig(newConfig: Partial<FlowiseConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Obter URL base
  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  // Obter API key
  getApiKey(): string {
    return this.config.apiKey;
  }

  // Obter timeout
  getTimeout(): number {
    return this.config.timeout || 30000;
  }

  // Obter número de retries
  getRetries(): number {
    return this.config.retries || 3;
  }

  // Verificar se logging está habilitado
  isLoggingEnabled(): boolean {
    return this.config.enableLogging ?? true;
  }

  // Verificar se caching está habilitado
  isCachingEnabled(): boolean {
    return this.config.enableCaching ?? true;
  }
}

// Instância singleton para uso em toda a aplicação
export const flowiseConfig = new FlowiseConfigManager();

// Função auxiliar para criar instância de configuração
export function createFlowiseConfig(config?: Partial<FlowiseConfig>): FlowiseConfigManager {
  return new FlowiseConfigManager(config);
}