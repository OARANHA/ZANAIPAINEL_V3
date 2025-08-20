# 🚀 Zanai AI Agents Platform

Uma plataforma completa de agentes de IA para transformar negócios com automação inteligente, atendimento personalizado e análise de dados avançada.

## ✨ Visão Geral

O Zanai é uma plataforma robusta que permite empresas de todos os tamanhos criar, gerenciar e implantar agentes de IA especializados. Com suporte a múltiplos canais, integrações avançadas e uma arquitetura escalável, o Zanai revoluciona a forma como as empresas interagem com clientes e automatizam processos.

### 🎯 Principais Recursos

- **🤖 Agentes de IA Especializados**: Crie agentes para atendimento, vendas, análise e automação
- **📊 Analytics em Tempo Real**: Dashboard completo com métricas e insights
- **🔗 Múltiplas Integrações**: WhatsApp, Email, Instagram, CRM, ERP e mais
- **👥 Gestão de Usuários**: Sistema multi-nível com admin, empresas e clientes
- **🏢 Workspace Organizado**: Estrutura por projetos e equipes
- **⚡ MCP Integration**: Suporte a Model Context Protocol para extensibilidade
- **📱 Interface Responsiva**: Design moderno e adaptável para todos os dispositivos
- **🌙 Dark Mode**: Suporte completo para tema claro e escuro

## 🏗️ Arquitetura do Sistema

### Tecnologias Utilizadas

#### Core Framework
- **⚡ Next.js 15** - Framework React com App Router
- **📘 TypeScript 5** - Tipagem segura e desenvolvimento robusto
- **🎨 Tailwind CSS 4** - Estilização utilitária e design responsivo

#### Banco de Dados & Backend
- **🗄️ Prisma ORM** - Mapeamento objeto-relacional com SQLite
- **🔐 NextAuth.js** - Sistema de autenticação completo
- **🌐 Socket.io** - Comunicação em tempo real

#### UI & Componentes
- **🧩 shadcn/ui** - Componentes acessíveis baseados em Radix UI
- **🎯 Lucide React** - Ícones consistentes e bonitos
- **🎭 Framer Motion** - Animações e transições suaves
- **📈 Recharts** - Visualização de dados e gráficos

#### Estado & Dados
- **🐻 Zustand** - Gerenciamento de estado leve
- **🔄 TanStack Query** - Sincronização de dados e cache
- **✅ Zod** - Validação de schemas TypeScript

#### IA & Automação
- **🤖 z-ai-web-dev-sdk** - Integração com modelos de linguagem avançados
- **🔧 FlowiseAI** - Plataforma visual de workflow (INTEGRADA)
- **📊 DND Kit** - Drag and drop moderno

## 🤖 Integração FlowiseAI

A plataforma Zanai agora possui integração completa e bidirecional com FlowiseAI, permitindo:

### ✅ Recursos da Integração

- **🔄 Sincronização Bidirecional**: Exporte workflows do ZanAI para Flowise e vice-versa
- **🎯 Tipos Múltiplos**: Suporte para CHATFLOW, AGENTFLOW, ASSISTANT e MULTIAGENT
- **📊 Analytics Completo**: Monitoramento de complexidade, performance e otimizações
- **🔗 URLs Diretas**: Geração automática de links de acesso para cada workflow
- **⚡ Exportação em Tempo Real**: Crie e publique workflows instantaneamente no Flowise externo

### 🌐 URLs de Acesso

Dependendo do tipo de workflow, o sistema gera automaticamente as URLs corretas:

- **CHATFLOW**: `https://aaranha-zania.hf.space/chatflows/{id}` e `https://aaranha-zania.hf.space/chat/{id}`
- **AGENTFLOW**: `https://aaranha-zania.hf.space/agentflows/{id}`
- **ASSISTANT**: `https://aaranha-zania.hf.space/assistants/{id}`

### 🚀 Como Usar

1. **Acesse o Gerenciador**: `/admin/flowise-workflows`
2. **Visualize Workflows**: Lista completa com filtros e analytics
3. **Exporte para Flowise**: Clique em "Exportar" para enviar ao Flowise externo
4. **Acesse Diretamente**: Use as URLs geradas para acessar seus workflows

### 📈 Status da Integração

- ✅ **Conexão Estável**: API Flowise respondendo corretamente
- ✅ **Autenticação Funcional**: Sistema de auth integrado
- ✅ **Exportação Testada**: Workflows sendo exportados com sucesso
- ✅ **URLs Validadas**: Links de acesso funcionando perfeitamente
- ✅ **Sincronização Completa**: Dados consistentes entre ZanAI e Flowise
- ✅ **Segurança Aprimorada**: Rota movida para `/admin/flowise-workflows` com proteção SUPER_ADMIN
- ✅ **Correção de Bugs**: Problemas de tipo de dados JSON resolvidos

### 🔧 Configuração Flowise

```bash
# URL do Flowise Externo
NEXT_PUBLIC_FLOWISE_URL=https://aaranha-zania.hf.space

# API Key do Flowise
FLOWISE_API_KEY=wNFL5HJcOA3RwJdKiVTUWqdzigK7OCUwRKo9KEgjenw
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta de email para testes (opcional)

### Instalação

```bash
# Clonar o repositório
git clone <repository-url>
cd zanai-platform

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Iniciar banco de dados
npm run db:push
npm run db:seed

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Rotas da API
│   │   ├── health/        # Health check
│   │   ├── v1/           # API v1
│   │   └── chat/         # Chat endpoints
│   ├── admin/            # Painel administrativo
│   ├── dashboard/        # Dashboard do usuário
│   ├── enterprise/       # Painel empresarial
│   ├── painel/           # Painel principal
│   ├── planos/           # Planos e preços
│   └── auth/             # Autenticação
├── components/           # Componentes React
│   ├── ui/              # Componentes shadcn/ui
│   ├── layout/          # Layouts da aplicação
│   ├── charts/          # Componentes de gráficos
│   ├── agents/          # Componentes de agentes
│   └── admin/           # Componentes administrativos
├── hooks/               # Hooks personalizados
├── lib/                 # Utilitários e configurações
│   ├── db.ts           # Cliente Prisma
│   ├── utils.ts        # Funções utilitárias
│   ├── auth.ts         # Configuração de auth
│   └── zai.ts          # Integração Z.ai
└── prisma/              # Schema e migrations
    └── schema.prisma   # Modelo de dados
```

## 🎛️ Planos e Recursos

### VS Code Gratuito
- Plugin VS Code gratuito
- 100+ prompts especializados
- Templates para download
- Comunidade exclusiva

### Iniciante (R$ 280/mês)
- 1 Agente de IA básico
- 1.000 interações/mês
- Integração com WhatsApp
- Relatórios básicos
- Suporte por email

### Profissional (R$ 490/mês) - Mais Popular
- 3 Agentes de IA especializados
- 10.000 interações/mês
- Múltiplos canais (WhatsApp, Email, Instagram)
- Analytics em tempo real
- Automação de processos
- Suporte 24/7

### Empresarial (R$ 890/mês)
- 5 Agentes de IA avançados
- Atendimento ilimitado
- Todas as integrações
- Machine Learning avançado
- API REST completa
- Suporte prioritário 24/7

### Enterprise (Customizado)
- Agentes ilimitados
- Atendimento multi-idioma
- Integrações customizadas
- SLA garantido (99.9%)
- Suporte dedicado
- Consultoria semanal

## 🔧 Configuração

### Variáveis de Ambiente

```bash
# Banco de Dados
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Provedores de Auth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Z.ai SDK
ZAI_API_KEY="your-zai-api-key"

# Outros
NODE_ENV="development"
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # ESLint

# Banco de Dados
npm run db:push      # Push schema para o banco
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run migrations
npm run db:reset     # Reset database
npm run db:seed      # Seed database
```

## 🏢 Modelos de Negócio

### Para Pequenas Empresas
- Comece com o plano Iniciante
- Automatize atendimento ao cliente
- Reduza tempo de resposta em 87%
- Aumente vendas em 40%

### Para Empresas em Crescimento
- Plano Profissional ideal
- Múltiplos agentes especializados
- Analytics avançado
- Automação de processos

### Para Grandes Corporações
- Plano Empresarial ou Enterprise
- Soluções customizadas
- Integração total com sistemas existentes
- Suporte dedicado e consultoria

## 🔒 Segurança

- **🔐 Autenticação**: NextAuth.js com múltiplos provedores
- **🛡️ Autorização**: Sistema de roles e permissões granular
- **📋 Auditoria**: Log completo de ações do sistema
- **🔒 Dados**: Criptografia de dados sensíveis
- **🌐 HTTPS**: Suporte completo a SSL/TLS

## 🚀 Implantação

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm run start
```

### Docker
```bash
docker build -t zanai-platform .
docker run -p 3000:3000 zanai-platform
```

## 📈 Monitoramento e Analytics

### Métricas Disponíveis
- Performance de agentes
- Taxa de sucesso de interações
- Tempo de resposta
- Satisfação do usuário
- Uso de recursos
- Análise de sentimentos

### Integrações de Monitoramento
- Dashboard em tempo real
- Relatórios automáticos
- Alertas personalizáveis
- Exportação de dados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **📧 Email**: suporte@zanai.com
- **📱 WhatsApp**: +55 11 99999-9999
- **🌐 Website**: [https://zanai.com](https://zanai.com)
- **📖 Documentação**: [https://docs.zanai.com](https://docs.zanai.com)

## 🙏 Agradecimentos

- A toda a equipe de desenvolvimento por dedicar countless horas
- Aos nossos clientes beta pelo feedback valioso
- À comunidade open source pelas ferramentas incríveis

---

**Transforme seu negócio com o poder da IA. Comece hoje mesmo!** 🚀