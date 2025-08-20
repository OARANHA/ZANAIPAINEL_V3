'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Sparkles, 
  Wand2, 
  Eye, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  FileText,
  Network,
  Zap,
  GitBranch,
  Settings
} from 'lucide-react';
import WorkflowPreview from './WorkflowPreview';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  status: 'active' | 'inactive' | 'training';
}

interface GeneratedWorkflow {
  name: string;
  description: string;
  nodes: Array<{
    id: string;
    type: string;
    name: string;
    description: string;
    config: Record<string, any>;
  }>;
  edges: Array<{
    source: string;
    target: string;
    type: string;
  }>;
  agents: string[];
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: string;
}

interface AIWorkflowGeneratorProps {
  agents: Agent[];
  workspaceId: string;
  onWorkflowGenerated: (workflow: GeneratedWorkflow) => void;
  onWorkflowSaved: (composition: any) => void;
}

export default function AIWorkflowGenerator({
  agents,
  workspaceId,
  onWorkflowGenerated,
  onWorkflowSaved
}: AIWorkflowGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [workflowType, setWorkflowType] = useState<'sequential' | 'parallel' | 'conditional'>('sequential');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<GeneratedWorkflow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Por favor, descreva o workflow que deseja criar');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      const response = await fetch('/admin/api/compositions/generate-ai-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          workflowType,
          complexity,
          workspaceId,
          availableAgents: agents
        }),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (response.ok) {
        const workflow = await response.json();
        setGeneratedWorkflow(workflow);
        onWorkflowGenerated(workflow);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao gerar workflow');
      }
    } catch (error) {
      console.error('Erro ao gerar workflow:', error);
      setError('Erro ao gerar workflow. Tente novamente.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  const handleSave = async () => {
    if (!generatedWorkflow) return;

    setIsSaving(true);
    try {
      // First, save as a regular composition
      const compositionResponse = await fetch('/admin/api/compositions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: generatedWorkflow.name,
          description: generatedWorkflow.description,
          workspaceId,
          agents: generatedWorkflow.agents,
          config: JSON.stringify({
            nodes: generatedWorkflow.nodes,
            edges: generatedWorkflow.edges,
            workflowType,
            complexity: generatedWorkflow.complexity,
            aiGenerated: true,
            estimatedTime: generatedWorkflow.estimatedTime
          })
        }),
      });

      if (compositionResponse.ok) {
        const composition = await composition.json();
        
        // Then, convert and save as Flowise workflow
        try {
          const flowiseResponse = await fetch('/admin/api/compositions/save-flowise-workflow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              generatedWorkflow,
              workspaceId,
              compositionId: composition.id
            }),
          });

          if (flowiseResponse.ok) {
            const flowiseResult = await flowiseResponse.json();
            console.log('Flowise workflow saved:', flowiseResult);
          } else {
            console.warn('Failed to save Flowise workflow, but composition was saved successfully');
          }
        } catch (flowiseError) {
          console.warn('Error saving Flowise workflow:', flowiseError);
          // Don't fail the entire save if Flowise conversion fails
        }

        onWorkflowSaved(composition);
        setIsOpen(false);
        setGeneratedWorkflow(null);
        setDescription('');
      } else {
        const errorData = await compositionResponse.json();
        setError(errorData.error || 'Erro ao salvar composição');
      }
    } catch (error) {
      console.error('Erro ao salvar composição:', error);
      setError('Erro ao salvar composição. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetGenerator = () => {
    setGeneratedWorkflow(null);
    setDescription('');
    setError(null);
  };

  const handleExecuteWorkflow = (workflow: GeneratedWorkflow) => {
    // Implementar execução do workflow
    console.log('Executando workflow:', workflow.name);
    
    // Aqui você pode:
    // 1. Salvar o workflow como composição
    // 2. Executar a composição
    // 3. Mostrar resultados da execução
    
    // Por enquanto, vamos mostrar uma mensagem de sucesso
    alert(`Workflow "${workflow.name}" enviado para execução!`);
  };

  const handleEditWorkflow = (workflow: GeneratedWorkflow) => {
    // Implementar edição do workflow
    console.log('Editando workflow:', workflow.name);
    
    // Aqui você pode:
    // 1. Abrir um modal de edição
    // 2. Permitir modificar nós e conexões
    // 3. Alterar agentes envolvidos
    // 4. Ajustar configurações
    
    // Por enquanto, vamos permitir editar a descrição
    const newDescription = prompt('Edite a descrição do workflow:', workflow.description);
    if (newDescription && newDescription !== workflow.description) {
      setGeneratedWorkflow({
        ...workflow,
        description: newDescription
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Gerar Workflow com IA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-600" />
            Gerador de Workflow com IA
          </DialogTitle>
          <DialogDescription>
            Descreva o workflow que deseja criar e nossa IA irá gerar automaticamente a estrutura ideal
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[calc(90vh-200px)]">
          <ScrollArea className="flex-1">
            <div className="space-y-6 p-1">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!generatedWorkflow ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Descreva seu Workflow</CardTitle>
                    <CardDescription>
                      Seja específico sobre o que você deseja que o workflow faça, quais agentes envolver e o fluxo de trabalho
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Descrição do Workflow *
                      </label>
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ex: Crie um workflow que analise sentimentos de textos, classifique em categorias e gere um relatório resumido usando agentes especializados..."
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Tipo de Workflow
                        </label>
                        <Select value={workflowType} onValueChange={(value: any) => setWorkflowType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sequential">Sequencial</SelectItem>
                            <SelectItem value="parallel">Paralelo</SelectItem>
                            <SelectItem value="conditional">Condicional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Complexidade
                        </label>
                        <Select value={complexity} onValueChange={(value: any) => setComplexity(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">Simples</SelectItem>
                            <SelectItem value="medium">Médio</SelectItem>
                            <SelectItem value="complex">Complexo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {isGenerating && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Gerando workflow...</span>
                          <span>{Math.round(generationProgress)}%</span>
                        </div>
                        <Progress value={generationProgress} className="w-full" />
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleGenerate} 
                        disabled={isGenerating || !description.trim()}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Gerar Workflow
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Workflow Gerado com Sucesso
                      </CardTitle>
                      <CardDescription>
                        Revise o workflow gerado pela IA antes de salvar
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Nome</label>
                          <p className="font-medium">{generatedWorkflow.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Complexidade</label>
                          <Badge variant={generatedWorkflow.complexity === 'simple' ? 'secondary' : generatedWorkflow.complexity === 'medium' ? 'default' : 'destructive'}>
                            {generatedWorkflow.complexity === 'simple' ? 'Simples' : generatedWorkflow.complexity === 'medium' ? 'Médio' : 'Complexo'}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                        <p className="text-sm">{generatedWorkflow.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="preview">Visualização</TabsTrigger>
                      <TabsTrigger value="agents">Agentes</TabsTrigger>
                      <TabsTrigger value="structure">Estrutura</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="space-y-4">
                      <WorkflowPreview
                        name={generatedWorkflow.name}
                        description={generatedWorkflow.description}
                        nodes={generatedWorkflow.nodes}
                        edges={generatedWorkflow.edges}
                        complexity={generatedWorkflow.complexity}
                        estimatedTime={generatedWorkflow.estimatedTime}
                        agents={generatedWorkflow.agents.map(agentId => {
                          const agent = agents.find(a => a.id === agentId);
                          return {
                            id: agentId,
                            name: agent?.name || 'Agente desconhecido',
                            description: agent?.description || 'Sem descrição',
                            status: agent?.status || 'inactive'
                          };
                        })}
                        onExecute={() => {
                          // Implementar execução do workflow
                          handleExecuteWorkflow(generatedWorkflow);
                        }}
                        onEdit={() => {
                          // Implementar edição do workflow
                          handleEditWorkflow(generatedWorkflow);
                        }}
                        isExecutable={generatedWorkflow.agents.some(agentId => {
                          const agent = agents.find(a => a.id === agentId);
                          return agent?.status === 'active';
                        })}
                      />
                    </TabsContent>

                    <TabsContent value="agents" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Agentes Selecionados ({generatedWorkflow.agents.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {generatedWorkflow.agents.map((agentId, index) => {
                              const agent = agents.find(a => a.id === agentId);
                              return (
                                <div key={agentId} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium">{index + 1}</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium">{agent?.name || 'Agente desconhecido'}</p>
                                    <p className="text-sm text-muted-foreground">{agent?.description || 'Sem descrição'}</p>
                                  </div>
                                  <Badge variant={agent?.status === 'active' ? 'default' : 'secondary'}>
                                    {agent?.status === 'active' ? 'Ativo' : 'Inativo'}
                                  </Badge>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="structure" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Estrutura do Workflow
                          </CardTitle>
                          <CardDescription>
                            Detalhes técnicos e configurações do workflow gerado
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Ações Rápidas */}
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditWorkflow(generatedWorkflow)}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Editar Workflow
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(generatedWorkflow, null, 2));
                                alert('Estrutura copiada para a área de transferência!');
                              }}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Copiar JSON
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const blob = new Blob([JSON.stringify(generatedWorkflow, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${generatedWorkflow.name.replace(/\s+/g, '_')}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Exportar JSON
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // Regenerar workflow com mesmos parâmetros
                                handleGenerate();
                              }}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Regenerar
                            </Button>
                          </div>

                          {/* Configurações do Workflow */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Tipo de Workflow</label>
                              <p className="text-lg font-medium capitalize">{workflowType}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Complexidade</label>
                              <Badge variant={generatedWorkflow.complexity === 'simple' ? 'secondary' : generatedWorkflow.complexity === 'medium' ? 'default' : 'destructive'}>
                                {generatedWorkflow.complexity === 'simple' ? 'Simples' : generatedWorkflow.complexity === 'medium' ? 'Médio' : 'Complexo'}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Tempo Estimado</label>
                              <p className="text-lg font-medium">{generatedWorkflow.estimatedTime}</p>
                            </div>
                          </div>

                          {/* Estrutura Detalhada */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Nós ({generatedWorkflow.nodes.length})</h4>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {generatedWorkflow.nodes.map((node, index) => (
                                  <div key={node.id} className="p-3 bg-muted/30 rounded-lg border">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-sm">{index + 1}. {node.name}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {node.type}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{node.description}</p>
                                    {node.config.agentId && (
                                      <Badge variant="secondary" className="text-xs">
                                        Agente: {agents.find(a => a.id === node.config.agentId)?.name || 'Desconhecido'}
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">Conexões ({generatedWorkflow.edges.length})</h4>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {generatedWorkflow.edges.map((edge, index) => (
                                  <div key={index} className="p-3 bg-muted/30 rounded-lg border">
                                    <div className="flex items-center gap-2 text-sm">
                                      <GitBranch className="w-4 h-4 text-muted-foreground" />
                                      <span className="font-medium">{edge.source}</span>
                                      <span className="text-muted-foreground">→</span>
                                      <span className="font-medium">{edge.target}</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {edge.type}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Resumo Técnico */}
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Resumo Técnico</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Total de Nós:</span>
                                <span className="ml-2 font-medium">{generatedWorkflow.nodes.length}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Total de Conexões:</span>
                                <span className="ml-2 font-medium">{generatedWorkflow.edges.length}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Agentes Ativos:</span>
                                <span className="ml-2 font-medium">
                                  {generatedWorkflow.agents.filter(agentId => {
                                    const agent = agents.find(a => a.id === agentId);
                                    return agent?.status === 'active';
                                  }).length}/{generatedWorkflow.agents.length}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Status:</span>
                                <Badge variant="default" className="ml-2 text-xs">
                                  Pronto para salvar
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Composição
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={resetGenerator} 
                      variant="outline"
                      disabled={isSaving}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Novo Workflow
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}