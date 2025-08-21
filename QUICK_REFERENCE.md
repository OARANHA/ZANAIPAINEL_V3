# Zania Project - Referência Rápida

## 🎯 Direção Principal
**Transformar cards estáticos em portais funcionais**

### Problema
- Cards atuais: apenas mostram informações
- Usuário precisa navegar para usar funcionalidades
- Experiência passiva

### Solução
- Cards novos: ações específicas por tipo
- Resultados imediatos no próprio card
- Experiência ativa e funcional

---

## 🔍 Mapeamento Rápido de Ações

### Health Agents (🏥)
- 🩺 Analisar Sintomas
- 📊 Monitoramento
- 🏥 Consulta Médica
- 📋 Gerar Relatório

### Business Agents (💼)
- 📈 Analisar Dados
- 💼 Consultoria
- ⚡ Otimizar Processos
- 🔮 Previsão de Tendências

### Education Agents (🎓)
- 📚 Criar Conteúdo
- 🎓 Tutoria
- 📝 Avaliar Aprendizado
- 📅 Plano de Estudos

### Default Agents (🤖)
- 💬 Conversar
- ✅ Executar Tarefa
- 🤝 Assistência
- ❓ Perguntar

---

## 🔧 APIs Disponíveis

### Flowise API
- Endpoint: `/api/flowise-external-sync`
- Uso: Exportar e gerenciar workflows

### MCP Tools
- Endpoint: `/api/mcp/execute`
- Uso: Executar ferramentas específicas

### Z.AI SDK
- Uso: Capacidades de IA generativa

### Database API
- Uso: Persistência de dados e métricas

---

## 📋 Tarefas Imediatas

### Hoje
1. Analisar cards existentes em `/src/components/agents/`
2. Mapear tipos de agentes no banco
3. Identificar APIs para cada tipo

### Amanhã
1. Criar protótipo do card funcional
2. Implementar backend para ações
3. Testar com agentes existentes

---

## 🎨 Design Patterns

### Estrutura do Card
```
┌─────────────────────────┐
│  🏥 Health Agent Pro    │
│  Descrição breve       │
│  ─────────────────────  │
│  🩺 Ação1      📊 Ação2 │
│  🏥 Ação3      📋 Ação4 │
│  ─────────────────────  │
│  Status: Ativo | Usos: X│
└─────────────────────────┘
```

### Estados do Card
1. **idle**: Mostra ações disponíveis
2. **input**: Campo para informações do usuário
3. **processing**: Loading e progresso
4. **result**: Resultado e opções
5. **error**: Erro e retry

---

## 🚀 Princípios Guiadores

1. **Contexto é Rei**: Ações relevantes ao tipo
2. **Imediatismo**: Resultados no próprio card
3. **Simplicidade**: Menos cliques, mais valor
4. **Consistência**: Padrão visual e comportamental

---

## 📁 Arquivos Chave

### Páginas Principais
- `/src/app/admin/agents/page.tsx` - Gestão de agentes
- `/src/app/admin/specialists/page.tsx` - Templates
- `/src/app/admin/compositions/page.tsx` - Workflows
- `/src/app/admin/flowise-workflows/page.tsx` - Flowise
- `/src/app/test-agent/page.tsx` - Testes

### Componentes
- `/src/components/agents/` - Componentes de agentes
- `/src/components/admin/` - Componentes admin
- `/src/components/flowise-workflow-manager.tsx` - Flowise

### APIs
- `/src/app/admin/api/` - APIs administrativas
- `/src/lib/mcp/` - MCP tools
- `/src/lib/flowise-client.ts` - Cliente Flowise

---

## ⚠️ Riscos a Evitar

- ❌ Não criar apenas "cards bonitos"
- ❌ Não adicionar complexidade desnecessária
- ❌ Não esquecer APIs existentes
- ❌ Não negligenciar mobile

---

## 🎯 Métricas de Sucesso

### Engajamento
- Aumento de cliques: 300%
- Redução de navegação: 60%
- Aumento de execuções: 200%

### Técnicas
- Tempo de resposta: < 3s
- Taxa de sucesso: > 95%
- Uso de memória: < 50MB

---

## 📚 Documentação

### Guia Completo
- `PROJECT_DIRECTIONS_GUIDE.md` - Direção completa

### Referências Técnicas
- `PROJECT_CHECKPOINT.md` - Status atual
- `FLOWISE_API_COMPLETE_GUIDE.md` - Flowise
- `MCP_EXAMPLES.md` - MCP tools

---

## 🔄 Lembrete Diário

**Antes de codificar:**
1. Qual o tipo deste agente?
2. Quais ações são relevantes?
3. Qual API devo usar?
4. Como mostrar o resultado?

**Depois de codificar:**
1. Testei todos os tipos?
2. A experiência é imediata?
3. Funciona no mobile?
4. As métricas são boas?

---

**Próxima ação sempre visível:** Transformar cards estáticos em portais funcionais! 🚀