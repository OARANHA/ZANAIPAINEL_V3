'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  FileText, 
  Database, 
  Zap, 
  Users, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  DollarSign,
  Clock,
  Shield,
  BarChart3,
  Cpu,
  Server,
  Wrench,
  Bot,
  Code,
  Search,
  Heart,
  Upload,
  Globe,
  Play,
  Settings,
  MessageSquare,
  Workflow,
  Terminal,
  GitBranch,
  Layers,
  Network,
  Plug,
  Unplug,
  Activity,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Layout } from '@/components/layout';

export default function DocPage() {
  const [activeTab, setActiveTab] = useState('pipeline');

  // Funcionalidades testadas e seu status
  const workingFeatures = [
    {
      id: 'chat-widget',
      name: 'Chat Widget',
      status: 'working',
      description: 'Widget de chat funcional com interface limpa',
      icon: MessageSquare,
      color: 'green',
      details: {
        setup: 'Importar ChatWidget e usar no componente',
        usage: '<ChatWidget />',
        tested: true,
        limitations: 'Requer backend de chat configurado'
      },
      codeExample: `import { ChatWidget } from "@/components/chat-widget";

function MyComponent() {
  return <ChatWidget />;
}`
    },
    {
      id: 'simple-chat',
      name: 'Simple Chat',
      status: 'working',
      description: 'Interface de chat simples e funcional',
      icon: MessageSquare,
      color: 'blue',
      details: {
        setup: 'Importar SimpleChat e usar com props',
        usage: '<SimpleChat title="Meu Chat" />',
        tested: true,
        limitations: 'Interface básica, sem histórico persistente'
      },
      codeExample: `import { SimpleChat } from "@/components/simple-chat";

function MyComponent() {
  return <SimpleChat title="Meu Chat" />;
}`
    },
    {
      id: 'roi-calculator',
      name: 'ROI Calculator',
      status: 'working',
      description: 'Calculadora de ROI funcional com cálculos automáticos',
      icon: DollarSign,
      color: 'green',
      details: {
        setup: 'Importar ROICalculator e usar no componente',
        usage: '<ROICalculator />',
        tested: true,
        limitations: 'Cálculos básicos de ROI'
      },
      codeExample: `import { ROICalculator } from "@/components/roi-calculator";

function MyComponent() {
  return <ROICalculator />;
}`
    },
    {
      id: 'flowise-integration',
      name: 'Flowise Integration',
      status: 'working',
      description: 'Integração com Flowise para chatbots avançados',
      icon: Bot,
      color: 'purple',
      details: {
        setup: 'Importar FlowiseIntegration e configurar API',
        usage: '<FlowiseIntegration apiUrl="sua-api" />',
        tested: true,
        limitations: 'Requer API do Flowise configurada'
      },
      codeExample: `import FlowiseIntegration from "@/components/flowise-integration";

function MyComponent() {
  return <FlowiseIntegration apiUrl="https://seu-flowise-api" />;
}`
    }
  ];

  // Funcionalidades com problemas ou não testadas
  const problematicFeatures = [
    {
      id: 'mcp-github',
      name: 'MCP GitHub Integration',
      status: 'error',
      description: 'Integração com GitHub via MCP apresenta erros',
      icon: GitBranch,
      color: 'red',
      details: {
        setup: 'Configurar token do GitHub e servidor MCP',
        usage: 'MCPManager com GitHub server',
        tested: false,
        error: 'Erro de importação de componentes não encontrados'
      },
      errorMessage: 'Componentes de importação incorretos, verifique os caminhos',
      fixSuggestion: 'Verificar imports e garantir que componentes existam'
    },
    {
      id: 'mcp-web-search',
      name: 'MCP Web Search',
      status: 'partial',
      description: 'Busca web funciona parcialmente via MCP',
      icon: Search,
      color: 'yellow',
      details: {
        setup: 'Configurar Brave Search API e servidor MCP',
        usage: 'MCPManager com Brave Search server',
        tested: true,
        limitations: 'Funciona apenas quando ZAI está disponível'
      },
      errorMessage: 'Depende de ZAI SDK que pode não estar disponível',
      fixSuggestion: 'Implementar fallback quando ZAI não está disponível'
    },
    {
      id: 'mcp-postgres',
      name: 'MCP PostgreSQL',
      status: 'error',
      description: 'Integração com PostgreSQL apresenta erros de conexão',
      icon: Database,
      color: 'red',
      details: {
        setup: 'Configurar string de conexão e servidor MCP',
        usage: 'MCPManager com PostgreSQL server',
        tested: false,
        error: 'Erro de configuração de banco de dados'
      },
      errorMessage: 'String de conexão inválida ou banco não configurado',
      fixSuggestion: 'Verificar configuração do banco e string de conexão'
    }
  ];

  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'working':
        return <Badge className="bg-green-100 text-green-800 border-green-200">✓ Funcionando</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠ Parcial</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">✗ Erro</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">? Não Testado</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Documentação Técnica
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Guia completo do pipeline, manual MCP e funcionalidades testadas do sistema
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="mcp">Manual MCP</TabsTrigger>
            <TabsTrigger value="funcionalidades">Funcionalidades</TabsTrigger>
          </TabsList>
          {/* Tab 1: Pipeline */}
          <TabsContent value="pipeline" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Etapa 1: Entrada de Dados */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">1. Entrada de Dados</CardTitle>
                  </div>
                  <CardDescription>O cliente fornece as informações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Upload de Documentos</h4>
                        <p className="text-sm text-muted-foreground">PDF, Word, Excel, Imagens</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Database className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Formulários Estruturados</h4>
                        <p className="text-sm text-muted-foreground">Dados específicos do negócio</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Zap className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Integração via API</h4>
                        <p className="text-sm text-muted-foreground">Sistemas existentes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Exemplo Prático:</h5>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p>• Contrato em PDF (upload)</p>
                      <p>• Setor: Construção Civil</p>
                      <p>• Valor: R$ 500.000</p>
                      <p>• Prioridade: Alta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Etapa 2: Processamento */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">2. Processamento</CardTitle>
                  </div>
                  <CardDescription>Agentes especializados analisam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Extração de Texto</h4>
                        <p className="text-sm text-muted-foreground">OCR e estruturação</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Enriquecimento</h4>
                        <p className="text-sm text-muted-foreground">Contexto do cliente</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Análise Paralela</h4>
                        <p className="text-sm text-muted-foreground">Múltiplos agentes</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Agentes em Ação:</h5>
                    <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <p>• Jurídico: Análise de cláusulas</p>
                      <p>• Compliance: Verificação legal</p>
                      <p>• Financeiro: Viabilidade econômica</p>
                      <p>• Operacional: Capacidade de entrega</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Etapa 3: Resultados */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">3. Resultados</CardTitle>
                  </div>
                  <CardDescription>Insights e recomendações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <BarChart3 className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Análise Completa</h4>
                        <p className="text-sm text-muted-foreground">Relatório multidimensional</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Target className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Recomendações</h4>
                        <p className="text-sm text-muted-foreground">Ações específicas</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <DollarSign className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Métricas de Valor</h4>
                        <p className="text-sm text-muted-foreground">ROI e economia</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Resultado Final:</h5>
                    <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                      <p>• Riscos identificados e mitigados</p>
                      <p>• Economia de R$ 50.000 estimada</p>
                      <p>• Tempo de análise: 20 minutos</p>
                      <p>• Precisão: 99%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fluxo Visual */}
            <Card>
              <CardHeader>
                <CardTitle>Fluxo Visual Completo</CardTitle>
                <CardDescription>Como os dados fluem pelo sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between space-x-4 overflow-x-auto">
                  <div className="flex flex-col items-center min-w-[200px]">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-center">Cliente</h3>
                    <p className="text-sm text-muted-foreground text-center">Envia documentos</p>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  
                  <div className="flex flex-col items-center min-w-[200px]">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-2">
                      <Database className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-medium text-center">Processamento</h3>
                    <p className="text-sm text-muted-foreground text-center">Extração e estruturação</p>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  
                  <div className="flex flex-col items-center min-w-[200px]">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-center">Agentes IA</h3>
                    <p className="text-sm text-muted-foreground text-center">Análise especializada</p>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  
                  <div className="flex flex-col items-center min-w-[200px]">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-center">Resultados</h3>
                    <p className="text-sm text-muted-foreground text-center">Insights e ações</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Manual MCP */}
          <TabsContent value="mcp" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* O que é MCP */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <span>O que é MCP?</span>
                  </CardTitle>
                  <CardDescription>
                    Model Context Protocol - O padrão para comunicação entre agentes e ferramentas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    O MCP (Model Context Protocol) é um protocolo padronizado que permite que agentes de IA se comuniquem com ferramentas externas, APIs e serviços de forma estruturada e segura.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Padronização</h4>
                        <p className="text-xs text-muted-foreground">Formato unificado para comunicação</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Segurança</h4>
                        <p className="text-xs text-muted-foreground">Controle de acesso e autenticação</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Escalabilidade</h4>
                        <p className="text-xs text-muted-foreground">Suporte a múltiplos servidores</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Servidores MCP Disponíveis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="w-5 h-5 text-green-600" />
                    <span>Servidores MCP Testados</span>
                  </CardTitle>
                  <CardDescription>
                    Status dos servidores MCP disponíveis no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <GitBranch className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium">GitHub MCP</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-200">✗ Erro</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium">Brave Search MCP</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⚠ Parcial</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium">PostgreSQL MCP</span>
                      </div>
                      <Badge className="bg-red-100 text-red-800 border-red-200">✗ Erro</Badge>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <h5 className="font-medium text-orange-800 dark:text-orange-200 mb-2">Importante:</h5>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      Alguns servidores MCP apresentam erros de importação ou configuração. 
                      Verifique a aba "Funcionalidades" para detalhes específicos.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Configuração MCP */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  <span>Configuração do Sistema MCP</span>
                </CardTitle>
                <CardDescription>
                  Como configurar e gerenciar servidores MCP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Pré-requisitos:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Node.js 18+ instalado</li>
                      <li>• Tokens de API válidos</li>
                      <li>• Acesso aos serviços externos</li>
                      <li>• ZAI SDK configurado</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Arquivos de Configuração:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• <code className="bg-gray-100 px-1 rounded">mcp/execute/route.ts</code></li>
                      <li>• <code className="bg-gray-100 px-1 rounded">mcp/servers/route.ts</code></li>
                      <li>• <code className="bg-gray-100 px-1 rounded">mcp/tools/route.ts</code></li>
                      <li>• <code className="bg-gray-100 px-1 rounded">MCPManager.tsx</code></li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Exemplo de Configuração:</h5>
                  <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-x-auto">
{`{
  "serverId": "brave-search-mcp",
  "toolName": "web_search",
  "arguments": {
    "query": "inteligência artificial em saúde 2024",
    "num": 10
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Funcionalidades */}
          <TabsContent value="funcionalidades" className="space-y-8">
            {/* Funcionalidades Funcionando */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span>Funcionalidades Testadas e Funcionando</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {workingFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={feature.id} className="border-green-200 dark:border-green-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-full flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 text-${feature.color}-600`} />
                            </div>
                            <CardTitle className="text-lg">{feature.name}</CardTitle>
                          </div>
                          <StatusBadge status={feature.status} />
                        </div>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Como usar:</h4>
                          <p className="text-xs text-muted-foreground">{feature.details.usage}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Setup:</h4>
                          <p className="text-xs text-muted-foreground">{feature.details.setup}</p>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-lg">
                          <h5 className="font-medium text-xs mb-1">Código de Exemplo:</h5>
                          <pre className="text-xs bg-gray-900 text-gray-100 p-2 rounded overflow-x-auto">
                            {feature.codeExample}
                          </pre>
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          <strong>Limitações:</strong> {feature.details.limitations}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Funcionalidades com Problemas */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <span>Funcionalidades com Problemas ou Não Testadas</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {problematicFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={feature.id} className="border-red-200 dark:border-red-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-full flex items-center justify-center`}>
                              <Icon className={`w-4 h-4 text-${feature.color}-600`} />
                            </div>
                            <CardTitle className="text-lg">{feature.name}</CardTitle>
                          </div>
                          <StatusBadge status={feature.status} />
                        </div>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Erro Identificado:</h4>
                          <p className="text-xs text-red-600 dark:text-red-400">{feature.errorMessage}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Solução Sugerida:</h4>
                          <p className="text-xs text-blue-600 dark:text-blue-400">{feature.fixSuggestion}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Setup:</h4>
                          <p className="text-xs text-muted-foreground">{feature.details.setup}</p>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                          <h5 className="font-medium text-red-800 dark:text-red-200 mb-1">Status:</h5>
                          <p className="text-xs text-red-700 dark:text-red-300">
                            {feature.details.tested ? 'Testado e apresentando erros' : 'Não testado devido a erros de configuração'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Guia de Teste */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-purple-600" />
                  <span>Guia de Teste das Funcionalidades</span>
                </CardTitle>
                <CardDescription>
                  Como testar cada funcionalidade do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Teste de Componentes UI:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>ChatWidget - Importar e renderizar</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>SimpleChat - Testar com diferentes props</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>ROICalculator - Verificar cálculos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>FlowiseIntegration - Testar conexão API</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Teste de Funcionalidades MCP:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>GitHub MCP - Verificar imports e tokens</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span>Brave Search - Testar com ZAI disponível</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>PostgreSQL MCP - Verificar string de conexão</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Comandos Úteis:</h5>
                  <div className="space-y-1 text-sm">
                    <p><code className="bg-gray-100 px-1 rounded">npm run lint</code> - Verificar qualidade do código</p>
                    <p><code className="bg-gray-100 px-1 rounded">npm run dev</code> - Iniciar servidor de desenvolvimento</p>
                    <p><code className="bg-gray-100 px-1 rounded">npm run build</code> - Compilar para produção</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}