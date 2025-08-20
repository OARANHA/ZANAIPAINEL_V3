import { db } from './db';

interface ProjectContext {
  projectId: string;
  projectName: string;
  files: Array<{
    path: string;
    content: string;
    language: string;
    lastModified: string;
  }>;
  structure: any;
  dependencies: any;
  patterns: Array<{
    type: string;
    description: string;
    examples: string[];
    confidence: number;
  }>;
  decisions: Array<{
    type: 'architecture' | 'technology' | 'design' | 'implementation';
    description: string;
    reason: string;
    timestamp: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  lastUpdated: string;
}

interface AgentMemory {
  agentId: string;
  projectId: string;
  interactions: Array<{
    input: string;
    output: string;
    context: any;
    timestamp: string;
    success: boolean;
    feedback?: string;
  }>;
  learnedPatterns: Array<{
    pattern: string;
    context: string;
    success: boolean;
    usage: number;
    lastUsed: string;
  }>;
  preferences: {
    codingStyle: string;
    architecturePatterns: string[];
    technologies: string[];
    conventions: any;
  };
  performance: {
    totalInteractions: number;
    successRate: number;
    averageResponseTime: number;
    lastUsed: string;
  };
}

export class ContextPersistenceService {
  static async saveProjectContext(workspaceId: string, context: Partial<ProjectContext>) {
    try {
      const existingContext = await db.workspace.findUnique({
        where: { id: workspaceId },
        select: { config: true }
      });

      const currentConfig = existingContext?.config ? JSON.parse(existingContext.config) : {};
      const projectContext = {
        ...currentConfig.projectContext,
        ...context,
        lastUpdated: new Date().toISOString()
      };

      await db.workspace.update({
        where: { id: workspaceId },
        data: {
          config: JSON.stringify({
            ...currentConfig,
            projectContext
          })
        }
      });

      return projectContext;
    } catch (error) {
      console.error('Error saving project context:', error);
      throw error;
    }
  }

  static async getProjectContext(workspaceId: string): Promise<ProjectContext | null> {
    try {
      const workspace = await db.workspace.findUnique({
        where: { id: workspaceId },
        select: { config: true }
      });

      if (!workspace?.config) return null;

      const config = JSON.parse(workspace.config);
      return config.projectContext || null;
    } catch (error) {
      console.error('Error getting project context:', error);
      return null;
    }
  }

  static async saveAgentMemory(agentId: string, memory: Partial<AgentMemory>) {
    try {
      const agent = await db.agent.findUnique({
        where: { id: agentId },
        select: { config: true }
      });

      if (!agent) throw new Error('Agent not found');

      const currentConfig = agent.config ? JSON.parse(agent.config) : {};
      const agentMemory = {
        ...currentConfig.memory,
        ...memory,
        performance: {
          ...currentConfig.memory?.performance,
          ...memory.performance,
          lastUsed: new Date().toISOString()
        }
      };

      await db.agent.update({
        where: { id: agentId },
        data: {
          config: JSON.stringify({
            ...currentConfig,
            memory: agentMemory
          })
        }
      });

      return agentMemory;
    } catch (error) {
      console.error('Error saving agent memory:', error);
      throw error;
    }
  }

  static async getAgentMemory(agentId: string): Promise<AgentMemory | null> {
    try {
      const agent = await db.agent.findUnique({
        where: { id: agentId },
        select: { config: true }
      });

      if (!agent?.config) return null;

      const config = JSON.parse(agent.config);
      return config.memory || null;
    } catch (error) {
      console.error('Error getting agent memory:', error);
      return null;
    }
  }

  static async addInteraction(agentId: string, interaction: {
    input: string;
    output: string;
    context: any;
    success: boolean;
    feedback?: string;
  }) {
    try {
      const memory = await this.getAgentMemory(agentId) || {
        agentId,
        projectId: '',
        interactions: [],
        learnedPatterns: [],
        preferences: {
          codingStyle: 'default',
          architecturePatterns: [],
          technologies: [],
          conventions: {}
        },
        performance: {
          totalInteractions: 0,
          successRate: 0,
          averageResponseTime: 0,
          lastUsed: new Date().toISOString()
        }
      };

      // Add new interaction
      memory.interactions.push({
        ...interaction,
        timestamp: new Date().toISOString()
      });

      // Update performance metrics
      memory.performance.totalInteractions = memory.interactions.length;
      const successfulInteractions = memory.interactions.filter(i => i.success).length;
      memory.performance.successRate = successfulInteractions / memory.performance.totalInteractions;

      // Keep only last 100 interactions
      if (memory.interactions.length > 100) {
        memory.interactions = memory.interactions.slice(-100);
      }

      return await this.saveAgentMemory(agentId, memory);
    } catch (error) {
      console.error('Error adding interaction:', error);
      throw error;
    }
  }

  static async learnFromPattern(agentId: string, pattern: {
    pattern: string;
    context: string;
    success: boolean;
  }) {
    try {
      const memory = await this.getAgentMemory(agentId) || {
        agentId,
        projectId: '',
        interactions: [],
        learnedPatterns: [],
        preferences: {
          codingStyle: 'default',
          architecturePatterns: [],
          technologies: [],
          conventions: {}
        },
        performance: {
          totalInteractions: 0,
          successRate: 0,
          averageResponseTime: 0,
          lastUsed: new Date().toISOString()
        }
      };

      // Check if pattern already exists
      const existingPattern = memory.learnedPatterns.find(p => p.pattern === pattern.pattern);
      
      if (existingPattern) {
        // Update existing pattern
        existingPattern.usage += 1;
        existingPattern.lastUsed = new Date().toISOString();
        existingPattern.success = pattern.success;
      } else {
        // Add new pattern
        memory.learnedPatterns.push({
          ...pattern,
          usage: 1,
          lastUsed: new Date().toISOString()
        });
      }

      // Sort by usage and keep only top 50 patterns
      memory.learnedPatterns.sort((a, b) => b.usage - a.usage);
      memory.learnedPatterns = memory.learnedPatterns.slice(0, 50);

      return await this.saveAgentMemory(agentId, memory);
    } catch (error) {
      console.error('Error learning from pattern:', error);
      throw error;
    }
  }

  static async updateProjectPattern(workspaceId: string, pattern: {
    type: string;
    description: string;
    examples: string[];
    confidence: number;
  }) {
    try {
      const projectContext = await this.getProjectContext(workspaceId) || {
        projectId: workspaceId,
        projectName: '',
        files: [],
        structure: {},
        dependencies: {},
        patterns: [],
        decisions: [],
        lastUpdated: new Date().toISOString()
      };

      // Check if pattern already exists
      const existingPattern = projectContext.patterns.find(p => 
        p.type === pattern.type && p.description === pattern.description
      );

      if (existingPattern) {
        // Update existing pattern
        existingPattern.examples = [...new Set([...existingPattern.examples, ...pattern.examples])];
        existingPattern.confidence = Math.max(existingPattern.confidence, pattern.confidence);
      } else {
        // Add new pattern
        projectContext.patterns.push(pattern);
      }

      // Sort by confidence and keep only top 20 patterns
      projectContext.patterns.sort((a, b) => b.confidence - a.confidence);
      projectContext.patterns = projectContext.patterns.slice(0, 20);

      return await this.saveProjectContext(workspaceId, projectContext);
    } catch (error) {
      console.error('Error updating project pattern:', error);
      throw error;
    }
  }

  static async addProjectDecision(workspaceId: string, decision: {
    type: 'architecture' | 'technology' | 'design' | 'implementation';
    description: string;
    reason: string;
    impact: 'low' | 'medium' | 'high';
  }) {
    try {
      const projectContext = await this.getProjectContext(workspaceId) || {
        projectId: workspaceId,
        projectName: '',
        files: [],
        structure: {},
        dependencies: {},
        patterns: [],
        decisions: [],
        lastUpdated: new Date().toISOString()
      };

      // Add new decision
      projectContext.decisions.push({
        ...decision,
        timestamp: new Date().toISOString()
      });

      // Keep only last 50 decisions
      if (projectContext.decisions.length > 50) {
        projectContext.decisions = projectContext.decisions.slice(-50);
      }

      return await this.saveProjectContext(workspaceId, projectContext);
    } catch (error) {
      console.error('Error adding project decision:', error);
      throw error;
    }
  }

  static async getRelevantContext(agentId: string, workspaceId: string, currentContext: any) {
    try {
      const [agentMemory, projectContext] = await Promise.all([
        this.getAgentMemory(agentId),
        this.getProjectContext(workspaceId)
      ]);

      return {
        agentMemory,
        projectContext,
        currentContext,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting relevant context:', error);
      return {
        agentMemory: null,
        projectContext: null,
        currentContext,
        timestamp: new Date().toISOString()
      };
    }
  }

  static async cleanupOldContext() {
    try {
      // Clean up old interactions (keep last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const agents = await db.agent.findMany({
        select: { id: true, config: true }
      });

      for (const agent of agents) {
        if (agent.config) {
          const config = JSON.parse(agent.config);
          if (config.memory?.interactions) {
            config.memory.interactions = config.memory.interactions.filter(
              (interaction: any) => new Date(interaction.timestamp) > sixMonthsAgo
            );
            
            await db.agent.update({
              where: { id: agent.id },
              data: { config: JSON.stringify(config) }
            });
          }
        }
      }

      console.log('Context cleanup completed');
    } catch (error) {
      console.error('Error during context cleanup:', error);
    }
  }
}