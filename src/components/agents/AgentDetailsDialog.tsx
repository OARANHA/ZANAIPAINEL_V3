'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Eye, 
  Play, 
  Settings, 
  Calendar, 
  BarChart3, 
  FileText, 
  Download, 
  Share2,
  Copy,
  CheckCircle,
  Clock,
  Zap,
  Brain,
  Users,
  Star,
  Code
} from 'lucide-react';

interface AgentDetailsDialogProps {
  agent: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExecute?: (agent: any) => void;
  onEdit?: (agent: any) => void;
}

export default function AgentDetailsDialog({ 
  agent, 
  open, 
  onOpenChange, 
  onExecute,
  onEdit 
}: AgentDetailsDialogProps) {
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleCopyConfig = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(agent, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar configuração:', error);
    }
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await onExecute?.(agent);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(agent, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${agent.name}-config.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'template': return Star;
      case 'custom': return Code;
      case 'composed': return Users;
      default: return Brain;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'template': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'custom': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'composed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'training': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const TypeIcon = getTypeIcon(agent.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <TypeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">{agent.name}</DialogTitle>
                <DialogDescription className="flex items-center space-x-2 mt-1">
                  <Badge className={getTypeColor(agent.type)}>
                    {agent.type}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                    <span className="text-sm text-muted-foreground capitalize">
                      {agent.status}
                    </span>
                  </div>
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="hidden sm:flex"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyConfig}
              >
                {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Visão Geral</span>
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Configuração</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Estatísticas</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Atividade</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                      <p className="mt-1 text-sm">{agent.description || 'Sem descrição'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Workspace</label>
                      <p className="mt-1 text-sm">{agent.workspace?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Slug</label>
                      <p className="mt-1 text-sm font-mono">{agent.slug}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                      <p className="mt-1 text-sm">
                        {new Date(agent.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={handleExecute}
                      disabled={isExecuting || agent.status !== 'active'}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      {isExecuting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Executando...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Executar Agente
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => onEdit?.(agent)}
                      className="w-full"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Editar Agente
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleExport}
                      className="w-full sm:hidden"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Configuração
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {agent.knowledge && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Brain className="w-5 h-5" />
                      <span>Base de Conhecimento</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{agent.knowledge}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="config" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Configuração do Agente</span>
                  </CardTitle>
                  <CardDescription>
                    Configuração detalhada do agente em formato JSON
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {JSON.stringify(agent, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {agent.customInstructions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instruções Personalizadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{agent.customInstructions}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-sm text-muted-foreground">Total Execuções</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">96%</p>
                        <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Zap className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">1.2s</p>
                        <p className="text-sm text-muted-foreground">Tempo Médio</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Detalhada</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Precisão</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94%' }} />
                        </div>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Velocidade</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }} />
                        </div>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Satisfação</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }} />
                        </div>
                        <span className="text-sm font-medium">96%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Atividade Recente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Execução bem-sucedida</p>
                        <p className="text-xs text-muted-foreground">Análise de documento - há 2 minutos</p>
                      </div>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Configuração atualizada</p>
                        <p className="text-xs text-muted-foreground">Novas instruções adicionadas - há 1 hora</p>
                      </div>
                      <Settings className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Treinamento concluído</p>
                        <p className="text-xs text-muted-foreground">Modelo otimizado com novos dados - há 3 horas</p>
                      </div>
                      <Brain className="w-4 h-4 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}