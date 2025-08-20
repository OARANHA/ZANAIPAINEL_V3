# Guia de Backup e Restauração do Banco de Dados

## 📋 Visão Geral

Este guia descreve como usar os scripts de backup para restaurar o banco de dados do ZANAI AI Agents Platform para seu estado ideal, contendo apenas os usuários e papéis necessários.

## 🎭 Papéis Ativos no Sistema

O sistema utiliza os seguintes papéis:

| Papel | Descrição | Acesso |
|-------|-----------|---------|
| `SUPER_ADMIN` | Super Administrador | Acesso total ao sistema (`/admin`) |
| `COMPANY_ADMIN` | Administrador da Empresa | Painel empresarial completo (`/enterprise`) |
| `COMPANY_USER` | Usuário da Empresa | Painel empresarial limitado (`/enterprise`) |
| `FREE` | Usuário Gratuito | Painel básico (`/painel`) |
| `INICIANTE` | Usuário Iniciante | Painel intermediário (`/painel`) |
| `PROFISSIONAL` | Usuário Profissional | Painel completo (`/painel`) |

## 🗑️ Papéis Removidos (Legados)

Os seguintes papéis foram removidos por não serem mais utilizados:

- `admin` - Substituído por `SUPER_ADMIN`
- `user` - Substituído por `FREE`, `INICIANTE`, `PROFISSIONAL`
- `company_admin` - Substituído por `COMPANY_ADMIN`

## 📁 Scripts de Backup

### 1. Backup Completo (`backup-seed.ts`)

Script completo que cria um ambiente rico com dados detalhados, incluindo 17 templates profissionais.

```bash
npm run db:seed:backup
```

**O que ele cria:**
- 6 usuários (um para cada papel)
- 2 empresas (TechCorp Solutions, Startup XYZ)
- 2 clientes
- 6 workspaces (um para cada usuário)
- 17 agentes templates profissionais (SuperAdmin)
- 6 agentes básicos (um para cada workspace)

**Templates Profissionais Incluídos:**
- **Estratégia e Negócios (5):** Consultor de Estratégia, Especialista em Dados, Agente de Automação Inteligente, Arquiteto de Workflows, Integrador Flowise
- **Vendas e Marketing (2):** Agente de Vendas, Agente de Marketing Digital
- **Tecnologia (2):** Consultor de TI, Assistente de E-commerce
- **Operações e Gestão (2):** Especialista em Logística, Agente de Recursos Humanos
- **Financeiro (1):** Consultor Financeiro
- **Serviços Profissionais (3):** Especialista em Educação, Consultor Jurídico, Agente de Saúde e Bem-estar
- **Criativo e Suporte (2):** Assistente Criativo, Agente de Suporte ao Cliente

### 2. Backup Rápido (`quick-backup.ts`)

Script simplificado para restauração rápida do essencial.

```bash
npm run db:seed:quick
```

**O que ele cria:**
- 6 usuários (um para cada papel)
- 6 workspaces (um para cada usuário)
- 6 agentes básicos

## 🔧 Configuração dos Scripts

Adicione os seguintes scripts ao seu `package.json`:

```json
{
  "scripts": {
    "db:seed:backup": "tsx prisma/backup-seed.ts",
    "db:seed:quick": "tsx prisma/quick-backup.ts"
  }
}
```

## 🚀 Como Usar

### Para uma Nova Instalação

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure o banco de dados:**
   ```bash
   npx prisma db push
   ```

3. **Execute o backup desejado:**
   ```bash
   # Para backup completo
   npm run db:seed:backup
   
   # Para backup rápido
   npm run db:seed:quick
   ```

### Para Restaurar o Banco de Dados

1. **Limpe o banco de dados atual:**
   ```bash
   npx prisma migrate reset
   ```

2. **Execute o script de backup:**
   ```bash
   npm run db:seed:backup
   ```

## 🔑 Credenciais de Teste

### Usuários do Sistema

| Tipo | Email | Papel | Senha | Rota de Acesso |
|------|-------|-------|-------|---------------|
| Super Admin | superadmin@zanai.com | SUPER_ADMIN | 123456 | `/admin` |
| Admin Empresa | company.admin@empresa.com | COMPANY_ADMIN | 123456 | `/enterprise` |
| Usuário Empresa | company.user@empresa.com | COMPANY_USER | 123456 | `/enterprise` |
| Usuário Gratuito | free.user@zanai.com | FREE | 123456 | `/painel` |
| Usuário Iniciante | iniciante.user@zanai.com | INICIANTE | 123456 | `/painel` |
| Usuário Profissional | profissional.user@zanai.com | PROFISSIONAL | 123456 | `/painel` |

### Acesso Rápido via Interface

Use os botões na página de login (`/login`) para acesso rápido:

- **Admin Empresa**: Preenche com `admin@mix.com` / `empresa`
- **Funcionário**: Preenche com `funcionario@mix.com` / `empresa`
- **Usuário Gratuito**: Preenche com `free@zanai.com` / `gratis`
- **Usuário Iniciante**: Preenche com `iniciante@zanai.com` / `iniciante`
- **Usuário Profissional**: Preenche com `profissional@zanai.com` / `profissional`

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

1. **User** - Usuários do sistema
2. **Workspace** - Workspaces dos usuários
3. **Agent** - Agentes de IA
4. **Company** - Empresas (opcional)
5. **Client** - Clientes (opcional)

### Tabelas de Relacionamento

- **Composition** - Composições de agentes
- **AgentExecution** - Execuções de agentes
- **AgentMetrics** - Métricas de agentes
- **Learning** - Dados de aprendizado
- **MCPConnection** - Conexões MCP
- **MCPServer** - Servidores MCP
- **MCPTool** - Ferramentas MCP

### Tabelas do Sistema Urbano (Opcionais)

- **Project** - Projetos
- **Task** - Tarefas
- **Contract** - Contratos
- **Report** - Relatórios
- **AuditLog** - Logs de auditoria

## 🔍 Verificação do Backup

Após executar o script de backup, verifique se os dados foram criados corretamente:

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  const users = await prisma.user.findMany();
  const workspaces = await prisma.workspace.findMany();
  const agents = await prisma.agent.findMany();
  
  console.log('📊 Verificação do Backup:');
  console.log(\`Usuários: \${users.length}\`);
  console.log(\`Workspaces: \${workspaces.length}\`);
  console.log(\`Agentes: \${agents.length}\`);
  
  console.log('\\n👥 Usuários:');
  users.forEach(user => {
    console.log(\`- \${user.name} (\${user.email}) - \${user.role}\`);
  });
  
  await prisma.\$disconnect();
}

verify().catch(console.error);
"
```

## 🛠️ Solução de Problemas

### Problemas Comuns

1. **Erro de chave estrangeira:**
   - Execute `npx prisma migrate reset` antes do backup
   - Verifique se não há outros processos usando o banco

2. **Prisma Client não atualizado:**
   - Execute `npx prisma generate`
   - Reinicie o servidor de desenvolvimento

3. **Permissões negadas:**
   - Verifique as variáveis de ambiente
   - Confirme a string de conexão do banco de dados

### Logs Úteis

Os scripts geram logs detalhados durante a execução. Preste atenção às mensagens:

- `✅` - Sucesso
- `⚠️` - Aviso (item já existe)
- `❌` - Erro

## 📝 Notas Finais

- Os scripts de backup são idempotentes - podem ser executados várias vezes
- Dados existentes são removidos antes de criar novos dados
- Use `backup-seed.ts` para ambientes de desenvolvimento completos
- Use `quick-backup.ts` para restauração rápida ou testes
- Sempre faça backup dos dados importantes antes de executar scripts de limpeza