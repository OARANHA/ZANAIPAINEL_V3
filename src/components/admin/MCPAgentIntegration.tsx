'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Bot, 
  Plus, 
  Link, 
  Unlink, 
  Play, 
  Settings, 
  CheckCircle, 
  XCircle,
  Loader2,
  Zap,
  Target,
  Code
} from 'lucide-react';

interface MCPServer {
  id: string;
  name: string;
  description?: string;
  type: 'stdio' | 'sse' | 'http';
  status: 'active' | 'inactive' | 'error';
  tools: MCPTool[];
}

interface MCPTool {
  id: string;
  name: string;
  description?: string;
  inputSchema: string;
  status: 'active' | 'inactive';
}

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  status: 'active' | 'inactive' | 'training';
}

interface MCPConnection {
  id: string;
  serverId: string;
  toolId?: string;
  agentId?: string;
  config?: string;
  status: 'active' | 'inactive';
  lastUsed?: string;
  server: MCPServer;
  tool?: MCPTool;
  agent?: Agent;
}

interface MCPExecution {
  id: string;
  serverId: string;
  toolName: string;
  arguments: any;
  result?: any;
  success: boolean;
  error?: string;
  timestamp: string;
}

export default function MCPAgentIntegration() {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [connections, setConnections] = useState<MCPConnection[]>([]);
  const [executions, setExecutions] = useState<MCPExecution[]>([]);
  const [isCreateConnectionOpen, setIsCreateConnectionOpen] = useState(false);
  const [isExecuteToolOpen, setIsExecuteToolOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [executing, setExecuting] = useState(false);
  const [newConnection, setNewConnection] = useState({
    serverId: '',
    toolId: '',
    agentId: '',
    config: ''
  });
  const [executionConfig, setExecutionConfig] = useState({
    serverId: '',
    toolName: '',
    arguments: '{}'
  });

  useEffect(() => {
    loadServers();
    loadAgents();
    loadConnections();
    loadExecutions();
  }, []);

  const loadServers = async () => {
    try {
      const response = await fetch('/admin/api/mcp/servers');
      if (response.ok) {
        const data = await response.json();
        setServers(data.servers || []);
      }
    } catch (error) {
      console.error('Erro ao carregar servidores MCP:', error);
    }
  };

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        const agentsArray = data.agents || [];
        setAgents(Array.isArray(agentsArray) ? agentsArray : []);
      }
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
    }
  };

  const loadConnections = async () => {
    try {
      // Simular conexões por enquanto
      const mockConnections: MCPConnection[] = [
        {
          id: '1',
          serverId: '1',
          toolId: '1',
          agentId: '1',
          config: '{"priority": "high", "timeout": 30000}',
          status: 'active',
          lastUsed: new Date().toISOString(),
          server: {
            id: '1',
            name: 'GitHub MCP',
            type: 'stdio',
            status: 'active',
            tools: []
          },
          tool: {
            id: '1',
            name: 'create_issue',
            description: 'Create GitHub issue',
            inputSchema: '{}',
            status: 'active'
          },
          agent: {
            id: '1',
            name: 'Dev Assistant',
            description: 'Assistant for development tasks',
            type: 'custom',
            status: 'active'
          }
        }
      ];
      setConnections(mockConnections);
    } catch (error) {
      console.error('Erro ao carregar conexões MCP:', error);
    }
  };

  const loadExecutions = async () => {
    try {
      // Simular execuções por enquanto
      const mockExecutions: MCPExecution[] = [
        {
          id: '1',
          serverId: '1',
          toolName: 'create_issue',
          arguments: { title: 'Bug fix needed', body: 'Found a bug in the login system' },
          result: { issue_number: 123, url: 'https://github.com/repo/issues/123' },
          success: true,
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          serverId: '1',
          toolName: 'search_repositories',
          arguments: { query: 'react components', per_page: 10 },
          result: { total_count: 1234, items: [] },
          success: true,
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        }
      ];
      setExecutions(mockExecutions);
    } catch (error) {
      console.error('Erro ao carregar execuções MCP:', error);
    }
  };

  const createConnection = async () => {
    if (!newConnection.serverId || !newConnection.agentId) return;

    try {
      // Simular criação de conexão
      const connection: MCPConnection = {
        id: Date.now().toString(),
        serverId: newConnection.serverId,
        toolId: newConnection.toolId || undefined,
        agentId: newConnection.agentId,
        config: newConnection.config,
        status: 'active',
        lastUsed: new Date().toISOString(),
        server: servers.find(s => s.id === newConnection.serverId)!,
        tool: servers.find(s => s.id === newConnection.serverId)?.tools.find(t => t.id === newConnection.toolId),
        agent: agents.find(a => a.id === newConnection.agentId)!
      };

      setConnections([...connections, connection]);
      setIsCreateConnectionOpen(false);
      setNewConnection({
        serverId: '',
        toolId: '',
        agentId: '',
        config: ''
      });
    } catch (error) {
      console.error('Erro ao criar conexão MCP:', error);
    }
  };

  const executeTool = async () => {
    if (!executionConfig.serverId || !executionConfig.toolName) return;

    setExecuting(true);
    
    try {
      const payload = {
        serverId: executionConfig.serverId,
        toolName: executionConfig.toolName,
        arguments: JSON.parse(executionConfig.arguments || '{}')
      };

      const response = await fetch('/admin/api/mcp/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      const execution: MCPExecution = {
        id: Date.now().toString(),
        serverId: executionConfig.serverId,
        toolName: executionConfig.toolName,
        arguments: JSON.parse(executionConfig.arguments || '{}'),
        result: result.result,
        success: result.success,
        error: result.error,
        timestamp: new Date().toISOString()
      };

      setExecutions([execution, ...executions]);
      setIsExecuteToolOpen(false);
      setExecutionConfig({
        serverId: '',
        toolName: '',
        arguments: '{}'
      });
    } catch (error) {
      console.error('Erro ao executar ferramenta MCP:', error);
    } finally {
      setExecuting(false);
    }
  };

  const deleteConnection = async (connectionId: string) => {
    setConnections(connections.filter(c => c.id !== connectionId));
  };

  const getServerTools = (serverId: string) => {
    const server = servers.find(s => s.id === serverId);
    return server?.tools || [];
  };

  const getAgentConnections = (agentId: string) => {
    return connections.filter(c => c.agentId === agentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const useCases = [
    {
      title: 'GitHub Integration',
      description: 'Agentes podem criar issues, gerenciar pull requests e analisar repositórios',
      icon: Code,
      tools: ['create_issue', 'create_pull_request', 'search_repositories'],
      agents: ['Dev Assistant', 'Code Reviewer']
    },
    {
      title: 'Database Operations',
      description: 'Agentes podem executar consultas SQL e analisar dados em tempo real',
      icon: Target,
      tools: ['execute_query', 'analyze_data', 'generate_report'],
      agents: ['Data Analyst', 'Report Generator']
    },
    {
      title: 'Web Search & Research',
      description: 'Agentes podem pesquisar informações na web e compilar relatórios',
      icon: Zap,
      tools: ['web_search', 'extract_content', 'summarize'],
      agents: ['Research Assistant', 'Content Creator']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Integração MCP com Agentes</h2>
          <p className="text-muted-foreground">
            Conecte servidores MCP aos agentes para expandir suas capacidades
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isExecuteToolOpen} onOpenChange={setIsExecuteToolOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Play className="w-4 h-4 mr-2" />
                Executar Ferramenta
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Executar Ferramenta MCP</DialogTitle>
                <DialogDescription>
                  Execute uma ferramenta MCP diretamente para testar sua funcionalidade
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Servidor</label>
                  <Select 
                    value={executionConfig.serverId} 
                    onValueChange={(value) => setExecutionConfig({...executionConfig, serverId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um servidor" />
                    </SelectTrigger>
                    <SelectContent>
                      {servers.filter(s => s.status === 'active').map((server) => (
                        <SelectItem key={server.id} value={server.id}>
                          {server.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {executionConfig.serverId && (
                  <div>
                    <label className="text-sm font-medium">Ferramenta</label>
                    <Select 
                      value={executionConfig.toolName} 
                      onValueChange={(value) => setExecutionConfig({...executionConfig, toolName: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma ferramenta" />
                      </SelectTrigger>
                      <SelectContent>
                        {getServerTools(executionConfig.serverId).map((tool) => (
                          <SelectItem key={tool.id} value={tool.name}>
                            {tool.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Argumentos (JSON)</label>
                  <Textarea
                    value={executionConfig.arguments}
                    onChange={(e) => setExecutionConfig({...executionConfig, arguments: e.target.value})}
                    placeholder='{"param1": "value1", "param2": "value2"}'
                    rows={4}
                  />
                </div>
                
                <Button 
                  onClick={executeTool} 
                  disabled={executing || !executionConfig.serverId || !executionConfig.toolName}
                  className="w-full"
                >
                  {executing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Executando...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Executar
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateConnectionOpen} onOpenChange={setIsCreateConnectionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Conexão
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Criar Conexão MCP</DialogTitle>
                <DialogDescription>
                  Conecte um servidor MCP a um agente para expandir suas capacidades
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Servidor MCP</label>
                  <Select 
                    value={newConnection.serverId} 
                    onValueChange={(value) => setNewConnection({...newConnection, serverId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um servidor" />
                    </SelectTrigger>
                    <SelectContent>
                      {servers.filter(s => s.status === 'active').map((server) => (
                        <SelectItem key={server.id} value={server.id}>
                          {server.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {newConnection.serverId && (
                  <div>
                    <label className="text-sm font-medium">Ferramenta (Opcional)</label>
                    <Select 
                      value={newConnection.toolId} 
                      onValueChange={(value) => setNewConnection({...newConnection, toolId: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma ferramenta (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Todas as ferramentas</SelectItem>
                        {getServerTools(newConnection.serverId).map((tool) => (
                          <SelectItem key={tool.id} value={tool.id}>
                            {tool.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Agente</label>
                  <Select 
                    value={newConnection.agentId} 
                    onValueChange={(value) => setNewConnection({...newConnection, agentId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um agente" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.filter(a => a.status === 'active').map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Configuração (JSON)</label>
                  <Textarea
                    value={newConnection.config}
                    onChange={(e) => setNewConnection({...newConnection, config: e.target.value})}
                    placeholder='{"priority": "high", "timeout": 30000}'
                    rows={3}
                  />
                </div>
                
                <Button onClick={createConnection} className="w-full">
                  Criar Conexão
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Use Cases */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Casos de Uso Práticos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {useCases.map((useCase, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <useCase.icon className="w-5 h-5 text-blue-500" />
                  <span>{useCase.title}</span>
                </CardTitle>
                <CardDescription>{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Ferramentas:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {useCase.tools.map((tool, toolIndex) => (
                        <Badge key={toolIndex} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Agentes:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {useCase.agents.map((agent, agentIndex) => (
                        <Badge key={agentIndex} variant="secondary" className="text-xs">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Connections */}
      <Card>
        <CardHeader>
          <CardTitle>Conexões Ativas</CardTitle>
          <CardDescription>
            Conexões entre servidores MCP e agentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(connection.status)}`} />
                    <div>
                      <h3 className="font-medium">
                        {connection.server.name} → {connection.agent?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {connection.tool ? `Ferramenta: ${connection.tool.name}` : 'Todas as ferramentas'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{connection.server.type.toUpperCase()}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteConnection(connection.id)}
                    >
                      <Unlink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {connection.lastUsed && (
                  <div className="text-xs text-muted-foreground">
                    Último uso: {new Date(connection.lastUsed).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
            
            {connections.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma conexão MCP ativa</p>
                <p className="text-sm">Crie uma conexão para integrar MCP com agentes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Execuções Recentes</CardTitle>
          <CardDescription>
            Histórico de execuções de ferramentas MCP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {executions.map((execution) => (
              <div key={execution.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {execution.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <h3 className="font-medium">{execution.toolName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Servidor: {servers.find(s => s.id === execution.serverId)?.name || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={execution.success ? 'default' : 'destructive'}
                      className={execution.success ? 'bg-green-100 text-green-800' : ''}
                    >
                      {execution.success ? 'Sucesso' : 'Erro'}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium mb-1">Argumentos:</div>
                  <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(execution.arguments, null, 2)}
                  </pre>
                </div>
                
                {execution.result && (
                  <div className="text-sm mt-2">
                    <div className="font-medium mb-1">Resultado:</div>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                      {JSON.stringify(execution.result, null, 2)}
                    </pre>
                  </div>
                )}
                
                {execution.error && (
                  <div className="text-sm mt-2 text-red-600">
                    <div className="font-medium mb-1">Erro:</div>
                    <div>{execution.error}</div>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground mt-2">
                  Executado em: {new Date(execution.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
            
            {executions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma execução recente</p>
                <p className="text-sm">Execute uma ferramenta MCP para ver o histórico</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}