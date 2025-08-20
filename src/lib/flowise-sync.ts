import { createFlowiseClient, defaultFlowiseConfig } from './flowise-client';

export interface SyncResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export class FlowiseSync {
  private client: any;
  private isExternal: boolean;

  constructor(config?: any) {
    this.isExternal = config?.baseUrl?.includes('hf.space') || false;
    this.client = createFlowiseClient(config || defaultFlowiseConfig);
  }

  async testConnection(): Promise<SyncResult> {
    try {
      const isConnected = await this.client.testConnection();
      
      if (isConnected) {
        return {
          success: true,
          message: this.isExternal 
            ? 'Conexão com Flowise externo estabelecida com sucesso' 
            : 'Conexão com Flowise local estabelecida com sucesso'
        };
      } else {
        return {
          success: false,
          message: 'Falha ao conectar com o servidor Flowise',
          error: 'Connection test failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao testar conexão com Flowise',
        error: error.message
      };
    }
  }

  async syncCanvas(canvasId: string): Promise<SyncResult> {
    try {
      // Primeiro, testar a conexão
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        return connectionTest;
      }

      // Obter dados do canvas específico
      const canvasData = await this.client.getChatflow(canvasId);
      
      if (!canvasData) {
        return {
          success: false,
          message: 'Canvas não encontrado',
          error: `Canvas ID ${canvasId} não existe`
        };
      }

      // Analisar se há nós desatualizados
      const syncNeeded = this.checkIfSyncNeeded(canvasData);
      
      if (!syncNeeded.needsSync) {
        return {
          success: true,
          message: 'Canvas já está sincronizado',
          data: { canvas: canvasData, syncNeeded: false }
        };
      }

      // Se necessário, sincronizar nós
      if (syncNeeded.outdatedNodes.length > 0) {
        const syncResult = await this.syncNodes(canvasData, syncNeeded.outdatedNodes);
        
        return {
          success: true,
          message: `Canvas sincronizado com sucesso. ${syncResult.syncedCount} nós atualizados.`,
          data: {
            canvas: canvasData,
            syncResult,
            outdatedNodes: syncNeeded.outdatedNodes
          }
        };
      }

      return {
        success: true,
        message: 'Canvas verificado e sincronizado',
        data: { canvas: canvasData, syncNeeded: false }
      };

    } catch (error) {
      return {
        success: false,
        message: 'Erro ao sincronizar canvas',
        error: error.message
      };
    }
  }

  private checkIfSyncNeeded(canvasData: any): { needsSync: boolean; outdatedNodes: any[] } {
    try {
      const flowData = JSON.parse(canvasData.flowData);
      const nodes = flowData.nodes || [];
      const outdatedNodes = [];

      // Para instâncias externas, verificar se há problemas de compatibilidade
      if (this.isExternal) {
        // Verificar nós que podem ter problemas com instâncias externas
        for (const node of nodes) {
          if (this.isNodeProblematicForExternal(node)) {
            outdatedNodes.push({
              id: node.id,
              name: node.data?.name || 'Unknown',
              reason: 'Nó pode ter problemas com instâncias externas'
            });
          }
        }
      }

      return {
        needsSync: outdatedNodes.length > 0,
        outdatedNodes
      };

    } catch (error) {
      return {
        needsSync: true,
        outdatedNodes: [{ id: 'parse-error', reason: 'Erro ao analisar flowData' }]
      };
    }
  }

  private isNodeProblematicForExternal(node: any): boolean {
    // Nós que podem ter problemas em instâncias externas
    const problematicCategories = [
      'File Processing',
      'Local Database',
      'System Integration',
      'Local Storage'
    ];

    const problematicNames = [
      'Read File',
      'Write File',
      'Local Database',
      'System Command',
      'Local Storage'
    ];

    const category = node.data?.category || '';
    const name = node.data?.name || '';

    return (
      problematicCategories.some(cat => category.includes(cat)) ||
      problematicNames.some(n => name.includes(n))
    );
  }

  private async syncNodes(canvasData: any, outdatedNodes: any[]): Promise<{ syncedCount: number; errors: string[] }> {
    const errors: string[] = [];
    let syncedCount = 0;

    try {
      const flowData = JSON.parse(canvasData.flowData);
      let nodes = flowData.nodes || [];
      let edges = flowData.edges || [];

      // Atualizar nós desatualizados
      for (const outdatedNode of outdatedNodes) {
        try {
          const nodeIndex = nodes.findIndex(n => n.id === outdatedNode.id);
          if (nodeIndex !== -1) {
            // Para instâncias externas, aplicar ajustes específicos
            if (this.isExternal) {
              nodes[nodeIndex] = this.adaptNodeForExternal(nodes[nodeIndex]);
            }
            syncedCount++;
          }
        } catch (error) {
          errors.push(`Erro ao sincronizar nó ${outdatedNode.id}: ${error.message}`);
        }
      }

      // Atualizar o flowData
      const updatedFlowData = {
        ...flowData,
        nodes,
        edges
      };

      // Salvar as alterações
      await this.client.updateChatflow(canvasData.id, {
        flowData: JSON.stringify(updatedFlowData)
      });

      return { syncedCount, errors };

    } catch (error) {
      errors.push(`Erro geral na sincronização: ${error.message}`);
      return { syncedCount, errors };
    }
  }

  private adaptNodeForExternal(node: any): any {
    // Adaptar nós para funcionar melhor em instâncias externas
    const adaptedNode = { ...node };

    // Exemplo: substituir operações de arquivo por operações HTTP
    if (node.data?.category?.includes('File')) {
      adaptedNode.data = {
        ...node.data,
        category: 'HTTP',
        inputs: {
          ...node.data.inputs,
          // Adaptar inputs conforme necessário
        }
      };
    }

    return adaptedNode;
  }

  async getHealthStatus(): Promise<SyncResult> {
    try {
      const health = await this.client.getHealth();
      
      return {
        success: true,
        message: 'Status de saúde obtido com sucesso',
        data: health
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao obter status de saúde',
        error: error.message
      };
    }
  }

  async getAllWorkflows(filters?: any): Promise<SyncResult> {
    try {
      const workflows = await this.client.getChatflows(filters);
      
      return {
        success: true,
        message: 'Workflows obtidos com sucesso',
        data: workflows
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao obter workflows',
        error: error.message
      };
    }
  }
}

// Factory function para criar sincronizador
export function createFlowiseSync(config?: any): FlowiseSync {
  return new FlowiseSync(config);
}

// Configuração para instância externa
export const externalFlowiseConfig = {
  baseUrl: process.env.NEXT_PUBLIC_FLOWISE_URL || 'https://aaranha-zania.hf.space',
  apiKey: process.env.FLOWISE_API_KEY,
  timeout: 60000, // Timeout maior para instâncias externas
  retryAttempts: 5 // Mais tentativas para instâncias externas
};