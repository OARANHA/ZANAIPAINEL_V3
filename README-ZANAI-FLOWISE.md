# ZanAI + Flowise Integration

Esta biblioteca permite criar agentes no ZanAI e enviá-los diretamente para o Flowise no formato compatível.

## 🚀 Funcionalidades

- ✅ Criação de agentes no formato simplificado do ZanAI
- ✅ Conversão automática para o formato complexo do Flowise
- ✅ Suporte para múltiplas ferramentas (Calculator, SerpAPI, Gmail, etc.)
- ✅ Integração com API do Flowise
- ✅ Exportação para arquivos JSON
- ✅ Interface React para criação visual de agentes
- ✅ Templates pré-configurados para diferentes tipos de agentes

## 📋 Pré-requisitos

- Node.js 16+
- Acesso a uma instância do Flowise (local ou remota)
- API keys para as ferramentas desejadas (opcional)

## 🛠️ Instalação

```bash
# Clonar o repositório
git clone <repositorio>
cd zanai-flowise-integration

# Instalar dependências
npm install
```

## 🔧 Configuração

Crie um arquivo `.env` com suas configurações:

```env
# Flowise Configuration
FLOWISE_URL=http://localhost:3000
FLOWISE_API_KEY=sua-api-key-do-flowise

# Tool API Keys
SERP_API_KEY=sua-serp-api-key
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GOOGLE_REFRESH_TOKEN=seu-google-refresh-token
WOLFRAM_ALPHA_APP_ID=seu-wolfram-alpha-app-id
```

## 📖 Como Usar

### 1. Uso Básico

```javascript
const { ZanAIFlowiseIntegration } = require('./zanai-flowise-integration');

// Criar instância
const integration = new ZanAIFlowiseIntegration(
  'http://localhost:3000',
  'sua-api-key'
);

// Criar um agente simples
const agent = await integration.createAndSendAgent({
  name: "Meu Agente",
  description: "Descrição do agente",
  systemMessage: "Você é um assistente útil",
  modelName: "gpt-4-turbo-preview",
  temperature: 0.7,
  tools: [
    {
      type: "calculator",
      name: "Calculadora",
      config: {}
    },
    {
      type: "serp",
      name: "Busca Web",
      config: {
        apiKey: "sua-serp-api-key"
      }
    }
  ],
  saveToFile: true
});

console.log('Agente criado:', agent);
```

### 2. Usando Templates Pré-configurados

```javascript
// Agente de Suporte Técnico
const techAgent = await integration.createTechSupportAgent();

// Agente de Vendas
const salesAgent = await integration.createSalesAgent();

// Agente de Pesquisa
const researchAgent = await integration.createResearchAgent();

// Agente de Produtividade
const productivityAgent = await integration.createProductivityAgent();
```

### 3. Listar e Testar Agentes

```javascript
// Listar todos os agentes
const agents = await integration.listAgents();
console.log('Agentes:', agents);

// Testar um agente
const response = await integration.testAgent(
  'agent-id',
  "Olá! Como você pode me ajudar?"
);
console.log('Resposta:', response.text);
```

### 4. Interface React

```jsx
import ZanAIFlowiseUI from './zanai-ui-integration-example';

function App() {
  return (
    <div className="App">
      <ZanAIFlowiseUI />
    </div>
  );
}
```

## 🏗️ Arquitetura

### Estrutura do ZanAI (Simplificada)

```typescript
interface ZanAIAgent {
  name: string;
  description: string;
  systemMessage: string;
  model: {
    name: string;
    temperature: number;
    maxTokens: number;
  };
  tools: Array<{
    type: string;
    name: string;
    config: Record<string, any>;
  }>;
  memory: {
    type: string;
    config: Record<string, any>;
  };
}
```

### Estrutura do Flowise (Complexa)

```typescript
interface FlowiseChatflow {
  nodes: [
    // Chat Model Node
    {
      id: "chatOpenAI_1",
      type: "ChatOpenAI",
      position: { x: 100, y: 100 },
      data: {
        inputParams: {
          modelName: "gpt-4-turbo-preview",
          temperature: 0.7,
          systemMessage: "Você é um assistente..."
        }
      }
    },
    // Memory Node
    {
      id: "bufferMemory_1",
      type: "BufferMemory",
      position: { x: 100, y: 200 },
      data: {
        inputParams: {
          memoryKey: "chat_history",
          returnMessages: true
        }
      }
    },
    // Tool Nodes
    {
      id: "calculator_1",
      type: "Calculator",
      position: { x: 100, y: 300 },
      data: { inputParams: {} }
    },
    // Tool Agent Main Node
    {
      id: "toolAgent_1",
      type: "ToolAgent",
      position: { x: 300, y: 200 },
      data: {
        inputParams: {
          agentName: "Assistente",
          agentDescription: "Descrição"
        }
      }
    }
  ],
  edges: [
    {
      id: "edge_1",
      source: "chatOpenAI_1",
      target: "toolAgent_1",
      sourceHandle: "model",
      targetHandle: "model"
    },
    {
      id: "edge_2",
      source: "bufferMemory_1",
      target: "toolAgent_1",
      sourceHandle: "memory",
      targetHandle: "memory"
    }
  ]
}
```

## 🛠️ Ferramentas Suportadas

### Ferramentas Básicas
- **Calculator**: Realiza cálculos matemáticos
- **CurrentDateTime**: Fornece data e hora atual
- **ReadFile**: Lê arquivos do sistema
- **WriteFile**: Escreve arquivos no sistema

### Ferramentas de Busca
- **SerpAPI**: Busca na web usando Google Search
- **ExaSearch**: Busca neural na web
- **WebBrowser**: Navegador web automatizado
- **WebScraperTool**: Extrai dados de páginas web
- **Arxiv**: Busca em artigos acadêmicos

### Ferramentas de Produtividade
- **Gmail**: Gerencia emails
- **GoogleCalendar**: Gerencia calendário
- **GoogleSheets**: Gerencia planilhas
- **Jira**: Gerencia tickets Jira
- **Slack**: Envia mensagens Slack
- **MicrosoftTeams**: Integração com Teams

### Ferramentas de Análise
- **WolframAlpha**: Motor de conhecimento computacional
- **JSONPathExtractor**: Extrai dados de JSON
- **RequestsGet/Post**: Requisições HTTP

## 📁 Estrutura do Projeto

```
zanai-flowise-integration/
├── zanai-to-flowise-converter.ts    # Conversor principal
├── zanai-agent-creator.ts           # Criador de agentes
├── zanai-flowise-integration.ts     # Integração completa
├── zanai-ui-integration-example.tsx # Interface React
├── example-usage.js                 # Exemplo de uso
├── README-ZANAI-FLOWISE.md         # Este arquivo
└── package.json                    # Dependências
```

## 🚀 Executando o Exemplo

```bash
# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Executar exemplo
npm run example

# Ou executar diretamente
node example-usage.js
```

## 🔧 Desenvolvimento

### Rodando em modo de desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar exemplo
npm run dev
```

### Testes

```bash
# Rodar testes
npm test

# Testes com coverage
npm run test:coverage
```

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com Flowise**
   - Verifique se o Flowise está rodando na URL correta
   - Confirme se a API key está correta
   - Verifique se o Flowise está acessível na rede

2. **Ferramentas não funcionando**
   - Verifique se as API keys estão configuradas corretamente
   - Confirme se as ferramentas estão instaladas no Flowise
   - Verifique as permissões das ferramentas

3. **Agentes não aparecendo no Flowise**
   - Verifique o console do Flowise por erros
   - Confirme se o chatflow foi criado corretamente
   - Verifique se o agente está deployado

### Debug

```javascript
// Habilitar debug
const integration = new ZanAIFlowiseIntegration(
  'http://localhost:3000',
  'sua-api-key',
  { debug: true }
);

// Verificar logs
integration.on('log', (message) => {
  console.log('[DEBUG]', message);
});
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- [Flowise](https://github.com/FlowiseAI/Flowise) pela plataforma incrível de orquestração de agentes
- [OpenAI](https://openai.com/) pelas APIs de linguagem
- [ZanAI](https://zanai.com/) pela plataforma de desenvolvimento

## 📞 Suporte

Se você tiver algum problema ou sugestão:

1. Abra uma [issue](https://github.com/seu-repositorio/issues)
2. Envie um email para suporte@zanai.com
3. Participe do nosso [Discord](https://discord.gg/zanai)

---

**Nota**: Esta é uma integração experimental. Recomendamos testar em ambiente de desenvolvimento antes de usar em produção.