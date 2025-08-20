'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Settings, 
  Code, 
  Download, 
  Play, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Database,
  Wrench,
  MessageSquare
} from 'lucide-react';
import { FlowiseNodeCatalog } from './FlowiseNodeCatalog';

interface AgentConfig {
  name: string;
  description: string;
  type: string;
  systemPrompt: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  documents?: string[];
  indexName?: string;
  topK?: number;
}

interface FlowiseConfig {
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  flows: any[];
  apiConfig: any;
}

interface ProviderInfo {
  id: string;
  name: string;
  models: string[];
  isDefault: boolean;
}

interface AgentCreatorProps {
  onAgentCreated?: (config: FlowiseConfig) => void;
}

export function AgentCreator({ onAgentCreated }: AgentCreatorProps) {
  const [agentConfig, setAgentConfig] = useState<AgentConfig>({
    name: '',
    description: '',
    type: 'chat',
    systemPrompt: 'You are a helpful assistant.',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  });

  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [generatedConfig, setGeneratedConfig] = useState<FlowiseConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('config');
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] } | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const response = await fetch('/api/flowise-config');
      if (response.ok) {
        const data = await response.json();
        setProviders(data.providers);
        
        // Set default model from default provider
        if (data.defaultProvider) {
          setAgentConfig(prev => ({
            ...prev,
            model: data.defaultProvider.models[0] || 'gpt-4'
          }));
        }
      }
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  };

  const handleGenerateConfig = async () => {
    if (!agentConfig.name.trim()) {
      alert('Por favor, informe o nome do agente');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/flowise-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentConfig),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedConfig(data.config);
        setValidation(data.validation);
        setActiveTab('preview');
        
        if (onAgentCreated) {
          onAgentCreated(data.config);
        }
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error generating config:', error);
      alert('Erro ao gerar configuração');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportConfig = () => {
    if (!generatedConfig) return;

    const blob = new Blob([JSON.stringify(generatedConfig, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agentConfig.name.replace(/\s+/g, '-')}-flowise-config.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      case 'rag':
        return <Database className="h-4 w-4" />;
      case 'assistant':
        return <Wrench className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'chat':
        return 'Agente de conversação básico com LLM';
      case 'rag':
        return 'Agente com recuperação de documentos e embeddings';
      case 'assistant':
        return 'Agente com ferramentas e capacidades avançadas';
      default:
        return 'Agente personalizado';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Criador de Agentes Flowise
          </CardTitle>
          <CardDescription>
            Crie agentes inteligentes com configuração automática para Flowise
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="catalog">Catálogo de Nodes</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="export">Exportar</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Agente</CardTitle>
              <CardDescription>
                Defina as propriedades básicas do seu agente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Agente</Label>
                  <Input
                    id="name"
                    placeholder="Meu Agente"
                    value={agentConfig.name}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Agente</Label>
                  <Select value={agentConfig.type} onValueChange={(value) => setAgentConfig(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chat">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Chat Simples
                        </div>
                      </SelectItem>
                      <SelectItem value="rag">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          RAG
                        </div>
                      </SelectItem>
                      <SelectItem value="assistant">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          Assistente
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o que seu agente faz..."
                  value={agentConfig.description}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systemPrompt">Prompt do Sistema</Label>
                <Textarea
                  id="systemPrompt"
                  placeholder="You are a helpful assistant."
                  value={agentConfig.systemPrompt}
                  onChange={(e) => setAgentConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  rows={4}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Select value={agentConfig.model} onValueChange={(value) => setAgentConfig(prev => ({ ...prev, model: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.flatMap(provider => 
                        provider.models.map(model => (
                          <SelectItem key={model} value={model}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {provider.name}
                              </Badge>
                              {model}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature ({agentConfig.temperature})</Label>
                  <Input
                    id="temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={agentConfig.temperature}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={agentConfig.maxTokens}
                    onChange={(e) => setAgentConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              {agentConfig.type === 'rag' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Configurações RAG</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="indexName">Nome do Índice</Label>
                        <Input
                          id="indexName"
                          placeholder="default"
                          value={agentConfig.indexName}
                          onChange={(e) => setAgentConfig(prev => ({ ...prev, indexName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="topK">Top K</Label>
                        <Input
                          id="topK"
                          type="number"
                          value={agentConfig.topK}
                          onChange={(e) => setAgentConfig(prev => ({ ...prev, topK: parseInt(e.target.value) }))}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button onClick={handleGenerateConfig} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Play className="h-4 w-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Gerar Configuração
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          <FlowiseNodeCatalog
            agentType={agentConfig.type}
            onNodeSelect={(node) => console.log('Node selected:', node)}
            onGenerateConfig={(nodes) => console.log('Generate config with:', nodes)}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          {generatedConfig ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {validation?.valid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    Configuração Gerada
                  </CardTitle>
                  <CardDescription>
                    {generatedConfig.name} - {generatedConfig.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{generatedConfig.nodes.length}</div>
                      <div className="text-sm text-muted-foreground">Nodes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{generatedConfig.edges.length}</div>
                      <div className="text-sm text-muted-foreground">Conexões</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Object.keys(generatedConfig.apiConfig.endpoints).length}</div>
                      <div className="text-sm text-muted-foreground">APIs</div>
                    </div>
                  </div>

                  {validation && !validation.valid && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="font-medium">Erros de validação:</div>
                        <ul className="list-disc list-inside mt-1">
                          {validation.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estrutura do Workflow</CardTitle>
                  <CardDescription>
                    Nodes e conexões geradas automaticamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedConfig.nodes.map((node, index) => (
                      <div key={node.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(agentConfig.type)}
                          <Badge variant="outline">{node.type}</Badge>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{node.data.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {node.data.modelName && `Model: ${node.data.modelName}`}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {node.position.x}, {node.position.y}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Code className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Gere uma configuração primeiro para ver o preview
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          {generatedConfig ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Exportar Configuração</CardTitle>
                  <CardDescription>
                    Exporte a configuração para usar no Flowise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={handleExportConfig}>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar JSON
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Copiar para Clipboard
                    </Button>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Importe este arquivo JSON no Flowise usando a opção "Import Workflow"
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximos Passos</CardTitle>
                  <CardDescription>
                    Como usar sua configuração no Flowise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center mt-0.5">1</div>
                      <div>
                        <div className="font-medium">Abra o Flowise</div>
                        <div className="text-sm text-muted-foreground">
                          Acesse sua instância do Flowise
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center mt-0.5">2</div>
                      <div>
                        <div className="font-medium">Importe o Workflow</div>
                        <div className="text-sm text-muted-foreground">
                          Use "Import Workflow" e selecione o arquivo JSON baixado
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center mt-0.5">3</div>
                      <div>
                        <div className="font-medium">Teste o Agente</div>
                        <div className="text-sm text-muted-foreground">
                          Use o chat para testar seu agente
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Download className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Gere uma configuração primeiro para exportar
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}