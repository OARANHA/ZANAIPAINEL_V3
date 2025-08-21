# ZANAI PAINEL V3 - Setup Guide

## Visão Geral

Este guia documenta o processo de setup automatizado do ZANAI PAINEL V3, uma plataforma completa para gestão de agentes de IA.

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Acesso à internet para instalação das dependências

## Setup Automatizado

O projeto inclui um script de setup automatizado que configura todo o ambiente necessário:

### 1. Instalação das Dependências

```bash
npm install
```

Este comando irá:
- Instalar todas as dependências do projeto
- Executar automaticamente o script de setup (`npm run setup`)
- Configurar o banco de dados
- Criar usuários padrão

### 2. Script de Setup (`setup.js`)

O script de setup realiza as seguintes operações:

#### Verificação de Pré-requisitos
- Cria arquivo `.env` se não existir
- Cria arquivo `.z-ai-config` se não existir
- Cria diretório `db/` se não existir

#### Configuração do Banco de Dados
- Executa `prisma db push` para criar o schema
- Gera o Prisma Client
- Popula o banco de dados com usuários padrão

### 3. Configuração Manual (Opcional)

Se preferir configurar manualmente, siga estes passos:

#### 3.1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database Configuration
DATABASE_URL="file:./db/custom.db"

# Environment Configuration
ZANAI_ENV="development"
ZANAI_PORT="3000"
NODE_ENV=development

# Z.ai SDK Configuration - GLM Configuration
ZAI_API_KEY=your_zai_api_key_here
ZAI_BASE_URL="https://api.z.ai/api/paas/v4/"
ZAI_MODEL=glm-4.5-flash
ZAI_MAX_TOKENS=2000
ZAI_TEMPERATURE=0.7

# OpenAI Configuration (for Flowise)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.z.ai/api/paas/v4/

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_muito_segura_aqui

# Flowise Configuration
NEXT_PUBLIC_FLOWISE_URL=https://aaranha-zania.hf.space
FLOWISE_BASE_URL=https://aaranha-zania.hf.space
FLOWISE_API_KEY=wNFL5HJcOA3RwJdKiVTUWqdzigK7OCUwRKo9KEgjenw
FLOWISE_TIMEOUT=30000
FLOWISE_RETRY_ATTEMPTS=3
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 3.2. Configuração do Z.ai SDK

Crie um arquivo `.z-ai-config` na raiz do projeto:

```json
{
  "apiKey": "your_zai_api_key_here",
  "baseUrl": "https://api.z.ai/api/paas/v4/",
  "model": "glm-4.5-flash",
  "maxTokens": 2000,
  "temperature": 0.6
}
```

#### 3.3. Banco de Dados

```bash
# Criar diretório do banco de dados
mkdir -p db

# Push do schema
npx prisma db push

# Gerar Prisma Client
npx prisma generate

# Popular banco de dados
npm run db:seed
```

## Usuários Padrão

Após o setup, os seguintes usuários serão criados:

### 1. SUPER_ADMIN
- **Email**: `superadmin@zanai.com`
- **Senha**: `admin123`
- **Acesso**: `/admin`
- **Permissões**: Acesso total ao sistema

### 2. Admin Empresa
- **Email**: `admin@zanai.com.br`
- **Senha**: `empresa`
- **Acesso**: `/enterprise`
- **Permissões**: Administração de nível empresarial

### 3. Usuário Gratuito
- **Email**: `free.user@zanai.com`
- **Senha**: `gratis`
- **Acesso**: `/painel`
- **Permissões**: Acesso básico limitado

### 4. Usuário Iniciante
- **Email**: `iniciante.user@zanai.com`
- **Senha**: `iniciante`
- **Acesso**: `/painel`
- **Permissões**: Acesso com funcionalidades básicas

### 5. Usuário Profissional
- **Email**: `profissional.user@zanai.com`
- **Senha**: `profissional`
- **Acesso**: `/painel`
- **Permissões**: Acesso completo ao painel

## Inicialização do Servidor

Após o setup completo, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em: http://localhost:3000

## Estrutura do Projeto

```
/
├── src/
│   ├── app/                 # Páginas Next.js
│   ├── components/          # Componentes React
│   ├── lib/                 # Bibliotecas e utilitários
│   └── hooks/               # Hooks customizados
├── prisma/
│   ├── schema.prisma        # Schema do banco de dados
│   └── simple-seed.ts       # Script de seed
├── db/                      # Arquivos do banco de dados
├── public/                  # Arquivos estáticos
├── setup.js                 # Script de setup automatizado
├── package.json             # Dependências e scripts
└── README.md                # Documentação do projeto
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Compila o projeto
npm run start        # Inicia servidor de produção
npm run lint         # Executa linting

# Banco de Dados
npm run db:push      # Push do schema
npm run db:generate  # Gera Prisma Client
npm run db:migrate   # Executa migrações
npm run db:reset     # Reseta o banco de dados
npm run db:seed      # Popula o banco de dados

# Setup
npm run setup        # Executa setup completo
```

## Troubleshooting

### Problemas Comuns

1. **Erro de permissão ao criar arquivos**
   - Verifique as permissões do diretório
   - Execute com permissões de administrador se necessário

2. **Banco de dados não encontrado**
   - Verifique se o diretório `db/` existe
   - Execute `npm run db:push` para criar o schema

3. **Dependências não instaladas**
   - Execute `npm install` novamente
   - Verifique a conexão com a internet

4. **Porta 3000 já em uso**
   - Altere a porta no arquivo `.env`
   - Ou encerre o processo que está usando a porta

### Logs

O servidor gera logs em tempo real:
- Desenvolvimento: `dev.log`
- Produção: `server.log`

## Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs do servidor
2. Consulte a documentação do projeto
3. Abra uma issue no repositório

## Próximos Passos

Após o setup completo:
1. Configure suas chaves de API no arquivo `.env`
2. Personalize os usuários conforme necessário
3. Explore a interface administrativa em `/admin`
4. Teste a funcionalidade de agentes de IA

---

**Nota**: Este setup é destinado para ambiente de desenvolvimento. Para produção, ajuste as variáveis de ambiente e configurações de segurança conforme necessário.