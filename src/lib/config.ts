/**
 * Configurações do sistema Zanai Project
 * Inclui chaves de API e configurações de serviços
 */

export interface ApiConfig {
  openai: {
    apiKey: string;
    baseUrl?: string;
    organization?: string;
  };
  zai: {
    enabled: boolean;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  };
  flowise: {
    baseUrl: string;
    apiKey?: string;
  };
}

// Configuração padrão
const defaultConfig: ApiConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    organization: process.env.OPENAI_ORGANIZATION || undefined
  },
  zai: {
    enabled: true,
    model: 'gpt-4',
    maxTokens: 4000,
    temperature: 0.7
  },
  flowise: {
    baseUrl: process.env.FLOWISE_BASE_URL || 'http://localhost:3000',
    apiKey: process.env.FLOWISE_API_KEY || undefined
  }
};

// Função para obter configuração
export function getConfig(): ApiConfig {
  return {
    ...defaultConfig,
    openai: {
      ...defaultConfig.openai,
      apiKey: process.env.OPENAI_API_KEY || defaultConfig.openai.apiKey
    }
  };
}

// Função para validar configuração
export function validateConfig(config: ApiConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.openai.apiKey) {
    errors.push('OpenAI API key is required');
  }

  if (!config.flowise.baseUrl) {
    errors.push('Flowise base URL is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Função para atualizar configuração (para uso em tempo de execução)
export function updateConfig(updates: Partial<ApiConfig>): void {
  // Em uma implementação real, isso poderia persistir em banco de dados
  // ou arquivo de configuração. Por enquanto, apenas atualiza o ambiente.
  console.log('Configuração atualizada:', updates);
}

// Exportar configuração padrão
export default defaultConfig;