# Clientes Flowise para Projeto Zania

Esta pasta contém uma implementação completa e estruturada de clientes TypeScript para integração com as APIs Flowise no projeto Zania.

## Estrutura

```
src/lib/clients/
├── flowise-base-client.ts          # Cliente base com funcionalidades comuns
├── flowise-assistants-client.ts     # Cliente para API de Assistants
├── flowise-attachments-client.ts    # Cliente para API de Attachments
├── flowise-document-store-client.ts # Cliente para API de Document Store
├── flowise-client-factory.ts       # Factory pattern para gestão de instâncias
├── flowise-zania-client.ts         # Cliente unificado para o Zania
├── index.ts                        # Exportações principais
└── README.md                       # Este arquivo
```

## Funcionalidades

### ✅ Implementados
- **FlowiseBaseClient**: Cliente base com retry automático, logging, tratamento de erros
- **FlowiseAssistantsClient**: Gestão completa de assistentes virtuais
- **FlowiseAttachmentsClient**: Upload, processamento e gestão de anexos
- **FlowiseDocumentStoreClient**: Armazenamento e busca semântica de documentos
- **FlowiseClientFactory**: Factory pattern para gestão de instâncias singleton
- **FlowiseZaniaClient**: Interface simplificada para operações comuns do Zania

### 🔄 Planejados
- FlowiseLeadsClient
- FlowisePingClient
- FlowisePredictionClient
- FlowiseToolsClient
- FlowiseUpsertHistoryClient
- FlowiseVariablesClient
- FlowiseVectorClient

## Uso Básico

### 1. Configuração Inicial

```typescript
import { createZaniaFlowiseClient } from '@/lib/clients';

const client = createZaniaFlowiseClient({
  apiKey: process.env.FLOWISE_API_KEY!,
  baseUrl: process.env.FLOWISE_BASE_URL,
  timeout: 30000,
  retries: 3,
  enableCaching: true,
  enableLogging: true
});
```

### 2. Health Check

```typescript
const health = await client.healthCheck();
console.log('Integration healthy:', health.healthy);
console.log('Service status:', health.services);
```

### 3. Criar Agente com Conhecimento

```typescript
const result = await client.createAgentWithKnowledge({
  name: 'Assistente de Suporte',
  description: 'Assistente especializado em suporte técnico',
  type: 'knowledge',
  systemPrompt: 'Você é um assistente de suporte técnico especializado.',
  knowledge: 'Base de conhecimento sobre produtos, serviços e procedimentos...',
  tools: ['calculator', 'web_search'],
  model: 'gpt-4',
  temperature: 0.7
});

if (result.success) {
  console.log('Agente criado:', result.agent);
  console.log('Base de conhecimento:', result.knowledgeBase);
}
```

### 4. Processar Mensagem com Anexos

```typescript
const message = 'Preciso de ajuda com este documento';
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const files = fileInput.files;

const result = await client.processMessage({
  message,
  attachments: Array.from(files),
  sessionId: 'user-session-123',
  context: {
    userId: 'user-456',
    department: 'support'
  }
});

console.log('Resposta:', result.response);
console.log('Anexos processados:', result.attachments);
console.log('Confiança:', result.confidence);
```

### 5. Criar Base de Conhecimento

```typescript
const knowledgeResult = await client.createKnowledgeBase({
  title: 'Manual do Produto X',
  content: 'Conteúdo detalhado do manual...',
  metadata: {
    category: 'product_manual',
    version: '1.0',
    author: 'technical_team'
  },
  generateEmbeddings: true,
  chunkSize: 1000,
  chunkOverlap: 200
});

if (knowledgeResult.success) {
  console.log('Documento criado:', knowledgeResult.document);
  console.log('Estatísticas:', knowledgeResult.stats);
}
```

### 6. Buscar em Bases de Conhecimento

```typescript
const searchResult = await client.searchKnowledge('como instalar o produto X', {
  limit: 5,
  threshold: 0.7,
  searchType: 'hybrid',
  filters: {
    category: 'product_manual'
  }
});

console.log('Resultados encontrados:', searchResult.results.length);
console.log('Tempo de busca:', searchResult.processingTime + 'ms');
```

### 7. Usar Clientes Específicos

```typescript
// Acessar clientes específicos diretamente
const assistantsClient = client.assistants;
const attachmentsClient = client.attachments;
const documentsClient = client.documents;

// Listar assistentes
const assistants = await assistantsClient.listAssistants();

// Upload de anexo
const attachment = await attachmentsClient.uploadAttachment(file);

// Buscar documentos
const searchResults = await documentsClient.searchDocuments('consulta específica');
```

## Padrões de Arquitetura

### 1. Factory Pattern
```typescript
// Usar factory para gerenciar instâncias
import { FlowiseClientFactory } from '@/lib/clients';

const factory = FlowiseClientFactory.getInstance({
  apiKey: process.env.FLOWISE_API_KEY!,
  baseUrl: process.env.FLOWISE_BASE_URL
});

const assistantsClient = factory.getAssistantsClient();
const attachmentsClient = factory.getAttachmentsClient();
```

### 2. Retry Automático
Todos os clientes implementam retry automático com exponential backoff:
- **Máximo de tentativas:** 3 (configurável)
- **Estratégia:** Exponential backoff
- **Erros retryáveis:** Erros de rede, 5xx, 429

### 3. Tratamento de Erros
Erros são padronizados com mensagens claras:
```typescript
try {
  const result = await client.someOperation();
} catch (error) {
  console.error('Erro:', error.message);
  // Erros comuns:
  // - "Não autorizado: Verifique sua API key"
  // - "Acesso negado: Permissões insuficientes"
  // - "Recurso não encontrado"
  // - "Limite de taxa excedido"
  // - "Erro interno do servidor Flowise"
}
```

### 4. Logging
Todas as requisições e respostas são logadas automaticamente:
```typescript
// Exemplo de log no console
[2025-08-20T10:30:00.000Z] Flowise API Request: {
  method: 'POST',
  url: '/api/v1/assistants',
  data: { name: 'Test Assistant', ... }
}
[2025-08-20T10:30:00.500Z] Flowise API Response: {
  status: 200,
  url: '/api/v1/assistants',
  data: { id: 'assistant_123', ... }
}
```

## Configuração de Ambiente

### Variáveis de Ambiente Necessárias
```bash
# .env
FLOWISE_API_KEY=your_api_key_here
FLOWISE_BASE_URL=https://api.flowiseai.com
```

### Configuração Opcional
```typescript
const config = {
  apiKey: process.env.FLOWISE_API_KEY!,
  baseUrl: process.env.FLOWISE_BASE_URL,
  timeout: 30000,        // Timeout em ms
  retries: 3,           // Número máximo de retries
  enableCaching: true,  // Habilitar cache
  enableLogging: true,  // Habilitar logging
  enableRetry: true     // Habilitar retry automático
};
```

## Melhores Práticas

### 1. Gerenciamento de Erros
```typescript
async function safeOperation() {
  try {
    const result = await client.someOperation();
    return { success: true, data: result };
  } catch (error) {
    console.error('Operation failed:', error);
    return { 
      success: false, 
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
}
```

### 2. Health Checks
```typescript
// Implementar health checks periódicos
setInterval(async () => {
  const health = await client.healthCheck();
  if (!health.healthy) {
    console.warn('Flowise integration unhealthy:', health.services);
    // Implementar lógica de recuperação
  }
}, 60000); // A cada minuto
```

### 3. Cache e Performance
```typescript
// Implementar cache para operações frequentes
const cache = new Map();

async function getCachedData(key: string, fetchFunction: () => Promise<any>) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetchFunction();
  cache.set(key, data);
  
  // Limpar cache após 5 minutos
  setTimeout(() => cache.delete(key), 300000);
  
  return data;
}
```

### 4. Streaming
```typescript
// Para respostas longas, usar streaming
async function* streamResponse(stream: ReadableStream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      yield chunk;
    }
  } finally {
    reader.releaseLock();
  }
}

// Uso
const result = await client.processMessage({
  message: 'Gerar um texto longo',
  streaming: true
});

if (result.stream) {
  for await (const chunk of streamResponse(result.stream)) {
    console.log('Chunk:', chunk);
  }
}
```

## Testes

### Testes Unitários
```typescript
// tests/clients/flowise-client.test.ts
import { createZaniaFlowiseClient } from '@/lib/clients';

describe('Flowise Client', () => {
  let client: ZaniaFlowiseClient;

  beforeEach(() => {
    client = createZaniaFlowiseClient({
      apiKey: 'test-key',
      baseUrl: 'https://test-api.flowiseai.com'
    });
  });

  test('should create agent with knowledge', async () => {
    const result = await client.createAgentWithKnowledge({
      name: 'Test Agent',
      description: 'Test Description',
      type: 'knowledge',
      knowledge: 'Test knowledge content'
    });

    expect(result.success).toBe(true);
    expect(result.agent).toBeDefined();
  });

  test('should handle health check', async () => {
    const health = await client.healthCheck();
    expect(typeof health.healthy).toBe('boolean');
    expect(typeof health.services).toBe('object');
  });
});
```

## Monitoramento

### Métricas Sugeridas
- **Tempo de resposta** das APIs
- **Taxa de sucesso/falha** das operações
- **Número de retries** por operação
- **Uso de memória** e CPU
- **Tamanho de uploads/downloads**

### Implementação de Monitoramento
```typescript
// metrics/flowise-metrics.ts
export class FlowiseMetrics {
  private metrics = {
    requests: 0,
    errors: 0,
    retries: 0,
    responseTimes: [] as number[]
  };

  recordRequest(responseTime: number, error?: boolean) {
    this.metrics.requests++;
    this.metrics.responseTimes.push(responseTime);
    
    if (error) {
      this.metrics.errors++;
    }
  }

  recordRetry() {
    this.metrics.retries++;
  }

  getStats() {
    return {
      ...this.metrics,
      averageResponseTime: this.metrics.responseTimes.length > 0 
        ? this.metrics.responseTimes.reduce((a, b) => a + b, 0) / this.metrics.responseTimes.length
        : 0,
      errorRate: this.metrics.requests > 0 
        ? (this.metrics.errors / this.metrics.requests) * 100 
        : 0
    };
  }
}
```

## Contribuição

Para adicionar novos clientes:

1. Criar arquivo `flowise-[api-name]-client.ts`
2. Estender `FlowiseBaseClient`
3. Implementar métodos específicos da API
4. Adicionar ao factory
5. Atualizar exportações em `index.ts`
6. Adicionar testes
7. Documentar no README

## Suporte

Para dúvidas ou problemas:
- Verificar o guia completo: `/FLOWISE_API_GUIDE.md`
- Consultar os logs do cliente
- Verificar a configuração do ambiente
- Testar com health checks