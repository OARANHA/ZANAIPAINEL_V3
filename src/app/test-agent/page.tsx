'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AgentCreator } from '@/components/AgentCreator';
import { FlowiseNodeCatalog } from '@/components/FlowiseNodeCatalog';
import { 
  Bot, 
  Settings, 
  TestTube, 
  Rocket, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Database,
  Wrench,
  MessageSquare,
  Zap,
  Code,
  Download
} from 'lucide-react';

interface TestAgent {
  name: string;
  type: string;
  description: string;
  config: any;
  status: 'pending' | 'testing' | 'success' | 'error';
  result?: any;
}

export default function TestAgentPage() {
  const [testAgents, setTestAgents] = useState<TestAgent[]>([
    {
      name: 'Chat Simples',
      type: 'chat',
      description: 'Agente básico de conversação',
      config: {
        name: 'Chat Simples',
        description: 'Agente básico de conversação para testes',
        type: 'chat',
        systemPrompt: 'You are a helpful assistant. Be friendly and concise.',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000
      },
      status: 'pending'
    },
    {
      name: 'Assistente RAG',
      type: 'rag',
      description: 'Agente com recuperação de documentos',
      config: {
        name: 'Assistente RAG',
        description: 'Agente com capacidade de busca em documentos',
        type: 'rag',
        systemPrompt: 'You are a helpful assistant that uses the provided context to answer questions.',
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 1500,
        indexName: 'test-docs',
        topK: 3
      },
      status: 'pending'
    },
    {
      name: 'Assistente com Ferramentas',
      type: 'assistant',
      description: 'Agente com capacidades de cálculo e busca',
      config: {
        name: 'Assistente com Ferramentas',
        description: 'Agente com ferramentas de cálculo e busca web',
        type: 'assistant',
        systemPrompt: 'You are a helpful assistant with access to tools for calculations and web search.',
        model: 'gpt-4',
        temperature: 0.5,
        maxTokens: 2000
      },
      status: 'pending'
    }
  ]);

  const [activeTab, setActiveTab] = useState('creator');

  const handleAgentCreated = (config: any) => {
    console.log('Agent created:', config);
  };

  const runTest = async (agentIndex: number) => {
    const agent = testAgents[agentIndex];
    setTestAgents(prev => prev.map((a, i) => 
      i === agentIndex ? { ...a, status: 'testing' } : a
    ));

    try {
      // Testar geração de configuração
      const response = await fetch('/api/flowise-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agent.config),
      });

      if (response.ok) {
        const data = await response.json();
        setTestAgents(prev => prev.map((a, i) => 
          i === agentIndex ? { 
            ...a, 
            status: 'success', 
            result: data 
          } : a
        ));
      } else {
        setTestAgents(prev => prev.map((a, i) => 
          i === agentIndex ? { ...a, status: 'error' } : a
        ));
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestAgents(prev => prev.map((a, i) => 
        i === agentIndex ? { ...a, status: 'error' } : a
      ));
    }
  };

  const runAllTests = async () => {
    for (let i = 0; i < testAgents.length; i++) {
      await runTest(i);
      // Pequeno delay entre testes
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <TestTube className="h-4 w-4" />;
      case 'testing':
        return <Zap className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <TestTube className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="h-5 w-5" />;
      case 'rag':
        return <Database className="h-5 w-5" />;
      case 'assistant':
        return <Wrench className="h-5 w-5" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Rocket className="h-8 w-8" />
          Teste de Integração Flowise
        </h1>
        <p className="text-muted-foreground">
          Crie e teste agentes com integração real com APIs de LLM
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="creator">Criador de Agentes</TabsTrigger>
          <TabsTrigger value="catalog">Catálogo de Nodes</TabsTrigger>
          <TabsTrigger value="tests">Testes Automáticos</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="creator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Criador de Agentes Flowise
              </CardTitle>
              <CardDescription>
                Crie agentes inteligentes com configuração automática para Flowise usando APIs reais
              </CardDescription>
            </CardHeader>
          </Card>

          <AgentCreator onAgentCreated={handleAgentCreated} />
        </TabsContent>

        <TabsContent value="catalog" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Catálogo de Nodes do Flowise
              </CardTitle>
              <CardDescription>
                Explore todos os nodes disponíveis no Flowise para construir seus agentes
              </CardDescription>
            </CardHeader>
          </Card>

          <FlowiseNodeCatalog
            agentType="chat"
            onNodeSelect={(node) => console.log('Node selected:', node)}
            onGenerateConfig={(nodes) => console.log('Generate config with:', nodes)}
          />
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Testes Automáticos
              </CardTitle>
              <CardDescription>
                Teste diferentes tipos de agentes com configurações pré-definidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button onClick={runAllTests} disabled={testAgents.some(a => a.status === 'testing')}>
                  <Zap className="h-4 w-4 mr-2" />
                  Executar Todos os Testes
                </Button>
                <Button variant="outline" onClick={() => setTestAgents(prev => prev.map(a => ({ ...a, status: 'pending' })))}>
                  <TestTube className="h-4 w-4 mr-2" />
                  Resetar Testes
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {testAgents.map((agent, index) => (
              <Card key={agent.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getTypeIcon(agent.type)}
                    {agent.name}
                    <Badge variant="outline">{agent.type}</Badge>
                    <Badge variant={agent.status === 'success' ? 'default' : agent.status === 'error' ? 'destructive' : 'secondary'}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(agent.status)}
                        {agent.status}
                      </div>
                    </Badge>
                  </CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Modelo: {agent.config.model} | Temperature: {agent.config.temperature}
                    </div>
                    <Button 
                      onClick={() => runTest(index)} 
                      disabled={agent.status === 'testing'}
                      size="sm"
                    >
                      {agent.status === 'testing' ? (
                        <>
                          <Zap className="h-4 w-4 mr-2 animate-spin" />
                          Testando...
                        </>
                      ) : (
                        <>
                          <TestTube className="h-4 w-4 mr-2" />
                          Testar
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {agent.result && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <div className="font-medium mb-2">Resultado do Teste:</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Nodes:</div>
                          <div>{agent.result.config.nodes.length}</div>
                        </div>
                        <div>
                          <div className="font-medium">Conexões:</div>
                          <div>{agent.result.config.edges.length}</div>
                        </div>
                        <div>
                          <div className="font-medium">Validação:</div>
                          <div className={agent.result.validation.valid ? 'text-green-600' : 'text-red-600'}>
                            {agent.result.validation.valid ? 'Válido' : 'Inválido'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Resultados dos Testes
              </CardTitle>
              <CardDescription>
                Resumo dos testes executados e status da integração
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{testAgents.length}</div>
                  <div className="text-sm text-muted-foreground">Total de Testes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {testAgents.filter(a => a.status === 'success').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Sucesso</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {testAgents.filter(a => a.status === 'error').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Falhas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {testAgents.filter(a => a.status === 'testing').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Em Execução</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Status da Integração:</h3>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>APIs de LLM configuradas (OpenAI, Z.AI)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Catálogo de nodes do Flowise disponível</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Gerador de configurações funcionando</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Interface de criação de agentes pronta</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Passos</CardTitle>
              <CardDescription>
                Como continuar com a integração e deploy dos agentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center mt-0.5">1</div>
                  <div>
                    <div className="font-medium">Configurar Instância Flowise</div>
                    <div className="text-sm text-muted-foreground">
                      Instale e configure uma instância do Flowise para importar os agentes
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center mt-0.5">2</div>
                  <div>
                    <div className="font-medium">Importar Agentes Testados</div>
                    <div className="text-sm text-muted-foreground">
                      Use os arquivos JSON gerados para importar os agentes no Flowise
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center mt-0.5">3</div>
                  <div>
                    <div className="font-medium">Testar Funcionalidade</div>
                    <div className="text-sm text-muted-foreground">
                      Teste os agentes importados usando a interface do Flowise
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center mt-0.5">4</div>
                  <div>
                    <div className="font-medium">Integrar com Zanai</div>
                    <div className="text-sm text-muted-foreground">
                      Configure a comunicação entre Flowise e Zanai para analytics
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}