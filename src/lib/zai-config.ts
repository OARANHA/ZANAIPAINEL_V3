export interface ZAIConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export const ZAI_DEFAULT_CONFIG: Partial<ZAIConfig> = {
  model: 'glm-4.5-flash',  // ← LINHA ALTERADA PARA O MODELO CORRETO
  maxTokens: 2000,
  temperature: 0.7,
};

export function getZAIConfig(): ZAIConfig {
  const apiKey = process.env.ZAI_API_KEY;
  const baseUrl = process.env.ZAI_BASE_URL;
  
  console.log('Verificando configuração ZAI:');
  console.log('ZAI_API_KEY exists:', !!apiKey);
  console.log('ZAI_API_KEY length:', apiKey?.length || 0);
  console.log('ZAI_BASE_URL:', baseUrl);
  
  if (!apiKey) {
    console.error('ZAI_API_KEY environment variable is not set');
    throw new Error('ZAI_API_KEY environment variable is required');
  }

  if (apiKey.length < 10) {
    console.error('ZAI_API_KEY seems too short:', apiKey);
    throw new Error('ZAI_API_KEY appears to be invalid');
  }

  return {
    apiKey,
    baseUrl,
    ...ZAI_DEFAULT_CONFIG,
  };
}

export function validateZAIConfig(config: ZAIConfig): boolean {
  return !!config.apiKey;
}