/**
 * Flowise Node Catalog Utility
 * 
 * This utility provides functions to catalog and manage Flowise nodes
 * for integration with our agent export functionality.
 */

import fs from 'fs/promises';
import path from 'path';

export interface FlowiseNode {
  categoria: string;
  label: string;
  desc: string;
  path: string;
  inputs: string;
  outputs: string;
}

export interface FlowiseNodeCatalog {
  nodes: FlowiseNode[];
  categories: string[];
  totalNodes: number;
  lastUpdated: string;
}

/**
 * Load the Flowise node catalog from JSON file
 */
export async function loadNodeCatalog(): Promise<FlowiseNodeCatalog | null> {
  try {
    const catalogPath = path.join(process.cwd(), 'catalog.flowise.nodes.json');
    const data = await fs.readFile(catalogPath, 'utf-8');
    const nodes: FlowiseNode[] = JSON.parse(data);
    
    const categories = [...new Set(nodes.map(node => node.categoria))].sort();
    
    return {
      nodes,
      categories,
      totalNodes: nodes.length,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error loading Flowise node catalog:', error);
    return null;
  }
}

/**
 * Get nodes by category
 */
export async function getNodesByCategory(category: string): Promise<FlowiseNode[]> {
  const catalog = await loadNodeCatalog();
  if (!catalog) return [];
  
  return catalog.nodes.filter(node => 
    node.categoria.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Search nodes by label or description
 */
export async function searchNodes(query: string): Promise<FlowiseNode[]> {
  const catalog = await loadNodeCatalog();
  if (!catalog) return [];
  
  const lowerQuery = query.toLowerCase();
  return catalog.nodes.filter(node => 
    node.label.toLowerCase().includes(lowerQuery) ||
    node.desc.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get recommended nodes for agent export based on agent type
 */
export async function getRecommendedNodes(agentType: string): Promise<FlowiseNode[]> {
  const catalog = await loadNodeCatalog();
  if (!catalog) return [];
  
  // Define node recommendations based on agent type
  const recommendations: Record<string, string[]> = {
    'chat': ['Chat', 'Prompt', 'Memory', 'LLM'],
    'assistant': ['Assistant', 'Tools', 'Agent', 'Memory'],
    'rag': ['Document', 'Embeddings', 'Vector Store', 'Retriever'],
    'workflow': ['Logic', 'Condition', 'Loop', 'Variable'],
    'api': ['HTTP Request', 'Webhook', 'API', 'Function'],
    'default': ['Chat', 'Prompt', 'LLM', 'Memory']
  };
  
  const agentCategory = recommendations[agentType.toLowerCase()] || recommendations['default'];
  
  return catalog.nodes.filter(node =>
    agentCategory.some(category => 
      node.categoria.toLowerCase().includes(category.toLowerCase()) ||
      node.label.toLowerCase().includes(category.toLowerCase())
    )
  );
}

/**
 * Generate a basic Flowise configuration based on agent data
 */
export async function generateFlowiseConfig(agentData: any): Promise<any> {
  const catalog = await loadNodeCatalog();
  if (!catalog) return null;
  
  // Get recommended nodes for this agent type
  const recommendedNodes = await getRecommendedNodes(agentData.type || 'default');
  
  // Basic configuration structure
  const config = {
    name: agentData.name || 'Untitled Agent',
    description: agentData.description || 'Agent exported from Zanai',
    nodes: [],
    edges: [],
    flows: []
  };
  
  // Add basic chat flow nodes
  if (agentData.type === 'chat' || !agentData.type) {
    const chatNode = recommendedNodes.find(n => n.label.toLowerCase().includes('chat'));
    const promptNode = recommendedNodes.find(n => n.label.toLowerCase().includes('prompt'));
    const llmNode = recommendedNodes.find(n => n.label.toLowerCase().includes('llm'));
    
    if (chatNode) {
      config.nodes.push({
        id: 'chat-input',
        type: chatNode.path,
        position: { x: 0, y: 0 },
        data: { label: chatNode.label }
      });
    }
    
    if (promptNode) {
      config.nodes.push({
        id: 'prompt-template',
        type: promptNode.path,
        position: { x: 300, y: 0 },
        data: { 
          label: promptNode.label,
          template: agentData.systemPrompt || 'You are a helpful assistant.'
        }
      });
    }
    
    if (llmNode) {
      config.nodes.push({
        id: 'llm',
        type: llmNode.path,
        position: { x: 600, y: 0 },
        data: { 
          label: llmNode.label,
          modelName: agentData.model || 'gpt-3.5-turbo'
        }
      });
    }
    
    // Add basic connections
    if (config.nodes.length >= 3) {
      config.edges.push(
        { id: 'e1-2', source: 'chat-input', target: 'prompt-template' },
        { id: 'e2-3', source: 'prompt-template', target: 'llm' }
      );
    }
  }
  
  return config;
}

/**
 * Check if catalog exists and is up to date
 */
export async function isCatalogValid(): Promise<boolean> {
  try {
    const catalogPath = path.join(process.cwd(), 'catalog.flowise.nodes.json');
    const stats = await fs.stat(catalogPath);
    
    // Consider catalog valid if less than 7 days old
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return stats.mtime > oneWeekAgo;
  } catch {
    return false;
  }
}

/**
 * Get catalog statistics
 */
export async function getCatalogStats(): Promise<{
  totalNodes: number;
  categories: string[];
  categoryCounts: Record<string, number>;
}> {
  const catalog = await loadNodeCatalog();
  if (!catalog) {
    return {
      totalNodes: 0,
      categories: [],
      categoryCounts: {}
    };
  }
  
  const categoryCounts: Record<string, number> = {};
  catalog.nodes.forEach(node => {
    categoryCounts[node.categoria] = (categoryCounts[node.categoria] || 0) + 1;
  });
  
  return {
    totalNodes: catalog.totalNodes,
    categories: catalog.categories,
    categoryCounts
  };
}