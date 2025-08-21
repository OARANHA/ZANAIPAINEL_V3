/**
 * Tipos de agentes e suas ações específicas para o sistema de cards funcionais
 */

export enum AgentCategory {
  HEALTH = 'health',
  BUSINESS = 'business', 
  EDUCATION = 'education',
  DEFAULT = 'default'
}

export enum AgentType {
  // Health Category
  HEALTH_CONSULTANT = 'health_consultant',
  MEDICAL_ANALYST = 'medical_analyst',
  HEALTH_MONITOR = 'health_monitor',
  WELLNESS_COACH = 'wellness_coach',
  
  // Business Category
  BUSINESS_ANALYST = 'business_analyst',
  SALES_AGENT = 'sales_agent',
  MARKETING_AGENT = 'marketing_agent',
  FINANCIAL_ADVISOR = 'financial_advisor',
  STRATEGY_CONSULTANT = 'strategy_consultant',
  
  // Education Category
  TUTOR_AGENT = 'tutor_agent',
  CONTENT_CREATOR = 'content_creator',
  LEARNING_ANALYST = 'learning_analyst',
  EDUCATION_PLANNER = 'education_planner',
  
  // Default Category
  GENERAL_ASSISTANT = 'general_assistant',
  TASK_AUTOMATOR = 'task_automator',
  RESEARCH_AGENT = 'research_agent',
  COMMUNICATION_AGENT = 'communication_agent'
}

export interface AgentAction {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'quick' | 'analysis' | 'generation' | 'automation';
  requiresInput: boolean;
  inputPlaceholder?: string;
  apiEndpoint: string;
  method: 'POST' | 'GET';
  expectedOutput: 'text' | 'json' | 'file' | 'chart';
  loadingMessage: string;
  successMessage: string;
}

export interface AgentTypeConfig {
  type: AgentType;
  category: AgentCategory;
  name: string;
  description: string;
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
  icon: string;
  actions: AgentAction[];
  defaultPrompt?: string;
}

export const AGENT_TYPE_CONFIGS: Record<AgentType, AgentTypeConfig> = {
  // Health Category
  [AgentType.HEALTH_CONSULTANT]: {
    type: AgentType.HEALTH_CONSULTANT,
    category: AgentCategory.HEALTH,
    name: 'Consultor de Saúde',
    description: 'Especialista em consultoria médica e orientação de saúde',
    color: {
      primary: 'bg-red-500',
      secondary: 'bg-red-100',
      accent: 'text-red-600'
    },
    icon: 'Heart',
    actions: [
      {
        id: 'medical_consultation',
        name: 'Consulta Médica',
        description: 'Realizar consulta médica virtual',
        icon: 'Stethoscope',
        category: 'quick',
        requiresInput: true,
        inputPlaceholder: 'Descreva seus sintomas ou dúvidas...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Realizando consulta médica...',
        successMessage: 'Consulta concluída com sucesso!'
      },
      {
        id: 'symptom_analysis',
        name: 'Análise de Sintomas',
        description: 'Analisar sintomas e fornecer orientações',
        icon: 'Activity',
        category: 'analysis',
        requiresInput: true,
        inputPlaceholder: 'Liste seus sintomas...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Analisando sintomas...',
        successMessage: 'Análise concluída!'
      },
      {
        id: 'health_report',
        name: 'Relatório de Saúde',
        description: 'Gerar relatório completo de saúde',
        icon: 'FileText',
        category: 'generation',
        requiresInput: false,
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'file',
        loadingMessage: 'Gerando relatório...',
        successMessage: 'Relatório gerado com sucesso!'
      },
      {
        id: 'health_monitoring',
        name: 'Monitoramento',
        description: 'Iniciar monitoramento de saúde',
        icon: 'Monitor',
        category: 'automation',
        requiresInput: false,
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'json',
        loadingMessage: 'Iniciando monitoramento...',
        successMessage: 'Monitoramento ativado!'
      }
    ],
    defaultPrompt: 'Como posso ajudar com sua saúde hoje?'
  },

  [AgentType.MEDICAL_ANALYST]: {
    type: AgentType.MEDICAL_ANALYST,
    category: AgentCategory.HEALTH,
    name: 'Analista Médico',
    description: 'Especialista em análise de dados médicos e diagnósticos',
    color: {
      primary: 'bg-pink-500',
      secondary: 'bg-pink-100',
      accent: 'text-pink-600'
    },
    icon: 'Microscope',
    actions: [
      {
        id: 'diagnostic_analysis',
        name: 'Análise Diagnóstica',
        description: 'Analisar exames e resultados médicos',
        icon: 'Search',
        category: 'analysis',
        requiresInput: true,
        inputPlaceholder: 'Insira os resultados dos exames...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Analisando dados...',
        successMessage: 'Análise concluída!'
      },
      {
        id: 'treatment_recommendation',
        name: 'Recomendação de Tratamento',
        description: 'Sugerir tratamentos baseados em análise',
        icon: 'Pill',
        category: 'generation',
        requiresInput: true,
        inputPlaceholder: 'Descreva o diagnóstico...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Gerando recomendações...',
        successMessage: 'Recomendações geradas!'
      }
    ],
    defaultPrompt: 'Quais dados médicos você precisa analisar?'
  },

  // Business Category
  [AgentType.BUSINESS_ANALYST]: {
    type: AgentType.BUSINESS_ANALYST,
    category: AgentCategory.BUSINESS,
    name: 'Analista de Negócios',
    description: 'Especialista em análise de dados e inteligência de negócios',
    color: {
      primary: 'bg-blue-500',
      secondary: 'bg-blue-100',
      accent: 'text-blue-600'
    },
    icon: 'BarChart3',
    actions: [
      {
        id: 'data_analysis',
        name: 'Análise de Dados',
        description: 'Analisar dados de negócios',
        icon: 'PieChart',
        category: 'analysis',
        requiresInput: true,
        inputPlaceholder: 'Descreva os dados para análise...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'chart',
        loadingMessage: 'Analisando dados...',
        successMessage: 'Análise concluída!'
      },
      {
        id: 'business_consulting',
        name: 'Consultoria de Negócios',
        description: 'Fornecer consultoria estratégica',
        icon: 'Briefcase',
        category: 'quick',
        requiresInput: true,
        inputPlaceholder: 'Descreva o desafio de negócio...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Analisando cenário...',
        successMessage: 'Consultoria concluída!'
      },
      {
        id: 'process_optimization',
        name: 'Otimização de Processos',
        description: 'Otimizar processos de negócio',
        icon: 'Settings',
        category: 'automation',
        requiresInput: true,
        inputPlaceholder: 'Descreva o processo atual...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Otimizando processo...',
        successMessage: 'Processo otimizado!'
      },
      {
        id: 'trend_prediction',
        name: 'Previsão de Tendências',
        description: 'Prever tendências de mercado',
        icon: 'TrendingUp',
        category: 'analysis',
        requiresInput: false,
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'json',
        loadingMessage: 'Analisando tendências...',
        successMessage: 'Previsões geradas!'
      }
    ],
    defaultPrompt: 'Qual aspecto do negócio você precisa analisar?'
  },

  [AgentType.SALES_AGENT]: {
    type: AgentType.SALES_AGENT,
    category: AgentCategory.BUSINESS,
    name: 'Agente de Vendas',
    description: 'Especialista em vendas, negociação e fechamento',
    color: {
      primary: 'bg-green-500',
      secondary: 'bg-green-100',
      accent: 'text-green-600'
    },
    icon: 'DollarSign',
    actions: [
      {
        id: 'lead_qualification',
        name: 'Qualificação de Leads',
        description: 'Qualificar leads para vendas',
        icon: 'Users',
        category: 'analysis',
        requiresInput: true,
        inputPlaceholder: 'Descreva o lead...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'json',
        loadingMessage: 'Qualificando lead...',
        successMessage: 'Lead qualificado!'
      },
      {
        id: 'sales_script',
        name: 'Script de Vendas',
        description: 'Gerar script de vendas personalizado',
        icon: 'FileText',
        category: 'generation',
        requiresInput: true,
        inputPlaceholder: 'Produto/serviço e público-alvo...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Gerando script...',
        successMessage: 'Script gerado!'
      },
      {
        id: 'negotiation_coach',
        name: 'Coach de Negociação',
        description: 'Assistir em negociações',
        icon: 'MessageSquare',
        category: 'quick',
        requiresInput: true,
        inputPlaceholder: 'Descreva a situação de negociação...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Analisando negociação...',
        successMessage: 'Orientações fornecidas!'
      }
    ],
    defaultPrompt: 'Como posso ajudar com suas vendas hoje?'
  },

  // Education Category
  [AgentType.TUTOR_AGENT]: {
    type: AgentType.TUTOR_AGENT,
    category: AgentCategory.EDUCATION,
    name: 'Agente Tutor',
    description: 'Especialista em tutoria e ensino personalizado',
    color: {
      primary: 'bg-purple-500',
      secondary: 'bg-purple-100',
      accent: 'text-purple-600'
    },
    icon: 'GraduationCap',
    actions: [
      {
        id: 'personalized_tutoring',
        name: 'Tutoria Personalizada',
        description: 'Fornecer tutoria personalizada',
        icon: 'BookOpen',
        category: 'quick',
        requiresInput: true,
        inputPlaceholder: 'Assunto e dúvidas...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Preparando aula...',
        successMessage: 'Tutoria concluída!'
      },
      {
        id: 'learning_assessment',
        name: 'Avaliação de Aprendizagem',
        description: 'Avaliar progresso de aprendizagem',
        icon: 'ClipboardCheck',
        category: 'analysis',
        requiresInput: true,
        inputPlaceholder: 'Descreva o que foi aprendido...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'json',
        loadingMessage: 'Avaliando progresso...',
        successMessage: 'Avaliação concluída!'
      },
      {
        id: 'study_plan',
        name: 'Plano de Estudos',
        description: 'Criar plano de estudos personalizado',
        icon: 'Calendar',
        category: 'generation',
        requiresInput: true,
        inputPlaceholder: 'Objetivos e tempo disponível...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'file',
        loadingMessage: 'Criando plano...',
        successMessage: 'Plano criado com sucesso!'
      }
    ],
    defaultPrompt: 'Qual assunto você precisa aprender?'
  },

  [AgentType.CONTENT_CREATOR]: {
    type: AgentType.CONTENT_CREATOR,
    category: AgentCategory.EDUCATION,
    name: 'Criador de Conteúdo',
    description: 'Especialista em criação de conteúdo educacional',
    color: {
      primary: 'bg-indigo-500',
      secondary: 'bg-indigo-100',
      accent: 'text-indigo-600'
    },
    icon: 'PenTool',
    actions: [
      {
        id: 'content_generation',
        name: 'Geração de Conteúdo',
        description: 'Gerar conteúdo educacional',
        icon: 'FileText',
        category: 'generation',
        requiresInput: true,
        inputPlaceholder: 'Tópico e formato desejado...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Gerando conteúdo...',
        successMessage: 'Conteúdo gerado!'
      },
      {
        id: 'curriculum_design',
        name: 'Design de Currículo',
        description: 'Criar estrutura de currículo',
        icon: 'Layout',
        category: 'generation',
        requiresInput: true,
        inputPlaceholder: 'Assunto e nível de dificuldade...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'file',
        loadingMessage: 'Desenhando currículo...',
        successMessage: 'Currículo criado!'
      }
    ],
    defaultPrompt: 'Que tipo de conteúdo você precisa criar?'
  },

  // Default Category
  [AgentType.GENERAL_ASSISTANT]: {
    type: AgentType.GENERAL_ASSISTANT,
    category: AgentCategory.DEFAULT,
    name: 'Assistente Geral',
    description: 'Assistente inteligente para diversas tarefas',
    color: {
      primary: 'bg-gray-500',
      secondary: 'bg-gray-100',
      accent: 'text-gray-600'
    },
    icon: 'Bot',
    actions: [
      {
        id: 'conversation',
        name: 'Conversar',
        description: 'Iniciar conversa',
        icon: 'MessageCircle',
        category: 'quick',
        requiresInput: true,
        inputPlaceholder: 'Como posso ajudar?',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Processando...',
        successMessage: 'Resposta gerada!'
      },
      {
        id: 'task_execution',
        name: 'Executar Tarefa',
        description: 'Executar tarefas diversas',
        icon: 'CheckCircle',
        category: 'automation',
        requiresInput: true,
        inputPlaceholder: 'Descreva a tarefa...',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Executando tarefa...',
        successMessage: 'Tarefa concluída!'
      },
      {
        id: 'information_retrieval',
        name: 'Buscar Informações',
        description: 'Buscar informações específicas',
        icon: 'Search',
        category: 'analysis',
        requiresInput: true,
        inputPlaceholder: 'O que você quer saber?',
        apiEndpoint: '/api/card/execute',
        method: 'POST',
        expectedOutput: 'text',
        loadingMessage: 'Buscando informações...',
        successMessage: 'Informações encontradas!'
      }
    ],
    defaultPrompt: 'Olá! Como posso ajudar você hoje?'
  }
};

export function getAgentTypeConfig(type: string): AgentTypeConfig | null {
  return AGENT_TYPE_CONFIGS[type as AgentType] || null;
}

export function getAgentCategory(type: string): AgentCategory | null {
  const config = getAgentTypeConfig(type);
  return config?.category || null;
}

export function getActionsByType(type: string): AgentAction[] {
  const config = getAgentTypeConfig(type);
  return config?.actions || [];
}

export function getAllAgentTypes(): AgentType[] {
  return Object.keys(AGENT_TYPE_CONFIGS) as AgentType[];
}

export function getAgentTypesByCategory(category: AgentCategory): AgentType[] {
  return Object.entries(AGENT_TYPE_CONFIGS)
    .filter(([_, config]) => config.category === category)
    .map(([type]) => type as AgentType);
}