'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  // Ícones Lucide
  Server, 
  Wrench, 
  Bot, 
  Zap, 
  Link, 
  Unlink, 
  Play, 
  Settings, 
  Database,
  Globe,
  Terminal,
  Code,
  FileText,
  Search,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Plus,
  ArrowRight,
  Download,
  Upload,
  BarChart3,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Lightbulb,
  Cpu,
  Network,
  Plug,
  Unplug,
  Activity,
  Heart,
  Star,
  MoreHorizontal,
  Copy,
  Trash2,
  ChevronRight
} from 'lucide-react';

export default function MCPManual() {
  const [activeTab, setActiveTab] = useState('introducao');

  // Dados dos servidores MCP pré-configurados
  const mcpServers = [
    {
      name: 'GitHub MCP',
      description: 'Servidor MCP para integração com GitHub API',
      type: 'stdio',
      status: 'active',
      tools: ['create_issue', 'create_pull_request', 'search_repositories', 'get_repository_info'],
      useCase: 'Automação de desenvolvimento e gestão de repositórios',
      setup: 'npx @modelcontextprotocol/server-github',
      env: { GITHUB_PERSONAL_ACCESS_TOKEN: 'seu_token_aqui' }
    },
    {
      name: 'PostgreSQL MCP',
      description: 'Servidor MCP para consultas PostgreSQL',
      type: 'stdio',
      status: 'active',
      tools: ['execute_query', 'analyze_data', 'generate_report', 'backup_database'],
      useCase: 'Análise de dados e gestão de banco de dados',
      setup: 'npx @modelcontextprotocol/server-postgres',
      env: { DATABASE_URL: 'postgresql://user:pass@localhost:5432/db' }
    },
    {
      name: 'Brave Search MCP',
      description: 'Servidor MCP para busca web com Brave Search',
      type: 'stdio',
      status: 'active',
      tools: ['web_search', 'extract_content', 'summarize', 'get_search_results'],
      useCase: 'Pesquisa e análise de conteúdo web',
      setup: 'npx @modelcontextprotocol/server-brave-search',
      env: { BRAVE_SEARCH_API_KEY: 'sua_chave_aqui' }
    },
    {
      name: 'File System MCP',
      description: 'Servidor MCP para operações de sistema de arquivos',
      type: 'stdio',
      status: 'active',
      tools: ['read_file', 'write_file', 'list_directory', 'delete_file', 'create_directory'],
      useCase: 'Automação de arquivos e gestão de diretórios',
      setup: 'npx @modelcontextprotocol/server-filesystem',
      env: { ROOT_PATH: '/caminho/para/diretorio' }
    },
    {
      name: 'Slack MCP',
      description: 'Servidor MCP para integração com Slack',
      type: 'sse',
      status: 'active',
      tools: ['send_message', 'get_channels', 'get_users', 'create_channel'],
      useCase: 'Comunicação e automação de equipes',
      setup: 'https://your-slack-bot.com/mcp',
      env: { SLACK_BOT_TOKEN: 'xoxb-seu-token' }
    },
    {
      name: 'Google Sheets MCP',
      description: 'Servidor MCP para manipulação de planilhas',
      type: 'http',
      status: 'active',
      tools: ['read_sheet', 'write_sheet', 'create_sheet', 'update_cell', 'get_formulas'],
      useCase: 'Automação de planilhas e relatórios',
      setup: 'https://your-sheets-service.com/mcp',
      env: { GOOGLE_SERVICE_ACCOUNT_KEY: 'sua_chave.json' }
    }
  ];

  // Casos de uso detalhados
  const useCases = [
    {
      title: 'Automação de Desenvolvimento',
      description: 'Integração completa com GitHub para automação de desenvolvimento',
      icon: Code,
      color: 'blue',
      steps: [
        'Monitorar repositórios em busca de novas issues',
        'Analisar código automaticamente',
        'Criar pull requests com correções',
        'Gerar relatórios de progresso',
        'Notificar equipe sobre atualizações'
      ],
      tools: ['create_issue', 'create_pull_request', 'search_repositories'],
      benefits: [
        'Redução de 70% no tempo de revisão de código',
        'Detecção automática de bugs',
        'Integração contínua melhorada',
        'Documentação automática'
      ],
      setup: 'Configure o GitHub MCP com seu token de acesso pessoal'
    },
    {
      title: 'Análise de Dados em Tempo Real',
      description: 'Consultas e análise de dados PostgreSQL com agentes IA',
      icon: Database,
      color: 'green',
      steps: [
        'Conectar ao banco de dados PostgreSQL',
        'Executar consultas complexas automaticamente',
        'Analisar padrões e tendências',
        'Gerar relatórios visuais',
        'Enviar insights para equipe'
      ],
      tools: ['execute_query', 'analyze_data', 'generate_report'],
      benefits: [
        'Análise 100x mais rápida',
        'Detecção de anomalias em tempo real',
        'Relatórios automáticos personalizados',
        'Tomada de decisão baseada em dados'
      ],
      setup: 'Configure o PostgreSQL MCP com string de conexão do banco'
    },
    {
      title: 'Pesquisa e Conteúdo Inteligente',
      description: 'Busca web avançada com extração e resumo de conteúdo',
      icon: Search,
      color: 'purple',
      steps: [
        'Realizar buscas web específicas',
        'Extrair conteúdo de páginas web',
        'Resumir artigos e documentos',
        'Analisar sentimento e relevância',
        'Compilar relatórios de pesquisa'
      ],
      tools: ['web_search', 'extract_content', 'summarize'],
      benefits: [
        'Pesquisa 50% mais eficiente',
        'Conteúdo resumido automaticamente',
        'Análise de sentimento precisa',
        'Economia de tempo em pesquisa'
      ],
      setup: 'Configure o Brave Search MCP com sua API key'
    },
    {
      title: 'Automação de Documentos',
      description: 'Gestão inteligente de arquivos e documentos',
      icon: FileText,
      color: 'orange',
      steps: [
        'Monitorar diretórios de documentos',
        'Classificar arquivos automaticamente',
        'Extrair texto de documentos',
        'Gerar resumos e insights',
        'Organizar estrutura de pastas'
      ],
      tools: ['read_file', 'write_file', 'list_directory', 'create_directory'],
      benefits: [
        'Organização automática de arquivos',
        'Extração de conteúdo inteligente',
        'Busca rápida em documentos',
        'Redução de trabalho manual'
      ],
      setup: 'Configure o File System MCP com caminho raiz dos documentos'
    }
  ];

  // Funcionalidades avançadas
  const advancedFeatures = [
    {
      title: 'Integração Multi-Agentes',
      description: 'Conecte múltiplos agentes a diferentes servidores MCP',
      icon: Users,
      features: [
        'Distribuição de tarefas entre agentes',
        'Comunicação entre servidores MCP',
        'Orquestração complexa de workflows',
        'Balanceamento de carga automático'
      ],
      example: 'Agente de pesquisa + Agente de análise + Agente de relatórios'
    },
    {
      title: 'Monitoramento e Saúde',
      description: 'Acompanhe o desempenho e status dos servidores MCP',
      icon: Activity,
      features: [
        'Monitoramento em tempo real',
        'Alertas de falha automática',
        'Métricas de performance',
        'Histórico de execuções'
      ],
      example: 'Dashboard com status de todos os servidores e ferramentas'
    },
    {
      title: 'Segurança e Controle',
      description: 'Gerencie permissões e acesso aos servidores MCP',
      icon: Shield,
      features: [
        'Controle de acesso granular',
        'Autenticação segura',
        'Logs de auditoria',
        'Políticas de segurança'
      ],
      example: 'Restringir acesso a ferramentas específicas por agente'
    },
    {
      title: 'Escalabilidade',
      description: 'Escale horizontalmente seus servidores MCP',
      icon: TrendingUp,
      features: [
        'Balanceamento de carga',
        'Replicação de servidores',
        'Auto-scaling automático',
        'Gerenciamento de recursos'
      ],
      example: 'Adicionar mais servidores conforme demanda aumenta'
    }
  ];

  // Exemplos práticos de código
  const codeExamples = [
    {
      title: 'Criar Issue no GitHub',
      description: 'Exemplo de como usar o GitHub MCP para criar uma issue',
      code: `{
  "serverId": "github-mcp-server",
  "toolName": "create_issue",
  "arguments": {
    "title": "Bug encontrado no sistema de login",
    "body": "Descrição detalhada do bug...",
    "owner": "nome-do-repositorio",
    "repo": "nome-do-projeto",
    "labels": ["bug", "critical"]
  }
}`,
      result: `{
  "issue_number": 123,
  "url": "https://github.com/nome-do-repositorio/nome-do-projeto/issues/123",
  "title": "Bug encontrado no sistema de login",
  "state": "open"
}`
    },
    {
      title: 'Consultar Banco de Dados',
      description: 'Exemplo de consulta PostgreSQL usando MCP',
      code: `{
  "serverId": "postgresql-mcp-server",
  "toolName": "execute_query",
  "arguments": {
    "query": "SELECT * FROM users WHERE created_at > '2024-01-01'",
    "params": []
  }
}`,
      result: `{
  "rows": [
    {"id": 1, "name": "João Silva", "email": "joao@example.com"},
    {"id": 2, "name": "Maria Santos", "email": "maria@example.com"}
  ],
  "rowCount": 2,
  "executionTime": "45ms"
}`
    },
    {
      title: 'Busca Web com Resumo',
      description: 'Exemplo de busca web e resumo automático',
      code: `{
  "serverId": "brave-search-mcp-server",
  "toolName": "web_search",
  "arguments": {
    "query": "inteligência artificial em saúde 2024",
    "num": 10
  }
}`,
      result: `{
  "query": "inteligência artificial em saúde 2024",
  "results": [
    {
      "title": "Avanços da IA na Medicina",
      "url": "https://example.com/article1",
      "snippet": "Novas tecnologias estão revolucionando..."
    }
  ],
  "summary": "A IA está transformando o setor saúde com diagnósticos mais precisos..."
}`
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Manual Completo do Sistema MCP
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Aprenda a configurar, gerenciar e utilizar o Model Context Protocol para expandir as capacidades dos seus agentes de IA
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        {/* Tab 1: Introdução */}
        <TabsContent value="introducao" className="space-y-8">
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
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Flexibilidade</h4>
                      <p className="text-xs text-muted-foreground">Integração com qualquer ferramenta</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefícios */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Benefícios do MCP</span>
                </CardTitle>
                <CardDescription>
                  Por que usar MCP no seu sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">10x</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Mais produtivo</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <div className="text-xs text-green-700 dark:text-green-300">Uptime</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">50+</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">Ferramentas</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">24/7</div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">Disponível</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Principais Vantagens:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Automação de tarefas repetitivas</li>
                    <li>• Integração com sistemas existentes</li>
                    <li>• Segurança aprimorada</li>
                    <li>• Monitoramento em tempo real</li>
                    <li>• Escalabilidade infinita</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Arquitetura MCP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-purple-600" />
                <span>Arquitetura MCP</span>
              </CardTitle>
              <CardDescription>
                Como os componentes se comunicam
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-4 overflow-x-auto">
                <div className="flex flex-col items-center min-w-[150px]">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-sm text-center">Agente IA</h3>
                  <p className="text-xs text-muted-foreground text-center">Solicita serviço</p>
                </div>
                
                <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                
                <div className="flex flex-col items-center min-w-[150px]">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                    <Plug className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-sm text-center">MCP Client</h3>
                  <p className="text-xs text-muted-foreground text-center">Protocolo MCP</p>
                </div>
                
                <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                
                <div className="flex flex-col items-center min-w-[150px]">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-2">
                    <Server className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-medium text-sm text-center">MCP Server</h3>
                  <p className="text-xs text-muted-foreground text-center">Gerencia ferramentas</p>
                </div>
                
                <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                
                <div className="flex flex-col items-center min-w-[150px]">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
                    <Wrench className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-sm text-center">Ferramentas</h3>
                  <p className="text-xs text-muted-foreground text-center">Executam ações</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Servidores MCP */}
        <TabsContent value="servidores" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mcpServers.map((server, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Server className="w-5 h-5 text-blue-600" />
                      <span>{server.name}</span>
                    </CardTitle>
                    <Badge variant={server.status === 'active' ? 'default' : 'secondary'}>
                      {server.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <CardDescription>{server.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Tipo:</h4>
                    <Badge variant="outline">{server.type.toUpperCase()}</Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Ferramentas:</h4>
                    <div className="flex flex-wrap gap-1">
                      {server.tools.map((tool, toolIndex) => (
                        <Badge key={toolIndex} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Caso de Uso:</h4>
                    <p className="text-xs text-muted-foreground">{server.useCase}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <h4 className="font-medium text-xs mb-1">Setup:</h4>
                    <code className="text-xs bg-gray-100 dark:bg-gray-700 p-1 rounded">
                      {server.setup}
                    </code>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <h4 className="font-medium text-xs mb-1">Variáveis de Ambiente:</h4>
                    {Object.entries(server.env).map(([key, value]) => (
                      <div key={key} className="text-xs text-blue-700 dark:text-blue-300">
                        <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                          {key}={value}
                        </code>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Casos de Uso */}
        <TabsContent value="casos" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <useCase.icon className={`w-5 h-5 text-${useCase.color}-600`} />
                    <span>{useCase.title}</span>
                  </CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Passo a Passo:</h4>
                    <ol className="text-xs text-muted-foreground space-y-1">
                      {useCase.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start space-x-2">
                          <span className="bg-gray-200 dark:bg-gray-700 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
                            {stepIndex + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Ferramentas Utilizadas:</h4>
                    <div className="flex flex-wrap gap-1">
                      {useCase.tools.map((tool, toolIndex) => (
                        <Badge key={toolIndex} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Benefícios:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {useCase.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <h4 className="font-medium text-xs mb-1">Configuração:</h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">{useCase.setup}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Funcionalidades Avançadas */}
        <TabsContent value="avancado" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advancedFeatures.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <feature.icon className="w-5 h-5 text-blue-600" />
                    <span>{feature.title}</span>
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Funcionalidades:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {feature.features.map((feat, featIndex) => (
                        <li key={featIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <h4 className="font-medium text-xs mb-1">Exemplo Prático:</h4>
                    <p className="text-xs text-muted-foreground">{feature.example}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: Exemplos de Código */}
        <TabsContent value="codigo" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {codeExamples.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-green-600" />
                    <span>{example.title}</span>
                  </CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Request:</h4>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Response:</h4>
                    <pre className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{example.result}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 6: Guia Rápido */}
        <TabsContent value="guia" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Passo 1: Configuração */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <span>Configuração</span>
                </CardTitle>
                <CardDescription>Prepare o ambiente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Instale dependências</h4>
                    <p className="text-xs text-muted-foreground">npm install @modelcontextprotocol/sdk</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Configure variáveis</h4>
                    <p className="text-xs text-muted-foreground">ZAI_API_KEY, DATABASE_URL, etc.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Teste conexão</h4>
                    <p className="text-xs text-muted-foreground">Use o botão "Testar" no painel</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passo 2: Criação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <span>Criação</span>
                </CardTitle>
                <CardDescription>Crie servidores MCP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Escolha template</h4>
                    <p className="text-xs text-muted-foreground">GitHub, PostgreSQL, Brave Search</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Configure parâmetros</h4>
                    <p className="text-xs text-muted-foreground">URLs, tokens, chaves de API</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Salve servidor</h4>
                    <p className="text-xs text-muted-foreground">O sistema valida automaticamente</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passo 3: Integração */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <span>Integração</span>
                </CardTitle>
                <CardDescription>Conecte aos agentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Selecione agente</h4>
                    <p className="text-xs text-muted-foreground">Escolha o agente que usará o MCP</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Conecte servidor</h4>
                    <p className="text-xs text-muted-foreground">Vincule servidor ao agente</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">Teste integração</h4>
                    <p className="text-xs text-muted-foreground">Execute ferramentas para testar</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dicas Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <span>Dicas Rápidas</span>
              </CardTitle>
              <CardDescription>Boas práticas e recomendações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sm mb-3">Boas Práticas:</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                      <span>Use tokens de acesso com permissões limitadas</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                      <span>Monitore o consumo de API e custos</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                      <span>Implemente retry e fallback para falhas</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                      <span>Documente suas integrações MCP</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-3">Problemas Comuns:</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-3 h-3 text-red-600 mt-0.5" />
                      <span>Tokens expirados ou inválidos</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-3 h-3 text-red-600 mt-0.5" />
                      <span>Limites de taxa de API excedidos</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-3 h-3 text-red-600 mt-0.5" />
                      <span>Configuração de firewall bloqueando acesso</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertCircle className="w-3 h-3 text-red-600 mt-0.5" />
                      <span>Formato de dados incorreto nas requisições</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}