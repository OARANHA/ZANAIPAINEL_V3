# 🚀 Zanai + Flowise Integration

Uma integração poderosa que combina o sistema de agentes especializados Zanai com a interface visual de construção de fluxos do Flowise, criando uma plataforma única de análise e automação de projetos.

## 🎯 Visão Geral

Esta integração permite:

- **Executar agentes Zanai através do Flowise** - Use seus agentes especializados (Arquiteto de Software, Cientista de Dados, Engenheiro de DevOps) via interface visual
- **Análise 360° de Projetos** - Obtenha insights completos combinando múltiplas perspectivas especializadas
- **Interface Visual Intuitiva** - Construa fluxos complexos sem escrever código
- **API Unificada** - Integre facilmente com outros sistemas

## 🏗️ Arquitetura

```mermaid
graph TD
    A[Usuário] --> B[Interface Zanai]
    A --> C[Interface Flowise]
    
    B --> D[API Zanai-Flowise]
    C --> D
    
    D --> E[Agentes Zanai]
    D --> F[Nós Flowise]
    
    E --> G[Análise de Arquitetura]
    E --> H[Análise de Dados]
    E --> I[Análise de DevOps]
    
    F --> J[100+ Integrações]
    F --> K[Automação Visual]
    F --> L[Marketplace de Componentes]
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── zanai-flowise/
│   │   └── page.tsx                 # Página de demonstração
│   └── api/
│       └── zanai-flowise/
│           └── route.ts             # API de integração
├── components/
│   └── zanai-flowise-demo.tsx       # Componente principal
└── ...
```

## 🚀 Como Usar

### 1. Acessar a Demonstração

Visite `/zanai-flowise` para ver a integração em ação.

### 2. Testar a Conexão

1. Clique em "Testar Conexão Flowise"
2. Verifique se a conexão com sua instância Flowise está funcionando
3. Confirme os chatflows disponíveis

### 3. Executar Análise 360°

1. Preencha os dados do projeto:
   - Nome do projeto
   - Descrição detalhada
   - Domínio de negócio
   - Tipo de projeto
   - Tamanho da equipe
   - Prazo estimado

2. Clique em "Executar Análise 360°"

3. Aguarde os 3 agentes especializadas:
   - **Arquiteto de Software**: Análise de arquitetura e design patterns
   - **Cientista de Dados**: Análise de dados e métricas
   - **Engenheiro de DevOps**: Análise de infraestrutura e CI/CD

### 4. Analisar Resultados

Cada agente fornecerá:
- **Análise detalhada** com pontos fortes e fracos
- **Recomendações específicas** para o projeto
- **Sugestões de melhorias** e boas práticas
- **Considerações de negócio** relevantes

## 🔧 Configuração

### Variáveis de Ambiente

A integração usa as seguintes configurações:

```typescript
const FLOWISE_API_URL = 'https://aaranha-zania.hf.space';
const FLOWISE_API_KEY = 'wNFL5HJcOA3RwJdKiVTUWqdzigK7OCUwRKo9KEgjenw';
```

### Agentes Configurados

```typescript
const zanaiAgents = [
  {
    id: 'cmed1m191000fs4kjxpx0a0hy',
    name: 'Arquiteto de Software',
    role: 'Análise de arquitetura e design patterns'
  },
  {
    id: 'cmed1m18o0003s4kje0n78m2f', 
    name: 'Cientista de Dados',
    role: 'Análise de dados e métricas'
  },
  {
    id: 'cmed1m195000js4kjqyvhx9s1',
    name: 'Engenheiro de DevOps', 
    role: 'Análise de infraestrutura e CI/CD'
  }
];
```

## 📊 Exemplos de Uso

### Análise de Projeto Web

```typescript
const projetoWeb = {
  name: "Plataforma E-commerce",
  description: "Sistema completo de vendas online com gestão de estoque",
  businessDomain: "E-commerce",
  projectType: "Web App",
  teamSize: "Médio (6-15 pessoas)",
  timeline: "6 meses",
  industry: "Varejo"
};
```

**Resultados Esperados:**
- **Arquiteto**: Recomendações de microservices, design patterns, escalabilidade
- **Cientista de Dados**: Métricas de conversão, análise de comportamento, previsões
- **DevOps**: Estratégia de deploy, monitoramento, segurança, performance

### Análise de Projeto Mobile

```typescript
const projetoMobile = {
  name: "App de Saúde",
  description: "Aplicativo para monitoramento de saúde e consultas online",
  businessDomain: "Saúde",
  projectType: "Mobile App",
  teamSize: "Pequeno (1-5 pessoas)",
  timeline: "3 meses",
  industry: "Healthcare"
};
```

**Resultados Esperados:**
- **Arquiteto**: Arquitetura mobile, padrões MVVM/MVI, offline-first
- **Cientista de Dados**: Análise de dados de saúde, padrões de uso, insights
- **DevOps**: CI/CD para mobile, testes automatizados, deployment stores

## 🔌 API Endpoints

### POST `/api/zanai-flowise`

Executa um agente Zanai através do Flowise.

**Request Body:**
```typescript
{
  agentId: string;           // ID do agente Zanai
  input: string;            // Prompt/instruções para o agente
  context?: any;           // Contexto adicional
}
```

**Response:**
```typescript
{
  agentId: string;
  output: string;           // Resposta do agente
  rawResponse: any;        // Resposta bruta do Flowise
  timestamp: string;
  success: boolean;
}
```

### GET `/api/zanai-flowise`

Testa a conexão com o Flowise e lista chatflows disponíveis.

**Response:**
```typescript
{
  success: boolean;
  message: string;
  chatflowCount: number;
  chatflows: Array<{
    id: string;
    name: string;
    // ... outras propriedades
  }>;
  timestamp: string;
}
```

## 🎨 Interface do Usuário

A interface de demonstração inclui:

### 📋 Formulário de Entrada
- Campos para informações do projeto
- Seletores de domínio e tipo
- Validação de dados

### 🔄 Execução em Tempo Real
- Indicadores de progresso
- Execução paralela de agentes
- Feedback visual constante

### 📊 Resultados Estruturados
- Cards individuais por agente
- Análise formatada
- Lista de recomendações
- Status e timestamps

### 🔧 Controles
- Teste de conexão
- Nova análise
- Exportar resultados

## 🚀 Próximos Passos

### Fase 1: Extensão de Agentes
- [ ] Adicionar mais agentes especializados
- [ ] Suporte a agentes customizados
- [ ] Marketplace de agentes

### Fase 2: Integração Flowise
- [ ] Criar chatflows específicos no Flowise
- [ ] Mapear todos os agentes Zanai para nós Flowise
- [ ] Suporte a fluxos visuais complexos

### Fase 3: Recursos Avançados
- [ ] Agendamento de análises
- [ ] Histórico de execuções
- [ ] Comparação de projetos
- [ ] Exportação em múltiplos formatos

### Fase 4: Integrações Externas
- [ ] Conexão com GitHub/GitLab
- [ ] Integração com ferramentas de PM
- [ ] API pública para terceiros
- [ ] Webhooks e automações

## 🐛 Troubleshooting

### Problemas Comuns

**1. Conexão Flowise Falhou**
- Verifique se a instância Flowise está online
- Confirme a API Key está correta
- Teste o endpoint manualmente

**2. Agentes Não Respondem**
- Verifique os IDs dos agentes
- Confirme se os agentes existem no sistema
- Teste com prompts simples

**3. Resultados Inconsistentes**
- Revise os prompts enviados
- Verifique o contexto fornecido
- Ajuste as instruções específicas

### Debug

```bash
# Testar conexão Flowise
curl -H "Authorization: Bearer wNFL5HJcOA3RwJdKiVTUWqdzigK7OCUwRKo9KEgjenw" \
     https://aaranha-zania.hf.space/api/v1/chatflows

# Testar API local
curl -X POST http://localhost:3000/api/zanai-flowise \
     -H "Content-Type: application/json" \
     -d '{"agentId":"cmed1m191000fs4kjxpx0a0hy","input":"Teste"}'
```

## 📈 Métricas e Monitoramento

### KPIs da Integração
- **Tempo de resposta dos agentes**
- **Taxa de sucesso das análises**
- **Qualidade das recomendações**
- **Satisfação do usuário**

### Monitoramento
```typescript
// Exemplo de métricas
const metrics = {
  executionTime: '2.5s',
  successRate: '98%',
  averageResponseLength: '1250 caracteres',
  userSatisfaction: '4.8/5.0'
};
```

## 🤝 Contribuição

Para contribuir com esta integração:

1. Teste a demonstração atual
2. Reporte bugs ou melhorias
3. Sugira novos agentes ou fluxos
4. Documente casos de uso

## 📄 Licença

Esta integração segue a mesma licença do projeto principal Zanai.

---

## 🎯 Conclusão

A integração Zanai + Flowise representa um passo significativo na democratização do acesso a análises especializadas de projetos. Combinando o poder dos agentes especializados Zanai com a interface visual do Flowise, criamos uma ferramenta única que pode:

- **Analisar projetos em minutos** (não dias/semanas)
- **Fornecer insights multidisciplinares** em uma única interface
- **Escalar facilmente** para qualquer tipo de projeto
- **Integrar-se** com fluxos de trabalho existentes

Esta é apenas o começo. O potencial para expansão e inovação é enorme!

---

**Criado com ❤️ para a comunidade Zanai + Flowise**