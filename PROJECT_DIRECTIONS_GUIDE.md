# Zania Project - Guia de Direções e Contexto

## 📋 Visão Geral do Projeto

**Status Atual**: Sistema completo em transição de "estático" para "funcional"  
**Data**: 2025-06-23  
**Fase**: Transformação de Cards em Portais Funcionais  

---

## 🎯 Direção Principal: "Do Estático ao Funcional"

### **Problema Identificado**
Os cards atuais são **"pontos de exibição estática"** em vez de **"portais de acesso funcional"**.

**Experiência Atual**: "Vejo um agente interessante, clico para ver o que acontece"  
**Experiência Desejada**: "Vejo um agente interessante, uso imediatamente para resolver meu problema"

### **Solução Estratégica**
Transformar cada card em um **portal funcional** com ações contextuais baseadas no tipo do agente.

---

## 🏗️ Arquitetura Atual (Funcionando)

### **Sistema Completo**
- ✅ **Agentes** - Gestão completa de agentes de IA
- ✅ **Especialistas** - Templates especializados
- ✅ **Composições** - Workflows multi-agente
- ✅ **Studio** - Ambiente de desenvolvimento
- ✅ **Flowise Integration** - 10 endpoints API completos
- ✅ **MCP Tools** - Sistema de ferramentas executáveis
- ✅ **Banco de Dados** - Prisma com schema completo
- ✅ **Autenticação** - Sistema de usuários e permissões
- ✅ **UI/UX** - shadcn/ui components modernos

### **APIs Disponíveis**
1. **Flowise API** - Execução de workflows
2. **MCP Tools** - Ferramentas específicas
3. **Z.AI SDK** - Capacidades de IA generativa
4. **Database API** - Persistência de dados

### **Páginas Principais**
- `/admin/agents` - Gestão de agentes
- `/admin/specialists` - Templates especializados
- `/admin/compositions` - Workflows multi-agente
- `/admin/flowise-workflows` - Gerenciamento Flowise
- `/test-agent` - Ambiente de testes

---

## 🔍 Análise dos Cards Atuais

### **Funcionalidades Existentes**
- ✅ Exibição de informações básicas (nome, descrição, status)
- ✅ Navegação para outras páginas
- ✅ Exportação de dados (JSON/Markdown)
- ✅ Execução básica de agentes
- ✅ Ações administrativas (editar, arquivar, excluir)

### **Limitações Identificadas**
- ❌ Ações genéricas (não específicas ao tipo)
- ❌ Sem resultados imediatos
- ❌ Navegação obrigatória para funcionalidade
- ❌ Sem integração com APIs específicas
- ❌ Experiência passiva do usuário

---

## 🎯 Mapeamento de Funcionalidades por Tipo de Agente

### **Health Agents (Saúde)**
```typescript
tipo: "health"
ações: [
  { label: "Consulta Médica", icon: "🏥", api: "health_consultation" },
  { label: "Análise de Sintomas", icon: "🩺", api: "symptom_analysis" },
  { label: "Monitoramento", icon: "📊", api: "health_monitoring" },
  { label: "Gerar Relatório", icon: "📋", api: "health_report" }
]
contexto: "Dados de saúde, histórico médico, sintomas atuais"
```

### **Business Agents (Negócios)**
```typescript
tipo: "business"
ações: [
  { label: "Analisar Dados", icon: "📈", api: "data_analysis" },
  { label: "Consultoria", icon: "💼", api: "business_consulting" },
  { label: "Otimizar Processos", icon: "⚡", api: "process_optimization" },
  { label: "Previsão de Tendências", icon: "🔮", api: "trend_forecasting" }
]
contexto: "Dados de negócios, métricas, objetivos estratégicos"
```

### **Education Agents (Educação)**
```typescript
tipo: "education"
ações: [
  { label: "Criar Conteúdo", icon: "📚", api: "content_creation" },
  { label: "Tutoria", icon: "🎓", api: "tutoring" },
  { label: "Avaliar Aprendizado", icon: "📝", api: "learning_assessment" },
  { label: "Plano de Estudos", icon: "📅", api: "study_planning" }
]
contexto: "Nível de ensino, área de conhecimento, objetivos de aprendizado"
```

### **Default Agents (Padrão)**
```typescript
tipo: "default"
ações: [
  { label: "Conversar", icon: "💬", api: "chat" },
  { label: "Executar Tarefa", icon: "✅", api: "task_execution" },
  { label: "Assistência", icon: "🤝", api: "assistance" },
  { label: "Perguntar", icon: "❓", api: "qa" }
]
contexto: "Necessidade geral, objetivo da interação"
```

---

## 🔧 Implementação Técnica

### **Estrutura do Card Funcional**
```typescript
interface FunctionalCard {
  // Dados básicos (existentes)
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  
  // Novos campos funcionais
  actions: CardAction[];
  capabilities: string[];
  apiEndpoints: string[];
  requiresContext: boolean;
  contextFields?: string[];
  
  // Metadados
  lastUsed?: string;
  usageCount?: number;
  averageResponseTime?: number;
}

interface CardAction {
  id: string;
  label: string;
  icon: string;
  api: string;
  method: 'GET' | 'POST';
  requiresInput?: boolean;
  inputPlaceholder?: string;
  expectedOutput?: string;
}
```

### **Fluxo de Ação do Card**
```
1. Usuário vê card com ações específicas
2. Clica em uma ação (ex: "Analisar Dados")
3. Card mostra input contextual (se necessário)
4. Usuário fornece informações
5. Card chama API específica
6. Resultado é exibido no próprio card
7. Opções de continuidade (salvar, compartilhar, refinar)
```

### **Integração com APIs Existentes**
```typescript
// Mapeamento de ações para APIs
const actionApiMapping = {
  health_consultation: '/api/mcp/execute',
  data_analysis: '/api/mcp/execute',
  content_creation: '/api/mcp/execute',
  chat: '/api/chat',
  task_execution: '/admin/api/execute',
  // ... outras ações
};

// Exemplo de execução
const executeCardAction = async (action: CardAction, input: string) => {
  const response = await fetch(actionApiMapping[action.api], {
    method: action.method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: action.api,
      input: input,
      agentType: agent.type,
      context: gatherContext(agent)
    })
  });
  
  return response.json();
};
```

---

## 🎨 Design e Experiência do Usuário

### **Visual do Card Funcional**
```
┌─────────────────────────────────────┐
│  🏥 Health Agent Pro               │
│  Agente especializado em saúde     │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  🩺 Analisar Sintomas  📊 Monitor  │
│                                     │
│  🏥 Consulta        📋 Relatório   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Status: Ativo | Usos: 127         │
│  Último uso: 2h atrás              │
└─────────────────────────────────────┘
```

### **Estados do Card**
1. **Estado Inicial**: Mostra ações disponíveis
2. **Estado de Input**: Mostra campo para informações do usuário
3. **Estado de Processamento**: Mostra loading e progresso
4. **Estado de Resultado**: Mostra resultado e opções de continuidade
5. **Estado de Erro**: Mostra erro e opções de retry

### **Micro-interações**
- Hover effects nos botões de ação
- Animações suaves entre estados
- Feedback visual imediato
- Toast notifications para ações concluídas

---

## 📋 Plano de Implementação

### **Fase 1: Análise e Mapeamento (1-2 dias)**
- [ ] Analisar estrutura atual dos cards
- [ ] Mapear todos os tipos de agentes existentes
- [ ] Identificar APIs disponíveis para cada tipo
- [ ] Definir ações específicas por tipo

### **Fase 2: Desenvolvimento do Backend (2-3 dias)**
- [ ] Criar endpoint unificado para ações de cards
- [ ] Implementar integração com MCP tools
- [ ] Criar sistema de contexto por tipo
- [ ] Adicionar métricas de uso

### **Fase 3: Desenvolvimento do Frontend (3-4 dias)**
- [ ] Criar componente de card funcional
- [ ] Implementar estados do card
- [ ] Adicionar ações contextuais
- [ ] Criar sistema de inputs dinâmicos

### **Fase 4: Integração e Testes (2-3 dias)**
- [ ] Integrar cards nas páginas existentes
- [ ] Testar todas as ações e APIs
- [ ] Validar experiência do usuário
- [ ] Otimizar performance

### **Fase 5: Refinamento e Documentação (1-2 dias)**
- [ ] Refinar UX baseado em feedback
- [ ] Otimizar animações e transições
- [ ] Documentar novo sistema
- [ ] Preparar para deploy

---

## 🔍 Padrões e Convenções

### **Nomenclatura**
- Componentes: `FunctionalCard`, `CardAction`, `CardContext`
- APIs: `/api/card/execute`, `/api/card/context`
- Estados: `idle`, `input`, `processing`, `result`, `error`

### **Cores e Ícones**
- Health: Verde (🏥🩺📊📋)
- Business: Azul (📈💼⚡🔮)
- Education: Laranja (📚🎓📝📅)
- Default: Roxo (💬✅🤝❓)

### **Responsividade**
- Mobile: Cards empilhados verticalmente
- Tablet: Cards em grid 2x2
- Desktop: Cards em grid 3x3 ou 4x4

---

## 📊 Métricas de Sucesso

### **Métricas de Engajamento**
- [ ] Aumento de cliques em cards (meta: 300%)
- [ ] Redução de navegação para outras páginas (meta: 60%)
- [ ] Aumento de execuções de agentes (meta: 200%)
- [ ] Tempo médio de interação (meta: 45 segundos)

### **Métricas Técnicas**
- [ ] Tempo de resposta das ações (meta: < 3 segundos)
- [ ] Taxa de sucesso das execuções (meta: > 95%)
- [ ] Uso de memória dos componentes (meta: < 50MB)
- [ ] Tamanho dos bundles (meta: < 200KB)

---

## 🚀 Próximos Passos Imediatos

### **Hoje/Amanhã**
1. **Analisar cards existentes** em `/src/components/agents/`
2. **Mapear tipos de agentes** no banco de dados
3. **Identificar APIs disponíveis** para integração

### **Esta Semana**
1. **Criar protótipo do card funcional**
2. **Implementar backend para ações**
3. **Testar com agentes existentes**

### **Próxima Semana**
1. **Integrar em todas as páginas**
2. **Testar experiência do usuário**
3. **Otimizar e refinar**

---

## 📝 Notas Importantes

### **Lembre-se Sempre**
- **O objetivo é funcionalidade, não apenas informação**
- **Cada card deve ser uma ferramenta útil**
- **O usuário deve obter valor imediato**
- **Use as APIs existentes (Flowise, MCP, Z.AI)**

### **Princípios Guiadores**
1. **Contexto é Rei**: Ações devem ser relevantes ao tipo do agente
2. **Imediatismo**: Resultados devem aparecer no próprio card
3. **Simplicidade**: Menos cliques, mais valor
4. **Consistência**: Padrão visual e comportamental

### **Riscos a Evitar**
- ❌ Não criar apenas "cards bonitos"
- ❌ Não adicionar complexidade desnecessária
- ❌ Não esquecer a integração com APIs existentes
- ❌ Não negligenciar a experiência mobile

---

## 📚 Recursos e Referências

### **Documentação Existente**
- `PROJECT_CHECKPOINT.md` - Status atual do projeto
- `FLOWISE_API_COMPLETE_GUIDE.md` - Integração Flowise
- `MCP_EXAMPLES.md` - Exemplos de MCP tools
- `ZANAI_FLOWISE_IMPLEMENTATION.md` - Implementação Flowise

### **Componentes Existentes**
- `/src/components/agents/` - Componentes de agentes
- `/src/components/admin/` - Componentes administrativos
- `/src/lib/` - Bibliotecas e utilitários
- `/src/app/admin/api/` - APIs administrativas

### **Arquivos Chave**
- `/src/app/admin/agents/page.tsx` - Página principal de agentes
- `/src/components/flowise-workflow-manager.tsx` - Gerenciador Flowise
- `/src/lib/mcp/` - Ferramentas MCP
- `/src/lib/flowise-client.ts` - Cliente Flowise

---

## 🎯 Conclusão

**A direção é clara**: Transformar cards estáticos em portais funcionais que proporcionem valor imediato ao usuário.

**O caminho é definido**: Usar a infraestrutura existente (Flowise, MCP, Z.AI) para criar ações contextuais por tipo de agente.

**O resultado esperado**: Uma plataforma onde cada agente é uma ferramenta útil que pode ser usada imediatamente para resolver problemas reais.

---

**Próxima Ação**: Começar a implementação analisando os cards existentes e mapeando as ações por tipo de agente.

**Lembrete**: Este documento serve como guia de referência para manter o contexto e direção do projeto sempre atualizados.