"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RefreshCw, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  BarChart3, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Database,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FlowiseWorkflow {
  id: string;
  flowiseId: string;
  name: string;
  description?: string;
  type: 'CHATFLOW' | 'AGENTFLOW' | 'MULTIAGENT' | 'ASSISTANT';
  deployed: boolean;
  isPublic: boolean;
  category?: string;
  complexityScore: number;
  nodeCount: number;
  edgeCount: number;
  maxDepth: number;
  capabilities: WorkflowCapabilities;
  nodes?: string; // JSON string
  connections?: string; // JSON string
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
  // Campos para agentes transformados
  isFromAgent?: boolean;
  originalAgentId?: string;
  originalAgentType?: string;
}

interface WorkflowCapabilities {
  canHandleFileUpload: boolean;
  hasStreaming: boolean;
  supportsMultiLanguage: boolean;
  hasMemory: boolean;
  usesExternalAPIs: boolean;
  hasAnalytics: boolean;
  supportsParallelProcessing: boolean;
  hasErrorHandling: boolean;
}

interface SyncStats {
  totalWorkflows: number;
  syncedWorkflows: number;
  failedSyncs: number;
  avgComplexity: number;
  lastSync?: string;
}

export default function FlowiseWorkflowManager() {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<FlowiseWorkflow[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    minComplexity: '',
    maxComplexity: '',
    search: ''
  });
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [exportLogs, setExportLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    loadWorkflows();
    loadStats();
  }, []);

  const loadExportLogs = async () => {
    setLoadingLogs(true);
    try {
      const response = await fetch('/api/admin/flowise-workflows/export-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_export_logs',
          data: { limit: 20 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setExportLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Erro ao carregar logs de exportação:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const clearExportLogs = async () => {
    try {
      const response = await fetch('/api/admin/flowise-workflows/export-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'clear_export_logs'
        })
      });

      if (response.ok) {
        setExportLogs([]);
        toast({
          title: "Logs Limpos",
          description: "Logs de exportação antigos foram removidos.",
        });
      }
    } catch (error) {
      console.error('Erro ao limpar logs:', error);
    }
  };

  const loadWorkflows = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/flowise-workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_workflows',
          data: { filters, page: 1, limit: 50 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.workflows || []);
      }
    } catch (error) {
      toast({
        title: "Erro ao carregar workflows",
        description: "Não foi possível carregar os workflows do Flowise.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/v1/flowise-workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_workflows',
          data: { page: 1, limit: 1 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Calcular estatísticas básicas
        const totalWorkflows = data.pagination?.total || 0;
        const avgComplexity = workflows.length > 0 
          ? Math.round(workflows.reduce((sum, w) => sum + w.complexityScore, 0) / workflows.length)
          : 0;
        
        setStats({
          totalWorkflows,
          syncedWorkflows: workflows.filter(w => w.lastSyncAt).length,
          failedSyncs: workflows.filter(w => !w.lastSyncAt).length,
          avgComplexity,
          lastSync: workflows.length > 0 
            ? workflows.reduce((latest, w) => 
                w.lastSyncAt && (!latest || new Date(w.lastSyncAt) > new Date(latest)) 
                  ? w.lastSyncAt 
                  : latest, 
                workflows[0]?.lastSyncAt || null
              )
            : undefined
        });
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const syncWithFlowise = async () => {
    setSyncing(true);
    try {
      // Testar conexão primeiro
      const testResponse = await fetch('/api/flowise-external-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_connection' })
      });

      const testResult = await testResponse.json();
      
      if (!testResult.success) {
        throw new Error(testResult.message || 'Falha na conexão com o Flowise');
      }

      // Obter workflows do Flowise externo
      const workflowsResponse = await fetch('/api/flowise-external-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_workflows' })
      });

      const workflowsResult = await workflowsResponse.json();
      
      if (!workflowsResult.success) {
        throw new Error(workflowsResult.message || 'Falha ao obter workflows');
      }

      // Processar workflows obtidos
      const externalWorkflows = workflowsResult.data || [];
      let syncedCount = 0;
      let errorCount = 0;

      // Sincronizar cada workflow
      for (const workflow of externalWorkflows) {
        try {
          const syncResponse = await fetch('/api/v1/flowise-workflows', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'register_workflow',
              data: {
                id: workflow.id,
                name: workflow.name,
                flowData: workflow.flowData || '{}',
                type: workflow.type || 'CHATFLOW',
                deployed: workflow.deployed || false,
                isPublic: workflow.isPublic || false,
                category: workflow.category || 'general',
                workspaceId: workflow.workspaceId,
                createdDate: new Date(workflow.createdDate || Date.now()),
                updatedDate: new Date(workflow.updatedDate || Date.now())
              }
            })
          });

          if (syncResponse.ok) {
            syncedCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error('Erro ao sincronizar workflow:', error);
          errorCount++;
        }
      }

      toast({
        title: "Sincronização Concluída",
        description: `${syncedCount} workflows sincronizados com sucesso!${errorCount > 0 ? ` ${errorCount} erros.` : ''}`,
      });
      
      // Recarregar dados
      await Promise.all([loadWorkflows(), loadStats()]);
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast({
        title: "Erro na sincronização",
        description: `Não foi possível sincronizar com o Flowise: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const verifyExportedWorkflow = async (workflowId: string, workflowName: string) => {
    try {
      const flowiseBaseUrl = "https://aaranha-zania.hf.space";
      const verifyUrl = `${flowiseBaseUrl}/api/v1/chatflows/${workflowId}`;
      
      console.log('🔍 Verificando workflow exportado:', verifyUrl);
      
      const response = await fetch(verifyUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer wNFL5HJcOA3RwJdKiVTUWqdzigK7OCUwRKo9KEgjenw`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Workflow verificado com sucesso:', {
          id: data.id,
          name: data.name,
          type: data.type,
          category: data.category,
          isPublic: data.isPublic,
          deployed: data.deployed
        });
        
        // Verificar se o workflow está configurado corretamente para ser visível
        const visibilityCheck = {
          isVisible: data.isPublic || data.type === 'CHATFLOW',
          type: data.type,
          category: data.category,
          isPublic: data.isPublic,
          deployed: data.deployed,
          issues: []
        } as any;
        
        // Identificar possíveis problemas de visibilidade
        if (!data.isPublic && data.type !== 'CHATFLOW') {
          visibilityCheck.issues.push('Workflow não é público e não é do tipo CHATFLOW');
        }
        if (data.category === 'Assistants') {
          visibilityCheck.issues.push('Workflow está na categoria "Assistants" que pode não ser mostrada na lista principal');
        }
        if (data.type === 'ASSISTANT') {
          visibilityCheck.issues.push('Workflow é do tipo "ASSISTANT" que pode não ser mostrado na lista de chatflows');
        }
        
        console.log('🔍 Verificação de visibilidade:', visibilityCheck);
        
        return {
          success: true,
          exists: true,
          workflow: data,
          visibility: visibilityCheck,
          urls: {
            chat: `${flowiseBaseUrl}/chat/${workflowId}`,
            edit: `${flowiseBaseUrl}/canvas/${workflowId}`,
            list: `${flowiseBaseUrl}/chatflows`
          }
        };
      } else {
        console.warn('⚠️ Workflow não encontrado ou não acessível:', response.status);
        return {
          success: false,
          exists: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      console.error('❌ Erro ao verificar workflow exportado:', error);
      return {
        success: false,
        exists: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  };

  const exportToFlowise = async (workflow: FlowiseWorkflow) => {
    setExporting(workflow.id);
    try {
      toast({
        title: "Exportando para Flowise",
        description: `Exportando workflow "${workflow.name}"...`,
      });

      // Verificar se é um agente transformado e preparar dados apropriados
      let exportData;
      let canvasId = workflow.flowiseId;
      
      if (workflow.isFromAgent) {
        // Se é um agente transformado, precisamos obter os dados originais do agente
        console.log('🔄 Exportando agente transformado:', workflow.originalAgentId);
        
        try {
          // Buscar dados completos do agente original
          const agentResponse = await fetch('/admin/api/agents/' + workflow.originalAgentId);
          if (agentResponse.ok) {
            const agentData = await agentResponse.json();
            console.log('✅ Dados do agente obtidos:', agentData);
            
            // Preparar dados completos do agente para transformação
            exportData = {
              id: agentData.id,
              name: agentData.name,
              slug: agentData.slug,
              description: agentData.description,
              type: agentData.type,
              config: agentData.config,
              knowledge: agentData.knowledge,
              workspaceId: agentData.workspaceId,
              roleDefinition: agentData.roleDefinition,
              customInstructions: agentData.customInstructions,
              groups: agentData.groups
            };
            
            // Usar o slug como canvasId para agentes
            canvasId = `agent_${agentData.slug}`;
          } else {
            throw new Error('Não foi possível obter dados do agente original');
          }
        } catch (agentError) {
          console.error('❌ Erro ao obter dados do agente:', agentError);
          throw new Error('Falha ao preparar dados do agente para exportação');
        }
      } else {
        // Se é um workflow Flowise normal, usar os dados existentes
        console.log('🔄 Exportando workflow Flowise existente:', workflow.id);
        
        // Preparar dados para exportação - analisar os campos JSON
        let nodes = [];
        let connections = [];
        
        try {
          nodes = workflow.nodes ? JSON.parse(workflow.nodes) : [];
        } catch (e) {
          console.warn('Erro ao fazer parse dos nodes:', e);
          nodes = [];
        }
        
        try {
          connections = workflow.connections ? JSON.parse(workflow.connections) : [];
        } catch (e) {
          console.warn('Erro ao fazer parse das connections:', e);
          connections = [];
        }

        const flowData = {
          nodes: nodes,
          edges: connections,
          viewport: { x: 0, y: 0, zoom: 1 }
        };

        exportData = {
          id: workflow.id,
          name: workflow.name,
          description: workflow.description || '',
          type: workflow.type,
          flowData: JSON.stringify(flowData), // Converter para string JSON
          deployed: workflow.deployed,
          isPublic: workflow.isPublic,
          category: workflow.category || 'general'
        };
      }

      // Fazer requisição para a API externa do Flowise
      console.log('🚀 Enviando requisição de exportação:', {
        action: 'export_workflow',
        canvasId: canvasId,
        workflowData: exportData,
        isFromAgent: workflow.isFromAgent
      });
      
      const startTime = Date.now();
      const response = await fetch('/api/flowise-external-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export_workflow',
          canvasId: canvasId,
          workflowData: exportData
        })
      });
      
      const duration = Date.now() - startTime;

      console.log('📝 Resposta da API:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        duration: duration
      });

      const result = await response.json();
      console.log('📊 Dados da resposta:', result);

      if (response.ok && result.success) {
        // Obter o ID real do workflow exportado da resposta
        const exportedWorkflowId = result.data?.canvasId || result.data?.flowiseResponse?.id || canvasId;
        const workflowName = result.data?.flowiseResponse?.name || workflow.name;
        
        // Verificar se o workflow realmente foi exportado e está acessível
        console.log('🔍 Verificando se o workflow foi realmente exportado...');
        const verification = await verifyExportedWorkflow(exportedWorkflowId, workflowName);
        
        // Construir URLs para acesso direto
        const flowiseBaseUrl = "https://aaranha-zania.hf.space";
        const directChatUrl = `${flowiseBaseUrl}/chat/${exportedWorkflowId}`;
        const directEditUrl = `${flowiseBaseUrl}/canvas/${exportedWorkflowId}`;
        const chatflowsListUrl = `${flowiseBaseUrl}/chatflows`;
        
        if (verification.success && verification.exists) {
          // Verificar se há problemas de visibilidade
          const hasVisibilityIssues = verification.visibility?.issues && verification.visibility.issues.length > 0;
          
          if (hasVisibilityIssues) {
            // Workflow exportado mas com possíveis problemas de visibilidade
            toast({
              title: "⚠️ Exportado com Problemas de Visibilidade",
              description: (
                <div className="space-y-2">
                  <p>Workflow "{workflowName}" foi exportado, mas pode não aparecer na lista principal:</p>
                  <div className="text-sm text-yellow-700 space-y-1">
                    {verification.visibility.issues.map((issue: string, index: number) => (
                      <div key={index}>• {issue}</div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <a 
                      href={verification.urls.chat} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      🔄 Testar workflow no chat
                    </a>
                    <a 
                      href={verification.urls.edit} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      ✏️ Editar workflow no canvas
                    </a>
                    <a 
                      href={verification.urls.list} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      📋 Ver lista de workflows (pode não estar visível)
                    </a>
                  </div>
                  <p className="text-xs text-gray-500">
                    ID: {exportedWorkflowId} | Tipo: {verification.visibility.type} | Categoria: {verification.visibility.category}
                  </p>
                </div>
              ),
              duration: 25000,
            });
          } else {
            // Exportado com sucesso e sem problemas de visibilidade
            toast({
              title: "✅ Exportação Concluída e Verificada",
              description: (
                <div className="space-y-2">
                  <p className="text-green-700 font-medium">Workflow "{workflowName}" exportado e verificado com sucesso!</p>
                  <div className="flex flex-col gap-1 text-sm">
                    <a 
                      href={verification.urls.chat} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      🔄 Testar workflow no chat
                    </a>
                    <a 
                      href={verification.urls.edit} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      ✏️ Editar workflow no canvas
                    </a>
                    <a 
                      href={verification.urls.list} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      📋 Ver lista completa de workflows
                    </a>
                  </div>
                  <p className="text-xs text-gray-500">
                    ID do workflow: {exportedWorkflowId}
                  </p>
                </div>
              ),
              duration: 20000,
            });
          }
        } else {
          // Exportação aparentemente bem-sucedida, mas verificação falhou
          toast({
            title: "⚠️ Exportação Concluída com Avisos",
            description: (
              <div className="space-y-2">
                <p>Workflow "{workflowName}" foi exportado, mas não foi possível verificar o acesso.</p>
                <p className="text-sm text-yellow-700">
                  Detalhes: {verification.error || 'Erro desconhecido na verificação'}
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <a 
                    href={directChatUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    🔄 Tentar acessar chat diretamente
                  </a>
                  <a 
                    href={chatflowsListUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    📋 Ver lista de workflows
                  </a>
                </div>
              </div>
            ),
            duration: 20000,
          });
        }
        
        // Mostrar detalhes adicionais se disponíveis
        if (result.data?.performance) {
          console.log('📈 Performance da exportação:', result.data.performance);
        }
        
        // Se houve transformação, mostrar detalhes
        if (result.data?.transformation?.applied) {
          console.log('🔄 Detalhes da transformação:', result.data.transformation);
        }
      } else {
        console.error('❌ Erro na exportação:', result);
        
        // Obter logs detalhados do erro
        let errorDetails = null;
        try {
          const logsResponse = await fetch('/api/admin/flowise-workflows/export-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'get_export_logs',
              data: {
                workflowId: workflow.id,
                status: 'ERROR',
                limit: 5
              }
            })
          });
          
          if (logsResponse.ok) {
            const logsResult = await logsResponse.json();
            errorDetails = logsResult.logs;
          }
        } catch (logError) {
          console.warn('Erro ao obter logs de erro:', logError);
        }
        
        // Preparar mensagem de erro detalhada
        let errorMessage = result.error || 'Erro na exportação';
        let errorDebug = '';
        
        if (result.debug) {
          if (result.debug.updateError) {
            errorMessage += ` (Falha na atualização: ${result.debug.updateError.status})`;
          }
          if (result.debug.createError) {
            errorMessage += ` (Falha na criação: ${result.debug.createError.status})`;
          }
        }
        
        if (errorDetails && errorDetails.length > 0) {
          const latestError = errorDetails[0];
          try {
            const details = JSON.parse(latestError.details);
            errorDebug = `\n\n🔍 Detalhes do erro:\n${details.message}`;
            if (details.stack) {
              errorDebug += `\n\n📋 Stack trace disponível nos logs.`;
            }
          } catch (e) {
            errorDebug = `\n\n🔍 Ver logs para mais detalhes.`;
          }
        }
        
        toast({
          title: "❌ Erro na Exportação",
          description: `${errorMessage}${errorDebug}`,
          variant: "destructive",
          duration: 10000, // 10 segundos para permitir leitura
        });
      }
    } catch (error) {
      console.error('💥 Erro crítico na exportação:', error);
      
      // Tentar registrar o erro nos logs
      try {
        await fetch('/api/admin/flowise-workflows/export-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'log_export_error',
            data: {
              workflowId: workflow.id,
              workflowName: workflow.name,
              canvasId: workflow.flowiseId,
              error: {
                message: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : '',
                type: 'FRONTEND_ERROR'
              },
              exportData: {
                name: workflow.name,
                type: workflow.type,
                isFromAgent: workflow.isFromAgent
              }
            }
          })
        });
      } catch (logError) {
        console.warn('Erro ao registrar log de erro:', logError);
      }
      
      toast({
        title: "💥 Erro Crítico na Exportação",
        description: `Não foi possível exportar o workflow "${workflow.name}". Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
        duration: 10000,
      });
    } finally {
      setExporting(null);
    }
  };

  const getComplexityColor = (score: number) => {
    if (score <= 30) return 'text-green-600 bg-green-100';
    if (score <= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CHATFLOW': return <Users className="w-4 h-4" />;
      case 'AGENTFLOW': return <Zap className="w-4 h-4" />;
      case 'MULTIAGENT': return <BarChart3 className="w-4 h-4" />;
      case 'ASSISTANT': return <Database className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CHATFLOW': return 'Chatbot';
      case 'AGENTFLOW': return 'Agente IA';
      case 'MULTIAGENT': return 'Multi-Agentes';
      case 'ASSISTANT': return 'Assistente';
      default: return type;
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    if (filters.type && filters.type !== 'all' && workflow.type !== filters.type) return false;
    if (filters.category && filters.category !== 'all' && workflow.category !== filters.category) return false;
    if (filters.minComplexity && workflow.complexityScore < parseInt(filters.minComplexity)) return false;
    if (filters.maxComplexity && workflow.complexityScore > parseInt(filters.maxComplexity)) return false;
    if (filters.search && !workflow.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciador de Workflows Flowise</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie e sincronize workflows complexos entre Flowise e Zanai
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={syncWithFlowise} disabled={syncing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar com Flowise'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setShowDebugPanel(!showDebugPanel);
              if (!showDebugPanel) {
                loadExportLogs();
              }
            }}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {showDebugPanel ? 'Esconder Debug' : 'Mostrar Debug'}
          </Button>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Novo Workflow
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkflows}</div>
              <p className="text-xs text-muted-foreground">
                Workflows registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sincronizados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.syncedWorkflows}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalWorkflows > 0 ? Math.round((stats.syncedWorkflows / stats.totalWorkflows) * 100) : 0}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complexidade Média</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgComplexity}/100</div>
              <p className="text-xs text-muted-foreground">
                Score de complexidade
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Sincronização</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.lastSync ? new Date(stats.lastSync).toLocaleDateString() : 'Nunca'}
              </div>
              <p className="text-xs text-muted-foreground">
                Data da última sincronização
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros e Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar workflows..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="CHATFLOW">Chatbot</SelectItem>
                <SelectItem value="AGENTFLOW">Agente IA</SelectItem>
                <SelectItem value="MULTIAGENT">Multi-Agentes</SelectItem>
                <SelectItem value="ASSISTANT">Assistente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="general">Geral</SelectItem>
                <SelectItem value="business">Negócios</SelectItem>
                <SelectItem value="technical">Técnico</SelectItem>
                <SelectItem value="creative">Criativo</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Complexidade mín"
              value={filters.minComplexity}
              onChange={(e) => setFilters({...filters, minComplexity: e.target.value})}
              min="0"
              max="100"
            />

            <Input
              type="number"
              placeholder="Complexidade máxima"
              value={filters.maxComplexity}
              onChange={(e) => setFilters({...filters, maxComplexity: e.target.value})}
              min="0"
              max="100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle>Workflows Registrados</CardTitle>
          <CardDescription>
            {filteredWorkflows.length} workflows encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <span className="ml-2">Carregando workflows...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredWorkflows.map((workflow) => (
                <div key={workflow.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(workflow.type)}
                        <h3 className="font-semibold text-lg">{workflow.name || `Workflow ${workflow.id}`}</h3>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getTypeLabel(workflow.type)}
                        </Badge>
                        {workflow.isFromAgent && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Brain className="w-3 h-3 mr-1" />
                            Agente
                          </Badge>
                        )}
                        <Badge className={getComplexityColor(workflow.complexityScore)}>
                          Complexidade: {workflow.complexityScore}/100
                        </Badge>
                        {workflow.deployed && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Deployed
                          </Badge>
                        )}
                        {workflow.lastSyncAt && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Sincronizado
                          </Badge>
                        )}
                      </div>
                      
                      {workflow.description && (
                        <p className="text-muted-foreground mb-3">{workflow.description}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Database className="w-4 h-4" />
                          {workflow.nodeCount} nós
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          {workflow.edgeCount} conexões
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Profundidade: {workflow.maxDepth}
                        </span>
                      </div>

                      {/* Capacidades */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(() => {
                          try {
                            const capabilities = typeof workflow.capabilities === 'string' 
                              ? JSON.parse(workflow.capabilities) 
                              : workflow.capabilities || {};
                            
                            return (
                              <>
                                {capabilities.canHandleFileUpload && (
                                  <Badge variant="secondary" className="text-xs">
                                    Upload de Arquivos
                                  </Badge>
                                )}
                                {capabilities.hasStreaming && (
                                  <Badge variant="secondary" className="text-xs">
                                    Streaming
                                  </Badge>
                                )}
                                {capabilities.supportsMultiLanguage && (
                                  <Badge variant="secondary" className="text-xs">
                                    Multi-idioma
                                  </Badge>
                                )}
                                {capabilities.hasMemory && (
                                  <Badge variant="secondary" className="text-xs">
                                    Memória
                                  </Badge>
                                )}
                                {capabilities.usesExternalAPIs && (
                                  <Badge variant="secondary" className="text-xs">
                                    APIs Externas
                                  </Badge>
                                )}
                                {capabilities.hasAnalytics && (
                                  <Badge variant="secondary" className="text-xs">
                                    Analytics
                                  </Badge>
                                )}
                                {capabilities.supportsParallelProcessing && (
                                  <Badge variant="secondary" className="text-xs">
                                    Processamento Paralelo
                                  </Badge>
                                )}
                                {capabilities.hasErrorHandling && (
                                  <Badge variant="secondary" className="text-xs">
                                    Tratamento de Erros
                                  </Badge>
                                )}
                              </>
                            );
                          } catch (error) {
                            console.warn('Erro ao fazer parse das capabilities:', error);
                            return null;
                          }
                        })()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Visualizar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => exportToFlowise(workflow)}
                        disabled={exporting === workflow.id}
                      >
                        {exporting === workflow.id ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-1" />
                        )}
                        {exporting === workflow.id ? 'Exportando...' : (workflow.isFromAgent ? 'Exportar Agente' : 'Exportar para Flowise')}
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredWorkflows.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum workflow encontrado com os filtros atuais.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setFilters({
                    type: '',
                    category: '',
                    minComplexity: '',
                    maxComplexity: '',
                    search: ''
                  })}>
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Panel */}
      {showDebugPanel && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="w-5 h-5" />
                Painel de Debug - Exportação de Workflows
              </CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={loadExportLogs} disabled={loadingLogs}>
                  <RefreshCw className={`w-4 h-4 mr-1 ${loadingLogs ? 'animate-spin' : ''}`} />
                  Atualizar Logs
                </Button>
                <Button size="sm" variant="outline" onClick={clearExportLogs}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Limpar Logs
                </Button>
              </div>
            </div>
            <CardDescription>
              Logs detalhados de exportação para diagnóstico de problemas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingLogs ? (
                <div className="text-center py-4">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" />
                  <p>Carregando logs...</p>
                </div>
              ) : exportLogs.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum log de exportação encontrado.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {exportLogs.map((log) => {
                    let details = {};
                    try {
                      details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details;
                    } catch (e) {
                      // Ignorar erro de parse
                    }

                    const isError = log.status === 'ERROR';
                    const isSuccess = log.status === 'SUCCESS';

                    return (
                      <div 
                        key={log.id} 
                        className={`p-3 rounded-lg border ${
                          isError 
                            ? 'border-red-200 bg-red-100 dark:bg-red-900/20 dark:border-red-800' 
                            : isSuccess 
                              ? 'border-green-200 bg-green-100 dark:bg-green-900/20 dark:border-green-800'
                              : 'border-gray-200 bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {isError ? (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            ) : isSuccess ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-600" />
                            )}
                            <span className="font-medium text-sm">
                              {log.action}
                            </span>
                            <Badge variant={isError ? "destructive" : isSuccess ? "default" : "secondary"}>
                              {log.status}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="text-sm space-y-1">
                          {log.workflowName && (
                            <p><strong>Workflow:</strong> {log.workflowName}</p>
                          )}
                          {log.canvasId && (
                            <p><strong>Canvas ID:</strong> {log.canvasId}</p>
                          )}
                          
                          {details.message && (
                            <p className={`${isError ? 'text-red-700 dark:text-red-300' : ''}`}>
                              <strong>Mensagem:</strong> {details.message}
                            </p>
                          )}
                          
                          {details.error && (
                            <p className="text-red-700 dark:text-red-300 text-xs">
                              <strong>Erro:</strong> {details.error}
                            </p>
                          )}
                          
                          {details.updateError && (
                            <div className="text-xs">
                              <strong>Erro na atualização:</strong> HTTP {details.updateError.status}
                            </div>
                          )}
                          
                          {details.createError && (
                            <div className="text-xs">
                              <strong>Erro na criação:</strong> HTTP {details.createError.status}
                            </div>
                          )}
                          
                          {details.performance && (
                            <div className="text-xs">
                              <strong>Performance:</strong> {details.performance.duration}ms
                            </div>
                          )}
                        </div>
                        
                        {details.stack && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer text-blue-600 hover:text-blue-800">
                              Ver Stack Trace
                            </summary>
                            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                              {details.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}