'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Loader2, CheckCircle, XCircle, Clock, FileText, Settings } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  status: 'active' | 'inactive' | 'training';
}

interface AgentExecutionDialogProps {
  agent: Agent;
  children: React.ReactNode;
  initialInput?: string;
}

interface Execution {
  id: string;
  input: string;
  output?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  result?: string;
  createdAt?: string;
}

export default function AgentExecutionDialog({ agent, children, initialInput }: AgentExecutionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [input, setInput] = useState('');
  const [currentExecution, setCurrentExecution] = useState<Execution | null>(null);
  const [executionHistory, setExecutionHistory] = useState<Execution[]>([]);
  const [activeTab, setActiveTab] = useState('execute');

  const loadExecutionHistory = async () => {
    try {
      const response = await fetch(`/api/execute?agentId=${agent.id}`);
      if (response.ok) {
        const data = await response.json();
        setExecutionHistory(data);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico de execuções:', error);
    }
  };

  const executeAgent = async () => {
    if (!input.trim()) return;

    setIsExecuting(true);
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agent.id,
          input: input.trim(),
          context: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentExecution({
          id: result.executionId,
          input: input.trim(),
          status: 'running',
          startedAt: new Date().toISOString()
        });
        setInput('');
        setActiveTab('results');
        
        // Iniciar polling para verificar o status
        pollExecutionStatus(result.executionId);
      } else {
        const error = await response.json();
        alert(`Erro ao executar agente: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao executar agente:', error);
      alert('Erro ao executar agente');
    } finally {
      setIsExecuting(false);
    }
  };

  const pollExecutionStatus = async (executionId: string) => {
    let pollCount = 0;
    const maxPolls = 60; // 60 segundos de polling (1 * 60)
    const pollInterval = setInterval(async () => {
      try {
        pollCount++;
        console.log(`Polling execution ${executionId} - attempt ${pollCount}/${maxPolls}`);
        
        const response = await fetch(`/api/execute?executionId=${executionId}`);
        if (response.ok) {
          const execution: Execution = await response.json();
          console.log(`Execution ${executionId} status: ${execution.status}`);
          setCurrentExecution(execution);
          
          if (execution.status === 'completed' || execution.status === 'failed') {
            console.log(`Execution ${executionId} finished with status: ${execution.status}`);
            clearInterval(pollInterval);
            loadExecutionHistory(); // Recarregar histórico
          }
        } else {
          console.error(`Failed to fetch execution ${executionId} status:`, response.status);
        }
      } catch (error) {
        console.error('Erro ao verificar status da execução:', error);
        clearInterval(pollInterval);
      }
      
      // Parar polling após maxPolls tentativas
      if (pollCount >= maxPolls) {
        console.log(`Polling stopped after ${maxPolls} attempts for execution ${executionId}`);
        clearInterval(pollInterval);
        
        // Marcar como timeout se ainda estiver running
        if (currentExecution?.status === 'running') {
          setCurrentExecution(prev => prev ? {
            ...prev,
            status: 'failed',
            error: 'Timeout: A execução demorou mais do que o esperado'
          } : null);
        }
      }
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (startedAt?: string, completedAt?: string) => {
    if (!startedAt) return '-';
    if (!completedAt) return 'Em execução...';
    
    const start = new Date(startedAt).getTime();
    const end = new Date(completedAt).getTime();
    const duration = end - start;
    
    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}min`;
  };

  useEffect(() => {
    if (isOpen) {
      loadExecutionHistory();
      if (initialInput) {
        setInput(initialInput);
      }
    }
  }, [isOpen, agent.id, initialInput]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Executar Agente: {agent.name}</DialogTitle>
              <DialogDescription className="mt-2">
                {agent.description}
              </DialogDescription>
            </div>
            <Badge className={
              agent.status === 'active' ? 'bg-green-100 text-green-800' : 
              agent.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
              'bg-blue-100 text-blue-800'
            }>
              {agent.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="execute">Executar Agente</TabsTrigger>
            <TabsTrigger value="results">Resultado Atual</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="execute" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Input para o Agente
                </label>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Descreva o que você deseja que o agente faça..."
                  className="min-h-32"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Digite uma instrução clara para o agente processar
                </div>
                <Button 
                  onClick={executeAgent} 
                  disabled={isExecuting || !input.trim() || agent.status !== 'active'}
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Executando...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Executar Agente
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {currentExecution ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(currentExecution.status)}
                    <Badge className={getStatusColor(currentExecution.status)}>
                      {currentExecution.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Duração: {formatDuration(currentExecution.startedAt, currentExecution.completedAt)}
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Input
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-3 rounded-md">
                      <pre className="text-sm whitespace-pre-wrap">
                        {currentExecution.input}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
                
                {currentExecution.status === 'running' && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                          <span className="text-lg font-medium">Processando sua solicitação...</span>
                        </div>
                        <div className="text-sm text-muted-foreground text-center max-w-md">
                          O agente está analisando sua solicitação e gerando uma resposta. Isso pode levar alguns segundos.
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Aguardando resposta da IA...
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {currentExecution.output && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                        Output
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64 w-full border rounded-md p-4 bg-muted/50">
                        <div className="prose prose-sm max-w-none">
                          <pre className="text-sm whitespace-pre-wrap">
                            {currentExecution.output}
                          </pre>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
                
                {currentExecution.error && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <XCircle className="w-5 h-5 mr-2 text-red-500" />
                        Erro
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-800">{currentExecution.error}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Play className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma Execução Atual</h3>
                <p className="text-muted-foreground mb-4">
                  Execute o agente para ver os resultados aqui
                </p>
                <Button onClick={() => setActiveTab('execute')}>
                  Ir para Execução
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Histórico de Execuções</h3>
                <Button variant="outline" size="sm" onClick={loadExecutionHistory}>
                  <Settings className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              </div>
              
              {executionHistory.length > 0 ? (
                <div className="space-y-3">
                  {executionHistory.map((execution) => (
                    <Card key={execution.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {getStatusIcon(execution.status)}
                              <Badge className={getStatusColor(execution.status)}>
                                {execution.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(execution.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-sm">
                              <div className="font-medium mb-1">Input:</div>
                              <div className="text-muted-foreground line-clamp-2">
                                {execution.input}
                              </div>
                            </div>
                            {execution.output && (
                              <div className="text-sm mt-2">
                                <div className="font-medium mb-1">Output:</div>
                                <div className="text-muted-foreground line-clamp-2">
                                  {execution.output}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground ml-4">
                            {formatDuration(execution.startedAt, execution.completedAt)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum Histórico</h3>
                  <p className="text-muted-foreground">
                    Este agente ainda não foi executado
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}