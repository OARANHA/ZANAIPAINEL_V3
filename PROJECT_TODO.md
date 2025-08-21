# Zania Project - TODO: Transformação de Cards em Portais Funcionais

## 🎯 Objetivo Principal
Transformar cards estáticos em portais funcionais com ações contextuais baseadas no tipo do agente.

---

## 📋 Fases do Projeto

### Fase 1: Análise e Mapeamento (1-2 dias)
- [ ] **Analisar estrutura atual dos cards**
  - [ ] Examinar `/src/components/agents/`
  - [ ] Entender como os cards são renderizados atualmente
  - [ ] Identificar pontos de integração para novas funcionalidades

- [ ] **Mapear todos os tipos de agentes existentes**
  - [ ] Consultar banco de dados para tipos de agentes
  - [ ] Documentar cada tipo e suas características
  - [ ] Criar enum de tipos para referência

- [ ] **Identificar APIs disponíveis para cada tipo**
  - [ ] Mapear endpoints Flowise por tipo
  - [ ] Identificar MCP tools relevantes
  - [ ] Documentar capacidades do Z.AI SDK

- [ ] **Definir ações específicas por tipo**
  - [ ] Health: consulta, análise, monitoramento, relatório
  - [ ] Business: análise, consultoria, otimização, previsão
  - [ ] Education: conteúdo, tutoria, avaliação, planejamento
  - [ ] Default: conversa, tarefa, assistência, perguntas

### Fase 2: Desenvolvimento do Backend (2-3 dias)
- [ ] **Criar endpoint unificado para ações de cards**
  - [ ] Implementar `/api/card/execute`
  - [ ] Suportar diferentes tipos de ações
  - [ ] Integrar com sistema de autenticação
  - [ ] Adicionar logging e métricas

- [ ] **Implementar integração com MCP tools**
  - [ ] Mapear ações para MCP tools específicas
  - [ ] Criar sistema de contexto dinâmico
  - [ ] Implementar tratamento de erros
  - [ ] Adicionar validação de input

- [ ] **Criar sistema de contexto por tipo**
  - [ ] Definir campos de contexto por tipo de agente
  - [ ] Implementar coleta de contexto automático
  - [ ] Criar sistema de sugestões de input
  - [ ] Adicionar histórico de contexto

- [ ] **Adicionar métricas de uso**
  - [ ] Track de execuções por tipo
  - [ ] Tempo médio de resposta
  - [ ] Taxa de sucesso por ação
  - [ ] Usuários mais ativos

### Fase 3: Desenvolvimento do Frontend (3-4 dias)
- [ ] **Criar componente de card funcional**
  - [ ] `FunctionalCard.tsx` - componente principal
  - [ ] `CardAction.tsx` - componente de botões de ação
  - [ ] `CardContext.tsx` - componente de input contextual
  - [ ] `CardResult.tsx` - componente de exibição de resultados

- [ ] **Implementar estados do card**
  - [ ] Estado `idle` - mostrar ações disponíveis
  - [ ] Estado `input` - coletar informações do usuário
  - [ ] Estado `processing` - mostrar loading e progresso
  - [ ] Estado `result` - exibir resultado e opções
  - [ ] Estado `error` - mostrar erro e opções de retry

- [ ] **Adicionar ações contextuais**
  - [ ] Mapear ações por tipo de agente
  - [ ] Criar sistema de ícones e cores
  - [ ] Implementar hover effects e micro-interações
  - [ ] Adicionar tooltips e ajuda contextual

- [ ] **Criar sistema de inputs dinâmicos**
  - [ ] Inputs baseados no tipo de ação
  - [ ] Validação em tempo real
  - [ ] Sugestões e autocompletar
  - [ ] Suporte para arquivos e mídia

### Fase 4: Integração e Testes (2-3 dias)
- [ ] **Integrar cards nas páginas existentes**
  - [ ] Atualizar `/admin/agents` para usar novos cards
  - [ ] Atualizar `/admin/specialists` para usar novos cards
  - [ ] Atualizar `/admin/compositions` para usar novos cards
  - [ ] Garantir compatibilidade com layout existente

- [ ] **Testar todas as ações e APIs**
  - [ ] Testar cada tipo de agente
  - [ ] Testar cada ação específica
  - [ ] Testar integração com APIs externas
  - [ ] Testar tratamento de erros

- [ ] **Validar experiência do usuário**
  - [ ] Testar fluxo completo do usuário
  - [ ] Testar em diferentes dispositivos
  - [ ] Testar acessibilidade
  - [ ] Coletar feedback inicial

- [ ] **Otimizar performance**
  - [ ] Otimizar tempo de carregamento
  - [ ] Reduzir tamanho dos bundles
  - [ ] Implementar lazy loading
  - [ ] Otimizar uso de memória

### Fase 5: Refinamento e Documentação (1-2 dias)
- [ ] **Refinar UX baseado em feedback**
  - [ ] Ajustar animações e transições
  - [ ] Melhorar mensagens de erro
  - [ ] Otimizar disposição dos elementos
  - [ ] Adicionar mais micro-interações

- [ ] **Otimizar animações e transições**
  - [ ] Suavizar transições entre estados
  - [ ] Adicionar animações de loading
  - [ ] Implementar feedback tátil (mobile)
  - [ ] Otimizar para dispositivos lentos

- [ ] **Documentar novo sistema**
  - [ ] Atualizar `PROJECT_DIRECTIONS_GUIDE.md`
  - [ ] Criar guia de uso dos novos cards
  - [ ] Documentar APIs e endpoints
  - [ ] Adicionar exemplos de uso

- [ ] **Preparar para deploy**
  - [ ] Testar em ambiente de staging
  - [ ] Verificar compatibilidade com browsers
  - [ ] Otimizar para produção
  - [ ] Preparar rollback plan

---

## 🎯 Tarefas Imediatas (Hoje/Amanhã)

### Hoje
- [ ] **Analisar cards existentes**
  - [ ] Abrir `/src/components/agents/` e examinar estrutura
  - [ ] Entender como os cards são implementados
  - [ ] Identificar onde adicionar novas funcionalidades

- [ ] **Mapear tipos de agentes**
  - [ ] Consultar banco de dados via Prisma
  - [ ] Listar todos os tipos de agentes existentes
  - [ ] Documentar características de cada tipo

- [ ] **Identificar APIs disponíveis**
  - [ ] Examinar `/src/lib/mcp/` para tools disponíveis
  - [ ] Analisar `/src/lib/flowise-client.ts` para integração Flowise
  - [ ] Verificar endpoints existentes em `/src/app/admin/api/`

### Amanhã
- [ ] **Criar protótipo do card funcional**
  - [ ] Implementar versão básica do `FunctionalCard`
  - [ ] Adicionar ações estáticas para visualização
  - [ ] Testar layout e responsividade

- [ ] **Implementar backend para ações**
  - [ ] Criar endpoint `/api/card/execute`
  - [ ] Implementar lógica básica de roteamento
  - [ ] Testar integração com MCP tools

- [ ] **Testar com agentes existentes**
  - [ ] Selecionar 2-3 agentes para teste inicial
  - [ ] Implementar ações específicas para esses agentes
  - [ ] Validar fluxo completo

---

## 🔧 Tarefas Técnicas Específicas

### Backend Tasks
- [ ] **Criar endpoint `/api/card/execute`**
  - [ ] Definir schema de request/response
  - [ ] Implementar autenticação e autorização
  - [ ] Adicionar rate limiting
  - [ ] Implementar logging estruturado

- [ ] **Integrar com MCP tools**
  - [ ] Mapear ações para tools específicas
  - [ ] Implementar sistema de contexto
  - [ ] Adicionar tratamento de erros
  - [ ] Implementar retry mechanism

- [ ] **Criar sistema de métricas**
  - [ ] Track de execuções por tipo
  - [ ] Monitorar tempo de resposta
  - [ ] Calcular taxas de sucesso
  - [ ] Implementar alertas para falhas

### Frontend Tasks
- [ ] **Criar `FunctionalCard` component**
  - [ ] Implementar estados do card
  - [ ] Adicionar sistema de ações contextuais
  - [ ] Implementar input dinâmico
  - [ ] Adicionar exibição de resultados

- [ ] **Criar subcomponentes**
  - [ ] `CardAction` - botões de ação
  - [ ] `CardContext` - input contextual
  - [ ] `CardResult` - exibição de resultados
  - [ ] `CardError` - tratamento de erros

- [ ] **Implementar design system**
  - [ ] Definir cores por tipo de agente
  - [ ] Criar ícones consistentes
  - [ ] Implementar animações
  - [ ] Adicionar responsive design

### Integration Tasks
- [ ] **Atualizar páginas existentes**
  - [ ] Modificar `/admin/agents/page.tsx`
  - [ ] Modificar `/admin/specialists/page.tsx`
  - [ ] Modificar `/admin/compositions/page.tsx`
  - [ ] Testar compatibilidade

- [ ] **Testar integração completa**
  - [ ] Testar fluxo do usuário
  - [ ] Testar em diferentes dispositivos
  - [ ] Testar acessibilidade
  - [ ] Testar performance

---

## 📊 Métricas e Monitoramento

### Métricas de Engajamento
- [ ] **Aumentar cliques em cards** (meta: 300%)
  - [ ] Implementar track de cliques
  - [ ] Monitorar antes/depois
  - [ ] A/B test diferentes layouts

- [ ] **Reduzir navegação para outras páginas** (meta: 60%)
  - [ ] Track de navegação
  - [ ] Monitorar tempo na página
  - [ ] Medir taxa de rejeição

- [ ] **Aumentar execuções de agentes** (meta: 200%)
  - [ ] Monitorar execuções por tipo
  - [ ] Track de sucesso/falha
  - [ ] Analisar padrões de uso

### Métricas Técnicas
- [ ] **Tempo de resposta das ações** (meta: < 3 segundos)
  - [ ] Monitorar tempo de API
  - [ ] Otimizar queries
  - [ ] Implementar caching

- [ ] **Taxa de sucesso das execuções** (meta: > 95%)
  - [ ] Monitorar erros
  - [ ] Implementar retry
  - [ ] Melhorar tratamento de erros

- [ ] **Uso de memória dos componentes** (meta: < 50MB)
  - [ ] Profile de memória
  - [ ] Otimizar renders
  - [ ] Implementar lazy loading

---

## 🚀 Checkpoints de Progresso

### Checkpoint 1: Análise Completa (Dia 2)
- [ ] Todos os tipos de agentes mapeados
- [ ] APIs disponíveis identificadas
- [ ] Ações específicas definidas
- [ ] Protótipo de card criado

### Checkpoint 2: Backend Funcional (Dia 5)
- [ ] Endpoint `/api/card/execute` funcionando
- [ ] Integração com MCP tools completa
- [ ] Sistema de contexto implementado
- [ ] Métricas básicas coletando

### Checkpoint 3: Frontend Funcional (Dia 9)
- [ ] Componente `FunctionalCard` completo
- [ ] Todos os estados implementados
- [ ] Ações contextuais funcionando
- [ ] Design system aplicado

### Checkpoint 4: Integração Completa (Dia 12)
- [ ] Todas as páginas atualizadas
- [ ] Testes completos realizados
- [ ] UX validada com usuários
- [ ] Performance otimizada

### Checkpoint 5: Pronto para Deploy (Dia 14)
- [ ] Documentação completa
- [ ] Testes finais aprovados
- [ ] Performance dentro das metas
- [ ] Deploy realizado com sucesso

---

## 📝 Notas Importantes

### Lembre-se sempre:
- **O objetivo é funcionalidade, não apenas informação**
- **Cada card deve ser uma ferramenta útil**
- **O usuário deve obter valor imediato**
- **Use as APIs existentes (Flowise, MCP, Z.AI)**

### Princípios de design:
1. **Contexto é Rei**: Ações relevantes ao tipo
2. **Imediatismo**: Resultados no próprio card
3. **Simplicidade**: Menos cliques, mais valor
4. **Consistência**: Padrão visual e comportamental

### Riscos a mitigar:
- ❌ Não criar apenas "cards bonitos"
- ❌ Não adicionar complexidade desnecessária
- ❌ Não esquecer a integração com APIs existentes
- ❌ Não negligenciar a experiência mobile

---

## 🔄 Atualizações do TODO

### Como atualizar:
1. Marcar tarefas como `[x]` quando completadas
2. Adicionar novas tarefas conforme necessário
3. Atualizar prazos se necessário
4. Adicionar notas sobre problemas encontrados

### Frequência de atualização:
- **Diariamente**: Revisar tarefas do dia
- **Semanalmente**: Revisar progresso geral
- **Ao final de cada fase**: Atualizar checkpoint

---

**Última atualização**: 2025-06-23  
**Próxima revisão**: 2025-06-24  
**Status do projeto**: Em andamento - Fase 1