/**
 * Exportações principais para clientes Flowise
 * Ponto central de acesso para todos os clientes e utilitários
 */

// Cliente base
export { FlowiseBaseClient, type FlowiseClientConfig } from './flowise-base-client';

// Clientes específicos
export { FlowiseAssistantsClient, type Assistant, type CreateAssistantRequest, type ExecuteInput, type ExecuteResponse } from './flowise-assistants-client';
export { FlowiseAttachmentsClient, type Attachment, type ProcessOptions, type ProcessResult } from './flowise-attachments-client';
export { FlowiseDocumentStoreClient, type Document, type UpsertDocumentRequest, type SearchResult, type SearchOptions } from './flowise-document-store-client';

// Factory e cliente unificado
export { FlowiseClientFactory, createFlowiseClientFactory, getFlowiseClientFactory } from './flowise-client-factory';
export { ZaniaFlowiseClient, createZaniaFlowiseClient, type ZaniaFlowiseConfig, type CreateAgentOptions, type ProcessMessageOptions, type ProcessMessageResult, type CreateKnowledgeBaseOptions } from './flowise-zania-client';

// Re-exportar tipos úteis
export type * from './flowise-base-client';
export type * from './flowise-assistants-client';
export type * from './flowise-attachments-client';
export type * from './flowise-document-store-client';