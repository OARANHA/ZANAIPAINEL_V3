/**
 * Cliente para API de Attachments do Flowise
 * Gerencia anexos de documentos em conversas
 */

import { FlowiseBaseClient, FlowiseClientConfig } from './flowise-base-client';

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  processed: boolean;
  content?: string; // Para arquivos de texto
  url?: string; // URL para download
  metadata: AttachmentMetadata;
}

export interface AttachmentMetadata {
  extractedText?: string;
  pageCount?: number;
  language?: string;
  entities?: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  author?: string;
  title?: string;
  subject?: string;
}

export interface ProcessOptions {
  extractText?: boolean;
  extractEntities?: boolean;
  classifyContent?: boolean;
  generateSummary?: boolean;
}

export interface ProcessResult {
  processed: boolean;
  extractedText?: string;
  entities?: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  classification?: {
    category: string;
    confidence: number;
  };
  summary?: string;
  processingTime: number;
}

export class FlowiseAttachmentsClient extends FlowiseBaseClient {
  constructor(config: FlowiseClientConfig) {
    super(config);
  }

  /**
   * Upload de anexo
   */
  async uploadAttachment(file: File, metadata?: Record<string, any>): Promise<Attachment> {
    return this.uploadFile('/api/v1/attachments/upload', file, metadata);
  }

  /**
   * Upload de múltiplos anexos
   */
  async uploadAttachments(files: File[], metadata?: Record<string, any>): Promise<Attachment[]> {
    const uploadPromises = files.map(file => this.uploadAttachment(file, metadata));
    return Promise.all(uploadPromises);
  }

  /**
   * Listar anexos
   */
  async listAttachments(options?: {
    limit?: number;
    offset?: number;
    mimeType?: string;
    processed?: boolean;
    fromDate?: string;
    toDate?: string;
  }): Promise<Attachment[]> {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = params.toString() 
      ? `/api/v1/attachments?${params.toString()}` 
      : '/api/v1/attachments';

    return this.request('GET', endpoint);
  }

  /**
   * Obter anexo específico
   */
  async getAttachment(id: string): Promise<Attachment> {
    return this.request('GET', `/api/v1/attachments/${id}`);
  }

  /**
   * Deletar anexo
   */
  async deleteAttachment(id: string): Promise<void> {
    return this.request('DELETE', `/api/v1/attachments/${id}`);
  }

  /**
   * Processar anexo
   */
  async processAttachment(id: string, options: ProcessOptions = {}): Promise<ProcessResult> {
    return this.request('POST', `/api/v1/attachments/${id}/process`, options);
  }

  /**
   * Processar múltiplos anexos
   */
  async processAttachments(ids: string[], options: ProcessOptions = {}): Promise<ProcessResult[]> {
    const processPromises = ids.map(id => this.processAttachment(id, options));
    return Promise.all(processPromises);
  }

  /**
   * Download de anexo
   */
  async downloadAttachment(id: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/v1/attachments/${id}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Extrair texto de anexo
   */
  async extractText(id: string): Promise<{ text: string; confidence: number }> {
    return this.request('POST', `/api/v1/attachments/${id}/extract-text`);
  }

  /**
   * Classificar conteúdo do anexo
   */
  async classifyContent(id: string): Promise<{
    category: string;
    confidence: number;
    categories: Array<{
      name: string;
      confidence: number;
    }>;
  }> {
    return this.request('POST', `/api/v1/attachments/${id}/classify`);
  }

  /**
   * Extrair entidades do anexo
   */
  async extractEntities(id: string, options?: {
    entityTypes?: string[];
    language?: string;
  }): Promise<{
    entities: Array<{
      type: string;
      value: string;
      confidence: number;
      start: number;
      end: number;
    }>;
  }> {
    return this.request('POST', `/api/v1/attachments/${id}/extract-entities`, options || {});
  }

  /**
   * Gerar resumo do anexo
   */
  async generateSummary(id: string, options?: {
    maxLength?: number;
    style?: 'brief' | 'detailed' | 'bullets';
  }): Promise<{
    summary: string;
    keyPoints: string[];
    processingTime: number;
  }> {
    return this.request('POST', `/api/v1/attachments/${id}/summarize`, options || {});
  }

  /**
   * Buscar anexos por conteúdo
   */
  async searchAttachments(query: string, options?: {
    limit?: number;
    offset?: number;
    searchInText?: boolean;
    searchInMetadata?: boolean;
  }): Promise<{
    results: Attachment[];
    total: number;
    query: string;
  }> {
    const params = new URLSearchParams({ query });
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = `/api/v1/attachments/search?${params.toString()}`;
    return this.request('GET', endpoint);
  }

  /**
   * Obter estatísticas de anexos
   */
  async getAttachmentStats(): Promise<{
    totalAttachments: number;
    totalSize: number;
    processedAttachments: number;
    mimeTypeDistribution: Record<string, number>;
    dailyUploads: Array<{
      date: string;
      count: number;
      size: number;
    }>;
  }> {
    return this.request('GET', '/api/v1/attachments/stats');
  }

  /**
   * Compactar anexos antigos
   */
  async archiveAttachments(options: {
    olderThan: string; // Data no formato ISO
    keepRecent?: number; // Número de anexos recentes para manter
  }): Promise<{
    archived: number;
    totalSize: number;
    archiveId: string;
  }> {
    return this.request('POST', '/api/v1/attachments/archive', options);
  }
}