# 🔧 Guia do Administrador - Zanai AI Agents Platform

Guia completo para administradores de sistema e gestores da plataforma Zanai.

## 🎯 Visão Geral Administrativa

Este guia destina-se a administradores de sistema responsáveis por gerenciar, monitorar e manter a plataforma Zanai. Como administrador, você terá acesso a ferramentas poderosas para gerenciar usuários, monitorar performance, garantir segurança e otimizar o sistema.

### 🏆 Responsabilidades do Administrador

- **Gerenciamento de Usuários**: Criar, editar e remover usuários
- **Monitoramento de Sistema**: Acompanhar performance e saúde do sistema
- **Segurança**: Garantir a integridade e segurança dos dados
- **Backup e Recuperação**: Gerenciar backups e planos de recuperação
- **Atualizações**: Manter o sistema atualizado e funcional
- **Suporte**: Auxiliar usuários com problemas complexos

## 🏠 Painel Administrativo (`/admin`)

### Acessando o Painel Administrativo

1. Faça login com sua conta de administrador
2. Navegue para `/admin`
3. Você verá o painel administrativo com várias seções

### Visão Geral do Painel

O painel administrativo inclui:

- **Estatísticas do Sistema**: Visão geral de usuários, agentes, e performance
- **Monitoramento em Tempo Real**: Status dos componentes do sistema
- **Alertas e Notificações**: Problemas que requerem atenção
- **Ações Rápidas**: Tarefas administrativas comuns
- **Logs do Sistema**: Atividades recentes e auditoria

### Seções do Painel Administrativo

#### 1. Dashboard Principal
- **Métricas Gerais**: Total de usuários, agentes, empresas
- **Performance do Sistema**: CPU, memória, disco
- **Atividade Recente**: Últimas ações no sistema
- **Status de Serviços**: API, banco de dados, filas

#### 2. Gestão de Usuários (`/admin/clients`)
- **Lista de Usuários**: Todos os usuários cadastrados
- **Filtros**: Por status, plano, data de cadastro
- **Ações**: Editar, suspender, remover usuários
- **Importação/Exportação**: Massa de usuários

#### 3. Gestão de Agentes (`/admin/agents`)
- **Todos os Agentes**: Visão completa de todos os agentes
- **Performance**: Taxa de sucesso, volume de uso
- **Status**: Ativos, inativos, em treinamento
- **Ações**: Editar, duplicar, remover agentes

#### 4. Composições (`/admin/compositions`)
- **Gerenciar Composições**: Fluxos de trabalho complexos
- **Execuções**: Histórico de execuções
- **Performance**: Análise de eficiência
- **Debug**: Ferramentas de diagnóstico

#### 5. Especialistas (`/admin/specialists`)
- **Agentes Especialistas**: Gerenciar agentes avançados
- **Configuração**: Parâmetros especializados
- **Performance**: Métricas detalhadas
- **Aprendizado**: Sistema de aprendizado automático

#### 6. Execuções (`/admin/executions`)
- **Monitorar Execuções**: Tempo real e histórico
- **Logs Detalhados**: Depuração de problemas
- **Performance**: Análise de eficiência
- **Erro Handling**: Gerenciamento de falhas

#### 7. Aprendizado (`/admin/learning`)
- **Sistema de Aprendizado**: Monitorar melhorias
- **Métricas**: Eficiência do aprendizado
- **Configuração**: Parâmetros de treinamento
- **Relatórios**: Análise de progresso

#### 8. MCP (`/admin/mcp`)
- **MCP Servers**: Gerenciar servidores MCP
- **Tools**: Ferramentas disponíveis
- **Conexões**: Status das conexões
- **Configuração**: Parâmetros MCP

## 👥 Gestão de Usuários

### Criando Novos Usuários

#### Manualmente

1. Vá para `/admin/clients`
2. Clique em "Novo Usuário"
3. Preencha as informações:
   ```markdown
   - Nome completo
   - Email (será usado para login)
   - Função (user, admin, company_admin)
   - Empresa (se aplicável)
   - Plano (básico, profissional, empresarial)
   ```
4. Configure permissões específicas
5. Envie o email de boas-vindas

#### Em Massa

1. Prepare um arquivo CSV com as colunas:
   ```csv
   nome,email,funcao,empresa,plano
   João Silva,joao@empresa.com,user,Empresa A,basico
   Maria Santos,maria@empresa.com,admin,Empresa A,profissional
   ```
2. Vá para `/admin/clients`
3. Clique em "Importar Usuários"
4. Selecione o arquivo CSV
5. Mapeie as colunas
6. Revise e confirme a importação

### Gerenciando Permissões

#### Níveis de Acesso

| Nível | Descrição | Permissões |
|-------|-----------|------------|
| **super_admin** | Administrador master | Controle total do sistema |
| **admin** | Administrador | Gestão de usuários e agentes |
| **company_admin** | Admin de empresa | Gestão da empresa e usuários |
| **user** | Usuário comum | Acesso aos próprios agentes |
| **client** | Cliente | Acesso limitado |

#### Configurando Permissões

1. Selecione o usuário na lista
2. Clique em "Editar Permissões"
3. Selecione o nível de acesso
4. Configure permissões granulares:
   - Criar agentes
   - Editar configurações
   - Ver analytics
   - Gerenciar usuários
   - Acesso administrativo

### Suspensão e Remoção

#### Suspensão Temporária

1. Selecione o usuário
2. Clique em "Suspender Usuário"
3. Escolha o motivo da suspensão
4. Defina o período (ou indefinido)
5. Adicione notas internas
6. Confirme a suspensão

#### Remoção Permanente

⚠️ **Aviso**: A remoção é permanente e não pode ser desfeita.

1. Selecione o usuário
2. Clique em "Remover Usuário"
3. Confirme a ação
4. Escolha o que fazer com os dados:
   - Manter dados (anônimos)
   - Remover completamente
   - Transferir para outro usuário

## 🤖 Gestão de Agentes

### Monitoramento de Agentes

#### Dashboard de Agentes

Acesse `/admin/agents` para ver:

- **Status Geral**: Quantidade de agentes por status
- **Performance**: Taxa de sucesso média
- **Volume**: Interações por período
- **Alertas**: Agentes com problemas

#### Métricas Importantes

- **Taxa de Sucesso**: % de interações bem-sucedidas
- **Tempo de Resposta**: Média de tempo para responder
- **Satisfação**: Avaliação dos usuários
- **Volume**: Número de conversas
- **Erros**: Quantidade de falhas

### Gerenciamento de Problemas

#### Agentes com Baixa Performance

1. Identifique agentes com performance abaixo de 80%
2. Analise os logs de erro
3. Verifique o conhecimento do agente
4. Teste o agente manualmente
5. Atualize o conhecimento ou configurações
6. Monitore a melhoria

#### Agentes Inativos

1. Verifique agentes inativos há mais de 30 dias
2. Contacte o proprietário
3. Ofereça ajuda ou treinamento
4. Considere desativar se necessário

### Atualização em Massa

#### Atualizando Configurações

1. Selecione múltiplos agentes
2. Clique em "Ações em Massa"
3. Escolha a ação:
   - Alterar status
   - Atualizar configurações
   - Transferir proprietário
   - Remover agentes

#### Migração de Agentes

1. Selecione os agentes a migrar
2. Escolha o novo proprietário
3. Configure as permissões
4. Execute a migração
5. Verifique o resultado

## 📊 Monitoramento e Analytics

### Monitoramento do Sistema

#### Métricas do Sistema

Acesse o dashboard para monitorar:

- **CPU**: Uso do processador
- **Memória**: Consumo de RAM
- **Disco**: Espaço em disco
- **Rede**: Tráfego de rede
- **Banco de Dados**: Performance e conexões

#### Alertas e Notificações

Configure alertas para:

- **Uso de CPU**: > 80% por 5 minutos
- **Memória**: > 90% por 5 minutos
- **Disco**: < 10% espaço livre
- **Serviços**: Serviços fora do ar
- **Erros**: Taxa de erros alta

### Analytics Administrativos

#### Relatórios Disponíveis

- **Uso do Sistema**: Atividade por período
- **Performance dos Agentes**: Comparativo entre agentes
- **Satisfação dos Usuários**: Avaliações e feedback
- **Crescimento**: Novos usuários e empresas
- **Receita**: Faturamento por plano

#### Exportação de Dados

1. Vá para a seção de analytics
2. Selecione o período e filtros
3. Escolha o formato de exportação
4. Clique em "Exportar"
5. Aguarde a geração do relatório

## 🔒 Segurança

### Configurações de Segurança

#### Autenticação

- **Senha Forte**: Exigir senhas com mínimo de 8 caracteres
- **2FA**: Autenticação de dois fatores para admins
- **Sessões**: Timeout de sessão configurável
- **Login Attempts**: Bloqueio após tentativas falhas

#### Permissões

- **Princípio do Menor Privilégio**: Dar apenas o necessário
- **Auditoria**: Log de todas as ações administrativas
- **Revisão Periódica**: Revisar permissões regularmente
- **Segregação**: Separar responsabilidades

### Monitoramento de Segurança

#### Eventos de Segurança

Monitore:

- **Logins Suspeitos**: Múltiplas tentativas falhas
- **Ações Administrativas**: Mudanças críticas
- **Acesso Não Autorizado**: Tentativas de acesso a áreas restritas
- **Alterações de Permissão**: Mudanças em níveis de acesso

#### Resposta a Incidentes

1. **Detecção**: Identificar o incidente
2. **Contenção**: Isolar o problema
3. **Análise**: Investigar a causa
4. **Remediação**: Corrigir o problema
5. **Prevenção**: Implementar medidas preventivas

### Backup e Recuperação

#### Estratégia de Backup

- **Banco de Dados**: Backup diário automático
- **Arquivos**: Backup semanal de uploads e mídias
- **Configurações**: Backup de configurações do sistema
- **Logs**: Backup de logs para auditoria

#### Procedimento de Recuperação

1. **Avaliar o Dano**: Identificar o que foi perdido
2. **Restaurar Backup**: Restaurar do backup mais recente
3. **Verificar Integridade**: Testar o sistema restaurado
4. **Atualizar Sistemas**: Aplicar patches e atualizações
5. **Monitorar**: Acompanhar por problemas recorrentes

## 🛠️ Manutenção do Sistema

### Atualizações

#### Planejamento de Atualizações

1. **Avisar Usuários**: Comunicar manutenção programada
2. **Backup Completo**: Fazer backup antes de atualizar
3. **Testar em Staging**: Testar atualizações em ambiente de teste
4. **Atualizar**: Aplicar atualizações em horário de baixo tráfego
5. **Verificar**: Testar funcionalidades críticas

#### Tipos de Atualizações

- **Security Patches**: Aplicar imediatamente
- **Minor Updates**: Aplicar semanalmente
- **Major Updates**: Planejar com antecedência
- **Dependencies**: Atualizar dependências regularmente

### Otimização de Performance

#### Banco de Dados

- **Índices**: Manter índices otimizados
- **Queries**: Otimizar consultas lentas
- **Limpeza**: Remover dados antigos
- **Monitoramento**: Acompanhar performance

#### Aplicação

- **Cache**: Implementar cache onde aplicável
- **CDN**: Usar CDN para assets estáticos
- **Compressão**: Comprimir respostas HTTP
- **Lazy Loading**: Carregar componentes sob demanda

## 🔧 Configurações Avançadas

### Configuração do Servidor

#### Variáveis de Ambiente

```bash
# Configurações básicas
NODE_ENV=production
PORT=3000
DATABASE_URL="file:./production.db"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# Z.ai SDK
ZAI_API_KEY="your-zai-api-key"

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-password"
EMAIL_FROM="noreply@your-domain.com"

# Monitoramento
SENTRY_DSN="your-sentry-dsn"
LOG_LEVEL="info"
```

#### Configuração do Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Configuração do Banco de Dados

#### Otimização do SQLite

```sql
-- Habilitar WAL mode para melhor performance
PRAGMA journal_mode=WAL;

-- Habilitar synchronous mode para segurança
PRAGMA synchronous=NORMAL;

-- Configurar cache size
PRAGMA cache_size=10000;

-- Habilitar foreign keys
PRAGMA foreign_keys=ON;
```

#### Manutenção do Banco

- **VACUUM**: Limpar espaço não utilizado
- **ANALYZE**: Atualizar estatísticas
- **Backup**: Backup regular do banco
- **Monitoramento**: Acompanhar tamanho e performance

## 📞 Suporte Administrativo

### Hierarquia de Suporte

#### Nível 1: Autoatendimento
- **Documentação**: Guias e tutoriais
- **Base de Conhecimento**: Artigos e FAQs
- **Fórum da Comunidade**: Discussões e soluções

#### Nível 2: Suporte Técnico
- **Ticket System**: Sistema de tickets
- **Email**: suporte@zanai.com
- **Chat**: Chat ao vivo durante horário comercial

#### Nível 3: Suporte Avançado
- **Phone Support**: Suporte telefônico prioritário
- **On-site Support**: Suporte presencial (Enterprise)
- **Dedicated Support**: Gerente de conta dedicado (Enterprise)

### Procedimentos de Emergência

#### Sistema Fora do Ar

1. **Verificar Status**: Confirmar se é um problema geral ou localizado
2. **Comunicar**: Informar usuários sobre o problema
3. **Investigar**: Identificar a causa raiz
4. **Corrigir**: Aplicar a solução
5. **Comunicar Resolução**: Informar quando o problema for resolvido
6. **Documentar**: Registrar o incidente para análise futura

#### Violação de Segurança

1. **Conter**: Isolar o sistema afetado
2. **Investigar**: Determinar o escopo da violação
3. **Notificar**: Informar partes interessadas
4. **Recuperar**: Restaurar sistemas seguros
5. **Prevenir**: Implementar medidas preventivas
6. **Reportar**: Documentar o incidente

## 📈 Melhores Práticas Administrativas

### Gestão do Dia a Dia

#### Rotinas Diárias
- **Verificar Logs**: Analisar logs de erro e acesso
- **Monitorar Performance**: Verificar métricas do sistema
- **Revisar Alertas**: Atender a alertas críticos
- **Backup**: Verificar se backups foram realizados

#### Rotinas Semanais
- **Atualizações**: Aplicar atualizações de segurança
- **Relatórios**: Gerar relatórios de performance
- **Revisão de Usuários**: Revisar novos usuários e permissões
- **Limpeza**: Remover dados temporários e logs antigos

#### Rotinas Mensais
- **Análise Completa**: Análise detalhada de performance
- **Capacidade**: Planejar expansão de recursos
- **Segurança**: Revisão de políticas de segurança
- **Treinamento**: Atualizar conhecimentos da equipe

### Documentação

#### Manter Documentação Atualizada
- **Procedimentos**: Documentar todos os procedimentos
- **Configurações**: Manter registro de configurações
- **Incidentes**: Documentar todos os incidentes
- **Mudanças**: Registrar todas as mudanças no sistema

#### Conhecimento Compartilhado
- **Base de Conhecimento**: Criar e manter artigos
- **Treinamento**: Treinar novos administradores
- **Comunidade**: Participar de fóruns e grupos
- **Melhores Práticas**: Compartilhar experiências

---

Este guia fornece uma visão completa das responsabilidades e procedimentos administrativos da plataforma Zanai. Para dúvidas específicas ou suporte adicional, não hesite em contactar a equipe de desenvolvimento ou acessar a documentação técnica.

**Mantenha seu sistema seguro, atualizado e otimizado!** 🔧