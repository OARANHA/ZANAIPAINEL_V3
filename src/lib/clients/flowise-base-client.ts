/**
 * Cliente base para integração com APIs Flowise
 * Fornece funcionalidades comuns para todos os clientes específicos
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

export interface FlowiseClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryableErrors: string[];
}

export class FlowiseBaseClient {
  protected client: AxiosInstance;
  protected apiKey: string;
  protected baseUrl: string;
  protected retryConfig: RetryConfig;

  constructor(config: FlowiseClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.flowiseai.com';
    
    this.retryConfig = {
      maxRetries: config.retries || 3,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffFactor: 2,
      retryableErrors: ['ECONNABORTED', 'ETIMEDOUT', 'ENOTFOUND']
    };
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: this.getDefaultHeaders(),
      timeout: config.timeout || 30000
    });

    this.setupInterceptors();
  }

  protected getDefaultHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Zania-Platform/2.0.0'
    };
  }

  private setupInterceptors(): void {
    // Request interceptor para logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[${new Date().toISOString()}] Flowise API Request:`, {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data
        });
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para retry e logging
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[${new Date().toISOString()}] Flowise API Response:`, {
          status: response.status,
          url: response.config.url,
          data: response.data
        });
        return response;
      },
      async (error: AxiosError) => {
        const config = error.config;
        
        if (!config || !config.retry) {
          config.retry = { count: 0, maxRetries: this.retryConfig.maxRetries };
        }
        
        // Implementar retry para falhas de rede ou erros 5xx
        if (config.retry.count < config.retry.maxRetries && 
            this.shouldRetry(error)) {
          config.retry.count++;
          const delay = this.calculateDelay(config.retry.count);
          
          console.log(`Retry attempt ${config.retry.count} for ${config.method?.toUpperCase()} ${config.url}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return this.client(config);
        }
        
        console.error(`[${new Date().toISOString()}] Flowise API Error:`, {
          status: error.response?.status,
          message: error.message,
          url: config.url
        });
        
        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: AxiosError): boolean {
    // Tentar novamente para erros de rede específicos
    if (error.code && this.retryConfig.retryableErrors.includes(error.code)) {
      return true;
    }

    // Tentar novamente para erros 5xx
    if (error.response && error.response.status >= 500) {
      return true;
    }

    // Tentar novamente para rate limiting (429)
    if (error.response && error.response.status === 429) {
      return true;
    }

    return false;
  }

  private calculateDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffFactor, attempt - 1);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  async request(method: string, endpoint: string, data?: any): Promise<any> {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        data
      });
      return response.data;
    } catch (error) {
      console.error(`Erro na requisição ${method} ${endpoint}:`, error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Erro de resposta da API
      const status = error.response.status;
      const message = error.response.data?.message || error.message;
      
      switch (status) {
        case 401:
          return new Error('Não autorizado: Verifique sua API key');
        case 403:
          return new Error('Acesso negado: Permissões insuficientes');
        case 404:
          return new Error('Recurso não encontrado');
        case 429:
          return new Error('Limite de taxa excedido');
        case 500:
          return new Error('Erro interno do servidor Flowise');
        default:
          return new Error(`Erro ${status}: ${message}`);
      }
    } else if (error.request) {
      // Erro de rede
      return new Error('Erro de rede: Não foi possível conectar ao servidor Flowise');
    } else {
      // Outros erros
      return new Error(error.message || 'Erro desconhecido');
    }
  }

  // Método para upload de arquivos (multipart/form-data)
  async uploadFile(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }
    
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Erro no upload para ${endpoint}:`, error);
      throw error;
    }
  }

  // Método para streaming responses
  async streamRequest(method: string, endpoint: string, data?: any): Promise<ReadableStream> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        ...this.getDefaultHeaders(),
        'Accept': 'text/event-stream'
      },
      body: data ? JSON.stringify(data) : undefined
    });
    
    if (!response.ok) {
      throw new Error(`Stream request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.body as ReadableStream;
  }
}