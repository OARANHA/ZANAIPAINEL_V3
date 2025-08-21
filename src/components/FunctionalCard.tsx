'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Heart, 
  BarChart3, 
  GraduationCap, 
  Bot, 
  Stethoscope, 
  Activity, 
  FileText, 
  Monitor,
  PieChart,
  Briefcase,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  MessageSquare,
  BookOpen,
  ClipboardCheck,
  Calendar,
  PenTool,
  Layout,
  CheckCircle,
  Search,
  Loader2,
  AlertCircle,
  Play,
  X,
  Maximize2,
  Download
} from 'lucide-react';
import { getAgentTypeConfig, getActionsByType, AgentAction, AgentTypeConfig } from '@/types/agent-types';

// Estados do card
export type CardState = 'idle' | 'input' | 'processing' | 'result' | 'error';

interface FunctionalCardProps {
  agent: {
    id: string;
    name: string;
    description: string;
    type?: string;
    config?: string;
    knowledge?: string;
    status?: string;
  };
  className?: string;
  compact?: boolean;
}

interface ExecutionResult {
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

// Mapeamento de ícones para ações
const ACTION_ICONS: Record<string, React.ComponentType<any>> = {
  Stethoscope,
  Activity,
  FileText,
  Monitor,
  PieChart,
  Briefcase,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  MessageSquare,
  BookOpen,
  ClipboardCheck,
  Calendar,
  PenTool,
  Layout,
  CheckCircle,
  Search,
  Play
};

export default function FunctionalCard({ agent, className = '', compact = false }: FunctionalCardProps) {
  const [cardState, setCardState] = useState<CardState>('idle');
  const [selectedAction, setSelectedAction] = useState<AgentAction | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [agentConfig, setAgentConfig] = useState<AgentTypeConfig | null>(null);
  const [availableActions, setAvailableActions] = useState<AgentAction[]>([]);

  // Determinar o tipo do agente e carregar configuração
  useEffect(() => {
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

    const config = getAgentTypeConfig(agentType);
    const actions = getActionsByType(agentType);
    
    setAgentConfig(config);
    setAvailableActions(actions);
  }, [agent]);

  // Simular progresso durante processamento
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (cardState === 'processing') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cardState]);

  const handleActionSelect = (action: AgentAction) => {
    setSelectedAction(action);
    if (action.requiresInput) {
      setCardState('input');
      setInputValue('');
    } else {
      executeAction(action, '');
    }
  };

  const executeAction = async (action: AgentAction, input: string) => {
    setCardState('processing');
    setProgress(0);
    setExecutionResult(null);

    try {
      const response = await fetch('/api/card/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agent.id,
          actionId: action.id,
          input,
          context: {
            agentConfig: agent.config,
            agentKnowledge: agent.knowledge
          }
        }),
      });

      const result: ExecutionResult = await response.json();
      
      setProgress(100);
      setExecutionResult(result);
      
      if (result.success) {
        setCardState('result');
      } else {
        setCardState('error');
      }
    } catch (error) {
      console.error('Erro ao executar ação:', error);
      setExecutionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao executar ação'
      });
      setCardState('error');
    }
  };

  const handleSubmit = () => {
    if (selectedAction) {
      executeAction(selectedAction, inputValue);
    }
  };

  const handleReset = () => {
    setCardState('idle');
    setSelectedAction(null);
    setInputValue('');
    setExecutionResult(null);
    setProgress(0);
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = ACTION_ICONS[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Play className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (!agentConfig) return 'bg-gray-100 text-gray-600';
    return agentConfig.color.primary;
  };

  const getSecondaryColor = () => {
    if (!agentConfig) return 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900';
    
    // Cores mais escuras e com melhor contraste para o fundo do card
    const colorMap: Record<string, string> = {
      'bg-red-100': 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 border-red-200 dark:border-red-800/50',
      'bg-pink-100': 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30 border-pink-200 dark:border-pink-800/50',
      'bg-blue-100': 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 border-blue-200 dark:border-blue-800/50',
      'bg-green-100': 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 border-green-200 dark:border-green-800/50',
      'bg-purple-100': 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 border-purple-200 dark:border-purple-800/50',
      'bg-indigo-100': 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30 border-indigo-200 dark:border-indigo-800/50',
      'bg-gray-100': 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700'
    };
    
    return colorMap[agentConfig.color.secondary] || 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700';
  };

  if (compact) {
    return (
      <Card className={`hover:shadow-lg transition-all duration-300 ${getSecondaryColor()} border ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {agentConfig && (
                <div className={`w-8 h-8 rounded-full ${getStatusColor()} flex items-center justify-center`}>
                  {(() => {
                    const IconComponent = ACTION_ICONS[agentConfig.icon];
                    return IconComponent ? <IconComponent className="w-4 h-4 text-white" /> : null;
                  })()}
                </div>
              )}
              <div>
                <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
                <CardDescription className="text-xs">
                  {agentConfig?.name || 'Agente'}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {availableActions.length} ações
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {availableActions.slice(0, 4).map((action) => (
              <Button
                key={action.id}
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => handleActionSelect(action)}
              >
                {getIconComponent(action.icon)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${getSecondaryColor()} border ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {agentConfig && (
              <div className={`w-12 h-12 rounded-full ${getStatusColor()} flex items-center justify-center`}>
                {(() => {
                  const IconComponent = ACTION_ICONS[agentConfig.icon];
                  return IconComponent ? <IconComponent className="w-6 h-6 text-white" /> : null;
                })()}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription className="text-sm">
                {agentConfig?.description || agent.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={`${agentConfig?.color.accent} font-medium`}>
              {agentConfig?.name || 'Agente'}
            </Badge>
            {agent.status === 'active' && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium">
                Ativo
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Estado Idle - Mostrar ações disponíveis */}
        {cardState === 'idle' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              {agentConfig?.defaultPrompt || 'Selecione uma ação para executar:'}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-accent/50 border-border/50 hover:border-border"
                  onClick={() => handleActionSelect(action)}
                >
                  <div className="flex items-center space-x-2 w-full">
                    {getIconComponent(action.icon)}
                    <span className="font-medium text-sm">{action.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground text-left">
                    {action.description}
                  </span>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {action.category}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Estado Input - Coletar informações do usuário */}
        {cardState === 'input' && selectedAction && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getIconComponent(selectedAction.icon)}
                <span className="font-medium">{selectedAction.name}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={handleReset}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {selectedAction.description}
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {selectedAction.inputPlaceholder || 'Digite sua solicitação:'}
              </label>
              {selectedAction.expectedOutput === 'file' ? (
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={selectedAction.inputPlaceholder}
                  className="min-h-24"
                />
              ) : (
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={selectedAction.inputPlaceholder}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} disabled={!inputValue.trim()}>
                {getIconComponent(selectedAction.icon)}
                Executar
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Estado Processing - Mostrar progresso */}
        {cardState === 'processing' && selectedAction && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-medium">{selectedAction.loadingMessage}</span>
            </div>
            
            <Progress value={progress} className="w-full" />
            
            <div className="text-sm text-muted-foreground">
              Executando {selectedAction.name}...
            </div>
          </div>
        )}

        {/* Estado Result - Mostrar resultado */}
        {cardState === 'result' && executionResult && selectedAction && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-600">
                  {selectedAction.successMessage}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleReset}>
                  Nova Ação
                </Button>
                {executionResult.result && (
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                )}
              </div>
            </div>
            
            {executionResult.processingTime && (
              <div className="text-xs text-muted-foreground">
                Processado em {executionResult.processingTime}ms
              </div>
            )}
            
            <div className="bg-muted/50 p-4 rounded-lg max-h-64 overflow-y-auto">
              {selectedAction.expectedOutput === 'text' && (
                <div className="text-sm whitespace-pre-wrap">
                  {typeof executionResult.result === 'string' 
                    ? executionResult.result 
                    : JSON.stringify(executionResult.result, null, 2)
                  }
                </div>
              )}
              
              {selectedAction.expectedOutput === 'json' && (
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(executionResult.result, null, 2)}
                </pre>
              )}
              
              {selectedAction.expectedOutput === 'chart' && (
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Gráfico gerado com sucesso</p>
                </div>
              )}
              
              {selectedAction.expectedOutput === 'file' && (
                <div className="text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Arquivo gerado com sucesso</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado Error - Mostrar erro */}
        {cardState === 'error' && executionResult && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {executionResult.error || 'Ocorreu um erro durante a execução.'}
              </AlertDescription>
            </Alert>
            
            <div className="flex space-x-2">
              <Button onClick={handleReset} variant="outline">
                Tentar Novamente
              </Button>
              <Button onClick={handleReset} variant="ghost">
                Voltar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}