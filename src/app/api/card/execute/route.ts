import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAgentTypeConfig, getActionsByType } from '@/types/agent-types';

// Interface para a requisição do card
interface CardExecuteRequest {
  agentId: string;
  actionId: string;
  input?: string;
  context?: Record<string, any>;
  sessionId?: string;
}

// Interface para a resposta do card
interface CardExecuteResponse {
  success: boolean;
  result?: any;
  error?: string;
  executionId?: string;
  processingTime?: number;
  metadata?: {
    agentType?: string;
    actionCategory?: string;
    apiUsed?: string;
  };
}

// Mapeamento de ações para APIs específicas
const ACTION_API_MAPPING: Record<string, string> = {
  // Health actions
  'medical_consultation': '/admin/api/mcp/execute',
  'symptom_analysis': '/admin/api/mcp/execute',
  'health_report': '/admin/api/mcp/execute',
  'health_monitoring': '/admin/api/mcp/execute',
  'diagnostic_analysis': '/admin/api/mcp/execute',
  'treatment_recommendation': '/admin/api/mcp/execute',
  
  // Business actions
  'data_analysis': '/admin/api/mcp/execute',
  'business_consulting': '/admin/api/mcp/execute',
  'process_optimization': '/admin/api/mcp/execute',
  'trend_prediction': '/admin/api/mcp/execute',
  'lead_qualification': '/admin/api/mcp/execute',
  'sales_script': '/admin/api/mcp/execute',
  'negotiation_coach': '/admin/api/mcp/execute',
  
  // Education actions
  'personalized_tutoring': '/admin/api/mcp/execute',
  'learning_assessment': '/admin/api/mcp/execute',
  'study_plan': '/admin/api/mcp/execute',
  'content_generation': '/admin/api/mcp/execute',
  'curriculum_design': '/admin/api/mcp/execute',
  
  // Default actions
  'conversation': '/admin/api/execute',
  'task_execution': '/admin/api/execute',
  'information_retrieval': '/admin/api/mcp/execute',
};

// Mapeamento de ações para ferramentas MCP
const ACTION_MCP_TOOL_MAPPING: Record<string, string> = {
  'web_search': 'web_search',
  'summarize': 'summarize',
  'extract_content': 'extract_content',
  'create_issue': 'create_issue',
  'search_repositories': 'search_repositories',
  'execute_query': 'execute_query',
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: CardExecuteRequest = await request.json();
    const { agentId, actionId, input = '', context = {}, sessionId } = body;

    // Validar campos obrigatórios
    if (!agentId || !actionId) {
      return NextResponse.json<CardExecuteResponse>(
        { 
          success: false, 
          error: 'AgentId e ActionId são obrigatórios' 
        },
        { status: 400 }
      );
    }

    // Buscar informações do agente
    const agent = await db.agent.findUnique({
      where: { id: agentId },
      include: {
        workspace: true,
        user: true
      }
    });

    if (!agent) {
      return NextResponse.json<CardExecuteResponse>(
        { 
          success: false, 
          error: 'Agente não encontrado' 
        },
        { status: 404 }
      );
    }

    // Determinar o tipo do agente baseado na configuração e descrição
    let agentType = 'general_assistant'; // tipo padrão
    
    // Lógica para determinar o tipo do agente
    if (agent.description?.toLowerCase().includes('saúde') || 
        agent.description?.toLowerCase().includes('médico') ||
        agent.description?.toLowerCase().includes('health')) {
      agentType = 'health_consultant';
    } else if (agent.description?.toLowerCase().includes('negócio') || 
               agent.description?.toLowerCase().includes('business') ||
               agent.description?.toLowerCase().includes('análise')) {
      agentType = 'business_analyst';
    } else if (agent.description?.toLowerCase().includes('venda') || 
               agent.description?.toLowerCase().includes('sales')) {
      agentType = 'sales_agent';
    } else if (agent.description?.toLowerCase().includes('educação') || 
               agent.description?.toLowerCase().includes('ensino') ||
               agent.description?.toLowerCase().includes('tutor')) {
      agentType = 'tutor_agent';
    } else if (agent.description?.toLowerCase().includes('conteúdo') || 
               agent.description?.toLowerCase().includes('content')) {
      agentType = 'content_creator';
    }

    // Obter configuração do tipo de agente
    const agentConfig = getAgentTypeConfig(agentType);
    if (!agentConfig) {
      return NextResponse.json<CardExecuteResponse>(
        { 
          success: false, 
          error: 'Tipo de agente não suportado' 
        },
        { status: 400 }
      );
    }

    // Verificar se a ação existe para este tipo de agente
    const actions = getActionsByType(agentType);
    const action = actions.find(a => a.id === actionId);
    
    if (!action) {
      return NextResponse.json<CardExecuteResponse>(
        { 
          success: false, 
          error: 'Ação não disponível para este tipo de agente' 
        },
        { status: 400 }
      );
    }

    // Preparar contexto adicional
    const enhancedContext = {
      ...context,
      agentName: agent.name,
      agentDescription: agent.description,
      agentConfig: agent.config,
      agentKnowledge: agent.knowledge,
      workspaceName: agent.workspace?.name,
      sessionId: sessionId || `session_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    // Executar a ação baseada no tipo
    let result: any;
    let apiUsed: string;

    try {
      if (action.apiEndpoint === '/api/card/execute') {
        // Ações que usam MCP tools
        const mcpTool = ACTION_MCP_TOOL_MAPPING[actionId] || 'web_search';
        
        const mcpResponse = await fetch(`http://localhost:3000/admin/api/mcp/execute`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-request': 'true'
          },
          body: JSON.stringify({
            serverId: 'default', // ID do servidor MCP padrão
            toolName: mcpTool,
            arguments: {
              query: input || action.name,
              context: enhancedContext,
              action: actionId,
              agentType: agentType
            },
            connectionId: context.connectionId
          }),
        });

        if (mcpResponse.ok) {
          const mcpResult = await mcpResponse.json();
          result = mcpResult;
          apiUsed = 'mcp';
        } else {
          throw new Error(`MCP execution failed: ${mcpResponse.statusText}`);
        }
      } else {
        // Ações que usam outras APIs
        const apiEndpoint = ACTION_API_MAPPING[actionId] || '/admin/api/execute';
        
        const apiResponse = await fetch(`http://localhost:3000${apiEndpoint}`, {
          method: action.method,
          headers: {
            'Content-Type': 'application/json',
            'x-internal-request': 'true'
          },
          body: JSON.stringify({
            agentId,
            input: input || action.name,
            action: actionId,
            context: enhancedContext,
            sessionId
          }),
        });

        if (apiResponse.ok) {
          result = await apiResponse.json();
          apiUsed = apiEndpoint.includes('mcp') ? 'mcp' : 'execute';
        } else {
          throw new Error(`API execution failed: ${apiResponse.statusText}`);
        }
      }

      // Registrar execução no banco de dados
      const executionRecord = await db.agentExecution.create({
        data: {
          agentId,
          input: input || action.name,
          output: JSON.stringify(result),
          status: 'completed',
          context: JSON.stringify(enhancedContext),
          startedAt: new Date(startTime),
          completedAt: new Date(),
          result: JSON.stringify({
            actionId,
            apiUsed,
            processingTime: Date.now() - startTime
          })
        }
      });

      const processingTime = Date.now() - startTime;

      return NextResponse.json<CardExecuteResponse>({
        success: true,
        result,
        executionId: executionRecord.id,
        processingTime,
        metadata: {
          agentType,
          actionCategory: action.category,
          apiUsed
        }
      });

    } catch (executionError) {
      console.error('Erro na execução da ação:', executionError);
      
      // Registrar falha no banco de dados
      await db.agentExecution.create({
        data: {
          agentId,
          input: input || action.name,
          status: 'failed',
          context: JSON.stringify(enhancedContext),
          startedAt: new Date(startTime),
          error: executionError instanceof Error ? executionError.message : 'Unknown error'
        }
      });

      return NextResponse.json<CardExecuteResponse>({
        success: false,
        error: executionError instanceof Error ? executionError.message : 'Erro na execução da ação',
        processingTime: Date.now() - startTime
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro no endpoint /api/card/execute:', error);
    
    return NextResponse.json<CardExecuteResponse>(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

// Endpoint GET para obter ações disponíveis para um agente
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json(
        { error: 'AgentId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar informações do agente
    const agent = await db.agent.findUnique({
      where: { id: agentId }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agente não encontrado' },
        { status: 404 }
      );
    }

    // Determinar o tipo do agente (mesma lógica do POST)
    let agentType = 'general_assistant';
    
    if (agent.description?.toLowerCase().includes('saúde') || 
        agent.description?.toLowerCase().includes('médico') ||
        agent.description?.toLowerCase().includes('health')) {
      agentType = 'health_consultant';
    } else if (agent.description?.toLowerCase().includes('negócio') || 
               agent.description?.toLowerCase().includes('business') ||
               agent.description?.toLowerCase().includes('análise')) {
      agentType = 'business_analyst';
    } else if (agent.description?.toLowerCase().includes('venda') || 
               agent.description?.toLowerCase().includes('sales')) {
      agentType = 'sales_agent';
    } else if (agent.description?.toLowerCase().includes('educação') || 
               agent.description?.toLowerCase().includes('ensino') ||
               agent.description?.toLowerCase().includes('tutor')) {
      agentType = 'tutor_agent';
    } else if (agent.description?.toLowerCase().includes('conteúdo') || 
               agent.description?.toLowerCase().includes('content')) {
      agentType = 'content_creator';
    }

    // Obter ações disponíveis
    const actions = getActionsByType(agentType);
    const agentConfig = getAgentTypeConfig(agentType);

    return NextResponse.json({
      agentId,
      agentType,
      agentConfig,
      actions,
      availableActions: actions.length
    });

  } catch (error) {
    console.error('Erro ao buscar ações do agente:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ações do agente' },
      { status: 500 }
    );
  }
}