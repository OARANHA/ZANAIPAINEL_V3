# Guia Completo das APIs Flowise para Projeto Zania

**Baseado na documentação oficial:** https://docs.flowiseai.com/api-reference/  
**Versão:** 1.0.0  
**Última Atualização:** 2025-06-23  
**Projeto:** Zania AI Platform

## Introdução

Este guia serve como referência permanente para integração com as APIs Flowise no projeto Zania. A documentação foi compilada a partir das fontes oficiais e está estruturada para comunicação bidirecional com Flowise.

**Objetivo:** Estabelecer comunicação bidirecional com Flowise (buscar e enviar dados)  
**Escopo:** Cobre todos os endpoints principais das APIs Flowise  
**Público Alvo:** Desenvolvedores do projeto Zania

## Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Configuração e Autenticação](#configuração-e-autenticação)
3. [APIs Detalhadas](#apis-detalhadas)
   - [Assistants API](#1-assistants-api)
   - [Attachments API](#2-attachments-api)
   - [Document Store API](#3-document-store-api)
   - [Leads API](#4-leads-api)
   - [Ping API](#5-ping-api)
   - [Prediction API](#6-prediction-api)
   - [Tools API](#7-tools-api)
   - [Upsert History API](#8-upsert-history-api)
   - [Variables API](#9-variables-api)
   - [Vector Upsert API](#10-vector-upsert-api)
4. [Padrões de Resposta e Erros](#padrões-de-resposta-e-erros)
5. [Exemplos de Implementação](#exemplos-de-implementação)
6. [Melhores Práticas](#melhores-práticas)

---

## Visão Geral da Arquitetura

### Fluxo de Comunicação Bidirecional
```
Zania Platform ←→ Flowise APIs ←→ Flowise Engine
     ↓                    ↓                ↓
  Frontend          API Clients        Workflow Engine
  Interface         (TypeScript)        (Processing)
```

### Direções de Comunicação
1. **Zania → Flowise**: Envio de dados para processamento
2. **Flowise → Zania**: Retorno de resultados e metadados
3. **Bidirecional**: Sincronização de estado e configurações

---

## Configuração e Autenticação

### Variáveis de Ambiente Necessárias
```bash
# .env
FLOWISE_API_KEY=your_api_key_here
FLOWISE_BASE_URL=https://api.flowiseai.com
```

### Autenticação
- **Tipo:** API Key Bearer Token
- **Header:** Authorization
- **Formato:** `Bearer ${API_KEY}`

### Headers Padrão
```typescript
const DEFAULT_HEADERS = {
  'Authorization': `Bearer ${process.env.FLOWISE_API_KEY}`,
  'Content-Type': 'application/json',
  'User-Agent': 'Zania-Platform/1.0.0'
};
```

---

## APIs Detalhadas

### 1. Assistants API

**Propósito:** Gerenciar assistentes virtuais especializados

#### Endpoints
```typescript
// Listar todos os assistentes
GET /api/v1/assistants

// Criar novo assistente
POST /api/v1/assistants

// Obter assistente específico
GET /api/v1/assistants/{id}

// Atualizar assistente
PUT /api/v1/assistants/{id}

// Deletar assistente
DELETE /api/v1/assistants/{id}

// Executar assistente
POST /api/v1/assistants/{id}/execute
```

#### Estrutura de Dados
```typescript
interface Assistant {
  id: string;
  name: string;
  description: string;
  type: 'chat' | 'tool' | 'composed' | 'knowledge';
  configuration: AssistantConfig;
  status: 'active' | 'inactive' | 'training';
  createdAt: string;
  updatedAt: string;
}

interface AssistantConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools?: string[];
  knowledgeBase?: string;
}
```

#### Exemplo de Uso no Zania
```typescript
// Criar assistente especializado
const assistant = await flowiseClient.assistants.createAssistant({
  name: 'Assistente de Suporte Zania',
  description: 'Assistente especializado em suporte técnico',
  type: 'knowledge',
  configuration: {
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'Você é um assistente de suporte técnico especializado.',
    tools: ['calculator', 'web_search']
  }
});

// Executar assistente
const result = await flowiseClient.assistants.executeAssistant(assistant.id, {
  input: 'Como posso configurar a integração com Flowise?',
  context: { userId: 'user-123', session: 'session-456' }
});
```

---

### 2. Attachments API

**Propósito:** Gerenciar anexos de documentos em conversas

#### Endpoints
```typescript
// Upload de anexo
POST /api/v1/attachments/upload

// Listar anexos
GET /api/v1/attachments

// Obter anexo específico
GET /api/v1/attachments/{id}

// Deletar anexo
DELETE /api/v1/attachments/{id}

// Processar anexo
POST /api/v1/attachments/{id}/process
```

#### Estrutura de Dados
```typescript
interface Attachment {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  processed: boolean;
  content?: string;
  metadata: AttachmentMetadata;
}

interface AttachmentMetadata {
  extractedText?: string;
  pageCount?: number;
  language?: string;
  entities?: Entity[];
}
```

#### Exemplo de Uso no Zania
```typescript
// Upload de documento
const file = new File(['conteúdo do documento'], 'manual.pdf', {
  type: 'application/pdf'
});

const attachment = await flowiseClient.attachments.uploadAttachment(file, {
  category: 'manual',
  userId: 'user-123'
});

// Processar anexo para extração de texto
const processed = await flowiseClient.attachments.processAttachment(attachment.id, {
  extractText: true,
  detectLanguage: true,
  extractEntities: true
});
```

---

### 3. Document Store API

**Propósito:** Gerenciar armazenamento e recuperação de documentos

#### Endpoints
```typescript
// Adicionar documento ao store
POST /api/v1/documents/upsert

// Buscar documentos
GET /api/v1/documents/search

// Listar documentos
GET /api/v1/documents

// Obter documento específico
GET /api/v1/documents/{id}

// Deletar documento
DELETE /api/v1/documents/{id}

// Atualizar documento
PUT /api/v1/documents/{id}
```

#### Estrutura de Dados
```typescript
interface Document {
  id: string;
  title: string;
  content: string;
  metadata: DocumentMetadata;
  embeddings?: number[];
  createdAt: string;
  updatedAt: string;
}

interface DocumentMetadata {
  source: string;
  author?: string;
  tags?: string[];
  category?: string;
  language?: string;
}
```

#### Exemplo de Uso no Zania
```typescript
// Adicionar documento à base de conhecimento
const document = await flowiseClient.documents.upsertDocument({
  title: 'Manual de Integração Flowise',
  content: 'Conteúdo detalhado do manual...',
  metadata: {
    source: 'zania-docs',
    author: 'technical-team',
    tags: ['integration', 'flowise', 'api'],
    category: 'technical-documentation'
  }
});

// Buscar documentos relevantes
const searchResults = await flowiseClient.documents.searchDocuments(
  'como configurar API Flowise',
  {
    limit: 5,
    threshold: 0.7,
    searchType: 'hybrid',
    filters: { category: 'technical-documentation' }
  }
);
```

---

### 4. Leads API

**Propósito:** Capturar e gerenciar leads gerados em conversas

#### Endpoints
```typescript
// Criar lead
POST /api/v1/leads

// Listar leads
GET /api/v1/leads

// Obter lead específico
GET /api/v1/leads/{id}

// Atualizar lead
PUT /api/v1/leads/{id}

// Qualificar lead
POST /api/v1/leads/{id}/qualify

// Converter lead em cliente
POST /api/v1/leads/{id}/convert
```

#### Estrutura de Dados
```typescript
interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'qualified' | 'converted' | 'lost';
  score: number;
  source: string;
  metadata: LeadMetadata;
  createdAt: string;
  updatedAt: string;
}

interface LeadMetadata {
  conversationId?: string;
  interests?: string[];
  budget?: string;
  timeline?: string;
  notes?: string;
}
```

#### Exemplo de Uso no Zania
```typescript
// Capturar lead de conversa
const lead = await flowiseClient.leads.createLead({
  name: 'João Silva',
  email: 'joao@empresa.com',
  company: 'Tech Solutions',
  source: 'chatbot-zania',
  metadata: {
    conversationId: 'conv-123',
    interests: ['integração', 'automatização', 'ia'],
    budget: '10k-50k',
    timeline: '3-6 meses'
  }
});

// Qualificar lead automaticamente
const qualified = await flowiseClient.leads.qualifyLead(lead.id, {
  criteria: {
    budgetMatch: true,
    timelineMatch: true,
    interestLevel: 'high'
  }
});
```

---

### 5. Ping API

**Propósito:** Verificar saúde e disponibilidade da API

#### Endpoints
```typescript
// Health check básico
GET /api/v1/ping

// Health check detalhado
GET /api/v1/health

// Status de serviços
GET /api/v1/status
```

#### Estrutura de Resposta
```typescript
interface PingResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version: string;
  uptime: number;
}

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: {
    database: 'up' | 'down';
    cache: 'up' | 'down';
    ai: 'up' | 'down';
  };
  metrics: {
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
}
```

#### Exemplo de Uso no Zania
```typescript
// Verificar saúde da API
const health = await flowiseClient.ping.health();
if (health.status === 'healthy') {
  console.log('Flowise API está saudável');
} else {
  console.log('Serviços com problemas:', health.services);
}

// Health check periódico
setInterval(async () => {
  const isHealthy = await flowiseClient.ping.isHealthy();
  if (!isHealthy) {
    // Implementar lógica de recuperação
    console.warn('Flowise API não está saudável');
  }
}, 60000);
```

---

### 6. Prediction API

**Propósito:** Fazer previsões e obter respostas de modelos de IA

#### Endpoints
```typescript
// Fazer previsão
POST /api/v1/prediction

// Previsão em batch
POST /api/v1/prediction/batch

// Obter histórico de previsões
GET /api/v1/prediction/history

// Obter previsão específica
GET /api/v1/prediction/{id}
```

#### Estrutura de Dados
```typescript
interface PredictionRequest {
  input: string | Record<string, any>;
  model?: string;
  parameters?: PredictionParameters;
  context?: PredictionContext;
}

interface PredictionResponse {
  id: string;
  output: any;
  confidence: number;
  processingTime: number;
  tokensUsed: number;
  metadata: PredictionMetadata;
}

interface PredictionParameters {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  stopSequences?: string[];
}
```

#### Exemplo de Uso no Zania
```typescript
// Fazer previsão simples
const prediction = await flowiseClient.prediction.predict({
  input: 'Qual a melhor abordagem para integração com Flowise?',
  model: 'gpt-4',
  parameters: {
    temperature: 0.7,
    maxTokens: 1000
  }
});

// Previsão com streaming
const stream = await flowiseClient.prediction.streamPredict({
  input: 'Gerar um artigo sobre integração de sistemas',
  parameters: { temperature: 0.8 }
});

for await (const chunk of stream) {
  console.log('Chunk:', chunk);
}
```

---

### 7. Tools API

**Propósito:** Gerenciar e executar ferramentas externas

#### Endpoints
```typescript
// Listar ferramentas disponíveis
GET /api/v1/tools

// Executar ferramenta
POST /api/v1/tools/{toolName}/execute

// Obter definição da ferramenta
GET /api/v1/tools/{toolName}

// Registrar nova ferramenta
POST /api/v1/tools/register

// Atualizar ferramenta
PUT /api/v1/tools/{toolName}
```

#### Estrutura de Dados
```typescript
interface Tool {
  name: string;
  description: string;
  parameters: ToolParameter[];
  returnType: string;
  category: 'api' | 'database' | 'file' | 'custom';
  version: string;
  author: string;
}

interface ToolExecution {
  toolName: string;
  parameters: Record<string, any>;
  result: any;
  executionTime: number;
  status: 'success' | 'error' | 'timeout';
}
```

#### Exemplo de Uso no Zania
```typescript
// Listar ferramentas disponíveis
const tools = await flowiseClient.tools.listTools();
console.log('Ferramentas disponíveis:', tools.map(t => t.name));

// Executar ferramenta de cálculo
const result = await flowiseClient.tools.executeTool('calculator', {
  expression: '2 + 2 * 3'
});

// Registrar ferramenta personalizada
const customTool = await flowiseClient.tools.registerTool({
  name: 'zania-integration-check',
  description: 'Verifica status de integração com sistemas Zania',
  parameters: [
    { name: 'systemId', type: 'string', required: true },
    { name: 'checkType', type: 'string', required: false }
  ],
  returnType: 'IntegrationStatus',
  category: 'custom'
});
```

---

### 8. Upsert History API

**Propósito:** Gerenciar histórico de atualizações e mudanças

#### Endpoints
```typescript
// Listar histórico
GET /api/v1/upsert-history

// Obter registro específico
GET /api/v1/upsert-history/{id}

// Buscar por entidade
GET /api/v1/upsert-history/entity/{entityType}/{entityId}

// Reverter alteração
POST /api/v1/upsert-history/{id}/revert
```

#### Estrutura de Dados
```typescript
interface UpsertHistory {
  id: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  changes: Record<string, any>;
  timestamp: string;
  user: string;
  metadata: Record<string, any>;
}
```

#### Exemplo de Uso no Zania
```typescript
// Obter histórico de alterações de um assistente
const history = await flowiseClient.upsertHistory.getHistory(
  'assistant',
  'assistant-123'
);

// Reverter alteração específica
const reverted = await flowiseClient.upsertHistory.revertChange(
  'history-record-456'
);
```

---

### 9. Variables API

**Propósito:** Gerenciar variáveis de ambiente e configurações

#### Endpoints
```typescript
// Listar variáveis
GET /api/v1/variables

// Obter variável específica
GET /api/v1/variables/{key}

// Criar/atualizar variável
POST /api/v1/variables

// Deletar variável
DELETE /api/v1/variables/{key}

// Obter variáveis por categoria
GET /api/v1/variables/category/{category}
```

#### Estrutura de Dados
```typescript
interface Variable {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  category: string;
  description?: string;
  isSecret: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### Exemplo de Uso no Zania
```typescript
// Definir variável de configuração
await flowiseClient.variables.setVariable('zania_api_timeout', '30000', {
  type: 'number',
  category: 'api',
  description: 'Timeout para chamadas de API em milissegundos'
});

// Obter variável
const timeout = await flowiseClient.variables.getVariable('zania_api_timeout');

// Listar variáveis de configuração
const configVars = await flowiseClient.variables.getVariablesByCategory('api');
```

---

### 10. Vector Upsert API

**Propósito:** Gerenciar embeddings e busca vetorial

#### Endpoints
```typescript
// Adicionar embeddings
POST /api/v1/vector-upsert

// Buscar vetorial
GET /api/v1/vector-upsert/search

// Obter embeddings específicos
GET /api/v1/vector-upsert/{id}

// Deletar embeddings
DELETE /api/v1/vector-upsert/{id}

// Atualizar embeddings
PUT /api/v1/vector-upsert/{id}
```

#### Estrutura de Dados
```typescript
interface VectorUpsertRequest {
  texts: string[];
  metadata?: Record<string, any>[];
  model?: string;
  chunkSize?: number;
  chunkOverlap?: number;
}

interface VectorSearchRequest {
  query: string;
  limit?: number;
  threshold?: number;
  filters?: Record<string, any>;
}

interface VectorSearchResult {
  id: string;
  text: string;
  score: number;
  metadata: Record<string, any>;
}
```

#### Exemplo de Uso no Zania
```typescript
// Adicionar textos para indexação vetorial
const upsertResult = await flowiseClient.vectorUpsert.upsertVectors({
  texts: [
    'Integração com Flowise permite criar workflows complexos',
    'A API de assistentes é útil para criar agentes especializados'
  ],
  metadata: [
    { source: 'docs', category: 'integration' },
    { source: 'docs', category: 'api' }
  ],
  chunkSize: 1000,
  chunkOverlap: 200
});

// Busca semântica
const searchResults = await flowiseClient.vectorUpsert.searchVectors({
  query: 'como criar agentes especializados',
  limit: 5,
  threshold: 0.7,
  filters: { category: 'api' }
});
```

---

## Padrões de Resposta e Erros

### Padrão de Resposta de Sucesso
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  metadata?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}
```

### Padrão de Resposta de Erro
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}
```

### Códigos de Erro Comuns
- `401 Unauthorized`: API key inválida ou ausente
- `403 Forbidden`: Permissões insuficientes
- `404 Not Found`: Recurso não encontrado
- `429 Too Many Requests`: Limite de taxa excedido
- `500 Internal Server Error`: Erro interno do servidor
- `503 Service Unavailable`: Serviço temporariamente indisponível

---

## Exemplos de Implementação

### Cliente Completo para Zania
```typescript
// src/lib/flowise-complete-client.ts
import { FlowiseConfigManager } from './flowise-config';

export class FlowiseCompleteClient {
  private config: FlowiseConfigManager;

  constructor(config?: any) {
    this.config = new FlowiseConfigManager(config);
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(this.config.buildUrl('ping'), {
        headers: this.config.getHeaders()
      });
      return await response.json();
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  // Criar assistente com conhecimento
  async createAssistantWithKnowledge(data: {
    name: string;
    description: string;
    knowledge: string;
    tools?: string[];
  }) {
    // Criar assistente
    const assistant = await this.createAssistant({
      name: data.name,
      description: data.description,
      type: 'knowledge'
    });

    // Adicionar conhecimento ao document store
    await this.upsertDocument({
      title: `Conhecimento: ${data.name}`,
      content: data.knowledge,
      metadata: {
        assistantId: assistant.id,
        type: 'knowledge_base'
      }
    });

    return assistant;
  }

  // Processar mensagem com anexos
  async processMessageWithAttachments(data: {
    message: string;
    attachments?: File[];
    context?: any;
  }) {
    const results = {
      response: '',
      processedAttachments: [] as any[]
    };

    // Processar anexos se existirem
    if (data.attachments) {
      for (const file of data.attachments) {
        const attachment = await this.uploadAttachment(file);
        const processed = await this.processAttachment(attachment.id);
        results.processedAttachments.push(processed);
      }
    }

    // Fazer previsão com a mensagem
    const prediction = await this.predict({
      input: data.message,
      context: {
        ...data.context,
        attachments: results.processedAttachments
      }
    });

    results.response = prediction.output;
    return results;
  }

  // Métodos para cada API (implementados anteriormente)
  async createAssistant(data: any) { /* ... */ }
  async upsertDocument(data: any) { /* ... */ }
  async uploadAttachment(file: File) { /* ... */ }
  async processAttachment(id: string) { /* ... */ }
  async predict(data: any) { /* ... */ }
}
```

---

## Melhores Práticas

### Segurança
- ✅ Sempre use HTTPS em produção
- ✅ Nunca exponha chaves de API no frontend
- ✅ Implemente rate limiting
- ✅ Valide todos os dados de entrada
- ✅ Use variáveis de ambiente para credenciais

### Performance
- ✅ Use conexões keep-alive
- ✅ Implemente cache para respostas frequentes
- ✅ Processe respostas de forma assíncrona
- ✅ Monitore tempos de resposta
- ✅ Use batching para múltiplas requisições

### Confiabilidade
- ✅ Implemente retry com exponential backoff
- ✅ Use circuit breaker para falhas em cascata
- ✅ Logue todas as requisições e respostas
- ✅ Monitore saúde da API
- ✅ Implemente health checks periódicos

### Monitoramento
- ✅ Métricas de tempo de resposta
- ✅ Taxa de sucesso/falha
- ✅ Uso de recursos
- ✅ Alertas para anomalias

---

## Conclusão

Este guia fornece uma referência completa para integração bidirecional com as APIs Flowise no projeto Zania. Todas as APIs principais estão documentadas com exemplos práticos de implementação.

**Próximos Passos:**
1. Implementar os clientes específicos para cada API
2. Criar os endpoints de API no Zania para comunicação bidirecional
3. Implementar os exemplos de uso no frontend
4. Adicionar testes e monitoramento

---

*Este guia será atualizado conforme novas versões das APIs Flowise forem lançadas.*