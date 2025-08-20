import { db } from '@/lib/db';

interface GeneratedNode {
  id: string;
  type: string;
  name: string;
  description: string;
  config: Record<string, any>;
}

interface GeneratedEdge {
  source: string;
  target: string;
  type: string;
}

interface GeneratedWorkflow {
  name: string;
  description: string;
  nodes: GeneratedNode[];
  edges: GeneratedEdge[];
  agents: string[];
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
}

interface FlowiseNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    name: string;
    type: string;
    category?: string;
    inputs?: Array<{
      name: string;
      type: string;
      label: string;
      required?: boolean;
    }>;
    outputs?: Array<{
      name: string;
      type: string;
      label: string;
    }>;
    credentials?: string;
    settings?: Record<string, any>;
  };
}

interface FlowiseEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  data: {
    sourceHandle: string;
    targetHandle: string;
  };
}

interface FlowiseWorkflow {
  nodes: FlowiseNode[];
  edges: FlowiseEdge[];
  viewport: { x: number; y: number; zoom: number };
}

export class FlowiseConverter {
  private static readonly NODE_TYPES = {
    START: 'StartNode',
    END: 'EndNode',
    LLM: 'LLMNode',
    TOOL: 'ToolNode',
    CUSTOM: 'CustomNode',
    CONDITION: 'ConditionNode',
    PARALLEL: 'ParallelNode'
  };

  private static readonly FLOWISE_TYPE_MAPPING = {
    'StartNode': 'startNode',
    'EndNode': 'endNode',
    'LLMNode': 'llmNode',
    'ToolNode': 'toolNode',
    'CustomNode': 'customNode',
    'ConditionNode': 'conditionNode',
    'ParallelNode': 'parallelNode'
  };

  /**
   * Convert generated workflow to Flowise format
   */
  static async convertToFlowiseFormat(
    generatedWorkflow: GeneratedWorkflow,
    workspaceId: string
  ): Promise<FlowiseWorkflow> {
    const flowiseNodes: FlowiseNode[] = [];
    const flowiseEdges: FlowiseEdge[] = [];

    // Convert nodes
    let yOffset = 50;
    for (let i = 0; i < generatedWorkflow.nodes.length; i++) {
      const node = generatedWorkflow.nodes[i];
      const flowiseNode = await this.convertNode(node, yOffset, workspaceId);
      flowiseNodes.push(flowiseNode);
      yOffset += 100;
    }

    // Convert edges
    for (let i = 0; i < generatedWorkflow.edges.length; i++) {
      const edge = generatedWorkflow.edges[i];
      const flowiseEdge = this.convertEdge(edge, i);
      flowiseEdges.push(flowiseEdge);
    }

    return {
      nodes: flowiseNodes,
      edges: flowiseEdges,
      viewport: { x: 0, y: 0, zoom: 1 }
    };
  }

  /**
   * Convert a single node to Flowise format
   */
  private static async convertNode(
    node: GeneratedNode,
    yOffset: number,
    workspaceId: string
  ): Promise<FlowiseNode> {
    const flowiseType = this.FLOWISE_TYPE_MAPPING[node.type] || 'customNode';
    
    // Calculate position based on node type
    const position = {
      x: this.getNodeXPosition(node.type, node.id),
      y: yOffset
    };

    // Get agent information if this is a custom node
    let agentData = null;
    if (node.type === 'CustomNode' && node.config.agentId) {
      agentData = await db.agent.findUnique({
        where: { id: node.config.agentId },
        select: { name: true, description: true, config: true }
      });
    }

    const flowiseNode: FlowiseNode = {
      id: node.id,
      type: flowiseType,
      position,
      data: {
        label: node.name,
        name: node.name,
        type: flowiseType,
        category: this.getNodeCategory(node.type),
        inputs: this.getNodeInputs(node.type),
        outputs: this.getNodeOutputs(node.type),
        settings: this.getNodeSettings(node, agentData),
        credentials: node.config.credentials || ''
      }
    };

    return flowiseNode;
  }

  /**
   * Convert an edge to Flowise format
   */
  private static convertEdge(edge: GeneratedEdge, index: number): FlowiseEdge {
    return {
      id: `edge_${index}`,
      source: edge.source,
      target: edge.target,
      sourceHandle: this.getSourceHandle(edge.source),
      targetHandle: this.getTargetHandle(edge.target),
      data: {
        sourceHandle: this.getSourceHandle(edge.source),
        targetHandle: this.getTargetHandle(edge.target)
      }
    };
  }

  /**
   * Get X position for node based on type
   */
  private static getNodeXPosition(nodeType: string, nodeId: string): number {
    const basePositions = {
      'StartNode': 50,
      'EndNode': 450,
      'LLMNode': 150,
      'ToolNode': 250,
      'CustomNode': 200,
      'ConditionNode': 300,
      'ParallelNode': 350
    };

    // Add some variation based on node ID to avoid overlap
    const variation = (parseInt(nodeId.split('_')[1] || '0') % 3) * 50;
    
    return (basePositions[nodeType as keyof typeof basePositions] || 200) + variation;
  }

  /**
   * Get node category for Flowise
   */
  private static getNodeCategory(nodeType: string): string {
    const categories = {
      'StartNode': 'Input',
      'EndNode': 'Output',
      'LLMNode': 'LLM',
      'ToolNode': 'Tools',
      'CustomNode': 'Custom',
      'ConditionNode': 'Logic',
      'ParallelNode': 'Logic'
    };

    return categories[nodeType as keyof typeof categories] || 'Custom';
  }

  /**
   * Get node inputs configuration
   */
  private static getNodeInputs(nodeType: string): Array<{
    name: string;
    type: string;
    label: string;
    required?: boolean;
  }> {
    const inputs = {
      'StartNode': [
        { name: 'input', type: 'string', label: 'Input', required: true }
      ],
      'LLMNode': [
        { name: 'prompt', type: 'string', label: 'Prompt', required: true },
        { name: 'systemMessage', type: 'string', label: 'System Message' },
        { name: 'temperature', type: 'number', label: 'Temperature' }
      ],
      'ToolNode': [
        { name: 'input', type: 'string', label: 'Input', required: true },
        { name: 'toolName', type: 'string', label: 'Tool Name', required: true }
      ],
      'CustomNode': [
        { name: 'input', type: 'string', label: 'Input', required: true },
        { name: 'agentId', type: 'string', label: 'Agent ID', required: true }
      ],
      'ConditionNode': [
        { name: 'input', type: 'string', label: 'Input', required: true },
        { name: 'condition', type: 'string', label: 'Condition', required: true }
      ],
      'ParallelNode': [
        { name: 'input', type: 'string', label: 'Input', required: true },
        { name: 'branches', type: 'number', label: 'Number of Branches', required: true }
      ],
      'EndNode': [
        { name: 'input', type: 'string', label: 'Input', required: true }
      ]
    };

    return inputs[nodeType as keyof typeof inputs] || [];
  }

  /**
   * Get node outputs configuration
   */
  private static getNodeOutputs(nodeType: string): Array<{
    name: string;
    type: string;
    label: string;
  }> {
    const outputs = {
      'StartNode': [
        { name: 'output', type: 'string', label: 'Output' }
      ],
      'LLMNode': [
        { name: 'response', type: 'string', label: 'Response' },
        { name: 'tokens', type: 'number', label: 'Tokens' }
      ],
      'ToolNode': [
        { name: 'result', type: 'string', label: 'Result' },
        { name: 'success', type: 'boolean', label: 'Success' }
      ],
      'CustomNode': [
        { name: 'output', type: 'string', label: 'Output' },
        { name: 'executionTime', type: 'number', label: 'Execution Time' }
      ],
      'ConditionNode': [
        { name: 'true', type: 'string', label: 'True Path' },
        { name: 'false', type: 'string', label: 'False Path' }
      ],
      'ParallelNode': [
        { name: 'results', type: 'array', label: 'Results' }
      ],
      'EndNode': [
        { name: 'final', type: 'string', label: 'Final Output' }
      ]
    };

    return outputs[nodeType as keyof typeof outputs] || [];
  }

  /**
   * Get node settings based on configuration
   */
  private static getNodeSettings(
    node: GeneratedNode,
    agentData: any
  ): Record<string, any> {
    const baseSettings = {
      timeout: node.config.timeout || 30000,
      retryCount: node.config.retryCount || 3,
      description: node.description
    };

    switch (node.type) {
      case 'LLMNode':
        return {
          ...baseSettings,
          model: node.config.model || 'gpt-3.5-turbo',
          temperature: node.config.temperature || 0.7,
          maxTokens: node.config.maxTokens || 1000
        };

      case 'CustomNode':
        return {
          ...baseSettings,
          agentId: node.config.agentId,
          agentName: agentData?.name || node.name,
          agentConfig: agentData?.config || '{}'
        };

      case 'ToolNode':
        return {
          ...baseSettings,
          toolName: node.config.toolName || 'default_tool',
          toolParameters: node.config.toolParameters || '{}'
        };

      case 'ConditionNode':
        return {
          ...baseSettings,
          condition: node.config.condition || 'true',
          expression: node.config.expression || 'input === "true"'
        };

      case 'ParallelNode':
        return {
          ...baseSettings,
          branches: node.config.branches || 2,
          waitForAll: node.config.waitForAll || true
        };

      default:
        return baseSettings;
    }
  }

  /**
   * Get source handle name for edge
   */
  private static getSourceHandle(nodeId: string): string {
    if (nodeId.includes('start')) return 'output';
    if (nodeId.includes('end')) return 'input';
    return 'output';
  }

  /**
   * Get target handle name for edge
   */
  private static getTargetHandle(nodeId: string): string {
    if (nodeId.includes('start')) return 'output';
    if (nodeId.includes('end')) return 'input';
    return 'input';
  }

  /**
   * Save converted workflow to database
   */
  static async saveToDatabase(
    flowiseWorkflow: FlowiseWorkflow,
    generatedWorkflow: GeneratedWorkflow,
    workspaceId: string
  ): Promise<any> {
    try {
      // Calculate complexity metrics
      const complexityScore = this.calculateComplexityScore(flowiseWorkflow);
      
      // Create Flowise workflow record
      const flowiseWorkflowRecord = await db.flowiseWorkflow.create({
        data: {
          flowiseId: `generated_${Date.now()}`,
          name: generatedWorkflow.name,
          description: generatedWorkflow.description,
          type: 'AGENTFLOW',
          flowData: JSON.stringify(flowiseWorkflow),
          deployed: false,
          isPublic: false,
          category: 'generated',
          workspaceId,
          complexityScore,
          nodeCount: flowiseWorkflow.nodes.length,
          edgeCount: flowiseWorkflow.edges.length,
          maxDepth: this.calculateMaxDepth(flowiseWorkflow),
          nodes: JSON.stringify(flowiseWorkflow.nodes),
          connections: JSON.stringify(flowiseWorkflow.edges),
          capabilities: JSON.stringify({
            aiGenerated: true,
            workflowType: generatedWorkflow.complexity,
            estimatedTime: generatedWorkflow.estimatedTime,
            agentCount: generatedWorkflow.agents.length
          })
        }
      });

      return flowiseWorkflowRecord;
    } catch (error) {
      console.error('Error saving Flowise workflow to database:', error);
      throw error;
    }
  }

  /**
   * Calculate complexity score for workflow
   */
  private static calculateComplexityScore(workflow: FlowiseWorkflow): number {
    let score = 0;
    
    // Base score from node count
    score += workflow.nodes.length * 10;
    
    // Edge complexity
    score += workflow.edges.length * 5;
    
    // Node type complexity
    workflow.nodes.forEach(node => {
      switch (node.type) {
        case 'conditionNode':
          score += 20;
          break;
        case 'parallelNode':
          score += 25;
          break;
        case 'customNode':
          score += 15;
          break;
        default:
          score += 5;
      }
    });
    
    return Math.min(score, 100); // Cap at 100
  }

  /**
   * Calculate maximum depth of workflow
   */
  private static calculateMaxDepth(workflow: FlowiseWorkflow): number {
    // Simple depth calculation based on node positions
    const yPositions = workflow.nodes.map(node => node.position.y);
    const minY = Math.min(...yPositions);
    const maxY = Math.max(...yPositions);
    
    return Math.ceil((maxY - minY) / 100) + 1;
  }
}