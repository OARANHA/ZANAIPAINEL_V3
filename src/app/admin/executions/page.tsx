'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Eye, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface Execution {
  id: string;
  input: string;
  output?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  error?: string;
  result?: string;
  agent: {
    id: string;
    name: string;
    type: string;
  };
}

interface Agent {
  id: string;
  name: string;
  type: string;
}

export default function ExecutionsPage() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [executionsResponse, agentsResponse] = await Promise.all([
        fetch('/api/execute'),
        fetch('/api/agents')
      ]);

      if (executionsResponse.ok) {
        const executionsData = await executionsResponse.json();
        setExecutions(executionsData);
      }

      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        // The API returns { agents: [...] } so we need to extract the agents array
        setAgents(agentsData.agents || []);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
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

  const filteredExecutions = executions.filter(execution => {
    const matchesSearch = execution.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.agent.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || execution.status === statusFilter;
    
    const matchesAgent = agentFilter === 'all' || execution.agent.id === agentFilter;
    
    return matchesSearch && matchesStatus && matchesAgent;
  });

  const getStatusCounts = () => {
    const counts = {
      total: executions.length,
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0
    };

    executions.forEach(execution => {
      counts[execution.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <img
                  src="/logo.svg"
                  alt="Zanai Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold">Zanai - Histórico de Execuções</h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/specialists">
              <Button variant="outline">
                ← Voltar para Especialistas
              </Button>
            </Link>
            <Button onClick={loadData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Execução</CardTitle>
              <Loader2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.running}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Falhas</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{statusCounts.failed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por input ou agente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="running">Em Execução</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="failed">Falha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Agente</label>
                <Select value={agentFilter} onValueChange={setAgentFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Agentes</SelectItem>
                    {Array.isArray(agents) && agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Execuções ({filteredExecutions.length})
              </div>
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredExecutions.length} de {executions.length} execuções
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Carregando execuções...</span>
              </div>
            ) : filteredExecutions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma Execução Encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || agentFilter !== 'all' 
                    ? 'Tente ajustar seus filtros'
                    : 'Comece executando alguns agentes para ver o histórico aqui'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Agente</TableHead>
                      <TableHead>Input</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExecutions.map((execution) => (
                      <TableRow key={execution.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(execution.status)}
                            <Badge className={getStatusColor(execution.status)}>
                              {execution.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{execution.agent.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {execution.agent.type}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {execution.input}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDuration(execution.startedAt, execution.completedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(execution.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedExecution(execution)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh]">
                              <DialogHeader>
                                <DialogTitle>Detalhes da Execução</DialogTitle>
                                <DialogDescription>
                                  Execução #{execution.id} - {execution.agent.name}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Status</h4>
                                    <div className="flex items-center space-x-2">
                                      {getStatusIcon(execution.status)}
                                      <Badge className={getStatusColor(execution.status)}>
                                        {execution.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Duração</h4>
                                    <p>{formatDuration(execution.startedAt, execution.completedAt)}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Início</h4>
                                    <p>{execution.startedAt ? new Date(execution.startedAt).toLocaleString() : '-'}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Fim</h4>
                                    <p>{execution.completedAt ? new Date(execution.completedAt).toLocaleString() : '-'}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Input</h4>
                                  <ScrollArea className="h-32 w-full border rounded-md p-3 bg-muted/50">
                                    <pre className="text-sm whitespace-pre-wrap">
                                      {execution.input}
                                    </pre>
                                  </ScrollArea>
                                </div>
                                
                                {execution.error && (
                                  <div>
                                    <h4 className="font-medium mb-2">Erro</h4>
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                      <p className="text-sm text-red-800">{execution.error}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {execution.output && (
                                  <div>
                                    <h4 className="font-medium mb-2">Output</h4>
                                    <ScrollArea className="h-64 w-full border rounded-md p-3 bg-muted/50">
                                      <div className="prose prose-sm max-w-none">
                                        <pre className="text-sm whitespace-pre-wrap">
                                          {execution.output}
                                        </pre>
                                      </div>
                                    </ScrollArea>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}