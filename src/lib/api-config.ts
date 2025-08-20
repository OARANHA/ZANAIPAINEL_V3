/**
 * API Configuration Manager
 * 
 * Gerencia as configurações de APIs para LLMs e outros serviços
 */

export interface ApiProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  models: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiConfiguration {
  providers: ApiProvider[];
  defaultProvider: string;
}

class ApiConfigManager {
  private static instance: ApiConfigManager;
  private config: ApiConfiguration;

  private constructor() {
    this.config = this.loadConfig();
  }

  static getInstance(): ApiConfigManager {
    if (!ApiConfigManager.instance) {
      ApiConfigManager.instance = new ApiConfigManager();
    }
    return ApiConfigManager.instance;
  }

  private loadConfig(): ApiConfiguration {
    // Carregar configuração do arquivo de ambiente ou banco de dados
    // Usar variáveis de ambiente para segurança
    const defaultConfig: ApiConfiguration = {
      providers: [
        {
          id: 'openai',
          name: 'OpenAI',
          baseUrl: 'https://api.openai.com/v1/',
          apiKey: process.env.OPENAI_API_KEY || '',
          models: [
            'gpt-4',
            'gpt-4-turbo',
            'gpt-4o',
            'gpt-4o-mini',
            'gpt-3.5-turbo'
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'z-ai',
          name: 'Z.AI',
          baseUrl: 'https://api.z.ai/api/paas/v4/',
          apiKey: process.env.ZAI_API_KEY || '',
          models: [
            'gpt-4',
            'gpt-4-turbo',
            'gpt-4o',
            'gpt-3.5-turbo'
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      defaultProvider: 'openai'
    };

    return defaultConfig;
  }

  getProviders(): ApiProvider[] {
    return this.config.providers;
  }

  getProvider(id: string): ApiProvider | undefined {
    return this.config.providers.find(p => p.id === id);
  }

  getDefaultProvider(): ApiProvider | undefined {
    return this.getProvider(this.config.defaultProvider);
  }

  addProvider(provider: Omit<ApiProvider, 'id' | 'createdAt' | 'updatedAt'>): ApiProvider {
    const newProvider: ApiProvider = {
      ...provider,
      id: provider.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.config.providers.push(newProvider);
    this.saveConfig();
    
    return newProvider;
  }

  updateProvider(id: string, updates: Partial<ApiProvider>): ApiProvider | null {
    const index = this.config.providers.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.config.providers[index] = {
      ...this.config.providers[index],
      ...updates,
      updatedAt: new Date()
    };

    this.saveConfig();
    return this.config.providers[index];
  }

  deleteProvider(id: string): boolean {
    const index = this.config.providers.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.config.providers.splice(index, 1);
    this.saveConfig();
    return true;
  }

  setDefaultProvider(id: string): boolean {
    const provider = this.getProvider(id);
    if (!provider) return false;

    this.config.defaultProvider = id;
    this.saveConfig();
    return true;
  }

  getActiveProviders(): ApiProvider[] {
    return this.config.providers.filter(p => p.isActive);
  }

  testConnection(providerId: string): Promise<boolean> {
    const provider = this.getProvider(providerId);
    if (!provider) return Promise.resolve(false);

    // Testar conexão com a API
    return fetch(`${provider.baseUrl}models`, {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.ok)
    .catch(() => false);
  }

  private saveConfig(): void {
    // Em uma implementação real, salvaria no banco de dados
    // Por enquanto, apenas logamos
    console.log('Configuração de API atualizada:', this.config);
  }

  // Método para obter configuração para Flowise
  getFlowiseConfig(): any {
    const activeProviders = this.getActiveProviders();
    const flowiseConfig: any = {
      endpoints: {}
    };

    activeProviders.forEach(provider => {
      flowiseConfig.endpoints[provider.id] = {
        baseUrl: provider.baseUrl,
        apiKey: provider.apiKey,
        models: provider.models
      };
    });

    return flowiseConfig;
  }

  // Método para obter configuração para o catálogo de nodes
  getNodeCatalogConfig(): any {
    const defaultProvider = this.getDefaultProvider();
    if (!defaultProvider) return {};

    return {
      defaultLLMConfig: {
        provider: defaultProvider.id,
        baseUrl: defaultProvider.baseUrl,
        apiKey: defaultProvider.apiKey,
        model: defaultProvider.models[0] || 'gpt-4'
      }
    };
  }
}

export const apiConfigManager = ApiConfigManager.getInstance();
export default ApiConfigManager;