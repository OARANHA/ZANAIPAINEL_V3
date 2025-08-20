# MCP Marketplace - Documentação

## Visão Geral

O MCP Marketplace é uma funcionalidade integrada ao Zanai Panel que permite descobrir, instalar e gerenciar servidores MCP (Model Context Protocol) de forma centralizada. O sistema oferece dois tipos de marketplace:

1. **Marketplace Interno** - Templates pré-configurados locais
2. **Marketplace Externo** - Catálogo externo com servidores oficiais e da comunidade

## Funcionalidades

### 🏪 Marketplace Interno
- **Templates Locais**: 3 servidores MCP pré-configurados
- **Instalação Rápida**: Aplicação de templates com um clique
- **Configuração Simplificada**: Parâmetros pré-definidos

### 🌍 Marketplace Externo
- **Catálogo Rico**: 10+ servidores MCP oficiais e da comunidade
- **Busca Inteligente**: Filtragem por nome, descrição e tags
- **Categorias Diversificadas**:
  - Oficiais (GitHub, PostgreSQL, Brave Search, etc.)
  - Comunidade (SQLite, Weather, Notion, Discord, etc.)
  - Banco de Dados, APIs, Arquivos, Comunicação
- **Informações Detalhadas**:
  - Rating e avaliações
  - Número de downloads e instalações
  - Versão e data de atualização
  - Autor e repositório
  - Tags e categorias

## Arquitetura

### Componentes Principais

#### 1. API Routes
- `/admin/api/mcp/marketplace` - Gerenciamento do catálogo externo
- `/admin/api/mcp/servers` - Gerenciamento de servidores locais
- `/admin/api/mcp/tools` - Gerenciamento de ferramentas MCP

#### 2. Componentes UI
- `MCPManager.tsx` - Componente principal de gerenciamento
- Interface de busca e filtragem
- Cards de servidores com informações detalhadas
- Modal de instalação e configuração

#### 3. Middleware
- Autenticação para APIs de admin
- Controle de acesso baseado em roles
- Validação de sessões

### Fluxo de Instalação

1. **Descoberta**: Usuário navega pelo marketplace
2. **Seleção**: Escolhe um servidor do catálogo
3. **Instalação**: Sistema configura automaticamente
4. **Validação**: Verifica requisitos e dependências
5. **Ativação**: Servidor fica disponível para uso

## Catálogo de Servidores

### Servidores Oficiais

#### GitHub MCP Server
- **ID**: `github-mcp`
- **Descrição**: Integração com GitHub API
- **Comando**: `npx @modelcontextprotocol/server-github`
- **Variáveis de Ambiente**: `GITHUB_PERSONAL_ACCESS_TOKEN`
- **Tags**: `github`, `api`, `version-control`, `official`
- **Rating**: 4.8/5

#### PostgreSQL MCP Server
- **ID**: `postgres-mcp`
- **Descrição**: Operações com banco de dados PostgreSQL
- **Comando**: `npx @modelcontextprotocol/server-postgres`
- **Variáveis de Ambiente**: `DATABASE_URL`
- **Tags**: `postgres`, `database`, `sql`, `official`
- **Rating**: 4.7/5

#### Brave Search MCP Server
- **ID**: `brave-search-mcp`
- **Descrição**: Busca web com Brave Search API
- **Comando**: `npx @modelcontextprotocol/server-brave-search`
- **Variáveis de Ambiente**: `BRAVE_SEARCH_API_KEY`
- **Tags**: `search`, `web`, `brave`, `api`, `official`
- **Rating**: 4.6/5

#### File System MCP Server
- **ID**: `filesystem-mcp`
- **Descrição**: Operações com sistema de arquivos
- **Comando**: `npx @modelcontextprotocol/server-filesystem`
- **Variáveis de Ambiente**: `ROOT_PATH`
- **Tags**: `filesystem`, `files`, `io`, `official`
- **Rating**: 4.5/5

#### Slack MCP Server
- **ID**: `slack-mcp`
- **Descrição**: Integração com Slack
- **Comando**: `npx @modelcontextprotocol/server-slack`
- **Variáveis de Ambiente**: `SLACK_BOT_TOKEN`
- **Tags**: `slack`, `chat`, `communication`, `official`
- **Rating**: 4.4/5

#### Google Sheets MCP Server
- **ID**: `google-sheets-mcp`
- **Descrição**: Operações com Google Sheets
- **Comando**: `npx @modelcontextprotocol/server-googlesheets`
- **Variáveis de Ambiente**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Tags**: `google-sheets`, `spreadsheet`, `google`, `official`
- **Rating**: 4.3/5

### Servidores da Comunidade

#### SQLite MCP Server
- **ID**: `sqlite-mcp`
- **Descrição**: Operações com banco de dados SQLite
- **Comando**: `npx @mcp-community/server-sqlite`
- **Variáveis de Ambiente**: `DATABASE_PATH`
- **Tags**: `sqlite`, `database`, `sql`, `community`
- **Rating**: 4.2/5

#### Weather MCP Server
- **ID**: `weather-mcp`
- **Descrição**: Informações de clima
- **Comando**: `npx @mcp-community/server-weather`
- **Variáveis de Ambiente**: `WEATHER_API_KEY`
- **Tags**: `weather`, `api`, `forecast`, `community`
- **Rating**: 4.1/5

#### Notion MCP Server
- **ID**: `notion-mcp`
- **Descrição**: Integração com Notion
- **Comando**: `npx @mcp-community/server-notion`
- **Variáveis de Ambiente**: `NOTION_TOKEN`
- **Tags**: `notion`, `productivity`, `wiki`, `community`
- **Rating**: 4.0/5

#### Discord MCP Server
- **ID**: `discord-mcp`
- **Descrição**: Bots do Discord
- **Comando**: `npx @mcp-community/server-discord`
- **Variáveis de Ambiente**: `DISCORD_BOT_TOKEN`
- **Tags**: `discord`, `chat`, `bot`, `community`
- **Rating**: 3.9/5

## Configuração

### Pré-requisitos
- Node.js 18+ instalado
- Acesso à internet para download de pacotes
- Tokens de API para serviços específicos
- Permissões de administrador no sistema

### Variáveis de Ambiente
Cada servidor requer variáveis de ambiente específicas. Exemplos:

```bash
# GitHub MCP
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token_here"

# PostgreSQL MCP
export DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Brave Search MCP
export BRAVE_SEARCH_API_KEY="your_brave_api_key_here"
```

## Uso

### Acesso ao Marketplace
1. Faça login como administrador
2. Navegue para `/admin/studio`
3. Selecione a aba "MCP"
4. Escolha entre "MCP Marketplace" (interno) ou "MCP Marketplace Externo"

### Instalação de Servidores
1. Navegue pelo catálogo de servidores
2. Use a busca ou filtros para encontrar o servidor desejado
3. Clique no botão "+" para instalar
4. Configure as variáveis de ambiente necessárias
5. Aguarde a confirmação de instalação

### Gerenciamento de Servidores
- **Ativação/Desativação**: Controle de status dos servidores
- **Monitoramento**: Visualização de status e conexões
- **Configuração**: Ajuste de parâmetros e variáveis
- **Remoção**: Desinstalação de servidores não utilizados

## API Reference

### GET /admin/api/mcp/marketplace
Retorna o catálogo de servidores do marketplace externo.

#### Parâmetros
- `q` (opcional): Termo de busca
- `category` (opcional): Categoria de filtro

#### Resposta
```json
{
  "servers": [
    {
      "id": "github-mcp",
      "name": "GitHub MCP Server",
      "description": "Official MCP server for GitHub API integration",
      "author": "Model Context Protocol",
      "version": "1.0.0",
      "downloads": 15420,
      "tags": ["github", "api", "version-control", "official"],
      "rating": 4.8,
      "config": {
        "type": "stdio",
        "command": "npx",
        "args": ["@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token_here"
        }
      }
    }
  ],
  "total": 10,
  "query": "",
  "category": "all"
}
```

### POST /admin/api/mcp/marketplace
Instala um servidor do marketplace.

#### Corpo da Requisição
```json
{
  "serverId": "github-mcp",
  "config": {
    "type": "stdio",
    "command": "npx",
    "args": ["@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token_here"
    }
  }
}
```

## Troubleshooting

### Problemas Comuns

#### Erro: "Erro ao carregar catálogo do marketplace"
- **Causa**: Problemas de autenticação ou API offline
- **Solução**: Verifique login e permissões de administrador

#### Erro: "Falha na instalação do servidor"
- **Causa**: Variáveis de ambiente incorretas ou pacote não encontrado
- **Solução**: Verifique as configurações e conexão com a internet

#### Erro: "Servidor não responde"
- **Causa**: Servidor em estado de erro ou configuração inválida
- **Solução**: Verifique logs e status do servidor

### Logs
Os logs do sistema estão disponíveis em:
- Console do navegador para erros de frontend
- Logs do servidor em `/home/z/my-project/dev.log`
- Logs de banco de dados através do Prisma

## Desenvolvimento

### Estrutura de Arquivos
```
src/
├── app/
│   └── admin/
│       └── api/
│           └── mcp/
│               ├── marketplace/
│               │   └── route.ts
│               ├── servers/
│               │   └── route.ts
│               └── tools/
│                   └── route.ts
├── components/
│   └── admin/
│       └── MCPManager.tsx
└── middleware.ts
```

### Adicionando Novos Servidores
Para adicionar um novo servidor ao catálogo:

1. **Adicionar ao catálogo estático** em `/src/app/admin/api/mcp/marketplace/route.ts`
2. **Definir configuração** com comando, argumentos e variáveis de ambiente
3. **Adicionar metadados** como autor, versão, tags e rating
4. **Testar instalação** para garantir funcionamento

### Extensões Futuras

#### Planejado:
- [ ] Sistema de reviews e avaliações
- [ ] Integração com repositórios Git automáticos
- [ ] Sistema de atualização automática
- [ ] Estatísticas de uso e desempenho
- [ ] Marketplace de templates e configurações
- [ ] Integração com Docker e Kubernetes
- [ ] Sistema de plugins e extensões

## Contribuição

Para contribuir com o desenvolvimento do MCP Marketplace:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Faça commit das suas mudanças
4. Abra um pull request
5. Aguarde revisão e merge

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo LICENSE para detalhes.

## Suporte

Para suporte e dúvidas:
- Issues no GitHub
- Documentação oficial
- Comunidade Discord
- Email de suporte