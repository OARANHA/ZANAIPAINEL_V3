import { NextRequest, NextResponse } from 'next/server';
import { ContextPersistenceService } from '@/lib/context-persistence';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'save_project_context':
        const { workspaceId, context } = data;
        const projectContext = await ContextPersistenceService.saveProjectContext(workspaceId, context);
        return NextResponse.json({ 
          success: true, 
          context: projectContext 
        });

      case 'get_project_context':
        const projectCtx = await ContextPersistenceService.getProjectContext(data.workspaceId);
        return NextResponse.json({ 
          success: true, 
          context: projectCtx 
        });

      case 'save_agent_memory':
        const { agentId, memory } = data;
        const agentMemory = await ContextPersistenceService.saveAgentMemory(agentId, memory);
        return NextResponse.json({ 
          success: true, 
          memory: agentMemory 
        });

      case 'get_agent_memory':
        const agentMem = await ContextPersistenceService.getAgentMemory(data.agentId);
        return NextResponse.json({ 
          success: true, 
          memory: agentMem 
        });

      case 'add_interaction':
        const interaction = await ContextPersistenceService.addInteraction(data.agentId, data.interaction);
        return NextResponse.json({ 
          success: true, 
          interaction: interaction 
        });

      case 'learn_from_pattern':
        const pattern = await ContextPersistenceService.learnFromPattern(data.agentId, data.pattern);
        return NextResponse.json({ 
          success: true, 
          pattern: pattern 
        });

      case 'update_project_pattern':
        const projectPattern = await ContextPersistenceService.updateProjectPattern(data.workspaceId, data.pattern);
        return NextResponse.json({ 
          success: true, 
          pattern: projectPattern 
        });

      case 'add_project_decision':
        const decision = await ContextPersistenceService.addProjectDecision(data.workspaceId, data.decision);
        return NextResponse.json({ 
          success: true, 
          decision: decision 
        });

      case 'get_relevant_context':
        const relevantContext = await ContextPersistenceService.getRelevantContext(
          data.agentId, 
          data.workspaceId, 
          data.currentContext
        );
        return NextResponse.json({ 
          success: true, 
          context: relevantContext 
        });

      case 'cleanup_old_context':
        await ContextPersistenceService.cleanupOldContext();
        return NextResponse.json({ 
          success: true, 
          message: 'Context cleanup completed' 
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Context API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}