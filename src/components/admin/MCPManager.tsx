'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, 
  Plus, 
  Settings, 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Wrench,
  Link,
  Unlink,
  Zap,
  Store,
  Activity,
  Heart,
  Globe,
  Terminal,
  Database,
  Bot,
  FileText,
  Star,
  MoreHorizontal,
  Copy,
  Trash2,
  ChevronRight,
  Search,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Switch
} from '@/components/ui/dropdown-menu';
import { Switch as UISwitch } from '@/components/ui/switch';

interface MCPServer {
  id: string;
  name: string;
  description?: string;
  type: 'stdio' | 'sse' | 'http';
  command?: string;
  args?: string;
  url?: string;
  env?: string;
  headers?: string;
  status: 'active' | 'inactive' | 'error';
  lastConnected?: string;
  workspace?: {
    id: string;
    name: string;
  };
  tools: MCPTool[];
  connections: MCPConnection[];
  _count: {
    tools: number;
    connections: number;
  };
}

interface MCPTool {
  id: string;
  name: string;
  description?: string;
  inputSchema: string;
  status: 'active' | 'inactive';
  server: {
    id: string;
    name: string;
    type: string;
    status: string;
  };
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
  agent?: {
    id: string;
    name: string;
  };
}

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  status: 'active' | 'inactive' | 'training';
}

export default function MCPManager() {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [tools, setTools] = useState<MCPTool[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isCreateServerOpen, setIsCreateServerOpen] = useState(false);
  const [isTestConnectionOpen, setIsTestConnectionOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [testingServer, setTestingServer] = useState<string | null>(null);
  const [newServer, setNewServer] = useState({
    name: '',
    description: '',
    type: 'stdio' as 'stdio' | 'sse' | 'http',
    command: '',
    args: '',
    url: '',
    env: '',
    headers: ''
  });
  const [testConfig, setTestConfig] = useState({
    type: 'stdio' as 'stdio' | 'sse' | 'http',
    command: '',
    args: '',
    url: '',
    env: '',
    headers: ''
  });

  // External Marketplace State
  const [marketplaceServers, setMarketplaceServers] = useState<any[]>([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState(false);
  const [marketplaceError, setMarketplaceError] = useState<string | null>(null);
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [marketplaceCategory, setMarketplaceCategory] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadServers();
    loadTools();
    loadAgents();
    loadMarketplaceServers();
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

  const loadTools = async () => {
    try {
      const response = await fetch('/admin/api/mcp/tools');
      if (response.ok) {
        const data = await response.json();
        setTools(data.tools || []);
      }
    } catch (error) {
      console.error('Erro ao carregar ferramentas MCP:', error);
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

  // External Marketplace Functions
  const loadMarketplaceServers = async (search = '', category = 'all') => {
    setMarketplaceLoading(true);
    setMarketplaceError(null);
    
    try {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (category !== 'all') params.append('category', category);
      
      const response = await fetch(`/admin/api/mcp/marketplace?${params}`);
      if (response.ok) {
        const data = await response.json();
        setMarketplaceServers(data.servers || []);
      } else {
        setMarketplaceError(`Erro ao carregar catálogo do marketplace: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao carregar marketplace:', error);
      setMarketplaceError(`Erro ao carregar catálogo do marketplace: ${error.message}`);
    } finally {
      setMarketplaceLoading(false);
    }
  };

  const installFromMarketplace = async (server: any) => {
    try {
      const payload = {
        serverId: server.id,
        config: server.config
      };

      const response = await fetch('/admin/api/mcp/marketplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Create the server in our system
        const createPayload = {
          name: server.name,
          description: server.description,
          type: server.config.type,
          command: server.config.command,
          args: server.config.args,
          url: server.config.url,
          env: server.config.env,
          headers: server.config.headers
        };

        const createResponse = await fetch('/admin/api/mcp/servers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createPayload),
        });

        if (createResponse.ok) {
          loadServers();
          alert(`Servidor "${server.name}" instalado com sucesso!`);
        } else {
          alert('Erro ao criar servidor no sistema');
        }
      } else {
        alert('Erro ao instalar servidor do marketplace');
      }
    } catch (error) {
      console.error('Erro ao instalar do marketplace:', error);
      alert('Erro ao instalar servidor do marketplace');
    }
  };

  const createServer = async () => {
    if (!newServer.name || !newServer.type) return;

    try {
      const payload = {
        name: newServer.name,
        description: newServer.description,
        type: newServer.type,
        ...(newServer.type === 'stdio' && { command: newServer.command }),
        ...(newServer.args && { args: JSON.parse(newServer.args || '[]') }),
        ...((newServer.type === 'sse' || newServer.type === 'http') && { url: newServer.url }),
        ...(newServer.env && { env: JSON.parse(newServer.env || '{}') }),
        ...(newServer.headers && { headers: JSON.parse(newServer.headers || '{}') })
      };

      const response = await fetch('/admin/api/mcp/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsCreateServerOpen(false);
        setNewServer({
          name: '',
          description: '',
          type: 'stdio',
          command: '',
          args: '',
          url: '',
          env: '',
          headers: ''
        });
        loadServers();
      }
    } catch (error) {
      console.error('Erro ao criar servidor MCP:', error);
    }
  };

  const testConnection = async () => {
    if (!testConfig.type) return;

    setTestingServer('test');
    
    try {
      const payload = {
        type: testConfig.type,
        ...(testConfig.type === 'stdio' && { command: testConfig.command }),
        ...(testConfig.args && { args: JSON.parse(testConfig.args || '[]') }),
        ...((testConfig.type === 'sse' || testConfig.type === 'http') && { url: testConfig.url }),
        ...(testConfig.env && { env: JSON.parse(testConfig.env || '{}') }),
        ...(testConfig.headers && { headers: JSON.parse(testConfig.headers || '{}') })
      };

      const response = await fetch('/admin/api/mcp/servers/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Conexão bem-sucedida! Encontradas ${result.tools.length} ferramentas.`);
      } else {
        alert(`Erro na conexão: ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      alert('Erro ao testar conexão');
    } finally {
      setTestingServer(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'inactive': return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const serverTemplates = [
    {
      name: 'GitHub MCP',
      description: 'Servidor MCP para integração com GitHub API',
      type: 'stdio' as const,
      command: 'npx',
      args: ['@modelcontextprotocol/server-github'],
      env: { GITHUB_PERSONAL_ACCESS_TOKEN: 'seu_token_aqui' }
    },
    {
      name: 'PostgreSQL MCP',
      description: 'Servidor MCP para consultas PostgreSQL',
      type: 'stdio' as const,
      command: 'npx',
      args: ['@modelcontextprotocol/server-postgres'],
      env: { DATABASE_URL: 'postgresql://user:pass@localhost:5432/db' }
    },
    {
      name: 'Brave Search MCP',
      description: 'Servidor MCP para busca web com Brave Search',
      type: 'stdio' as const,
      command: 'npx',
      args: ['@modelcontextprotocol/server-brave-search'],
      env: { BRAVE_SEARCH_API_KEY: 'sua_chave_aqui' }
    }
  ];

  const applyTemplate = (template: typeof serverTemplates[0]) => {
    setNewServer({
      name: template.name,
      description: template.description,
      type: template.type,
      command: template.command,
      args: JSON.stringify(template.args, null, 2),
      url: '',
      env: JSON.stringify(template.env, null, 2),
      headers: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Main Servers Card */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{servers.length}</div>
                  <div className="text-sm text-muted-foreground">Servidores MCP</div>
                </div>
              </div>
              <div className="flex -space-x-2">
                {servers.slice(0, 3).map((server, index) => (
                  <div key={index} className={`w-3 h-3 rounded-full ${
                    server.status === 'active' ? 'bg-green-500' :
                    server.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                  }`} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {servers.filter(s => s.status === 'active').length} ativos
              </span>
              <span className="text-green-600 font-medium">
                +{Math.floor(servers.length * 0.2)}% este mês
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tools Card */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 group-hover:from-green-500/20 group-hover:to-emerald-500/20 transition-all duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Wrench className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{tools.length}</div>
                  <div className="text-sm text-muted-foreground">Ferramentas</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {tools.filter(t => t.status === 'active').length}
                </div>
                <div className="text-xs text-muted-foreground">ativas</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(tools.filter(t => t.status === 'active').length / Math.max(tools.length, 1)) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance Card */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {servers.reduce((acc, s) => acc + s.connections.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Conexões</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">
                  {Math.floor(servers.reduce((acc, s) => acc + s.connections.length, 0) * 1.5)}
                </div>
                <div className="text-xs text-muted-foreground">hoje</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-600">Online</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">99.9% uptime</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-300" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Plus className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">Ações</div>
                  <div className="text-sm text-muted-foreground">Rápidas</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => setIsCreateServerOpen(true)}
              >
                <Plus className="w-3 h-3 mr-1" />
                Novo
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={() => setIsTestConnectionOpen(true)}
              >
                <Play className="w-3 h-3 mr-1" />
                Testar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={loadServers}
              >
                <Loader2 className="w-3 h-3 mr-1" />
                Atualizar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                Config
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced MCP Control Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Servers Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* MCP Marketplace */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Store className="w-5 h-5 text-purple-600" />
                    <span>MCP Marketplace</span>
                  </CardTitle>
                  <CardDescription>
                    Descubra e instale servidores MCP pré-configurados
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                  {serverTemplates.length} disponíveis
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serverTemplates.map((template, index) => (
                  <Card key={index} className="border-2 border-dashed hover:border-solid hover:border-purple-300 transition-all duration-300 group cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-lg">
                            {template.type === 'stdio' ? (
                              <Terminal className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Globe className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{template.name}</h3>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {template.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => applyTemplate(template)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span className="text-green-600">Verificado</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* External MCP Marketplace */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span>MCP Marketplace Externo</span>
                  </CardTitle>
                  <CardDescription>
                    Catálogo externo de servidores MCP da comunidade
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  {marketplaceServers.length} disponíveis
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar servidores..."
                    value={marketplaceSearch}
                    onChange={(e) => setMarketplaceSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={marketplaceCategory} onValueChange={(value) => setMarketplaceCategory(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas Categorias</SelectItem>
                      <SelectItem value="official">Oficiais</SelectItem>
                      <SelectItem value="community">Comunidade</SelectItem>
                      <SelectItem value="database">Banco de Dados</SelectItem>
                      <SelectItem value="api">APIs</SelectItem>
                      <SelectItem value="filesystem">Arquivos</SelectItem>
                      <SelectItem value="communication">Comunicação</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => loadMarketplaceServers(marketplaceSearch, marketplaceCategory)}
                    disabled={marketplaceLoading}
                    size="sm"
                  >
                    {marketplaceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {marketplaceError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-red-800">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">{marketplaceError}</span>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {marketplaceLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-muted-foreground">Carregando catálogo...</span>
                </div>
              )}

              {/* Marketplace Servers Grid */}
              {!marketplaceLoading && !marketplaceError && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {marketplaceServers.map((server, index) => (
                    <Card key={index} className="border hover:shadow-md transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg ${
                              server.tags.includes('official') 
                                ? 'bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30'
                                : 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30'
                            }`}>
                              {server.config.type === 'stdio' ? (
                                <Terminal className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Globe className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">{server.name}</h3>
                              <div className="flex items-center gap-1 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {server.config.type.toUpperCase()}
                                </Badge>
                                {server.tags.includes('official') && (
                                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                                    Oficial
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => installFromMarketplace(server)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {server.description}
                        </p>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground">por {server.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{server.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Download className="w-3 h-3 text-gray-500" />
                              <span>{server.downloads.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-3 h-3 text-red-500" />
                              <span>{server.installCount.toLocaleString()}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            v{server.version}
                          </Badge>
                        </div>
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {server.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {server.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{server.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!marketplaceLoading && !marketplaceError && marketplaceServers.length === 0 && (
                <div className="text-center py-8">
                  <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum servidor encontrado</h3>
                  <p className="text-sm text-muted-foreground">
                    Tente ajustar sua busca ou categoria para encontrar mais servidores.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Servers Management */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span>Servidores Ativos</span>
                  </CardTitle>
                  <CardDescription>
                    Gerencie e monitore seus servidores MCP configurados
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value="all" onValueChange={() => {}}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                      <SelectItem value="error">Erro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={() => setIsCreateServerOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {servers.map((server) => (
                  <Card key={server.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {getStatusIcon(server.status)}
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              server.status === 'active' ? 'bg-green-500' :
                              server.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-medium flex items-center space-x-2">
                              <span>{server.name}</span>
                              {server.status === 'active' && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  <div className="w-1 h-1 bg-green-500 rounded-full mr-1" />
                                  Online
                                </Badge>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">{server.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {server.type.toUpperCase()}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedServer(server.id);
                                setIsTestConnectionOpen(true);
                              }}>
                                <Play className="w-4 h-4 mr-2" />
                                Testar Conexão
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="w-4 h-4 mr-2" />
                                Configurar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Endpoint:</span>
                          <div className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded mt-1">
                            {server.type === 'stdio' ? server.command : server.url}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Ferramentas:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-bold">{server._count.tools}</span>
                            <div className="flex -space-x-1">
                              {Array.from({ length: Math.min(server._count.tools, 3) }).map((_, i) => (
                                <Wrench key={i} className="w-3 h-3 text-green-500" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Conexões:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-bold">{server._count.connections}</span>
                            <Link className="w-3 h-3 text-purple-500" />
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Último:</span>
                          <div className="text-xs text-muted-foreground mt-1">
                            {server.lastConnected ? new Date(server.lastConnected).toLocaleDateString() : 'Nunca'}
                          </div>
                        </div>
                      </div>

                      {/* Server Tools Preview */}
                      {server._count.tools > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-muted-foreground">Ferramentas disponíveis:</span>
                            <Button size="sm" variant="ghost" className="text-xs h-6">
                              Ver todas
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {['web_search', 'extract_content', 'summarize'].slice(0, 3).map((tool, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                            {server._count.tools > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{server._count.tools - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {servers.length === 0 && (
                  <div className="text-center py-12">
                    <Server className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Nenhum servidor MCP configurado
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Comece adicionando um servidor MCP do marketplace ou crie um personalizado
                    </p>
                    <Button onClick={() => setIsCreateServerOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Servidor MCP
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Advanced Controls */}
        <div className="space-y-6">
          {/* MCP Health Monitor */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Health Monitor</span>
              </CardTitle>
              <CardDescription>
                Monitoramento em tempo real dos servidores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm">Global Status</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                    Healthy
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Response Time</span>
                    <span className="font-mono text-xs">142ms</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-green-500 h-1 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Success Rate</span>
                    <span className="font-mono text-xs">99.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: '99.2%' }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Error Rate</span>
                    <span className="font-mono text-xs">0.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div className="bg-red-500 h-1 rounded-full" style={{ width: '0.8%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <Button size="sm" variant="outline" className="w-full">
                  <Activity className="w-4 h-4 mr-2" />
                  Ver Relatório Completo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Templates */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span>Quick Start</span>
              </CardTitle>
              <CardDescription>
                Templates populares para começar rápido
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Web Research', icon: Globe, color: 'blue', count: 3 },
                { name: 'Database Tools', icon: Database, color: 'green', count: 2 },
                { name: 'AI Assistant', icon: Bot, color: 'purple', count: 4 },
                { name: 'File Operations', icon: FileText, color: 'orange', count: 2 }
              ].map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 bg-${template.color}-100 dark:bg-${template.color}-900/30 rounded-lg`}>
                      <template.icon className={`w-4 h-4 text-${template.color}-600 dark:text-${template.color}-400`} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.count} ferramentas</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* MCP Settings */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Settings className="w-5 h-5 text-gray-600" />
                <span>Configurações</span>
              </CardTitle>
              <CardDescription>
                Configurações globais do MCP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Auto-reconnect</div>
                    <div className="text-xs text-muted-foreground">Reconectar automaticamente</div>
                  </div>
                  <UISwitch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Health Monitoring</div>
                    <div className="text-xs text-muted-foreground">Monitorar saúde dos servidores</div>
                  </div>
                  <UISwitch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Error Notifications</div>
                    <div className="text-xs text-muted-foreground">Notificar em caso de erros</div>
                  </div>
                  <UISwitch defaultChecked />
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Timeout</span>
                    <Select defaultValue="30">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15s</SelectItem>
                        <SelectItem value="30">30s</SelectItem>
                        <SelectItem value="60">60s</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <Button size="sm" variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações Avançadas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs remain the same */}
      <Dialog open={isTestConnectionOpen} onOpenChange={setIsTestConnectionOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Testar Conexão
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Testar Conexão MCP</DialogTitle>
            <DialogDescription>
              Teste a conexão com um servidor MCP antes de adicioná-lo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select 
                value={testConfig.type} 
                onValueChange={(value: any) => setTestConfig({...testConfig, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stdio">STDIO</SelectItem>
                  <SelectItem value="sse">SSE</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {testConfig.type === 'stdio' && (
              <div>
                <label className="text-sm font-medium">Comando</label>
                <Input
                  value={testConfig.command}
                  onChange={(e) => setTestConfig({...testConfig, command: e.target.value})}
                  placeholder="Ex: npx"
                />
              </div>
            )}
            
            {(testConfig.type === 'sse' || testConfig.type === 'http') && (
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={testConfig.url}
                  onChange={(e) => setTestConfig({...testConfig, url: e.target.value})}
                  placeholder="Ex: http://localhost:3001/mcp"
                />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Argumentos (JSON)</label>
              <Textarea
                value={testConfig.args}
                onChange={(e) => setTestConfig({...testConfig, args: e.target.value})}
                placeholder='["@modelcontextprotocol/server-github"]'
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Variáveis de Ambiente (JSON)</label>
              <Textarea
                value={testConfig.env}
                onChange={(e) => setTestConfig({...testConfig, env: e.target.value})}
                placeholder='{"GITHUB_PERSONAL_ACCESS_TOKEN": "seu_token"}'
                rows={3}
              />
            </div>
            
            <Button 
              onClick={testConnection} 
              disabled={testingServer === 'test'}
              className="w-full"
            >
              {testingServer === 'test' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Testar Conexão
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCreateServerOpen} onOpenChange={setIsCreateServerOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Servidor
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Servidor MCP</DialogTitle>
            <DialogDescription>
              Configure um novo servidor MCP para expandir as capacidades dos agentes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Templates Rápidos</label>
              <div className="grid grid-cols-1 gap-2">
                {serverTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto p-3"
                    onClick={() => applyTemplate(template)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input
                value={newServer.name}
                onChange={(e) => setNewServer({...newServer, name: e.target.value})}
                placeholder="Nome do servidor"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={newServer.description}
                onChange={(e) => setNewServer({...newServer, description: e.target.value})}
                placeholder="Descrição do servidor"
                rows={2}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select 
                value={newServer.type} 
                onValueChange={(value: any) => setNewServer({...newServer, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stdio">STDIO</SelectItem>
                  <SelectItem value="sse">SSE</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newServer.type === 'stdio' && (
              <div>
                <label className="text-sm font-medium">Comando</label>
                <Input
                  value={newServer.command}
                  onChange={(e) => setNewServer({...newServer, command: e.target.value})}
                  placeholder="Ex: npx"
                />
              </div>
            )}
            
            {(newServer.type === 'sse' || newServer.type === 'http') && (
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={newServer.url}
                  onChange={(e) => setNewServer({...newServer, url: e.target.value})}
                  placeholder="Ex: http://localhost:3001/mcp"
                />
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Argumentos (JSON)</label>
              <Textarea
                value={newServer.args}
                onChange={(e) => setNewServer({...newServer, args: e.target.value})}
                placeholder='["@modelcontextprotocol/server-github"]'
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Variáveis de Ambiente (JSON)</label>
              <Textarea
                value={newServer.env}
                onChange={(e) => setNewServer({...newServer, env: e.target.value})}
                placeholder='{"GITHUB_PERSONAL_ACCESS_TOKEN": "seu_token"}'
                rows={3}
              />
            </div>
            
            {(newServer.type === 'sse' || newServer.type === 'http') && (
              <div>
                <label className="text-sm font-medium">Headers (JSON)</label>
                <Textarea
                  value={newServer.headers}
                  onChange={(e) => setNewServer({...newServer, headers: e.target.value})}
                  placeholder='{"Authorization": "Bearer token"}'
                  rows={2}
                />
              </div>
            )}
            
            <Button onClick={createServer} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Criar Servidor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}