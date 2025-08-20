import ZAI from 'z-ai-web-dev-sdk';
import { getZAIConfig } from './zai-config';

export class ZAIClient {
  private static instance: ZAIClient;
  private zai: any = null;

  private constructor() {}

  public static getInstance(): ZAIClient {
    if (!ZAIClient.instance) {
      ZAIClient.instance = new ZAIClient();
    }
    return ZAIClient.instance;
  }

  private async initializeZAI() {
    if (!this.zai) {
      try {
        console.log('Initializing ZAI with configuration...');
        const config = getZAIConfig();
        console.log('ZAI Configuration:', JSON.stringify(config, null, 2));
        
        this.zai = await ZAI.create(config);
        console.log('ZAI initialized successfully');
      } catch (error) {
        console.error('Error initializing ZAI:', error);
        throw new Error(`Failed to initialize AI service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    return this.zai;
  }

  public async chatCompletion(messages: any[], options: any = {}) {
    const zai = await this.initializeZAI();
    
    try {
      const completion = await zai.chat.completions.create({
        messages,
        ...options
      });

      return completion;
    } catch (error) {
      console.error('Error in chat completion:', error);
      throw error;
    }
  }

  public async generateImage(prompt: string, options: any = {}) {
    const zai = await this.initializeZAI();
    
    try {
      const response = await zai.images.generations.create({
        prompt,
        ...options
      });

      return response;
    } catch (error) {
      console.error('Error in image generation:', error);
      throw error;
    }
  }

  public async webSearch(query: string, options: any = {}) {
    const zai = await this.initializeZAI();
    
    try {
      const searchResult = await zai.functions.invoke("web_search", {
        query,
        ...options
      });

      return searchResult;
    } catch (error) {
      console.error('Error in web search:', error);
      throw error;
    }
  }
}

export const zaiClient = ZAIClient.getInstance();