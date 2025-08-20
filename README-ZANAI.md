# Zanai - Sistema de Agentes Inteligentes

## Visão Geral

O Zanai é um sistema de agentes inteligentes projetado como extensão do Kilocode, fornecendo superpoderes para criação, orquestração e aprendizado de agentes diretamente no VS Code.

## 🚀 Características Principais

### 1. Agent Templates
- Criação rápida de agentes especializados
- Templates pré-configurados para diversas tarefas
- Configuração YAML + Base de conhecimento Markdown
- Integração nativa com Kilocode

### 2. Agent Composition
- Orquestração de múltiplos agentes
- Fluxos de trabalho complexos
- Composição visual de agentes
- Execução paralela e sequencial

### 3. Agent Learning
- Sistema de aprendizado contínuo
- Análise de padrões de execução
- Otimização automática de performance
- Registro de feedback e melhorias

### 4. Visual Agent Studio
- Interface visual intuitiva
- Canvas para arrastar e soltar agentes
- Designer de fluxos de trabalho
- Dashboard de monitoramento

## 🏗️ Arquitetura

```
VS Code + Kilocode (Plataforma Base)
    ↓
.zanai-modes/ (Modos Personalizados)
    ↓
.zanai-workspace/ (Sistema de Agentes)
    ↓
Quatro Superpoderes:
├── Agent Templates (Criação Rápida)
├── Agent Composition (Orquestração)
├── Agent Learning (Aprendizado Contínuo)
└── Visual Agent Studio (Interface Visual)
```

## 📁 Estrutura do Projeto

```
zanai-nextjs-template/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Interface principal
│   │   ├── api/
│   │   │   ├── agents/              # API de agentes
│   │   │   ├── workspaces/          # API de workspaces
│   │   │   ├── compositions/        # API de composições
│   │   │   ├── learning/            # API de aprendizado
│   │   │   └── execute/             # API de execução
│   │   └── globals.css
│   ├── components/
│   │   └── ui/                      # Componentes shadcn/ui
│   ├── lib/
│   │   ├── db.ts                    # Cliente Prisma
│   │   ├── agent-execution.ts      # Serviço de execução
│   │   └── utils.ts
│   └── hooks/
├── prisma/
│   └── schema.prisma               # Modelo de dados
├── .zanai-modes.yaml               # Configuração Kilocode
├── package.json
└── README.md
```

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+
- VS Code com extensão Kilocode
- Banco de dados SQLite

### Instalação

1. Clone o repositório:
```bash
git clone <repositorio>
cd zanai-nextjs-template
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npm run db:push
```

4. Popule o banco de dados com dados iniciais:
```bash
npx tsx seed-database.ts
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Integração com Kilocode

1. Copie o arquivo `.zanai-modes.yaml` para o diretório do seu projeto VS Code
2. Reinicie o VS Code para carregar os novos modos
3. Use os modos Zanai diretamente no Kilocode

## 🎯 Modos de Uso

### Agent Templates Mode
```yaml
# Exemplo de template de agente
name: Code Reviewer
version: 1.0.0
capabilities:
  - analyze_code_quality
  - suggest_improvements
  - detect_security_issues
knowledge: |
  # Code Reviewer
  Especialista em revisão de código...
```

### Agent Composition Mode
```yaml
# Exemplo de composição
name: Full Stack Analysis
agents:
  - code-reviewer
  - documentation-assistant
  - api-generator
workflow: |
  1. Code Reviewer analisa
  2. API Generator sugere
  3. Documentation Assistant documenta
```

### Agent Learning Mode
```yaml
# Exemplo de estratégia de aprendizado
strategy: feedback_learning
approach: |
  1. Coletar feedback
  2. Analisar padrões
  3. Ajustar comportamentos
  4. Validar melhorias
```

### Visual Agent Studio Mode
- Interface drag-and-drop
- Conexões visuais entre agentes
- Propriedades editáveis em tempo real
- Preview de execuções

## 🔧 Configuração

### Variáveis de Ambiente
```env
DATABASE_URL="sqlite:./zanai.db"
ZANAI_ENV="development"
ZANAI_PORT="3000"
```

### Configuração do Zanai
```yaml
global_settings:
  kilocode_integration:
    enabled: true
    auto_sync: true
  execution:
    max_concurrent_agents: 5
    timeout_per_agent: 30000
  learning:
    auto_record: true
    confidence_threshold: 0.8
```

## 📊 API Endpoints

### Agentes
- `GET /api/agents` - Listar agentes
- `POST /api/agents` - Criar agente

### Workspaces
- `GET /api/workspaces` - Listar workspaces
- `POST /api/workspaces` - Criar workspace

### Composições
- `GET /api/compositions` - Listar composições
- `POST /api/compositions` - Criar composição

### Execução
- `POST /api/execute` - Executar agente/composição

### Aprendizado
- `GET /api/learning` - Listar registros de aprendizado
- `POST /api/learning` - Criar registro de aprendizado

## 🛠️ Desenvolvimento

### Scripts Úteis
```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Construir para produção
npm run start        # Iniciar servidor de produção
npm run lint         # Verificar código
npm run db:push      # Atualizar schema do banco
npm run db:generate  # Gerar cliente Prisma
```

### Estrutura de Dados

#### Agent
```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  config: string;        // YAML
  knowledge: string;     // Markdown
  status: 'active' | 'inactive' | 'training';
  workspaceId: string;
}
```

#### Workspace
```typescript
interface Workspace {
  id: string;
  name: string;
  description: string;
  config: string;        // JSON
  userId: string;
}
```

#### Composition
```typescript
interface Composition {
  id: string;
  name: string;
  description: string;
  config: string;        // YAML
  status: 'draft' | 'active' | 'archived';
  workspaceId: string;
  agents: Agent[];
}
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das suas mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎯 Roadmap

### Versão 1.0 (Atual)
- ✅ Sistema básico de agentes
- ✅ Interface web completa
- ✅ Integração com Kilocode
- ✅ Quatro modos principais

### Versão 1.1 (Próxima)
- 🔄 Sistema de busca semântica
- 🔄 Mais templates de agentes
- 🔄 Melhorias na interface visual
- 🔄 Documentação avançada

### Versão 2.0 (Futura)
- 📋 Agente de busca semântica integrado
- 📋 Sistema de aprendizado avançado
- 📋 Integração com mais ferramentas
- 📋 Performance otimizada

## 🤖 Integração com Z.ai Code Assistant

O Zanai é potencializado pelo **Z.ai Code Assistant** - um assistente de desenvolvimento avançado com IA que fornece capacidades inteligentes de conclusão de código, depuração e gerenciamento de projetos.

### Recursos com IA
- **Completação Inteligente de Código**: Sugestões de código context-aware e completions
- **Depuração Inteligente**: Detecção de erros e sugestões de resolução com IA
- **Análise de Projeto**: Recomendações automáticas de revisão e otimização de código
- **Geração de Documentação**: Criação e atualização automáticas de documentação
- **Planejamento de Arquitetura**: Design de sistema e planejamento de estrutura assistidos por IA

### Desenvolvimento com Z.ai Code
- **Assistência em Tempo Real**: Ajuda instantânea durante o desenvolvimento com sugestões context-aware
- **Suporte Multi-linguagem**: Funciona perfeitamente com TypeScript, JavaScript, Prisma e mais
- **Melhores Práticas**: Aplica padrões de codificação e melhores práticas automaticamente
- **Integração de Aprendizado**: Aprende continuamente com os padrões do projeto para fornecer melhor assistência

### Configuração do Z.ai Code
O projeto inclui arquivo `.z-ai-config` com configurações otimizadas:
- **Modelo**: GLM-4.5-Flash para respostas rápidas e precisas
- **Temperatura**: 0.6 para criatividade e precisão balanceadas
- **Max Tokens**: 2000 para respostas abrangentes
- **Integração de API Personalizada**: Integração perfeita com serviços Z.ai

## 📞 Suporte

Para suporte, por favor:

1. Abra uma issue no GitHub
2. Use os modos do Kilocode para ajuda
3. Consulte a documentação
4. Utilize o Z.ai Code Assistant para ajuda em tempo real no desenvolvimento

---

**Zanai - Transformando o Kilocode em uma plataforma de agentes inteligentes com Z.ai Code Assistant** 🚀