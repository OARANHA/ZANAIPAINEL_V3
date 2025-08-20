# 📚 Documentação da API - Zanai AI Agents Platform

Documentação completa da API REST da plataforma Zanai para desenvolvedores.

## 🌟 Visão Geral

A API do Zanai permite integrar funcionalidades da plataforma em suas aplicações, gerenciar agentes, processar conversações e acessar analytics. A API é RESTful, utiliza JSON para comunicação e suporta autenticação via Bearer tokens.

### 🎯 O que você pode fazer com a API?

- **Gerenciar Agentes**: Criar, atualizar, listar e remover agentes
- **Processar Conversações**: Enviar mensagens e receber respostas
- **Acessar Analytics**: Obter métricas e relatórios
- **Gerenciar Usuários**: Criar e gerenciar usuários (admin)
- **Integrar Sistemas**: Conectar com outras plataformas
- **Automatizar Processos**: Criar workflows personalizados

## 🔑 Autenticação

### Bearer Token

Todas as requisições à API devem incluir um token de autenticação no header:

```http
Authorization: Bearer seu-token-aqui
```

### Obtendo um Token

1. Faça login na plataforma Zanai
2. Vá para Configurações > API Keys
3. Clique em "Gerar Nova API Key"
4. Copie o token gerado

### Exemplo de Requisição

```bash
curl -X GET "https://api.zanai.com/v1/agents" \
  -H "Authorization: Bearer seu-token-aqui" \
  -H "Content-Type: application/json"
```

## 📊 Formato de Resposta

### Estrutura Padrão

Todas as respostas da API seguem este formato:

```json
{
  "success": true,
  "data": {
    // dados da resposta
  },
  "message": "Operação realizada com sucesso",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Resposta de Erro

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "name",
        "message": "Nome é obrigatório"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| **200** | OK - Requisição bem-sucedida |
| **201** | Created - Recurso criado com sucesso |
| **400** | Bad Request - Requisição inválida |
| **401** | Unauthorized - Não autorizado |
| **403** | Forbidden - Acesso negado |
| **404** | Not Found - Recurso não encontrado |
| **422** | Unprocessable Entity - Validação falhou |
| **429** | Too Many Requests - Limite de taxa excedido |
| **500** | Internal Server Error - Erro interno do servidor |

## 🤖 Agentes API

### Listar Agentes

```http
GET /api/v1/agents
```

#### Parâmetros de Query

| Parâmetro | Tipo | Descrição | Padrão |
|-----------|------|-----------|---------|
| `page` | integer | Número da página | 1 |
| `limit` | integer | Itens por página | 20 |
| `status` | string | Filtrar por status (active, inactive, training) | null |
| `type` | string | Filtrar por tipo (template, custom, composed) | null |
| `search` | string | Buscar por nome ou descrição | null |

#### Exemplo de Requisição

```bash
curl -X GET "https://api.zanai.com/v1/agents?page=1&limit=10&status=active" \
  -H "Authorization: Bearer seu-token-aqui"
```

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "id": "agent_123",
        "name": "Atendimento ao Cliente",
        "description": "Agente especializado em atendimento",
        "type": "custom",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "performance": {
          "successRate": 0.95,
          "responseTime": 2.5,
          "totalInteractions": 1250
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  },
  "message": "Agentes listados com sucesso"
}
```

### Criar Agente

```http
POST /api/v1/agents
```

#### Body da Requisição

```json
{
  "name": "Atendimento ao Cliente",
  "description": "Agente especializado em atendimento ao cliente 24/7",
  "type": "custom",
  "config": {
    "temperature": 0.7,
    "maxTokens": 1000,
    "systemPrompt": "Você é um agente de atendimento ao cliente..."
  },
  "knowledge": "# Conhecimento do Agente\n\n## FAQs\n\nP: Qual o horário de atendimento?\nR: 24/7",
  "status": "active"
}
```

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "id": "agent_456",
    "name": "Atendimento ao Cliente",
    "description": "Agente especializado em atendimento ao cliente 24/7",
    "type": "custom",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Agente criado com sucesso"
}
```

### Atualizar Agente

```http
PUT /api/v1/agents/{id}
```

#### Body da Requisição

```json
{
  "name": "Atendimento ao Cliente (Atualizado)",
  "description": "Agente especializado em atendimento ao cliente 24/7",
  "status": "active",
  "config": {
    "temperature": 0.8,
    "maxTokens": 1500
  }
}
```

### Deletar Agente

```http
DELETE /api/v1/agents/{id}
```

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": null,
  "message": "Agente removido com sucesso"
}
```

### Executar Agente

```http
POST /api/v1/agents/{id}/execute
```

#### Body da Requisição

```json
{
  "input": "Olá, preciso de ajuda com meu pedido",
  "context": {
    "userId": "user_123",
    "sessionId": "session_456",
    "channel": "web"
  }
}
```

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "executionId": "exec_789",
    "response": "Olá! Como posso ajudar você com seu pedido hoje?",
    "confidence": 0.92,
    "processingTime": 1.5,
    "tokensUsed": 150
  },
  "message": "Agente executado com sucesso"
}
```

## 💬 Chat API

### Enviar Mensagem

```http
POST /api/chat
```

#### Body da Requisição

```json
{
  "agentId": "agent_123",
  "message": "Qual o horário de atendimento?",
  "userId": "user_456",
  "sessionId": "session_789",
  "context": {
    "channel": "web",
    "userAgent": "Mozilla/5.0...",
    "location": "São Paulo, Brasil"
  }
}
```

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "response": "Nosso horário de atendimento é 24 horas por dia, 7 dias por semana!",
    "confidence": 0.98,
    "sessionId": "session_789",
    "timestamp": "2024-01-15T10:30:00Z",
    "metadata": {
      "tokensUsed": 45,
      "processingTime": 0.8,
      "agentId": "agent_123"
    }
  },
  "message": "Mensagem processada com sucesso"
}
```

### Histórico de Conversa

```http
GET /api/chat/history/{sessionId}
```

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "sessionId": "session_789",
    "messages": [
      {
        "id": "msg_123",
        "role": "user",
        "content": "Qual o horário de atendimento?",
        "timestamp": "2024-01-15T10:29:00Z"
      },
      {
        "id": "msg_124",
        "role": "assistant",
        "content": "Nosso horário de atendimento é 24 horas por dia, 7 dias por semana!",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "message": "Histórico recuperado com sucesso"
}
```

## 📈 Analytics API

### Estatísticas do Dashboard

```http
GET /api/v1/dashboard/stats
```

#### Parâmetros de Query

| Parâmetro | Tipo | Descrição | Padrão |
|-----------|------|-----------|---------|
| `period` | string | Período (day, week, month, year) | week |
| `agentId` | string | ID do agente específico | null |

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "totalAgents": 15,
    "activeAgents": 12,
    "totalInteractions": 5432,
    "successRate": 0.94,
    "averageResponseTime": 2.3,
    "userSatisfaction": 4.6,
    "period": "week",
    "comparison": {
      "previousPeriod": {
        "totalInteractions": 4876,
        "successRate": 0.91,
        "averageResponseTime": 2.8
      },
      "change": {
        "interactions": 0.114,
        "successRate": 0.033,
        "responseTime": -0.179
      }
    }
  },
  "message": "Estatísticas recuperadas com sucesso"
}
```

### Tendências

```http
GET /api/v1/dashboard/trends
```

#### Parâmetros de Query

| Parâmetro | Tipo | Descrição | Padrão |
|-----------|------|-----------|---------|
| `metric` | string | Métrica (interactions, success_rate, response_time) | interactions |
| `period` | string | Período (day, week, month, year) | week |
| `granularity` | string | Granularidade (hour, day, week) | day |

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "metric": "interactions",
    "period": "week",
    "granularity": "day",
    "trends": [
      {
        "date": "2024-01-08",
        "value": 650,
        "label": "Segunda"
      },
      {
        "date": "2024-01-09",
        "value": 720,
        "label": "Terça"
      },
      {
        "date": "2024-01-10",
        "value": 680,
        "label": "Quarta"
      }
    ]
  },
  "message": "Tendências recuperadas com sucesso"
}
```

### Atividade Recente

```http
GET /api/v1/dashboard/activity
```

#### Parâmetros de Query

| Parâmetro | Tipo | Descrição | Padrão |
|-----------|------|-----------|---------|
| `limit` | integer | Número de atividades | 20 |
| `type` | string | Tipo de atividade (agent, user, system) | null |

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity_123",
        "type": "agent",
        "action": "created",
        "description": "Novo agente criado: Suporte Técnico",
        "user": {
          "id": "user_456",
          "name": "João Silva"
        },
        "timestamp": "2024-01-15T10:30:00Z"
      },
      {
        "id": "activity_124",
        "type": "user",
        "action": "login",
        "description": "Usuário fez login",
        "user": {
          "id": "user_789",
          "name": "Maria Santos"
        },
        "timestamp": "2024-01-15T10:25:00Z"
      }
    ]
  },
  "message": "Atividades recuperadas com sucesso"
}
```

## 👥 Usuários API (Admin)

### Listar Usuários

```http
GET /api/admin/users
```

#### Parâmetros de Query

| Parâmetro | Tipo | Descrição | Padrão |
|-----------|------|-----------|---------|
| `page` | integer | Número da página | 1 |
| `limit` | integer | Itens por página | 20 |
| `role` | string | Filtrar por função (user, admin, company_admin) | null |
| `status` | string | Filtrar por status (active, inactive, suspended) | null |

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "name": "João Silva",
        "email": "joao@empresa.com",
        "role": "user",
        "status": "active",
        "createdAt": "2024-01-15T10:30:00Z",
        "lastLogin": "2024-01-15T09:30:00Z",
        "company": {
          "id": "company_456",
          "name": "Empresa ABC"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  },
  "message": "Usuários listados com sucesso"
}
```

### Criar Usuário

```http
POST /api/admin/users
```

#### Body da Requisição

```json
{
  "name": "Maria Santos",
  "email": "maria@empresa.com",
  "role": "user",
  "companyId": "company_456",
  "sendWelcomeEmail": true
}
```

### Atualizar Usuário

```http
PUT /api/admin/users/{id}
```

#### Body da Requisição

```json
{
  "name": "Maria Santos Silva",
  "role": "company_admin",
  "status": "active"
}
```

## 🏢 Empresas API (Admin)

### Listar Empresas

```http
GET /api/admin/companies
```

#### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "company_123",
        "name": "Empresa ABC",
        "cnpj": "12.345.678/0001-90",
        "email": "contato@empresaabc.com",
        "status": "active",
        "plan": "professional",
        "createdAt": "2024-01-15T10:30:00Z",
        "users": 15,
        "agents": 8
      }
    ]
  },
  "message": "Empresas listadas com sucesso"
}
```

## 🔔 Webhooks

### Configurar Webhook

```http
POST /api/webhooks
```

#### Body da Requisição

```json
{
  "url": "https://seu-sistema.com/webhook",
  "events": [
    "agent.created",
    "agent.updated",
    "agent.deleted",
    "conversation.completed",
    "user.registered"
  ],
  "secret": "seu-secreto-aqui"
}
```

### Eventos Disponíveis

| Evento | Descrição | Payload |
|--------|-----------|---------|
| `agent.created` | Agente criado | Agent data |
| `agent.updated` | Agente atualizado | Agent data |
| `agent.deleted` | Agente deletado | Agent ID |
| `conversation.completed` | Conversa finalizada | Conversation data |
| `user.registered` | Usuário registrado | User data |
| `user.login` | Usuário fez login | User data |
| `system.error` | Erro no sistema | Error data |

### Exemplo de Payload Webhook

```json
{
  "event": "agent.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "agent_123",
    "name": "Atendimento ao Cliente",
    "description": "Agente especializado em atendimento",
    "type": "custom",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## 🚫 Limites de Taxa

### Limites Padrão

| Tipo de Usuário | Requisições/minuto | Requisições/hora |
|-----------------|-------------------|------------------|
| **Gratuito** | 60 | 1000 |
| **Profissional** | 300 | 10000 |
| **Empresarial** | 600 | 20000 |
| **Enterprise** | Ilimitado | Ilimitado |

### Headers de Rate Limit

```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1642249200
```

### Resposta de Rate Limit Excedido

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Limite de requisições excedido",
    "retryAfter": 60
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🧪 Testando a API

### Ambiente de Teste

Use o ambiente de sandbox para testes:

```bash
curl -X GET "https://sandbox-api.zanai.com/v1/agents" \
  -H "Authorization: Bearer seu-sandbox-token"
```

### Ferramentas Recomendadas

- **Postman**: Collection da API Zanai
- **Insomnia**: Cliente REST moderno
- **curl**: Linha de comando
- **HTTPie**: Cliente HTTP amigável

### Exemplos de Código

#### JavaScript/Node.js

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.zanai.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.ZANAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Listar agentes
async function listAgents() {
  try {
    const response = await api.get('/agents');
    console.log(response.data.data.agents);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}

// Criar agente
async function createAgent(agentData) {
  try {
    const response = await api.post('/agents', agentData);
    console.log('Agente criado:', response.data.data);
  } catch (error) {
    console.error('Erro:', error.response.data);
  }
}
```

#### Python

```python
import requests
import json

class ZanaiAPI:
    def __init__(self, api_key):
        self.base_url = 'https://api.zanai.com/v1'
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def list_agents(self, page=1, limit=20):
        response = requests.get(
            f'{self.base_url}/agents',
            headers=self.headers,
            params={'page': page, 'limit': limit}
        )
        return response.json()
    
    def create_agent(self, agent_data):
        response = requests.post(
            f'{self.base_url}/agents',
            headers=self.headers,
            json=agent_data
        )
        return response.json()
    
    def execute_agent(self, agent_id, input_data):
        response = requests.post(
            f'{self.base_url}/agents/{agent_id}/execute',
            headers=self.headers,
            json=input_data
        )
        return response.json()
```

#### PHP

```php
<?php
class ZanaiAPI {
    private $apiKey;
    private $baseUrl = 'https://api.zanai.com/v1';
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
    }
    
    private function request($method, $endpoint, $data = null) {
        $ch = curl_init();
        
        $url = $this->baseUrl . $endpoint;
        $headers = [
            'Authorization: Bearer ' . $this->apiKey,
            'Content-Type: application/json'
        ];
        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        
        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        } elseif ($method === 'PUT') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        } elseif ($method === 'DELETE') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        }
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return json_decode($response, true);
    }
    
    public function listAgents($page = 1, $limit = 20) {
        return $this->request('GET', '/agents', [
            'page' => $page,
            'limit' => $limit
        ]);
    }
    
    public function createAgent($agentData) {
        return $this->request('POST', '/agents', $agentData);
    }
}
?>
```

## 🐛 Troubleshooting

### Erros Comuns

#### 401 Unauthorized
- Verifique se o token está correto
- Confirme se o token não expirou
- Verifique as permissões do token

#### 403 Forbidden
- Verifique as permissões do seu usuário
- Confirme se você tem acesso ao recurso
- Verifique se sua conta está ativa

#### 422 Validation Error
- Verifique os campos obrigatórios
- Confirme os formatos dos dados
- Verifique os limites de tamanho

#### 429 Too Many Requests
- Aguarde o tempo de reset
- Implemente retry com backoff exponencial
- Verifique os limites do seu plano

### Debugging

#### Log de Requisições

```javascript
// Adicione interceptors para logging
axios.interceptors.request.use(request => {
  console.log('Request:', request);
  return request;
});

axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
}, error => {
  console.error('Error:', error);
  return Promise.reject(error);
});
```

#### Teste de Conectividade

```bash
# Teste básico de conectividade
curl -I https://api.zanai.com/health

# Teste de autenticação
curl -I https://api.zanai.com/v1/agents \
  -H "Authorization: Bearer seu-token-aqui"
```

## 📚 Recursos Adicionais

### SDKs Oficiais

- **Node.js**: `@zanai/api-sdk`
- **Python**: `zanai-python-sdk`
- **PHP**: `zanai-php-sdk`
- **Ruby**: `zanai-ruby-sdk`

### Comunidade

- **Fórum**: [https://community.zanai.com](https://community.zanai.com)
- **Discord**: [https://discord.gg/zanai](https://discord.gg/zanai)
- **Stack Overflow**: Tag `zanai-api`
- **GitHub**: [https://github.com/zanai/api-examples](https://github.com/zanai/api-examples)

### Suporte

- **Documentação**: [https://docs.zanai.com/api](https://docs.zanai.com/api)
- **Status**: [https://status.zanai.com](https://status.zanai.com)
- **Email**: api-support@zanai.com
- **Changelog**: [https://docs.zanai.com/changelog](https://docs.zanai.com/changelog)

---

Esta documentação cobre todos os aspectos da API Zanai. Para dúvidas específicas ou suporte adicional, não hesite em contactar nossa equipe ou acessar os recursos disponíveis.

**Integre, automatize e inove com a API Zanai!** 🚀