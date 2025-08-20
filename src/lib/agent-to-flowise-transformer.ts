/**
 * Transformador de dados de Agent para Flowise Workflow
 * Converte a estrutura de dados do sistema Zanai para o formato esperado pelo Flowise
 * Suporta múltiplos templates baseados no tipo de agente
 */

export interface AgentData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'template' | 'custom' | 'composed' | 'professional' | 'assistant' | 'tool';
  config: string; // YAML
  knowledge?: string; // Markdown
  roleDefinition?: string;
  customInstructions?: string;
  workspaceId: string;
  groups?: any[];
  // Campos adicionais para melhor detecção do tipo
  category?: string;
  specialization?: string;
  capabilities?: string[];
}

export interface FlowiseWorkflowData {
  id: string;
  name: string;
  description?: string;
  type: 'CHATFLOW' | 'AGENTFLOW' | 'MULTIAGENT' | 'ASSISTANT';
  flowData: string; // JSON string
  deployed?: boolean;
  isPublic?: boolean;
  category?: string;
  chatbotConfig?: string; // JSON string
  apiConfig?: string; // JSON string
  workspaceId?: string;
}

export interface FlowiseNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  positionAbsolute?: { x: number; y: number };
  width?: number;
  height?: number;
  selected?: boolean;
  dragging?: boolean;
  data: {
    id: string;
    label: string;
    version?: number;
    name: string;
    type: string;
    baseClasses?: string[];
    category: string;
    description?: string;
    inputParams?: FlowiseInputParam[];
    inputAnchors?: FlowiseAnchor[];
    inputs?: Record<string, any>;
    outputAnchors?: FlowiseAnchor[];
    outputs?: Record<string, any>;
    selected?: boolean;
    [key: string]: any;
  };
}

export interface FlowiseInputParam {
  label: string;
  name: string;
  type: string;
  description?: string;
  default?: any;
  optional?: boolean;
  additionalParams?: boolean;
  id?: string;
  rows?: number;
  placeholder?: string;
  step?: number;
  loadMethod?: string;
  credentialNames?: string[];
  options?: Array<{ label: string; name: string }>;
  display?: boolean;
  show?: Record<string, any>;
}

export interface FlowiseAnchor {
  id: string;
  name: string;
  label: string;
  type?: string;
  description?: string;
  optional?: boolean;
  list?: boolean;
  display?: boolean;
}

export interface FlowiseEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type?: string;
  data?: { label?: string };
}

/**
 * Detecta o tipo de template adequado baseado nas características do agente
 * Utiliza API Z quando disponível para decisões mais inteligentes
 */
async function detectAgentTemplate(agent: AgentData): Promise<string> {
  const config = parseAgentConfig(agent.config);
  
  console.log('🔍 Detectando template para agente:', {
    name: agent.name,
    type: agent.type,
    capabilities: agent.capabilities,
    hasKnowledge: !!agent.knowledge,
    configKeys: Object.keys(config || {})
  });
  
  // Se o agente tem tipo específico, usar diretamente
  if (agent.type === 'professional' || agent.name.toLowerCase().includes('profissional')) {
    console.log('✅ Template detectado: professional (baseado no nome/tipo)');
    return 'professional';
  }
  
  if (agent.type === 'assistant' || agent.name.toLowerCase().includes('assistente')) {
    console.log('✅ Template detectado: assistant (baseado no nome/tipo)');
    return 'assistant';
  }
  
  if (agent.type === 'tool' || agent.category === 'tools') {
    console.log('✅ Template detectado: tool (baseado no tipo/categoria)');
    return 'tool';
  }
  
  // Detectar baseado em capacidades e configuração
  if (agent.capabilities?.includes('function_calling') || config?.tools?.length > 0) {
    console.log('✅ Template detectado: tool (baseado em capacidades)');
    return 'tool';
  }
  
  if (agent.capabilities?.includes('knowledge_base') || agent.knowledge) {
    console.log('✅ Template detectado: knowledge (baseado em conhecimento)');
    return 'knowledge';
  }
  
  if (agent.specialization === 'chat' || config?.systemPrompt?.includes('chat')) {
    console.log('✅ Template detectado: chat (baseado em especialização)');
    return 'chat';
  }
  
  // Padrão: usar template baseado no tipo original
  let templateType = 'chat'; // Template padrão
  switch (agent.type) {
    case 'template':
      templateType = 'chat';
      break;
    case 'custom':
      templateType = 'custom';
      break;
    case 'composed':
      templateType = 'composed';
      break;
    default:
      templateType = 'chat';
  }
  
  console.log('✅ Template detectado:', templateType, '(baseado no tipo original)');
  return templateType;
}

/**
 * Transforma dados de um Agent para o formato FlowiseWorkflow usando template dinâmico
 */
export async function transformAgentToFlowiseWorkflow(agent: AgentData): Promise<FlowiseWorkflowData> {
  console.log('🔄 Transformando agente para Flowise workflow:', agent.name);

  // Detectar o tipo de template adequado
  console.log('🔍 Iniciando detecção de template...');
  const templateType = await detectAgentTemplate(agent);
  console.log('📋 Template detectado:', templateType);
  
  // Extrair configuração do agente
  console.log('📝 Extraindo configuração do agente...');
  const agentConfig = parseAgentConfig(agent.config);
  console.log('✅ Configuração extraída:', Object.keys(agentConfig || {}));
  
  // Gerar nós e conexões baseado no template detectado
  console.log('🔗 Gerando nós e conexões...');
  const { nodes, edges } = generateTemplateNodesAndEdges(agent, agentConfig, templateType);
  console.log('✅ Nós e conexões gerados:', { nodesCount: nodes.length, edgesCount: edges.length });
  
  // Gerar flowData no formato esperado pelo Flowise
  console.log('📊 Gerando flowData...');
  const flowData = {
    nodes,
    edges,
    viewport: { x: 0, y: 0, zoom: 1 }
  };
  console.log('✅ flowData gerado');

  // Gerar chatbotConfig baseado nas configurações do agente
  console.log('💬 Gerando chatbotConfig...');
  const chatbotConfig = generateChatbotConfig(agent, agentConfig, templateType);
  console.log('✅ chatbotConfig gerado');
  
  // Gerar apiConfig baseado nas configurações do agente
  console.log('🔌 Gerando apiConfig...');
  const apiConfig = generateApiConfig(agent, agentConfig, templateType);
  console.log('✅ apiConfig gerado');

  // Determinar o tipo do workflow no Flowise baseado no template
  console.log('🏷️ Determinando tipo do workflow...');
  const workflowType = getWorkflowType(templateType);
  console.log('✅ Tipo do workflow determinado:', workflowType);

  const transformed: FlowiseWorkflowData = {
    id: agent.id,
    name: agent.name,
    description: agent.description || `Agente ${agent.name} transformado para workflow Flowise`,
    type: workflowType,
    flowData: JSON.stringify(flowData),
    deployed: false,
    isPublic: false,
    category: getCategoryForTemplate(templateType),
    chatbotConfig: JSON.stringify(chatbotConfig),
    apiConfig: JSON.stringify(apiConfig),
    workspaceId: agent.workspaceId
  };

  console.log('✅ Transformação concluída:', {
    originalType: agent.type,
    templateType,
    transformedType: workflowType,
    nodesCount: nodes.length,
    edgesCount: edges.length,
    hasChatbotConfig: !!chatbotConfig,
    hasApiConfig: !!apiConfig
  });

  return transformed;
}

/**
 * Faz parse da configuração YAML do agente
 */
function parseAgentConfig(configYaml: string): any {
  try {
    // Tentar fazer parse como JSON primeiro
    try {
      return JSON.parse(configYaml);
    } catch (jsonError) {
      // Se falhar o parse JSON, retornar configuração padrão
      console.warn('Não foi possível fazer parse da config como JSON, usando padrão:', jsonError);
      return {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2000,
        category: 'general'
      };
    }
  } catch (error) {
    console.warn('Erro ao fazer parse da configuração do agente:', error);
    return {
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      category: 'general'
    };
  }
}

/**
 * Obtém o tipo de workflow Flowise baseado no template
 */
function getWorkflowType(templateType: string): 'CHATFLOW' | 'AGENTFLOW' | 'MULTIAGENT' | 'ASSISTANT' {
  switch (templateType) {
    case 'tool':
      return 'AGENTFLOW';
    case 'professional':
    case 'assistant':
      return 'ASSISTANT';
    case 'composed':
      return 'MULTIAGENT';
    case 'chat':
    case 'knowledge':
    case 'custom':
    default:
      return 'CHATFLOW';
  }
}

/**
 * Obtém a categoria baseado no template
 */
function getCategoryForTemplate(templateType: string): string {
  switch (templateType) {
    case 'tool':
      return 'Tools';
    case 'professional':
      return 'Professional';
    case 'assistant':
      return 'Assistants';
    case 'knowledge':
      return 'Knowledge Base';
    case 'chat':
      return 'Chat';
    case 'composed':
      return 'Multi-Agent';
    case 'custom':
    default:
      return 'Custom';
  }
}

/**
 * Gera nós e conexões baseado no template detectado
 */
function generateTemplateNodesAndEdges(agent: AgentData, config: any, templateType: string): { nodes: FlowiseNode[], edges: FlowiseEdge[] } {
  switch (templateType) {
    case 'professional':
      return generateProfessionalAssistantNodesAndEdges(agent, config);
    case 'assistant':
      return generateAssistantNodesAndEdges(agent, config);
    case 'tool':
      return generateToolAgentNodesAndEdges(agent, config);
    case 'knowledge':
      return generateKnowledgeAgentNodesAndEdges(agent, config);
    case 'chat':
      return generateChatAgentNodesAndEdges(agent, config);
    case 'composed':
      return generateComposedAgentNodesAndEdges(agent, config);
    case 'custom':
    default:
      return generateCustomAgentNodesAndEdges(agent, config);
  }
}

/**
 * Gera nós e conexões para Assistente Profissional - Template específico com estrutura completa
 */
function generateProfessionalAssistantNodesAndEdges(agent: AgentData, config: any): { nodes: FlowiseNode[], edges: FlowiseEdge[] } {
  const nodes: FlowiseNode[] = [];
  const edges: FlowiseEdge[] = [];

  // 1. ChatOpenAI Node - Modelo de linguagem principal
  const chatOpenAINode: FlowiseNode = {
    id: 'chatOpenAI_0',
    type: 'customNode',
    position: { x: 74.4955, y: 35.2848 },
    positionAbsolute: { x: 74.4955, y: 35.2848 },
    width: 300,
    height: 771,
    selected: false,
    dragging: false,
    data: {
      id: 'chatOpenAI_0',
      label: 'ChatOpenAI',
      version: 8.2,
      name: 'chatOpenAI',
      type: 'ChatOpenAI',
      baseClasses: ['ChatOpenAI', 'BaseChatModel', 'BaseLanguageModel', 'Runnable'],
      category: 'Chat Models',
      description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
      inputParams: [
        {
          label: 'Connect Credential',
          name: 'credential',
          type: 'credential',
          credentialNames: ['openAIApi'],
          id: 'chatOpenAI_0-input-credential-credential',
          display: true
        },
        {
          label: 'Model Name',
          name: 'modelName',
          type: 'asyncOptions',
          loadMethod: 'listModels',
          default: 'gpt-4o-mini',
          id: 'chatOpenAI_0-input-modelName-asyncOptions',
          display: true
        },
        {
          label: 'Temperature',
          name: 'temperature',
          type: 'number',
          step: 0.1,
          default: 0.7,
          optional: true,
          id: 'chatOpenAI_0-input-temperature-number',
          display: true
        },
        {
          label: 'Max Tokens',
          name: 'maxTokens',
          type: 'number',
          step: 1,
          optional: true,
          additionalParams: true,
          id: 'chatOpenAI_0-input-maxTokens-number',
          display: true
        },
        {
          label: 'Allow Image Uploads',
          name: 'allowImageUploads',
          type: 'boolean',
          description: 'Allow image input. Refer to the docs for more details.',
          default: false,
          optional: true,
          id: 'chatOpenAI_0-input-allowImageUploads-boolean',
          display: true
        }
      ],
      inputAnchors: [
        {
          label: 'Cache',
          name: 'cache',
          type: 'BaseCache',
          optional: true,
          id: 'chatOpenAI_0-input-cache-BaseCache',
          display: true
        }
      ],
      inputs: {
        cache: '',
        modelName: config.model || 'gpt-4o-mini',
        temperature: config.temperature || 0.7,
        maxTokens: config.maxTokens || '',
        allowImageUploads: false
      },
      outputAnchors: [
        {
          id: 'chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable',
          name: 'chatOpenAI',
          label: 'ChatOpenAI',
          description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
          type: 'ChatOpenAI | BaseChatModel | BaseLanguageModel | Runnable'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(chatOpenAINode);

  // 2. Human Message Node - Entrada do usuário
  const humanMessageNode: FlowiseNode = {
    id: 'humanMessage_0',
    type: 'customNode',
    position: { x: 450.5125, y: 72.4059 },
    positionAbsolute: { x: 450.5125, y: 72.4059 },
    width: 300,
    height: 200,
    selected: false,
    dragging: false,
    data: {
      id: 'humanMessage_0',
      label: 'Human Message',
      version: 1,
      name: 'humanMessage',
      type: 'HumanMessage',
      baseClasses: ['HumanMessage', 'BaseMessage'],
      category: 'Messages',
      description: 'Human message input',
      inputParams: [
        {
          label: 'Text',
          name: 'text',
          type: 'string',
          rows: 3,
          placeholder: 'Enter your message here...',
          id: 'humanMessage_0-input-text-string',
          display: true
        }
      ],
      inputAnchors: [],
      inputs: {
        text: '{{chatInput}}'
      },
      outputAnchors: [
        {
          id: 'humanMessage_0-output-humanMessage-HumanMessage|BaseMessage',
          name: 'humanMessage',
          label: 'HumanMessage',
          type: 'HumanMessage | BaseMessage'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(humanMessageNode);

  // 3. Prompt Template Node - Template de prompt personalizado
  const promptTemplateNode: FlowiseNode = {
    id: 'promptTemplate_0',
    type: 'customNode',
    position: { x: 800.5125, y: 72.4059 },
    positionAbsolute: { x: 800.5125, y: 72.4059 },
    width: 300,
    height: 300,
    selected: false,
    dragging: false,
    data: {
      id: 'promptTemplate_0',
      label: 'Prompt Template',
      version: 1,
      name: 'promptTemplate',
      type: 'PromptTemplate',
      baseClasses: ['PromptTemplate', 'BasePromptTemplate'],
      category: 'Prompts',
      description: 'Schema to represent a prompt for an LLM',
      inputParams: [
        {
          label: 'Template',
          name: 'template',
          type: 'string',
          rows: 8,
          placeholder: 'Enter your template here...',
          id: 'promptTemplate_0-input-template-string',
          display: true
        }
      ],
      inputAnchors: [],
      inputs: {
        template: generateProfessionalPromptTemplate(agent, config)
      },
      outputAnchors: [
        {
          id: 'promptTemplate_0-output-promptTemplate-PromptTemplate|BasePromptTemplate',
          name: 'promptTemplate',
          label: 'PromptTemplate',
          type: 'PromptTemplate | BasePromptTemplate'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(promptTemplateNode);

  // 4. LLM Chain Node - Cadeia principal de processamento
  const llmChainNode: FlowiseNode = {
    id: 'llmChain_0',
    type: 'customNode',
    position: { x: 1200.6757, y: 208.1858 },
    positionAbsolute: { x: 1200.6757, y: 208.1858 },
    width: 300,
    height: 400,
    selected: false,
    dragging: false,
    data: {
      id: 'llmChain_0',
      label: 'LLM Chain',
      version: 1,
      name: 'llmChain',
      type: 'LLMChain',
      baseClasses: ['LLMChain', 'BaseChain', 'Runnable'],
      category: 'Chains',
      description: 'Chain to run queries against LLMs',
      inputParams: [
        {
          label: 'Memory',
          name: 'memory',
          type: 'BaseMemory',
          optional: true,
          id: 'llmChain_0-input-memory-BaseMemory',
          display: true
        }
      ],
      inputAnchors: [
        {
          label: 'LLM',
          name: 'llm',
          type: 'BaseLanguageModel',
          id: 'llmChain_0-input-llm-BaseLanguageModel',
          display: true
        },
        {
          label: 'Prompt',
          name: 'prompt',
          type: 'BasePromptTemplate',
          id: 'llmChain_0-input-prompt-BasePromptTemplate',
          display: true
        }
      ],
      inputs: {
        llm: '{{chatOpenAI_0.data.instance}}',
        prompt: '{{promptTemplate_0.data.instance}}',
        memory: ''
      },
      outputAnchors: [
        {
          id: 'llmChain_0-output-llmChain-LLMChain|BaseChain|Runnable',
          name: 'llmChain',
          label: 'LLMChain',
          type: 'LLMChain | BaseChain | Runnable'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(llmChainNode);

  // 5. Buffer Memory Node - Memória do chat
  const bufferMemoryNode: FlowiseNode = {
    id: 'bufferMemory_1',
    type: 'customNode',
    position: { x: 607.6261, y: 584.7921 },
    positionAbsolute: { x: 607.6261, y: 584.7921 },
    width: 300,
    height: 258,
    selected: false,
    dragging: false,
    data: {
      id: 'bufferMemory_1',
      label: 'Buffer Memory',
      version: 2,
      name: 'bufferMemory',
      type: 'BufferMemory',
      baseClasses: ['BufferMemory', 'BaseChatMemory', 'BaseMemory'],
      category: 'Memory',
      description: 'Retrieve chat messages stored in database',
      inputParams: [
        {
          label: 'Session Id',
          name: 'sessionId',
          type: 'string',
          description: 'If not specified, a random id will be used.',
          default: '',
          additionalParams: true,
          optional: true,
          id: 'bufferMemory_1-input-sessionId-string'
        },
        {
          label: 'Memory Key',
          name: 'memoryKey',
          type: 'string',
          default: 'chat_history',
          additionalParams: true,
          id: 'bufferMemory_1-input-memoryKey-string'
        }
      ],
      inputAnchors: [],
      inputs: {
        sessionId: '',
        memoryKey: 'chat_history'
      },
      outputAnchors: [
        {
          id: 'bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory',
          name: 'bufferMemory',
          label: 'BufferMemory',
          type: 'BufferMemory | BaseChatMemory | BaseMemory'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(bufferMemoryNode);

  // 6. Conversational Retrieval QA Chain Node - Para conhecimento base
  if (agent.knowledge) {
    const retrievalNode: FlowiseNode = {
      id: 'conversationalRetrievalQAChain_0',
      type: 'customNode',
      position: { x: 1600.5125, y: 208.1858 },
      positionAbsolute: { x: 1600.5125, y: 208.1858 },
      width: 300,
      height: 500,
      selected: false,
      dragging: false,
      data: {
        id: 'conversationalRetrievalQAChain_0',
        label: 'Conversational Retrieval QA',
        version: 1,
        name: 'conversationalRetrievalQAChain',
        type: 'ConversationalRetrievalQAChain',
        baseClasses: ['ConversationalRetrievalQAChain', 'BaseChain', 'Runnable'],
        category: 'Chains',
        description: 'Chain for having a conversation based on retrieved documents',
        inputParams: [
          {
            label: 'Return Source Documents',
            name: 'returnSourceDocuments',
            type: 'boolean',
            default: false,
            optional: true,
            id: 'conversationalRetrievalQAChain_0-input-returnSourceDocuments-boolean',
            display: true
          }
        ],
        inputAnchors: [
          {
            label: 'Retriever',
            name: 'retriever',
            type: 'BaseRetriever',
            id: 'conversationalRetrievalQAChain_0-input-retriever-BaseRetriever',
            display: true
          },
          {
            label: 'LLM',
            name: 'llm',
            type: 'BaseLanguageModel',
            id: 'conversationalRetrievalQAChain_0-input-llm-BaseLanguageModel',
            display: true
          },
          {
            label: 'Memory',
            name: 'memory',
            type: 'BaseChatMemory',
            id: 'conversationalRetrievalQAChain_0-input-memory-BaseChatMemory',
            display: true
          }
        ],
        inputs: {
          retriever: '{{vectorStoreRetriever_0.data.instance}}',
          llm: '{{chatOpenAI_0.data.instance}}',
          memory: '{{bufferMemory_1.data.instance}}',
          returnSourceDocuments: false
        },
        outputAnchors: [
          {
            id: 'conversationalRetrievalQAChain_0-output-conversationalRetrievalQAChain-ConversationalRetrievalQAChain|BaseChain|Runnable',
            name: 'conversationalRetrievalQAChain',
            label: 'ConversationalRetrievalQAChain',
            type: 'ConversationalRetrievalQAChain | BaseChain | Runnable'
          }
        ],
        outputs: {},
        selected: false
      }
    };
    nodes.push(retrievalNode);

    // 7. Vector Store Retriever Node - Para busca em base de conhecimento
    const vectorStoreRetrieverNode: FlowiseNode = {
      id: 'vectorStoreRetriever_0',
      type: 'customNode',
      position: { x: 2000.5125, y: 208.1858 },
      positionAbsolute: { x: 2000.5125, y: 208.1858 },
      width: 300,
      height: 200,
      selected: false,
      dragging: false,
      data: {
        id: 'vectorStoreRetriever_0',
        label: 'Vector Store Retriever',
        version: 1,
        name: 'vectorStoreRetriever',
        type: 'VectorStoreRetriever',
        baseClasses: ['VectorStoreRetriever', 'BaseRetriever'],
        category: 'Retrievers',
        description: 'Retriever for a VectorStore',
        inputParams: [],
        inputAnchors: [],
        inputs: {},
        outputAnchors: [
          {
            id: 'vectorStoreRetriever_0-output-vectorStoreRetriever-VectorStoreRetriever|BaseRetriever',
            name: 'vectorStoreRetriever',
            label: 'VectorStoreRetriever',
            type: 'VectorStoreRetriever | BaseRetriever'
          }
        ],
        outputs: {},
        selected: false
      }
    };
    nodes.push(vectorStoreRetrieverNode);
  }

  // Conexões para o template básico (sem conhecimento)
  edges.push({
    id: 'chatOpenAI_0-chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable-llmChain_0-llmChain_0-input-llm-BaseLanguageModel',
    source: 'chatOpenAI_0',
    target: 'llmChain_0',
    sourceHandle: 'chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable',
    targetHandle: 'llmChain_0-input-llm-BaseLanguageModel',
    type: 'buttonedge',
    data: {}
  });

  edges.push({
    id: 'promptTemplate_0-promptTemplate_0-output-promptTemplate-PromptTemplate|BasePromptTemplate-llmChain_0-llmChain_0-input-prompt-BasePromptTemplate',
    source: 'promptTemplate_0',
    target: 'llmChain_0',
    sourceHandle: 'promptTemplate_0-output-promptTemplate-PromptTemplate|BasePromptTemplate',
    targetHandle: 'llmChain_0-input-prompt-BasePromptTemplate',
    type: 'buttonedge',
    data: {}
  });

  edges.push({
    id: 'bufferMemory_1-bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory-llmChain_0-llmChain_0-input-memory-BaseMemory',
    source: 'bufferMemory_1',
    target: 'llmChain_0',
    sourceHandle: 'bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory',
    targetHandle: 'llmChain_0-input-memory-BaseMemory',
    type: 'buttonedge',
    data: {}
  });

  // Conexões adicionais se tiver conhecimento
  if (agent.knowledge) {
    edges.push({
      id: 'chatOpenAI_0-chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable-conversationalRetrievalQAChain_0-conversationalRetrievalQAChain_0-input-llm-BaseLanguageModel',
      source: 'chatOpenAI_0',
      target: 'conversationalRetrievalQAChain_0',
      sourceHandle: 'chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable',
      targetHandle: 'conversationalRetrievalQAChain_0-input-llm-BaseLanguageModel',
      type: 'buttonedge',
      data: {}
    });

    edges.push({
      id: 'bufferMemory_1-bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory-conversationalRetrievalQAChain_0-conversationalRetrievalQAChain_0-input-memory-BaseChatMemory',
      source: 'bufferMemory_1',
      target: 'conversationalRetrievalQAChain_0',
      sourceHandle: 'bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory',
      targetHandle: 'conversationalRetrievalQAChain_0-input-memory-BaseChatMemory',
      type: 'buttonedge',
      data: {}
    });

    edges.push({
      id: 'vectorStoreRetriever_0-vectorStoreRetriever_0-output-vectorStoreRetriever-VectorStoreRetriever|BaseRetriever-conversationalRetrievalQAChain_0-conversationalRetrievalQAChain_0-input-retriever-BaseRetriever',
      source: 'vectorStoreRetriever_0',
      target: 'conversationalRetrievalQAChain_0',
      sourceHandle: 'vectorStoreRetriever_0-output-vectorStoreRetriever-VectorStoreRetriever|BaseRetriever',
      targetHandle: 'conversationalRetrievalQAChain_0-input-retriever-BaseRetriever',
      type: 'buttonedge',
      data: {}
    });
  }

  return { nodes, edges };
}

/**
 * Gera template de prompt para assistente profissional
 */
function generateProfessionalPromptTemplate(agent: AgentData, config: any): string {
  let template = `You are ${agent.name}, a professional AI assistant.\n\n`;
  
  if (agent.roleDefinition) {
    template += `**Role Definition:**\n${agent.roleDefinition}\n\n`;
  }
  
  if (agent.description) {
    template += `**Description:**\n${agent.description}\n\n`;
  }
  
  template += `**Instructions:**\n`;
  template += `1. Provide professional, accurate, and helpful responses\n`;
  template += `2. Use clear and concise language\n`;
  template += `3. Be respectful and maintain a professional tone\n`;
  
  if (agent.customInstructions) {
    template += `\n**Custom Instructions:**\n${agent.customInstructions}\n`;
  }
  
  template += `\n**Context:**\n{chat_history}\n\n`;
  template += `**Current Question:**\n{question}\n\n`;
  template += `**Response:**\n`;
  
  return template;
}

/**
 * Gera nós e conexões para Assistente genérico
 */
function generateAssistantNodesAndEdges(agent: AgentData, config: any): { nodes: FlowiseNode[], edges: FlowiseEdge[] } {
  // Implementação simplificada para assistente genérico
  return generateProfessionalAssistantNodesAndEdges(agent, config);
}

/**
 * Gera nós e conexões para Knowledge Agent
 */
function generateKnowledgeAgentNodesAndEdges(agent: AgentData, config: any): { nodes: FlowiseNode[], edges: FlowiseEdge[] } {
  // Implementação focada em conhecimento
  const result = generateProfessionalAssistantNodesAndEdges(agent, config);
  // Garantir que tenha nós de conhecimento
  return result;
}

/**
 * Gera nós e conexões para Chat Agent
 */
function generateChatAgentNodesAndEdges(agent: AgentData, config: any): { nodes: FlowiseNode[], edges: FlowiseEdge[] } {
  // Implementação simplificada para chat
  const nodes: FlowiseNode[] = [];
  const edges: FlowiseEdge[] = [];

  // Apenas os nós essenciais para chat
  const chatOpenAINode: FlowiseNode = {
    id: 'chatOpenAI_0',
    type: 'customNode',
    position: { x: 100, y: 100 },
    width: 300,
    height: 400,
    selected: false,
    dragging: false,
    data: {
      id: 'chatOpenAI_0',
      label: 'ChatOpenAI',
      version: 8.2,
      name: 'chatOpenAI',
      type: 'ChatOpenAI',
      baseClasses: ['ChatOpenAI', 'BaseChatModel', 'BaseLanguageModel', 'Runnable'],
      category: 'Chat Models',
      description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
      inputParams: [
        {
          label: 'Model Name',
          name: 'modelName',
          type: 'asyncOptions',
          loadMethod: 'listModels',
          default: 'gpt-4o-mini',
          id: 'chatOpenAI_0-input-modelName-asyncOptions',
          display: true
        },
        {
          label: 'Temperature',
          name: 'temperature',
          type: 'number',
          step: 0.1,
          default: 0.7,
          optional: true,
          id: 'chatOpenAI_0-input-temperature-number',
          display: true
        }
      ],
      inputAnchors: [],
      inputs: {
        modelName: config.model || 'gpt-4o-mini',
        temperature: config.temperature || 0.7
      },
      outputAnchors: [
        {
          id: 'chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable',
          name: 'chatOpenAI',
          label: 'ChatOpenAI',
          type: 'ChatOpenAI | BaseChatModel | BaseLanguageModel | Runnable'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(chatOpenAINode);

  return { nodes, edges };
}

/**
 * Gera nós e conexões para Composed Agent
 */
function generateComposedAgentNodesAndEdges(agent: AgentData, config: any): { nodes: FlowiseNode[], edges: FlowiseEdge[] } {
  // Implementação para agente composto (múltiplas capacidades)
  return generateProfessionalAssistantNodesAndEdges(agent, config);
}

/**
 * Gera nós e conexões para Custom Agent
 */
function generateCustomAgentNodesAndEdges(agent: AgentData, config: any): { nodes: FlowiseNode[], edges: FlowiseEdge[] } {
  // Implementação padrão para agente customizado
  return generateProfessionalAssistantNodesAndEdges(agent, config);
}

/**
 * Gera nós e conexões para o Flowise baseado no agente usando estrutura Tool Agent
 */
function generateToolAgentNodesAndEdges(agent: AgentData, config: any): { nodes: FlowiseNode[], edges: FlowiseEdge[] } {
  const nodes: FlowiseNode[] = [];
  const edges: FlowiseEdge[] = [];

  // 1. ChatOpenAI Node - Modelo de linguagem
  const chatOpenAINode: FlowiseNode = {
    id: 'chatOpenAI_0',
    type: 'customNode',
    position: { x: 97.01321406237057, y: 63.67664262280914 },
    positionAbsolute: { x: 97.01321406237057, y: 63.67664262280914 },
    width: 300,
    height: 771,
    selected: false,
    dragging: false,
    data: {
      id: 'chatOpenAI_0',
      label: 'ChatOpenAI',
      version: 8.2,
      name: 'chatOpenAI',
      type: 'ChatOpenAI',
      baseClasses: ['ChatOpenAI', 'BaseChatModel', 'BaseLanguageModel', 'Runnable'],
      category: 'Chat Models',
      description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
      inputParams: [
        {
          label: 'Connect Credential',
          name: 'credential',
          type: 'credential',
          credentialNames: ['openAIApi'],
          id: 'chatOpenAI_0-input-credential-credential',
          display: true
        },
        {
          label: 'Model Name',
          name: 'modelName',
          type: 'asyncOptions',
          loadMethod: 'listModels',
          default: 'gpt-4o-mini',
          id: 'chatOpenAI_0-input-modelName-asyncOptions',
          display: true
        },
        {
          label: 'Temperature',
          name: 'temperature',
          type: 'number',
          step: 0.1,
          default: 0.7,
          optional: true,
          id: 'chatOpenAI_0-input-temperature-number',
          display: true
        },
        {
          label: 'Streaming',
          name: 'streaming',
          type: 'boolean',
          default: true,
          optional: true,
          additionalParams: true,
          id: 'chatOpenAI_0-input-streaming-boolean',
          display: true
        },
        {
          label: 'Max Tokens',
          name: 'maxTokens',
          type: 'number',
          step: 1,
          optional: true,
          additionalParams: true,
          id: 'chatOpenAI_0-input-maxTokens-number',
          display: true
        },
        {
          label: 'Allow Image Uploads',
          name: 'allowImageUploads',
          type: 'boolean',
          description: 'Allow image input. Refer to the docs for more details.',
          default: false,
          optional: true,
          id: 'chatOpenAI_0-input-allowImageUploads-boolean',
          display: true
        },
        {
          label: 'Image Resolution',
          description: 'This parameter controls the resolution in which the model views the image.',
          name: 'imageResolution',
          type: 'options',
          options: [
            { label: 'Low', name: 'low' },
            { label: 'High', name: 'high' },
            { label: 'Auto', name: 'auto' }
          ],
          default: 'low',
          optional: false,
          show: { 'allowImageUploads': true },
          id: 'chatOpenAI_0-input-imageResolution-options',
          display: true
        }
      ],
      inputAnchors: [
        {
          label: 'Cache',
          name: 'cache',
          type: 'BaseCache',
          optional: true,
          id: 'chatOpenAI_0-input-cache-BaseCache',
          display: true
        }
      ],
      inputs: {
        cache: '',
        modelName: config.model || 'gpt-4o-mini',
        temperature: config.temperature || 0.7,
        streaming: true,
        maxTokens: config.maxTokens || '',
        allowImageUploads: false,
        imageResolution: 'low'
      },
      outputAnchors: [
        {
          id: 'chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable',
          name: 'chatOpenAI',
          label: 'ChatOpenAI',
          description: 'Wrapper around OpenAI large language models that use the Chat endpoint',
          type: 'ChatOpenAI | BaseChatModel | BaseLanguageModel | Runnable'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(chatOpenAINode);

  // 2. Buffer Memory Node - Memória do chat
  const bufferMemoryNode: FlowiseNode = {
    id: 'bufferMemory_1',
    type: 'customNode',
    position: { x: 607.6260576768354, y: 584.7920541862369 },
    positionAbsolute: { x: 607.6260576768354, y: 584.7920541862369 },
    width: 300,
    height: 258,
    selected: false,
    dragging: false,
    data: {
      id: 'bufferMemory_1',
      label: 'Buffer Memory',
      version: 2,
      name: 'bufferMemory',
      type: 'BufferMemory',
      baseClasses: ['BufferMemory', 'BaseChatMemory', 'BaseMemory'],
      category: 'Memory',
      description: 'Retrieve chat messages stored in database',
      inputParams: [
        {
          label: 'Session Id',
          name: 'sessionId',
          type: 'string',
          description: 'If not specified, a random id will be used.',
          default: '',
          additionalParams: true,
          optional: true,
          id: 'bufferMemory_1-input-sessionId-string'
        },
        {
          label: 'Memory Key',
          name: 'memoryKey',
          type: 'string',
          default: 'chat_history',
          additionalParams: true,
          id: 'bufferMemory_1-input-memoryKey-string'
        }
      ],
      inputAnchors: [],
      inputs: {
        sessionId: '',
        memoryKey: 'chat_history'
      },
      outputAnchors: [
        {
          id: 'bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory',
          name: 'bufferMemory',
          label: 'BufferMemory',
          type: 'BufferMemory | BaseChatMemory | BaseMemory'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(bufferMemoryNode);

  // 3. Calculator Tool Node - Ferramenta de cálculo
  const calculatorNode: FlowiseNode = {
    id: 'calculator_1',
    type: 'customNode',
    position: { x: 800.5125025564965, y: 72.40592063242738 },
    positionAbsolute: { x: 800.5125025564965, y: 72.40592063242738 },
    width: 300,
    height: 149,
    selected: false,
    dragging: false,
    data: {
      id: 'calculator_1',
      label: 'Calculator',
      version: 1,
      name: 'calculator',
      type: 'Calculator',
      baseClasses: ['Calculator', 'Tool', 'StructuredTool', 'BaseLangChain'],
      category: 'Tools',
      description: 'Perform calculations on response',
      inputParams: [],
      inputAnchors: [],
      inputs: {},
      outputAnchors: [
        {
          id: 'calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain',
          name: 'calculator',
          label: 'Calculator',
          type: 'Calculator | Tool | StructuredTool | BaseLangChain'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(calculatorNode);

  // 4. Tool Agent Node - Agente principal
  const toolAgentNode: FlowiseNode = {
    id: 'toolAgent_0',
    type: 'customNode',
    position: { x: 1200.6756893536506, y: 208.18578883272318 },
    positionAbsolute: { x: 1200.6756893536506, y: 208.18578883272318 },
    width: 300,
    height: 491,
    selected: false,
    dragging: false,
    data: {
      id: 'toolAgent_0',
      label: 'Tool Agent',
      version: 2,
      name: 'toolAgent',
      type: 'AgentExecutor',
      baseClasses: ['AgentExecutor', 'BaseChain', 'Runnable'],
      category: 'Agents',
      description: 'Agent that uses Function Calling to pick the tools and args to call',
      inputParams: [
        {
          label: 'System Message',
          name: 'systemMessage',
          type: 'string',
          default: 'You are a helpful AI assistant.',
          description: 'If Chat Prompt Template is provided, this will be ignored',
          rows: 4,
          optional: true,
          additionalParams: true,
          id: 'toolAgent_0-input-systemMessage-string',
          display: true
        },
        {
          label: 'Max Iterations',
          name: 'maxIterations',
          type: 'number',
          optional: true,
          additionalParams: true,
          id: 'toolAgent_0-input-maxIterations-number',
          display: true
        },
        {
          label: 'Enable Detailed Streaming',
          name: 'enableDetailedStreaming',
          type: 'boolean',
          default: false,
          description: 'Stream detailed intermediate steps during agent execution',
          optional: true,
          additionalParams: true,
          id: 'toolAgent_0-input-enableDetailedStreaming-boolean',
          display: true
        }
      ],
      inputAnchors: [
        {
          label: 'Tools',
          name: 'tools',
          type: 'Tool',
          list: true,
          id: 'toolAgent_0-input-tools-Tool',
          display: true
        },
        {
          label: 'Memory',
          name: 'memory',
          type: 'BaseChatMemory',
          id: 'toolAgent_0-input-memory-BaseChatMemory',
          display: true
        },
        {
          label: 'Tool Calling Chat Model',
          name: 'model',
          type: 'BaseChatModel',
          description: 'Only compatible with models that are capable of function calling',
          id: 'toolAgent_0-input-model-BaseChatModel',
          display: true
        }
      ],
      inputs: {
        tools: ['{{calculator_1.data.instance}}'],
        memory: '{{bufferMemory_1.data.instance}}',
        model: '{{chatOpenAI_0.data.instance}}',
        systemMessage: generateSystemPrompt(agent, config),
        maxIterations: '',
        enableDetailedStreaming: ''
      },
      outputAnchors: [
        {
          id: 'toolAgent_0-output-toolAgent-AgentExecutor|BaseChain|Runnable',
          name: 'toolAgent',
          label: 'AgentExecutor',
          description: 'Agent that uses Function Calling to pick the tools and args to call',
          type: 'AgentExecutor | BaseChain | Runnable'
        }
      ],
      outputs: {},
      selected: false
    }
  };
  nodes.push(toolAgentNode);

  // 5. Sticky Note Node - Nota informativa
  const stickyNoteNode: FlowiseNode = {
    id: 'stickyNote_0',
    type: 'stickyNote',
    position: { x: 1197.3578961103253, y: 117.43214592301385 },
    positionAbsolute: { x: 1197.3578961103253, y: 117.43214592301385 },
    width: 300,
    height: 62,
    selected: false,
    dragging: false,
    data: {
      id: 'stickyNote_0',
      label: 'Sticky Note',
      version: 2,
      name: 'stickyNote',
      type: 'StickyNote',
      baseClasses: ['StickyNote'],
      category: 'Utilities',
      description: 'Add a sticky note',
      inputParams: [
        {
          label: '',
          name: 'note',
          type: 'string',
          rows: 1,
          placeholder: 'Type something here',
          optional: true,
          id: 'stickyNote_0-input-note-string'
        }
      ],
      inputAnchors: [],
      inputs: {
        note: `LLM has to be function calling compatible - Agent: ${agent.name}`
      },
      outputAnchors: [
        {
          id: 'stickyNote_0-output-stickyNote-StickyNote',
          name: 'stickyNote',
          label: 'StickyNote',
          description: 'Add a sticky note',
          type: 'StickyNote'
        }
      ],
      outputs: {},
      selected: false,
      tags: ['Utilities']
    }
  };
  nodes.push(stickyNoteNode);

  // Conexões entre os nós
  edges.push({
    id: 'chatOpenAI_0-chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable-toolAgent_0-toolAgent_0-input-model-BaseChatModel',
    source: 'chatOpenAI_0',
    target: 'toolAgent_0',
    sourceHandle: 'chatOpenAI_0-output-chatOpenAI-ChatOpenAI|BaseChatModel|BaseLanguageModel|Runnable',
    targetHandle: 'toolAgent_0-input-model-BaseChatModel',
    type: 'buttonedge',
    data: {}
  });

  edges.push({
    id: 'bufferMemory_1-bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory-toolAgent_0-toolAgent_0-input-memory-BaseChatMemory',
    source: 'bufferMemory_1',
    target: 'toolAgent_0',
    sourceHandle: 'bufferMemory_1-output-bufferMemory-BufferMemory|BaseChatMemory|BaseMemory',
    targetHandle: 'toolAgent_0-input-memory-BaseChatMemory',
    type: 'buttonedge',
    data: {}
  });

  edges.push({
    id: 'calculator_1-calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain-toolAgent_0-toolAgent_0-input-tools-Tool',
    source: 'calculator_1',
    target: 'toolAgent_0',
    sourceHandle: 'calculator_1-output-calculator-Calculator|Tool|StructuredTool|BaseLangChain',
    targetHandle: 'toolAgent_0-input-tools-Tool',
    type: 'buttonedge',
    data: {}
  });

  return { nodes, edges };
}

/**
 * Gera template de prompt para Knowledge Agent
 */
function generateKnowledgePromptTemplate(agent: AgentData, config: any): string {
  let template = `You are ${agent.name}, a knowledge-based AI assistant.\n\n`;
  
  if (agent.roleDefinition) {
    template += `**Role Definition:**\n${agent.roleDefinition}\n\n`;
  }
  
  if (agent.description) {
    template += `**Description:**\n${agent.description}\n\n`;
  }
  
  template += `**Instructions:**\n`;
  template += `1. Use the provided knowledge base to answer questions accurately\n`;
  template += `2. Always base your responses on the available information\n`;
  template += `3. If the information is not in the knowledge base, acknowledge this limitation\n`;
  template += `4. Provide clear, concise, and informative answers\n`;
  
  if (agent.customInstructions) {
    template += `\n**Custom Instructions:**\n${agent.customInstructions}\n`;
  }
  
  template += `\n**Knowledge Base Context:**\n{context}\n\n`;
  template += `**Chat History:**\n{chat_history}\n\n`;
  template += `**Current Question:**\n{question}\n\n`;
  template += `**Response:**\n`;
  
  return template;
}

/**
 * Gera template de prompt para Chat Agent
 */
function generateChatPromptTemplate(agent: AgentData, config: any): string {
  let template = `You are ${agent.name}, a friendly conversational AI assistant.\n\n`;
  
  if (agent.roleDefinition) {
    template += `**Role Definition:**\n${agent.roleDefinition}\n\n`;
  }
  
  if (agent.description) {
    template += `**Description:**\n${agent.description}\n\n`;
  }
  
  template += `**Instructions:**\n`;
  template += `1. Be friendly, engaging, and conversational\n`;
  template += `2. Provide helpful and natural responses\n`;
  template += `3. Maintain context and remember previous parts of the conversation\n`;
  
  if (agent.customInstructions) {
    template += `\n**Custom Instructions:**\n${agent.customInstructions}\n`;
  }
  
  template += `\n**Chat History:**\n{chat_history}\n\n`;
  template += `**Current Message:**\n{question}\n\n`;
  template += `**Response:**\n`;
  
  return template;
}

/**
 * Gera template de prompt para Composed Agent
 */
function generateComposedPromptTemplate(agent: AgentData, config: any): string {
  let template = `You are ${agent.name}, a multi-capability AI assistant.\n\n`;
  
  if (agent.roleDefinition) {
    template += `**Role Definition:**\n${agent.roleDefinition}\n\n`;
  }
  
  if (agent.description) {
    template += `**Description:**\n${agent.description}\n\n`;
  }
  
  template += `**Instructions:**\n`;
  template += `1. Adapt your approach based on the user's needs\n`;
  template += `2. Use multiple capabilities as needed (conversation, knowledge, tools)\n`;
  template += `3. Provide comprehensive and versatile assistance\n`;
  template += `4. Maintain context and provide coherent responses\n`;
  
  if (agent.customInstructions) {
    template += `\n**Custom Instructions:**\n${agent.customInstructions}\n`;
  }
  
  template += `\n**Context:**\n{chat_history}\n\n`;
  template += `**Current Request:**\n{question}\n\n`;
  template += `**Response:**\n`;
  
  return template;
}

/**
 * Gera o system prompt para o agente no Flowise
 */
function generateSystemPrompt(agent: AgentData, config: any): string {
  let prompt = agent.roleDefinition || `You are ${agent.name}, a helpful AI assistant.`;
  
  if (agent.customInstructions) {
    prompt += `\n\n**Custom Instructions:**\n${agent.customInstructions}`;
  }

  if (config.systemPrompt) {
    prompt += `\n\n**Additional Configuration:**\n${config.systemPrompt}`;
  }

  // Add information about agent type
  switch (agent.type) {
    case 'template':
      prompt += '\n\nYou are a template-based agent, designed for specific tasks.';
      break;
    case 'custom':
      prompt += '\n\nYou are a custom agent, adapted for specific user needs.';
      break;
    case 'composed':
      prompt += '\n\nYou are a composed agent, combining multiple capabilities and specializations.';
      break;
    case 'professional':
      prompt += '\n\nYou are a professional assistant, providing high-quality, accurate responses.';
      break;
    case 'assistant':
      prompt += '\n\nYou are a general-purpose assistant, ready to help with various tasks.';
      break;
    case 'tool':
      prompt += '\n\nYou are a tool-enabled assistant, capable of using various tools and functions.';
      break;
  }

  // Add template-specific instructions
  if (agent.capabilities?.includes('function_calling') || config?.tools?.length > 0) {
    prompt += '\n\nYou have access to tools and can use function calling to accomplish tasks. ' +
             'Always think step by step and use the appropriate tools when needed.';
  }

  if (agent.knowledge) {
    prompt += '\n\nYou have access to a knowledge base. Use this information to provide accurate and informed responses.';
  }

  return prompt;
}

/**
 * Gera configuração de chatbot para o Flowise baseado no template
 */
function generateChatbotConfig(agent: AgentData, config: any, templateType: string): any {
  const baseConfig = {
    modelName: config.model || 'gpt-4o-mini',
    temperature: config.temperature || 0.7,
    maxTokens: config.maxTokens || 2000,
    streaming: true,
    memory: true,
    contextWindow: config.contextWindow || 4096,
    agentType: agent.type,
    agentId: agent.id,
    agentSlug: agent.slug,
    createdAt: new Date().toISOString()
  };

  switch (templateType) {
    case 'professional':
      return {
        ...baseConfig,
        systemPrompt: generateProfessionalPromptTemplate(agent, config),
        welcomeMessage: `Olá! Sou ${agent.name}, um assistente profissional de IA. ${agent.description || 'Como posso ajudar você hoje?'}`,
        placeholder: 'Digite sua mensagem aqui...',
        category: 'Professional',
        professionalMode: true,
        enableKnowledgeBase: !!agent.knowledge,
        enableMemory: true,
        enableStreaming: true
      };
    
    case 'assistant':
      return {
        ...baseConfig,
        systemPrompt: generateSystemPrompt(agent, config),
        welcomeMessage: `Hello! I'm ${agent.name}. ${agent.description || 'How can I help you today?'}`,
        placeholder: 'Type your message here...',
        category: 'Assistants',
        assistantMode: true,
        enableMemory: true,
        enableStreaming: true
      };
    
    case 'tool':
      return {
        ...baseConfig,
        systemPrompt: generateSystemPrompt(agent, config),
        welcomeMessage: `Hello! I'm ${agent.name}, a tool-enabled assistant. ${agent.description || 'What task would you like me to help you with?'}`,
        placeholder: 'Describe what you need help with...',
        category: 'Tools',
        toolAgentEnabled: true,
        functionCalling: true,
        tools: ['calculator'],
        enableMemory: true,
        enableStreaming: true
      };
    
    case 'knowledge':
      return {
        ...baseConfig,
        systemPrompt: generateKnowledgePromptTemplate(agent, config),
        welcomeMessage: `Olá! Sou ${agent.name}, um assistente com base de conhecimento. ${agent.description || 'Posso ajudar com informações específicas. O que você gostaria de saber?'}`,
        placeholder: 'Faça sua pergunta sobre o conhecimento disponível...',
        category: 'Knowledge Base',
        knowledgeBaseEnabled: true,
        enableRetrieval: true,
        enableMemory: true,
        enableStreaming: true
      };
    
    case 'chat':
      return {
        ...baseConfig,
        systemPrompt: generateChatPromptTemplate(agent, config),
        welcomeMessage: `Olá! Sou ${agent.name}. ${agent.description || 'Como posso ajudar você hoje?'}`,
        placeholder: 'Digite sua mensagem aqui...',
        category: 'Chat',
        chatMode: true,
        enableMemory: true,
        enableStreaming: true
      };
    
    case 'composed':
      return {
        ...baseConfig,
        systemPrompt: generateComposedPromptTemplate(agent, config),
        welcomeMessage: `Olá! Sou ${agent.name}, um assistente multi-capacidades. ${agent.description || 'Posso ajudar com diversos tipos de tarefas. Como posso ajudar?'}`,
        placeholder: 'Descreva o que você precisa...',
        category: 'Multi-Agent',
        multiAgentEnabled: true,
        enableMemory: true,
        enableStreaming: true
      };
    
    case 'custom':
    default:
      return {
        ...baseConfig,
        systemPrompt: generateSystemPrompt(agent, config),
        welcomeMessage: `Olá! Sou ${agent.name}. ${agent.description || 'Como posso ajudar você hoje?'}`,
        placeholder: 'Digite sua mensagem aqui...',
        category: 'Custom',
        customMode: true,
        enableMemory: true,
        enableStreaming: true
      };
  }
}

/**
 * Gera configuração de API para o Flowise baseado no template
 */
function generateApiConfig(agent: AgentData, config: any, templateType: string): any {
  const baseConfig = {
    apiEndpoint: `/api/v1/${getWorkflowType(templateType).toLowerCase()}/${agent.id}`,
    apiKey: `flowise_${agent.id}`,
    authentication: {
      type: 'bearer',
      token: `flowise_${agent.id}`
    },
    rateLimit: {
      requests: 100,
      window: '15min'
    },
    responseFormat: 'json',
    streaming: config.streaming !== false,
    agentType: agent.type,
    agentId: agent.id,
    version: '1.0.0',
    workflowType: getWorkflowType(templateType),
    cors: {
      enabled: true,
      origins: ['*']
    },
    logging: {
      enabled: true,
      level: 'info'
    }
  };

  switch (templateType) {
    case 'professional':
      return {
        ...baseConfig,
        supportsKnowledgeBase: !!agent.knowledge,
        supportsMemory: true,
        supportsStreaming: true,
        compatibleModels: ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
        features: ['professional_assistant', 'memory', 'knowledge_base', 'streaming']
      };
    
    case 'assistant':
      return {
        ...baseConfig,
        supportsMemory: true,
        supportsStreaming: true,
        compatibleModels: ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
        features: ['assistant', 'memory', 'streaming']
      };
    
    case 'tool':
      return {
        ...baseConfig,
        supportsFunctionCalling: true,
        supportsMemory: true,
        supportsStreaming: true,
        compatibleModels: ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
        features: ['tool_agent', 'function_calling', 'memory', 'streaming']
      };
    
    case 'knowledge':
      return {
        ...baseConfig,
        supportsRetrieval: true,
        supportsMemory: true,
        supportsStreaming: true,
        compatibleModels: ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
        features: ['knowledge_base', 'retrieval', 'memory', 'streaming']
      };
    
    case 'chat':
      return {
        ...baseConfig,
        supportsMemory: true,
        supportsStreaming: true,
        compatibleModels: ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
        features: ['chat', 'memory', 'streaming']
      };
    
    case 'composed':
      return {
        ...baseConfig,
        supportsMultiAgent: true,
        supportsMemory: true,
        supportsStreaming: true,
        compatibleModels: ['gpt-4', 'gpt-4o', 'gpt-4o-mini'],
        features: ['multi_agent', 'memory', 'streaming', 'advanced_capabilities']
      };
    
    case 'custom':
    default:
      return {
        ...baseConfig,
        supportsMemory: true,
        supportsStreaming: true,
        compatibleModels: ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
        features: ['custom', 'memory', 'streaming']
      };
  }
}

/**
 * Valida se os dados transformados estão no formato correto para exportação
 */
export function validateTransformedData(data: FlowiseWorkflowData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar campos obrigatórios
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Workflow name is required');
  }

  if (!data.type || !['CHATFLOW', 'AGENTFLOW', 'MULTIAGENT', 'ASSISTANT'].includes(data.type)) {
    errors.push('Invalid workflow type');
  }

  // Validar flowData
  try {
    const flowData = JSON.parse(data.flowData);
    if (!flowData.nodes || !Array.isArray(flowData.nodes)) {
      errors.push('flowData must contain a nodes array');
    }
    if (!flowData.edges || !Array.isArray(flowData.edges)) {
      errors.push('flowData must contain an edges array');
    }

    // Validar estrutura específica baseado no tipo de workflow
    switch (data.type) {
      case 'AGENTFLOW':
        const hasToolAgent = flowData.nodes.some((node: any) => 
          node.data.type === 'AgentExecutor' || node.data.name === 'toolAgent'
        );
        if (!hasToolAgent) {
          errors.push('AGENTFLOW must contain a Tool Agent node');
        }

        const hasChatOpenAI = flowData.nodes.some((node: any) => 
          node.data.type === 'ChatOpenAI' || node.data.name === 'chatOpenAI'
        );
        if (!hasChatOpenAI) {
          errors.push('Tool Agent must have a ChatOpenAI node connected');
        }

        const hasBufferMemory = flowData.nodes.some((node: any) => 
          node.data.type === 'BufferMemory' || node.data.name === 'bufferMemory'
        );
        if (!hasBufferMemory) {
          errors.push('Tool Agent should have a Buffer Memory node');
        }

        const hasTools = flowData.nodes.some((node: any) => 
          node.data.category === 'Tools' || node.data.baseClasses?.includes('Tool')
        );
        if (!hasTools) {
          errors.push('Tool Agent should have at least one tool node');
        }
        break;

      case 'ASSISTANT':
        const hasLLMChain = flowData.nodes.some((node: any) => 
          node.data.type === 'LLMChain' || node.data.name === 'llmChain'
        );
        if (!hasLLMChain) {
          errors.push('ASSISTANT must have an LLM Chain node');
        }

        const hasAssistantChatOpenAI = flowData.nodes.some((node: any) => 
          node.data.type === 'ChatOpenAI' || node.data.name === 'chatOpenAI'
        );
        if (!hasAssistantChatOpenAI) {
          errors.push('Assistant must have a ChatOpenAI node connected');
        }

        const hasPromptTemplate = flowData.nodes.some((node: any) => 
          node.data.type === 'PromptTemplate' || node.data.name === 'promptTemplate'
        );
        if (!hasPromptTemplate) {
          errors.push('Assistant should have a Prompt Template node');
        }
        break;

      case 'CHATFLOW':
        const hasChatModel = flowData.nodes.some((node: any) => 
          node.data.category === 'Chat Models' || node.data.type === 'ChatOpenAI'
        );
        if (!hasChatModel) {
          errors.push('CHATFLOW must have at least one Chat Model node');
        }
        break;

      case 'MULTIAGENT':
        const hasMultipleAgents = flowData.nodes.filter((node: any) => 
          node.data.category === 'Agents' || node.data.type?.includes('Agent')
        ).length;
        if (hasMultipleAgents < 2) {
          errors.push('MULTIAGENT should have at least two agent nodes');
        }
        break;
    }

    // Validar conexões básicas
    if (flowData.nodes.length > 0 && flowData.edges.length === 0) {
      errors.push('Workflow should have connections between nodes');
    }

  } catch (e) {
    errors.push('flowData must be valid JSON');
  }

  // Validar chatbotConfig se presente
  if (data.chatbotConfig) {
    try {
      JSON.parse(data.chatbotConfig);
    } catch (e) {
      errors.push('chatbotConfig must be valid JSON');
    }
  }

  // Validar apiConfig se presente
  if (data.apiConfig) {
    try {
      JSON.parse(data.apiConfig);
    } catch (e) {
      errors.push('apiConfig must be valid JSON');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}