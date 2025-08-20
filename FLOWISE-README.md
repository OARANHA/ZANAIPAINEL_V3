# Exemplo Prático: Agentes de IA com Flowise Integration

Este projeto demonstra uma integração completa entre uma aplicação Next.js e o FlowiseAI, permitindo criar e gerenciar agentes de IA inteligentes.

## 🚀 Visão Geral

A solução oferece:

- **Múltiplos Tipos de Agentes**: Vendas, Suporte e Marketing
- **Integração via API REST**: Comunicação completa com o Flowise
- **Interface Interativa**: Chat em tempo real com status de conexão
- **Contexto Persistente**: Mantém o histórico da conversa
- **Customização Avançada**: Configuração flexível de parâmetros

## 🏗️ Arquitetura da Solução

### Backend (API Routes)
```
src/app/api/flowise-chat/route.ts
├── POST /api/flowise-chat     - Envio de mensagens
├── GET /api/flowise-chat      - Listagem de chatflows
└── Integração com Flowise API
```

### Frontend (Componentes)
```
src/components/flowise-chat.tsx
├── Interface de chat completa
├── Status de conexão em tempo real
├── Histórico de mensagens
└── Tratamento de erros robusto
```

### Página de Demonstração
```
src/app/flowise-demo/page.tsx
├── Demo interativa com múltiplos agentes
├── Exemplos de uso para cada tipo
├── Especificações técnicas
└── Código de exemplo
```

## 🔧 Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Configure as variáveis:

```env
# URL do servidor Flowise
FLOWISE_API_URL=http://localhost:3001

# Chave de API do Flowise (opcional)
FLOWISE_API_KEY=sua_chave_de_api_aqui

# IDs dos chatflows específicos
FLOWISE_VENDAS_FLOW_ID=seu_flow_id_vendas_aqui
FLOWISE_SUPORTE_FLOW_ID=seu_flow_id_suporte_aqui
FLOWISE_MARKETING_FLOW_ID=seu_flow_id_marketing_aqui

# URL pública para acesso ao Flowise
NEXT_PUBLIC_FLOWISE_URL=http://localhost:3001
```

### 2. Configuração do Flowise

#### Criando os Chatflows no Flowise

1. **Acesse o Flowise**: Abra `http://localhost:3001` no navegador
2. **Crie um Chatflow para Vendas**:
   - Nome: "Agente de Vendas IA"
   - Tipo: "AgentFlow" (recomendado)
   - Configure os nós necessários (LLM, Tools, etc.)
3. **Crie um Chatflow para Suporte**:
   - Nome: "Agente de Suporte IA"
   - Tipo: "AgentFlow"
   - Configure para resolução de problemas
4. **Crie um Chatflow para Marketing**:
   - Nome: "Agente de Marketing IA"
   - Tipo: "AgentFlow"
   - Configure para marketing digital

#### Obtendo os IDs dos Chatflows

Após criar cada chatflow:
1. Vá para a lista de chatflows
2. Clique no chatflow desejado
3. Copie o ID da URL: `http://localhost:3001/chatflow/{ID_DO_CHATFLOW}`
4. Adicione o ID ao `.env.local`

## 📚 Exemplos de Uso

### 1. Usando o Componente FlowiseChat

```tsx
import { FlowiseChat } from '@/components/flowise-chat'

export default function MyPage() {
  return (
    <FlowiseChat
      agentType="vendas"
      title="Agente de Vendas IA"
      description="Assistente especializado em vendas"
      placeholder="Digite sua pergunta sobre vendas..."
    />
  )
}
```

### 2. Integração com API Direta

```tsx
async function sendMessage(message: string, agentType: string) {
  const response = await fetch('/api/flowise-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: message }
      ],
      agentType,
    }),
  })

  const data = await response.json()
  return data.response
}
```

### 3. Listando Chatflows Disponíveis

```tsx
async function getAvailableChatflows() {
  const response = await fetch('/api/flowise-chat')
  const data = await response.json()
  return data.chatflows
}
```

## 🎯 Casos de Uso por Tipo de Agente

### Agente de Vendas
- **Qualificação de Leads**: "Como qualificar leads de forma eficiente?"
- **Estratégias de Vendas**: "Quais estratégias de vendas para B2B?"
- **Follow-up**: "Como automatizar follow-up de clientes?"
- **Negociação**: "Me mostre um exemplo de negociação"

### Agente de Suporte
- **Resolução de Problemas**: "Como resolver problemas técnicos?"
- **Atendimento**: "Me mostre um atendimento de qualidade"
- **Personalização**: "Como personalizar o suporte?"
- **Métricas**: "Quais métricas acompanhar no suporte?"

### Agente de Marketing
- **Campanhas**: "Como criar campanhas eficazes?"
- **Conteúdo**: "Quais estratégias de conteúdo usar?"
- **Análise**: "Como analisar comportamento do consumidor?"
- **Leads**: "Me mostre geração de leads"

## 🔍 API Reference

### POST /api/flowise-chat

Envia uma mensagem para o agente e retorna a resposta.

**Request Body:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  flowiseId?: string
  agentType?: 'vendas' | 'suporte' | 'marketing'
}
```

**Response:**
```typescript
{
  response: string
  agentType?: string
  flowiseId: string
  timestamp: string
}
```

### GET /api/flowise-chat

Lista os chatflows disponíveis e tipos de agentes.

**Response:**
```typescript
{
  chatflows: Array<{
    id: string
    name: string
    type: 'chatflow' | 'agentflow'
    category?: string
  }>
  agentTypes: Array<{
    id: string
    name: string
    flowId: string
  }>
}
```

## 🛠️ Personalização Avançada

### 1. Customizando o Comportamento do Agente

Você pode modificar o sistema message e parâmetros no backend:

```typescript
// Em src/app/api/flowise-chat/route.ts
overrideConfig: {
  systemMessage: `Você é um agente especializado em ${agentType}. 
  Seu objetivo é...`,
  temperature: 0.7,        // Criatividade (0-1)
  maxTokens: 1000,        // Tamanho máximo da resposta
}
```

### 2. Adicionando Novos Tipos de Agentes

1. Adicione o novo tipo ao mapeamento:
```typescript
const AGENT_FLOWS: Record<string, string> = {
  vendas: process.env.FLOWISE_VENDAS_FLOW_ID || '',
  suporte: process.env.FLOWISE_SUPORTE_FLOW_ID || '',
  marketing: process.env.FLOWISE_MARKETING_FLOW_ID || '',
  rh: process.env.FLOWISE_RH_FLOW_ID || '', // Novo tipo
}
```

2. Adicione a variável de ambiente:
```env
FLOWISE_RH_FLOW_ID=seu_flow_id_rh_aqui
```

3. Atualize o componente FlowiseChat:
```typescript
type AgentType = 'vendas' | 'suporte' | 'marketing' | 'rh'
```

### 3. Estilização Personalizada

O componente FlowiseChat aceita props de estilo:

```tsx
<FlowiseChat
  className="custom-styles"
  title="Meu Agente Personalizado"
  description="Descrição personalizada"
  placeholder="Seu placeholder aqui"
/>
```

## 🚀 Deploy

### 1. Configuração de Produção

1. **Variáveis de Ambiente de Produção**:
   - Configure todas as variáveis no ambiente de produção
   - Use URLs HTTPS para segurança

2. **Segurança**:
   - Use chaves de API fortes
   - Configure CORS se necessário
   - Implemente rate limiting

### 2. Docker Compose (Opcional)

```yaml
version: '3.8'
services:
  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      - FLOWISE_API_URL=http://flowise:3001
      - FLOWISE_API_KEY=${FLOWISE_API_KEY}
    depends_on:
      - flowise
  
  flowise:
    image: flowiseai/flowise:latest
    ports:
      - "3001:3001"
    environment:
      - FLOWISE_SECRETKEY=${FLOWISE_SECRETKEY}
    volumes:
      - flowise_data:/root/.flowise
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Conexão Recusada**:
   - Verifique se o Flowise está rodando na porta correta
   - Confira a URL no `.env.local`

2. **Respostas Vazias**:
   - Verifique os IDs dos chatflows
   - Confira se os flows estão publicados

3. **Erro de Autenticação**:
   - Verifique a chave de API
   - Confira as permissões do usuário

### Logs e Debug

Habilite logs detalhados:

```bash
# Ver logs do Next.js
npm run dev

# Ver logs do Flowise
docker logs flowise
```

## 📈 Melhorias Futuras

- [ ] Suporte a streaming de respostas
- [ ] Integração com múltiplos provedores de LLM
- [ ] Sistema de avaliação de respostas
- [ ] Analytics e métricas de uso
- [ ] Interface administrativa
- [ ] Suporte a múltiplos idiomas
- [ ] Integração com bancos de dados vetoriais

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das suas mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Se você tiver problemas ou dúvidas:

1. Verifique a documentação
2. Abra uma issue no GitHub
3. Entre em contato com o suporte técnico

---

**Este exemplo demonstra como integrar FlowiseAI com aplicações Next.js para criar agentes de IA inteligentes e personalizáveis.**