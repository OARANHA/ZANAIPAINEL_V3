# Flowise Node Catalog System

Este sistema permite catalogar e gerenciar os nodes do Flowise diretamente do código-fonte, facilitando a integração com nossa plataforma de agentes.

## 🚀 Funcionalidades

- **Catálogo Automático**: Extrai informações de nodes diretamente do código-fonte do Flowise
- **Busca Inteligente**: Permite buscar nodes por nome, descrição ou categoria
- **Recomendações**: Sugere nodes baseados no tipo de agente
- **Geração de Configuração**: Cria configurações básicas do Flowise automaticamente
- **API REST**: Interface completa para acesso programático

## 📋 Instalação e Configuração

### 1. Clonar o Flowise

```bash
git clone https://github.com/FlowiseAI/Flowise.git
cd Flowise
```

### 2. Executar o Script de Catalogação

```bash
# A partir do diretório raiz do projeto
node scripts/catalog-flowise-nodes.mjs
```

### 3. Verificar Resultados

O script gerará dois arquivos:
- `catalog.flowise.nodes.json` - Catálogo em formato JSON
- `catalog.flowise.nodes.md` - Catálogo em formato Markdown

## 📖 Uso

### Via API

#### Obter catálogo completo
```bash
GET /api/flowise-nodes?action=catalog
```

#### Buscar nodes
```bash
GET /api/flowise-nodes?action=search&query=chat
```

#### Obter nodes por categoria
```bash
GET /api/flowise-nodes?action=category&category=LLM
```

#### Obter nodes recomendados
```bash
GET /api/flowise-nodes?action=recommended&agentType=chat
```

#### Gerar configuração
```bash
POST /api/flowise-nodes
{
  "action": "generate-config",
  "agentData": {
    "name": "Meu Agente",
    "type": "chat",
    "systemPrompt": "You are a helpful assistant"
  }
}
```

#### Obter estatísticas
```bash
GET /api/flowise-nodes?action=stats
```

### Via Componente React

```tsx
import { FlowiseNodeCatalog } from '@/components/FlowiseNodeCatalog';

function MyComponent() {
  return (
    <FlowiseNodeCatalog
      agentType="chat"
      onNodeSelect={(node) => console.log('Node selecionado:', node)}
      onGenerateConfig={(nodes) => console.log('Gerar config com:', nodes)}
    />
  );
}
```

## 🔧 Estrutura do Catálogo

Cada node no catálogo contém:

```typescript
interface FlowiseNode {
  categoria: string;     // Categoria do node (ex: "LLM", "Chat", "Document")
  label: string;         // Nome do node
  desc: string;          // Descrição do node
  path: string;          // Caminho do arquivo no repositório
  inputs: string;        // Inputs do node (best-effort parsing)
  outputs: string;       // Outputs do node (best-effort parsing)
}
```

## 🎯 Recomendações por Tipo de Agente

O sistema sugere nodes diferentes baseado no tipo de agente:

- **chat**: Nodes de Chat, Prompt, Memory, LLM
- **assistant**: Nodes de Assistant, Tools, Agent, Memory
- **rag**: Nodes de Document, Embeddings, Vector Store, Retriever
- **workflow**: Nodes de Logic, Condition, Loop, Variable
- **api**: Nodes de HTTP Request, Webhook, API, Function

## 📊 Exemplo de Resposta da API

```json
{
  "nodes": [
    {
      "categoria": "LLM",
      "label": "OpenAI",
      "desc": "OpenAI API for chat completion",
      "path": "Flowise/packages/components/nodes/llm/OpenAI.ts",
      "inputs": "{ type: 'option', label: 'Model Name', name: 'modelName' }",
      "outputs": "{ type: 'document', label: 'Document' }"
    }
  ],
  "categories": ["LLM", "Chat", "Document", "Memory"],
  "totalNodes": 150,
  "lastUpdated": "2024-08-20T18:00:00.000Z"
}
```

## 🔄 Atualização do Catálogo

O catálogo é considerado válido por 7 dias. Para atualizá-lo:

1. Atualize o repositório do Flowise:
   ```bash
   cd Flowise
   git pull origin main
   ```

2. Execute novamente o script de catalogação:
   ```bash
   node scripts/catalog-flowise-nodes.mjs
   ```

## 🛠️ Scripts Úteis

### Script de Setup Automático
```bash
./scripts/setup-flowise-catalog.sh
```

Este script:
- Clona o Flowise (se necessário)
- Executa o script de catalogação
- Mostra estatísticas do catálogo gerado

### Verificar Status do Catálogo
```typescript
import { isCatalogValid } from '@/lib/flowise-node-catalog';

const isValid = await isCatalogValid();
console.log('Catálogo válido:', isValid);
```

## 🎨 Integração com Exportação de Agentes

O catálogo de nodes é integrado com o sistema de exportação de agentes para Flowise:

1. **Seleção de Nodes**: O usuário pode selecionar nodes recomendados
2. **Geração de Configuração**: Configuração básica é gerada automaticamente
3. **Personalização**: O usuário pode customizar a configuração antes da exportação

## 📝 Notas

- O script de catalogação faz parsing "best-effort" dos inputs/outputs
- Nem todos os nodes podem ter informações completas de inputs/outputs
- O catálogo deve ser regenerado quando o Flowise for atualizado
- O sistema funciona com Node.js 18+

## 🔍 Troubleshooting

### Erro: "Pasta não encontrada"
- Verifique se o repositório do Flowise foi clonado corretamente
- Certifique-se de que está executando o script a partir do diretório raiz

### Erro: "Catálogo não encontrado ou desatualizado"
- Execute o script de catalogação para gerar os arquivos
- Verifique se os arquivos `catalog.flowise.nodes.json` e `catalog.flowise.nodes.md` existem

### Nodes sem informações de inputs/outputs
- Isso é normal para nodes complexos ou com definições não padrão
- O script faz parsing básico e pode não capturar todas as informações

## 📈 Benefícios

1. **Documentação Automática**: Mantém o catálogo sempre atualizado
2. **Integração Facilitada**: Facilita a seleção de nodes para exportação
3. **Descoberta de Nodes**: Ajuda a descobrir novos nodes disponíveis
4. **Consistência**: Garante que todos usem a mesma referência de nodes
5. **Eficiência**: Reduz o tempo manual de catalogação e documentação