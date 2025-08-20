# Exemplos Práticos de Uso MCP (Model Context Protocol)

Este documento contém exemplos práticos de como integrar e usar MCP no sistema Zanai.

## Visão Geral

O MCP (Model Context Protocol) permite que agentes de IA acessem ferramentas externas através de servidores padronizados. No nosso sistema, você pode:

1. **Configurar servidores MCP** (GitHub, PostgreSQL, Brave Search, etc.)
2. **Conectar servidores a agentes** para expandir suas capacidades
3. **Executar ferramentas MCP** diretamente ou através de agentes
4. **Monitorar execuções** e gerenciar conexões

## Exemplo 1: Integração com GitHub

### Cenário
Um agente de desenvolvimento que pode criar issues, gerenciar pull requests e analisar repositórios.

### Configuração do Servidor

```json
{
  "name": "GitHub MCP",
  "description": "Servidor MCP para integração com GitHub API",
  "type": "stdio",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
  }
}
```

### Ferramentas Disponíveis

- `create_issue` - Criar uma issue em um repositório
- `create_pull_request` - Criar um pull request
- `search_repositories` - Buscar repositórios
- `get_repository` - Obter informações de um repositório
- `list_issues` - Listar issues de um repositório

### Exemplo de Uso

#### Criar uma Issue

```javascript
// Argumentos para a ferramenta create_issue
const arguments = {
  owner: "facebook",
  repo: "react",
  title: "Bug: Component rendering issue",
  body: "Found a bug in the component rendering system. Steps to reproduce:\n1. Create component\n2. Add props\n3. Render component\n\nExpected: Component renders correctly\nActual: Component fails to render",
  labels: ["bug", "component"]
};

// Executar através da API
const response = await fetch('/admin/api/mcp/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serverId: 'github-server-id',
    toolName: 'create_issue',
    arguments
  })
});

const result = await response.json();
console.log('Issue criada:', result.result);
```

#### Buscar Repositórios

```javascript
const arguments = {
  query: "react components library",
  per_page: 10,
  sort: "stars",
  order: "desc"
};

const response = await fetch('/admin/api/mcp/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serverId: 'github-server-id',
    toolName: 'search_repositories',
    arguments
  })
});

const result = await response.json();
console.log('Repositórios encontrados:', result.result.items);
```

## Exemplo 2: Integração com PostgreSQL

### Cenário
Um agente de análise de dados que pode executar consultas SQL e gerar relatórios.

### Configuração do Servidor

```json
{
  "name": "PostgreSQL MCP",
  "description": "Servidor MCP para consultas PostgreSQL",
  "type": "stdio",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-postgres"],
  "env": {
    "DATABASE_URL": "postgresql://user:password@localhost:5432/mydatabase"
  }
}
```

### Ferramentas Disponíveis

- `execute_query` - Executar consulta SQL
- `get_tables` - Listar tabelas do banco
- `get_table_schema` - Obter schema de uma tabela
- `analyze_data` - Analisar dados de uma tabela

### Exemplo de Uso

#### Executar Consulta SQL

```javascript
const arguments = {
  query: "SELECT COUNT(*) as total_users, created_at::date as date FROM users GROUP BY created_at::date ORDER BY date DESC LIMIT 30",
  params: []
};

const response = await fetch('/admin/api/mcp/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serverId: 'postgres-server-id',
    toolName: 'execute_query',
    arguments
  })
});

const result = await response.json();
console.log('Resultado da consulta:', result.result);
```

#### Analisar Dados

```javascript
const arguments = {
  table: "users",
  analysis_type: "summary"
};

const response = await fetch('/admin/api/mcp/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serverId: 'postgres-server-id',
    toolName: 'analyze_data',
    arguments
  })
});

const result = await response.json();
console.log('Análise de dados:', result.result);
```

## Exemplo 3: Integração com Brave Search

### Cenário
Um agente de pesquisa que pode buscar informações na web e compilar relatórios.

### Configuração do Servidor

```json
{
  "name": "Brave Search MCP",
  "description": "Servidor MCP para busca web com Brave Search",
  "type": "stdio",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-brave-search"],
  "env": {
    "BRAVE_SEARCH_API_KEY": "your_api_key_here"
  }
}
```

### Ferramentas Disponíveis

- `web_search` - Realizar busca na web
- `extract_content` - Extrair conteúdo de páginas
- `summarize` - Resumir conteúdo

### Exemplo de Uso

#### Buscar na Web

```javascript
const arguments = {
  query: "artificial intelligence trends 2024",
  count: 10,
  country: "BR",
  language: "pt"
};

const response = await fetch('/admin/api/mcp/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serverId: 'brave-search-server-id',
    toolName: 'web_search',
    arguments
  })
});

const result = await response.json();
console.log('Resultados da busca:', result.result);
```

#### Resumir Conteúdo

```javascript
const arguments = {
  url: "https://example.com/article-about-ai",
  max_length: 500,
  language: "pt"
};

const response = await fetch('/admin/api/mcp/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serverId: 'brave-search-server-id',
    toolName: 'summarize',
    arguments
  })
});

const result = await response.json();
console.log('Resumo do conteúdo:', result.result);
```

## Exemplo 4: Integração com Sistema de Arquivos

### Cenário
Um agente que pode ler, escrever e gerenciar arquivos no sistema.

### Configuração do Servidor

```json
{
  "name": "File System MCP",
  "description": "Servidor MCP para operações de sistema de arquivos",
  "type": "stdio",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-filesystem"],
  "env": {
    "ALLOWED_PATHS": "/home/user/projects"
  }
}
```

### Ferramentas Disponíveis

- `read_file` - Ler conteúdo de um arquivo
- `write_file` - Escrever conteúdo em um arquivo
- `list_directory` - Listar conteúdo de um diretório
- `create_directory` - Criar diretório
- `delete_file` - Excluir arquivo

### Exemplo de Uso

#### Ler Arquivo

```javascript
const arguments = {
  path: "/home/user/projects/my-app/src/components/Button.js"
};

const response = await fetch('/admin/api/mcp/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serverId: 'filesystem-server-id',
    toolName: 'read_file',
    arguments
  })
});

const result = await response.json();
console.log('Conteúdo do arquivo:', result.result);
```

#### Escrever Arquivo

```javascript
const arguments = {
  path: "/home/user/projects/my-app/src/components/NewComponent.js",
  content: `import React from 'react';

const NewComponent = ({ title, children }) => {
  return (
    <div className="new-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default NewComponent;`
};

const response = await fetch('/admin/api/mcp/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serverId: 'filesystem-server-id',
    toolName: 'write_file',
    arguments
  })
});

const result = await response.json();
console.log('Arquivo escrito:', result.result);
```

## Exemplo 5: Integração com Slack

### Cenário
Um agente que pode enviar mensagens para canais do Slack e notificar equipes.

### Configuração do Servidor

```json
{
  "name": "Slack MCP",
  "description": "Servidor MCP para integração com Slack",
  "type": "stdio",
  "command": "npx",
  "args": ["@modelcontextprotocol/server-slack"],
  "env": {
    "SLACK_BOT_TOKEN": "xoxb-your-bot-token"
  }
}
```

### Ferramentas Disponíveis

- `send_message` - Enviar mensagem para um canal
- `list_channels` - Listar canais disponíveis
- `get_channel_info` - Obter informações de um canal
- `upload_file` - Upload de arquivo para canal

### Exemplo de Uso

#### Enviar Mensagem

```javascript
const arguments = {
  channel: "#general",
  text: "🚀 Novo deploy realizado com sucesso! A aplicação está atualizada na versão 2.1.0.",
  attachments: [
    {
      "color": "#36a64f",
      "title": "Deploy Information",
      "fields": [
        {
          "title": "Version",
          "value": "2.1.0",
          "short": true
        },
        {
          "title": "Environment",
          "value": "Production",
          "short": true
        }
      ]
    }
  ]
};

const response = await fetch('/admin/api/mcp/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serverId: 'slack-server-id',
    toolName: 'send_message',
    arguments
  })
});

const result = await response.json();
console.log('Mensagem enviada:', result.result);
```

## Integração com Agentes

### Conectando MCP a um Agente

1. **Crie uma conexão** entre o servidor MCP e o agente:
```javascript
const connection = {
  serverId: 'github-server-id',
  toolId: 'create_issue', // Opcional: pode ser todas as ferramentas
  agentId: 'dev-assistant-id',
  config: {
    priority: 'high',
    timeout: 30000,
    auto_approve: true
  }
};
```

2. **O agente agora pode usar as ferramentas MCP** em suas respostas:
```javascript
// Exemplo de prompt para o agente
const prompt = `
  Você é um assistente de desenvolvimento com acesso ao GitHub.
  Por favor, crie uma issue no repositório facebook/react sobre um bug de performance.
  Use a ferramenta create_issue do servidor GitHub MCP.
  
  Detalhes do bug:
  - Componente: Button
  - Problema: Renderização lenta com muitos elementos
  - Severidade: Alta
  - Passos para reproduzir: Incluídos no corpo da issue
`;
```

### Exemplo de Fluxo Completo

```javascript
// 1. Configurar servidor MCP
const mcpServer = {
  name: "GitHub Integration",
  type: "stdio",
  command: "npx",
  args: ["@modelcontextprotocol/server-github"],
  env: {
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN
  }
};

// 2. Criar conexão com agente
const agentConnection = {
  serverId: mcpServer.id,
  agentId: "dev-assistant",
  config: {
    allowed_tools: ["create_issue", "search_repositories"],
    rate_limit: 10
  }
};

// 3. Agente usa MCP para resolver uma tarefa
const task = {
  description: "Analisar repositórios React populares e reportar issues comuns",
  steps: [
    "Buscar repositórios React populares",
    "Analisar issues abertas",
    "Identificar padrões comuns",
    "Criar relatório consolidado"
  ]
};

// 4. Execução através do agente
const result = await agent.executeTask(task, {
  useMCP: true,
  mcpConnections: [agentConnection]
});
```

## Boas Práticas

### 1. Segurança
- **Nunca exponha credenciais** no código-fonte
- **Use variáveis de ambiente** para tokens e chaves de API
- **Limite permissões** dos tokens ao mínimo necessário
- **Valide entradas** antes de passar para ferramentas MCP

### 2. Performance
- **Implemente cache** para operações repetitivas
- **Use rate limiting** para evitar excesso de chamadas
- **Monitore tempos de resposta** e timeouts
- **Otimize consultas** e buscas

### 3. Monitoramento
- **Registre todas as execuções** para auditoria
- **Monitore erros** e falhas de conexão
- **Implemente alertas** para problemas críticos
- **Analise padrões de uso** para otimização

### 4. Manutenção
- **Mantenha servidores MCP** atualizados
- **Teste conexões** regularmente
- **Documente configurações** e casos de uso
- **Planeje contingências** para falhas

## 🤖 Potencializado por Z.ai Code Assistant

O sistema MCP é potencializado pelo **Z.ai Code Assistant**, que fornece capacidades avançadas para integração e gerenciamento de servidores MCP.

### Recursos com Z.ai Code Assistant

#### Otimização de Configurações MCP
- **Auto-Configuração**: O Z.ai Code Assistant ajuda a configurar automaticamente servidores MCP com base nas necessidades do projeto
- **Validação de Configurações**: Verificação automática de configurações MCP para garantir compatibilidade
- **Sugestões de Otimização**: Recomendações para melhorar performance e segurança das integrações MCP

#### Desenvolvimento Inteligente
- **Geração de Código**: Criação automática de código de integração MCP para diferentes linguagens e frameworks
- **Debugging Avançado**: Detecção e resolução de problemas em integrações MCP
- **Documentação Automática**: Geração automática de documentação para servidores e ferramentas MCP

#### Monitoramento e Análise
- **Performance Monitoring**: Monitoramento inteligente do desempenho das execuções MCP
- **Análise de Padrões**: Identificação de padrões de uso para otimização
- **Alertas Inteligentes**: Sistema de alertas baseado em IA para problemas críticos

### Exemplo de Integração com Z.ai Code Assistant

#### Auto-Configuração de Servidor MCP
```javascript
// Z.ai Code Assistant pode gerar automaticamente esta configuração
const mcpConfig = {
  name: "GitHub MCP",
  description: "Servidor MCP para integração com GitHub API",
  type: "stdio",
  command: "npx",
  args: ["@modelcontextprotocol/server-github"],
  env: {
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN
  },
  // Configurações otimizadas sugeridas pelo Z.ai Code Assistant
  optimization: {
    timeout: 30000,
    retry_attempts: 3,
    cache_enabled: true,
    rate_limit: 100
  }
};
```

#### Código de Integração Gerado
```javascript
// Código gerado pelo Z.ai Code Assistant para integração MCP
class MCPIntegrationManager {
  constructor(zaiConfig) {
    this.zai = zaiConfig;
    this.connections = new Map();
  }

  async createConnection(serverConfig) {
    // Validação automática de configuração
    const validation = await this.validateConfig(serverConfig);
    if (!validation.valid) {
      throw new Error(`Configuração inválida: ${validation.errors.join(', ')}`);
    }

    // Criação da conexão com otimizações sugeridas
    const connection = await this.initializeConnection(serverConfig);
    this.connections.set(serverConfig.name, connection);
    
    return connection;
  }

  async executeTool(serverName, toolName, arguments) {
    const connection = this.connections.get(serverName);
    if (!connection) {
      throw new Error(`Servidor ${serverName} não encontrado`);
    }

    // Execução com monitoramento inteligente
    const result = await this.executeWithMonitoring(
      connection, 
      toolName, 
      arguments
    );

    // Análise de resultados pelo Z.ai Code Assistant
    const analysis = await this.analyzeResult(result);
    
    return {
      result: result,
      analysis: analysis,
      optimizations: analysis.suggestions
    };
  }
}
```

### Configuração Z.ai Code para MCP
```json
{
  "apiKey": "d56c89e3fdd24034bd228576e2f40fd5.zfVpIPTnS55T9qRE",
  "baseUrl": "https://api.z.ai/api/paas/v4/",
  "model": "glm-4.5-flash",
  "maxTokens": 2000,
  "temperature": 0.6,
  "mcp_integration": {
    "auto_optimize": true,
    "performance_monitoring": true,
    "error_recovery": true,
    "suggestions_enabled": true
  }
}
```

## Conclusão

A integração MCP no sistema Zanai, potencializada pelo **Z.ai Code Assistant**, oferece infinitas possibilidades para expandir as capacidades dos agentes de IA. Com os exemplos apresentados, você pode:

- Integrar com serviços externos (GitHub, bancos de dados, APIs)
- Automatizar tarefas complexas e repetitivas
- Criar fluxos de trabalho inteligentes
- Monitorar e gerenciar execuções em tempo real
- Otimizar configurações automaticamente com IA
- Gerar código de integração de forma inteligente

Experimente diferentes combinações de servidores e agentes para criar soluções personalizadas para suas necessidades específicas, com o poder adicional do Z.ai Code Assistant.

---

**Desenvolvido com Z.ai Code Assistant** 🤖