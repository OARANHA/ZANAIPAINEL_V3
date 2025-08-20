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
import { Target, Play, Settings, Download, Upload, Code, FileText, GitBranch, Lightbulb, Zap, Server, Bot } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ElegantCard from '@/components/ui/ElegantCard';
import MCPManager from '@/components/admin/MCPManager';
import MCPAgentIntegration from '@/components/admin/MCPAgentIntegration';

interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  framework: string;
  status: 'active' | 'inactive' | 'deployed';
  lastSynced: string;
  createdAt: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  status: 'active' | 'inactive' | 'training';
}

export default function StudioPage() {
  const pathname = usePathname();
  const [projects, setProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    language: '',
    framework: ''
  });

  useEffect(() => {
    loadProjects();
    loadAgents();
  }, []);

  const loadProjects = async () => {
    try {
      // Simular projetos por enquanto
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'API de E-commerce',
          description: 'API RESTful para plataforma de e-commerce',
          language: 'TypeScript',
          framework: 'Next.js',
          status: 'active',
          lastSynced: new Date().toISOString(),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Dashboard Analytics',
          description: 'Dashboard de análise de dados em tempo real',
          language: 'JavaScript',
          framework: 'React',
          status: 'deployed',
          lastSynced: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setProjects(mockProjects);
      if (mockProjects.length > 0) {
        setSelectedProject(mockProjects[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        // The API returns { agents: [...] } so we need to extract the agents array
        const agentsArray = data.agents || [];
        setAgents(Array.isArray(agentsArray) ? agentsArray.filter(agent => agent.status === 'active') : []);
      }
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
      // Set empty array on error to prevent filter errors
      setAgents([]);
    }
  };

  const createProject = async () => {
    if (!newProject.name) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      language: newProject.language,
      framework: newProject.framework,
      status: 'active',
      lastSynced: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setProjects([...projects, project]);
    setIsCreateProjectOpen(false);
    setNewProject({
      name: '',
      description: '',
      language: '',
      framework: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'deployed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <MainLayout currentPath={pathname}>
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ElegantCard
            title="Total Projetos"
            description="Projetos criados"
            icon={Code}
            iconColor="text-blue-600"
            bgColor="bg-blue-100 dark:bg-blue-900/20"
            value={projects.length}
            badge={projects.length > 0 ? "Ativos" : undefined}
            badgeColor="bg-blue-50 text-blue-700 border-blue-200"
          />
          
          <ElegantCard
            title="Projetos Ativos"
            description="Em desenvolvimento"
            icon={Zap}
            iconColor="text-green-600"
            bgColor="bg-green-100 dark:bg-green-900/20"
            value={projects.filter(p => p.status === 'active').length}
            badge="Em andamento"
            badgeColor="bg-green-50 text-green-700 border-green-200"
          />
          
          <ElegantCard
            title="Projetos Deployados"
            description="Em produção"
            icon={Upload}
            iconColor="text-purple-600"
            bgColor="bg-purple-100 dark:bg-purple-900/20"
            value={projects.filter(p => p.status === 'deployed').length}
            badge="Produção"
            badgeColor="bg-purple-50 text-purple-700 border-purple-200"
          />
          
          <ElegantCard
            title="Agentes IA"
            description="Disponíveis"
            icon={Target}
            iconColor="text-orange-600"
            bgColor="bg-orange-100 dark:bg-orange-900/20"
            value={Array.isArray(agents) ? agents.length : 0}
            badge={Array.isArray(agents) && agents.length > 0 ? "Prontos para uso" : undefined}
            badgeColor="bg-orange-50 text-orange-700 border-orange-200"
          />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Visual Studio</h1>
          <p className="text-lg text-muted-foreground">
            Ambiente de desenvolvimento integrado com agentes de IA
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione um projeto" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                  Novo Projeto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Projeto</DialogTitle>
                  <DialogDescription>
                    Configure um novo projeto para integração com agentes de IA
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="Nome do projeto"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Descrição</label>
                    <Textarea
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Descrição do projeto"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Linguagem</label>
                      <Input
                        value={newProject.language}
                        onChange={(e) => setNewProject({ ...newProject, language: e.target.value })}
                        placeholder="Ex: TypeScript"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Framework</label>
                      <Input
                        value={newProject.framework}
                        onChange={(e) => setNewProject({ ...newProject, framework: e.target.value })}
                        placeholder="Ex: Next.js"
                      />
                    </div>
                  </div>
                  <Button onClick={createProject} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Criar Projeto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="workspace" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-lg border">
            <TabsTrigger value="workspace" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 rounded-lg transition-all">
              <Code className="w-4 h-4" />
              <span>Workspace</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-2 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 rounded-lg transition-all">
              <Target className="w-4 h-4" />
              <span>Agentes IA</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center space-x-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 rounded-lg transition-all">
              <Zap className="w-4 h-4" />
              <span>Automação</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-orange-100 dark:data-[state=active]:bg-orange-900 rounded-lg transition-all">
              <Lightbulb className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="mcp" className="flex items-center space-x-2 data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900 rounded-lg transition-all">
              <Server className="w-4 h-4" />
              <span>MCP</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workspace" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Project List */}
              <div className="lg:col-span-1">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Projetos</CardTitle>
                    <CardDescription>Seus projetos ativos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedProject === project.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{project.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span>{project.language} • {project.framework}</span>
                          <span>{new Date(project.lastSynced).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Workspace Area */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Área de Trabalho</CardTitle>
                        <CardDescription>
                          {projects.find(p => p.id === selectedProject)?.name || 'Selecione um projeto'}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Upload className="w-4 h-4 mr-1" />
                          Sync
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <Code className="w-4 h-4" />
                          <span className="font-medium">Editor de Código</span>
                        </div>
                        <Textarea
                          placeholder="Seu código aparecerá aqui..."
                          className="min-h-64 font-mono text-sm"
                          defaultValue={`// Exemplo de código integrado com IA
function processData(data) {
  // Agentes de IA podem ajudar a otimizar esta função
  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: new Date().toISOString()
  }));
}`}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <ElegantCard
                          title="Sugestões de IA"
                          description="Otimizações sugeridas"
                          icon={Lightbulb}
                          iconColor="text-yellow-600"
                          bgColor="bg-yellow-100 dark:bg-yellow-900/20"
                          badge="3 sugestões"
                          badgeColor="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <Lightbulb className="w-4 h-4 text-yellow-500" />
                              <span>Otimize o loop de processamento</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Zap className="w-4 h-4 text-blue-500" />
                              <span>Adicione tratamento de erros</span>
                            </div>
                          </div>
                        </ElegantCard>
                        
                        <ElegantCard
                          title="Ações Rápidas"
                          description="Atalhos comuns"
                          icon={GitBranch}
                          iconColor="text-green-600"
                          bgColor="bg-green-100 dark:bg-green-900/20"
                          badge="Disponíveis"
                          badgeColor="bg-green-50 text-green-700 border-green-200"
                        >
                          <div className="space-y-2">
                            <Button size="sm" variant="outline" className="w-full justify-start">
                              <GitBranch className="w-4 h-4 mr-2" />
                              Gerar Branch
                            </Button>
                            <Button size="sm" variant="outline" className="w-full justify-start">
                              <Play className="w-4 h-4 mr-2" />
                              Executar Testes
                            </Button>
                          </div>
                        </ElegantCard>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(agents) && agents.map((agent) => (
                <ElegantCard
                  key={agent.id}
                  title={agent.name}
                  description={agent.description}
                  icon={Target}
                  iconColor={agent.status === 'active' ? 'text-green-600' : 'text-gray-600'}
                  bgColor={agent.status === 'active' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-900/20'}
                  badge={agent.type}
                  badgeColor={agent.type === 'template' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                           agent.type === 'custom' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                           'bg-green-50 text-green-700 border-green-200'}
                >
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Play className="w-4 h-4 mr-1" />
                      Executar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </ElegantCard>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ElegantCard
                title="Automação de Build"
                description="CI/CD integrado com IA"
                icon={Zap}
                iconColor="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/20"
                badge="Automatizado"
                badgeColor="bg-blue-50 text-blue-700 border-blue-200"
              >
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Builds automáticos</span>
                    <span className="font-medium text-green-600">Ativado</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Testes automáticos</span>
                    <span className="font-medium text-green-600">Ativado</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Deploy automático</span>
                    <span className="font-medium text-orange-600">Parcial</span>
                  </div>
                </div>
              </ElegantCard>

              <ElegantCard
                title="Monitoramento"
                description="Monitoramento inteligente"
                icon={Lightbulb}
                iconColor="text-purple-600"
                bgColor="bg-purple-100 dark:bg-purple-900/20"
                badge="Ativo"
                badgeColor="bg-purple-50 text-purple-700 border-purple-200"
              >
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Performance</span>
                    <span className="font-medium text-green-600">98%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-medium text-green-600">99.9%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Alertas</span>
                    <span className="font-medium text-blue-600">0</span>
                  </div>
                </div>
              </ElegantCard>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ElegantCard
                title="Código Analisado"
                description="Linhas de código processadas"
                icon={Code}
                iconColor="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/20"
                value="15,234"
                badge="Hoje"
                badgeColor="bg-blue-50 text-blue-700 border-blue-200"
              />
              
              <ElegantCard
                title="Bugs Encontrados"
                description="Problemas identificados"
                icon={Target}
                iconColor="text-red-600"
                bgColor="bg-red-100 dark:bg-red-900/20"
                value="23"
                badge="Corrigidos"
                badgeColor="bg-red-50 text-red-700 border-red-200"
              />
              
              <ElegantCard
                title="Otimizações"
                description="Melhorias aplicadas"
                icon={Zap}
                iconColor="text-green-600"
                bgColor="bg-green-100 dark:bg-green-900/20"
                value="47"
                badge="Performance +15%"
                badgeColor="bg-green-50 text-green-700 border-green-200"
              />
            </div>
          </TabsContent>

          <TabsContent value="mcp" className="space-y-6">
            <Tabs defaultValue="servers" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-slate-800 p-1 rounded-lg shadow">
                <TabsTrigger value="servers" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 rounded-md transition-all">
                  <Server className="w-4 h-4" />
                  <span>Servidores</span>
                </TabsTrigger>
                <TabsTrigger value="integration" className="flex items-center space-x-2 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 rounded-md transition-all">
                  <Bot className="w-4 h-4" />
                  <span>Integração</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="servers">
                <MCPManager />
              </TabsContent>
              
              <TabsContent value="integration">
                <MCPAgentIntegration />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}