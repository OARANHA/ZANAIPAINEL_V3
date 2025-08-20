'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Network, 
  Play, 
  Pause, 
  Settings, 
  Zap,
  Clock,
  Target,
  Layers,
  GitBranch,
  AlertTriangle
} from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  description: string;
  config: Record<string, any>;
}

interface WorkflowEdge {
  source: string;
  target: string;
  type: string;
}

interface WorkflowPreviewProps {
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
  agents: Array<{
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'training';
  }>;
  onExecute?: () => void;
  onEdit?: () => void;
  isExecutable?: boolean;
}

export default function WorkflowPreview({
  name,
  description,
  nodes,
  edges,
  complexity,
  estimatedTime,
  agents,
  onExecute,
  onEdit,
  isExecutable = true
}: WorkflowPreviewProps) {
  const workflowStats = useMemo(() => {
    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      agentCount: agents.length,
      activeAgents: agents.filter(agent => agent.status === 'active').length,
      complexityScore: complexity === 'simple' ? 25 : complexity === 'medium' ? 50 : 75,
      estimatedDuration: estimatedTime
    };
  }, [nodes, edges, agents, complexity, estimatedTime]);

  const getNodeIcon = (nodeType: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'StartNode': Play,
      'EndNode': Target,
      'LLMNode': Zap,
      'ToolNode': Settings,
      'CustomNode': Layers,
      'ConditionNode': GitBranch,
      'ParallelNode': Network
    };
    
    return iconMap[nodeType] || Settings;
  };

  const getNodeColor = (nodeType: string) => {
    const colorMap: Record<string, string> = {
      'StartNode': 'bg-green-100 text-green-700 border-green-200',
      'EndNode': 'bg-red-100 text-red-700 border-red-200',
      'LLMNode': 'bg-blue-100 text-blue-700 border-blue-200',
      'ToolNode': 'bg-purple-100 text-purple-700 border-purple-200',
      'CustomNode': 'bg-orange-100 text-orange-700 border-orange-200',
      'ConditionNode': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'ParallelNode': 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    
    return colorMap[nodeType] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const renderWorkflowFlow = () => {
    if (nodes.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Network className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum nó no workflow</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Workflow flow visualization */}
        <div className="space-y-4">
          {nodes.map((node, index) => {
            const IconComponent = getNodeIcon(node.type);
            const nodeColor = getNodeColor(node.type);
            const isLastNode = index === nodes.length - 1;
            
            return (
              <div key={node.id} className="flex items-center">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 ${nodeColor} flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{node.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {node.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
                  
                  {node.config.agentId && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Agente: {agents.find(a => a.id === node.config.agentId)?.name || 'Desconhecido'}
                      </Badge>
                    </div>
                  )}
                </div>
                
                {!isLastNode && (
                  <div className="flex-shrink-0 ml-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <GitBranch className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                {name}
              </CardTitle>
              <CardDescription className="mt-2">{description}</CardDescription>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Settings className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
              {onExecute && isExecutable && (
                <Button size="sm" onClick={onExecute}>
                  <Play className="w-4 h-4 mr-2" />
                  Executar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nós</p>
                <p className="text-2xl font-bold">{workflowStats.nodeCount}</p>
              </div>
              <Layers className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conexões</p>
                <p className="text-2xl font-bold">{workflowStats.edgeCount}</p>
              </div>
              <GitBranch className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Agentes</p>
                <p className="text-2xl font-bold">{workflowStats.agentCount}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Complexidade</p>
                <Badge variant={complexity === 'simple' ? 'secondary' : complexity === 'medium' ? 'default' : 'destructive'}>
                  {complexity === 'simple' ? 'Simples' : complexity === 'medium' ? 'Médio' : 'Complexo'}
                </Badge>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Fluxo do Workflow</CardTitle>
          <CardDescription>
            Visualização sequencial do fluxo de trabalho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-96">
            {renderWorkflowFlow()}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Agentes Envolvidos</CardTitle>
          <CardDescription>
            Agentes que serão utilizados neste workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    agent.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Zap className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{agent.name}</h4>
                    <Badge variant={agent.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {agent.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estimated Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Informações de Execução
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tempo Estimado</label>
              <p className="text-lg font-medium">{workflowStats.estimatedDuration}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status de Execução</label>
              <Badge variant={isExecutable ? 'default' : 'secondary'}>
                {isExecutable ? 'Pronto para executar' : 'Requer configuração'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}