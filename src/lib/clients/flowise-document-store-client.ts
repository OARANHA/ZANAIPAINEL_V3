/**
 * Cliente para API de Document Store do Flowise
 * Gerencia armazenamento e recuperação de documentos
 */

import { FlowiseBaseClient, FlowiseClientConfig } from './flowise-base-client';

export interface Document {
  id: string;
  title: string;
  content: string;
  metadata: DocumentMetadata;
  embeddings?: number[];
  chunkCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentMetadata {
  source: string;
  author?: string;
  tags?: string[];
  category?: string;
  language?: string;
  documentType?: string;
  confidence?: number;
}

export interface UpsertDocumentRequest {
  id?: string; // Opcional para atualização
  title: string;
  content: string;
  metadata: DocumentMetadata;
  generateEmbeddings?: boolean;
  chunkSize?: number;
  chunkOverlap?: number;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  threshold?: number;
  filters?: Record<string, any>;
  includeMetadata?: boolean;
}

export interface SearchResult {
  document: Document;
  score: number;
  highlights?: string[];
  matchedChunks?: Array<{
    content: string;
    score: number;
    metadata?: Record<string, any>;
  }>;
}

export interface VectorSearchOptions {
  topK?: number;
  namespace?: string;
  filter?: Record<string, any>;
  includeVectors?: boolean;
}

export class FlowiseDocumentStoreClient extends FlowiseBaseClient {
  constructor(config: FlowiseClientConfig) {
    super(config);
  }

  /**
   * Adicionar/atualizar documento
   */
  async upsertDocument(data: UpsertDocumentRequest): Promise<Document> {
    return this.request('POST', '/api/v1/documents/upsert', data);
  }

  /**
   * Adicionar/atualizar múltiplos documentos
   */
  async upsertDocuments(data: UpsertDocumentRequest[]): Promise<Document[]> {
    return this.request('POST', '/api/v1/documents/batch-upsert', { documents: data });
  }

  /**
   * Buscar documentos por similaridade semântica
   */
  async searchDocuments(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    const params = new URLSearchParams({ query });
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = `/api/v1/documents/search?${params.toString()}`;
    return this.request('GET', endpoint);
  }

  /**
   * Buscar documentos por vetor
   */
  async vectorSearch(query: string, options?: VectorSearchOptions): Promise<SearchResult[]> {
    return this.request('POST', '/api/v1/documents/vector-search', {
      query,
      ...options
    });
  }

  /**
   * Buscar híbrida (texto + vetor)
   */
  async hybridSearch(query: string, options?: SearchOptions & VectorSearchOptions): Promise<{
    semanticResults: SearchResult[];
    keywordResults: SearchResult[];
    combinedResults: SearchResult[];
  }> {
    return this.request('POST', '/api/v1/documents/hybrid-search', {
      query,
      ...options
    });
  }

  /**
   * Listar documentos
   */
  async listDocuments(options?: {
    limit?: number;
    offset?: number;
    filters?: Record<string, any>;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    documents: Document[];
    total: number;
    hasMore: boolean;
  }> {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = params.toString() 
      ? `/api/v1/documents?${params.toString()}` 
      : '/api/v1/documents';

    return this.request('GET', endpoint);
  }

  /**
   * Obter documento específico
   */
  async getDocument(id: string, options?: {
    includeChunks?: boolean;
    includeEmbeddings?: boolean;
  }): Promise<Document> {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = params.toString() 
      ? `/api/v1/documents/${id}?${params.toString()}` 
      : `/api/v1/documents/${id}`;

    return this.request('GET', endpoint);
  }

  /**
   * Deletar documento
   */
  async deleteDocument(id: string): Promise<void> {
    return this.request('DELETE', `/api/v1/documents/${id}`);
  }

  /**
   * Deletar múltiplos documentos
   */
  async deleteDocuments(ids: string[]): Promise<{ deleted: number; errors?: string[] }> {
    return this.request('POST', '/api/v1/documents/batch-delete', { ids });
  }

  /**
   * Atualizar metadados do documento
   */
  async updateDocumentMetadata(id: string, metadata: Partial<DocumentMetadata>): Promise<Document> {
    return this.request('PATCH', `/api/v1/documents/${id}/metadata`, metadata);
  }

  /**
   * Gerar embeddings para documento existente
   */
  async generateEmbeddings(id: string, options?: {
    chunkSize?: number;
    chunkOverlap?: number;
    model?: string;
  }): Promise<{
    generated: number;
    processingTime: number;
    model: string;
  }> {
    return this.request('POST', `/api/v1/documents/${id}/embeddings`, options || {});
  }

  /**
   * Obter chunks do documento
   */
  async getDocumentChunks(id: string, options?: {
    limit?: number;
    offset?: number;
    includeEmbeddings?: boolean;
  }): Promise<Array<{
    id: string;
    content: string;
    metadata?: Record<string, any>;
    embeddings?: number[];
    score?: number;
  }>> {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = params.toString() 
      ? `/api/v1/documents/${id}/chunks?${params.toString()}` 
      : `/api/v1/documents/${id}/chunks`;

    return this.request('GET', endpoint);
  }

  /**
   * Buscar por tags
   */
  async searchByTags(tags: string[], options?: {
    operator?: 'AND' | 'OR';
    limit?: number;
    offset?: number;
  }): Promise<SearchResult[]> {
    return this.request('POST', '/api/v1/documents/search-by-tags', {
      tags,
      operator: options?.operator || 'AND',
      limit: options?.limit,
      offset: options?.offset
    });
  }

  /**
   * Obter estatísticas do document store
   */
  async getDocumentStats(): Promise<{
    totalDocuments: number;
    totalChunks: number;
    totalSize: number;
    averageDocumentLength: number;
    categoryDistribution: Record<string, number>;
    languageDistribution: Record<string, number>;
    dailyStats: Array<{
      date: string;
      documentsAdded: number;
      documentsDeleted: number;
      searchesPerformed: number;
    }>;
  }> {
    return this.request('GET', '/api/v1/documents/stats');
  }

  /**
   * Otimizar índices de busca
   */
  async optimizeIndex(): Promise<{
    optimized: boolean;
    timeTaken: number;
    indexSize: number;
  }> {
    return this.request('POST', '/api/v1/documents/optimize');
  }

  /**
   * Exportar documentos
   */
  async exportDocuments(options?: {
    format?: 'json' | 'csv' | 'parquet';
    filters?: Record<string, any>;
    includeEmbeddings?: boolean;
  }): Promise<Blob> {
    const params = new URLSearchParams();
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }

    const endpoint = `/api/v1/documents/export?${params.toString()}`;
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status} ${response.statusText}`);
    }

    return response.blob();
  }

  /**
   * Importar documentos
   */
  async importDocuments(file: File, options?: {
    generateEmbeddings?: boolean;
    chunkSize?: number;
    chunkOverlap?: number;
    metadata?: Record<string, any>;
  }): Promise<{
    imported: number;
    errors: Array<{
      row: number;
      error: string;
    }>;
    processingTime: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }

    const response = await fetch(`${this.baseUrl}/api/v1/documents/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Import failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}