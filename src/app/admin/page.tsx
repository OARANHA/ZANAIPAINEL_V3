'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, BookOpen, Brain, Building, Loader2, Plus, Shield, Sparkles, Target, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ElegantCard from '@/components/ui/ElegantCard';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  config: string;
  knowledge?: string;
  status: 'active' | 'inactive' | 'training';
  workspaceId: string;
  workspace?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface SpecialistCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface SpecialistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  skills: string[];
  useCases: string[];
  created: string;
}

interface Composition {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
  agents?: any[];
}

export default function AdminDashboard() {
  const [pathname, setPathname] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [specialists, setSpecialists] = useState<SpecialistTemplate[]>([]);
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Garantir que o código só execute no cliente
  useEffect(() => {
    setIsClient(true);
    // Only get pathname on client side
    setPathname(window.location.pathname);
  }, []);

  // Só carregar dados se estiver no cliente
  useEffect(() => {
    if (isClient) {
      loadData();
    }
  }, [isClient]);

  // Funções de carregamento de dados
  const loadWorkspaces = async () => {
    try {
      const response = await fetch('/admin/api/workspaces');
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
        return data;
      } else {
        throw new Error(`API response: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao carregar workspaces:', error);
      // Fallback para dados de teste
      const fallbackData = [{
        id: 'test-workspace',
        name: 'Workspace Principal',
        description: 'Ambiente de trabalho principal',
        createdAt: new Date().toISOString()
      }];
      setWorkspaces(fallbackData);
      return fallbackData;
    }
  };

  const loadAgents = async () => {
    try {
      const response = await fetch('/admin/api/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
        return data.agents || [];
      } else {
        throw new Error(`API response: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
      // Fallback para dados de teste
      const fallbackData = [{
        id: 'test-agent',
        name: 'Agente de Teste',
        description: 'Agente para demonstração',
        type: 'template' as const,
        config: '',
        status: 'active' as const,
        workspaceId: 'test-workspace',
        createdAt: new Date().toISOString()
      }];
      setAgents(fallbackData);
      return fallbackData;
    }
  };

  const loadCompositions = async () => {
    try {
      const response = await fetch('/admin/api/compositions');
      if (response.ok) {
        const data = await response.json();
        // Mapear os dados para o formato esperado
        const mappedCompositions = (data.compositions || data).map((comp: any) => ({
          id: comp.id,
          name: comp.name,
          description: comp.description,
          status: comp.status,
          createdAt: comp.createdAt,
          updatedAt: comp.updatedAt,
          workspaceId: comp.workspaceId,
          agents: comp.agents || []
        }));
        setCompositions(mappedCompositions);
        return mappedCompositions;
      } else {
        throw new Error(`API response: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao carregar composições:', error);
      // Fallback para dados de teste
      const fallbackData = [{
        id: 'test-comp-1',
        name: 'Pipeline de Desenvolvimento',
        description: 'Fluxo completo para análise e desenvolvimento',
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workspaceId: 'test-workspace',
        agents: []
      }];
      setCompositions(fallbackData);
      return fallbackData;
    }
  };

  const loadSpecialists = async () => {
    try {
      const response = await fetch('/admin/api/specialists');
      if (response.ok) {
        const data = await response.json();
        setSpecialists(data.templates || []);
        return data.templates || [];
      } else {
        throw new Error(`API response: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao carregar especialistas:', error);
      // Fallback para dados de teste
      const fallbackData = [
        {
          id: 'test-1',
          name: 'Business Analyst',
          description: 'Especialista em análise de negócios',
          category: 'business',
          skills: ['Análise de Dados', 'Gestão de Projetos', 'Consultoria'],
          useCases: ['Planejamento Estratégico', 'Análise de Mercado', 'Otimização de Processos'],
          created: new Date().toISOString()
        },
        {
          id: 'test-2',
          name: 'Technical Specialist',
          description: 'Especialista em integrações técnicas',
          category: 'technical',
          skills: ['API Integration', 'Security', 'Risk Management'],
          useCases: ['Payment Integration', 'Security Audits', 'System Architecture'],
          created: new Date().toISOString()
        }
      ];
      setSpecialists(fallbackData);
      return fallbackData;
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Carregar todos os dados em paralelo
      const [workspacesData, agentsData, specialistsData, compositionsData] = await Promise.all([
        loadWorkspaces(),
        loadAgents(),
        loadSpecialists(),
        loadCompositions()
      ]);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'template': return 'bg-blue-100 text-blue-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      case 'composed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompositionStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeAgents = Array.isArray(agents) ? agents.filter(agent => agent.status === 'active').length : 0;
  const totalAgents = Array.isArray(agents) ? agents.length : 0;
  const activeCompositions = Array.isArray(compositions) ? compositions.filter(comp => comp.status === 'active').length : 0;
  const totalCompositions = Array.isArray(compositions) ? compositions.length : 0;

  // Loading state component
  const LoadingCard = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );

  // Error state component
  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="text-red-500 mb-4">
        <Shield className="w-12 h-12 mx-auto" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Erro ao Carregar Dados</h3>
      <p className="text-muted-foreground mb-4">{error}</p>
      <Button onClick={loadData} variant="outline">
        <Loader2 className="w-4 h-4 mr-2" />
        Tentar Novamente
      </Button>
    </div>
  );

  return (
    <MainLayout currentPath={pathname}>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo ao Zanai Project
          </h2>
          <p className="text-lg text-muted-foreground">
            Gerencie seus agentes de IA, especialistas e composições em um único lugar
          </p>
        </div>

        {/* Stats Overview */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-white dark:bg-slate-800 shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <ErrorState />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ElegantCard
              title="Total de Agentes"
              description="Agentes cadastrados"
              icon={Brain}
              iconColor="text-blue-600"
              bgColor="bg-blue-100 dark:bg-blue-900/20"
              value={totalAgents}
              badge={totalAgents > 0 ? `${activeAgents} ativos` : undefined}
              badgeColor="bg-green-50 text-green-700 border-green-200"
            />
            
            <ElegantCard
              title="Agentes Ativos"
              description="Em operação"
              icon={Activity}
              iconColor="text-green-600"
              bgColor="bg-green-100 dark:bg-green-900/20"
              value={activeAgents}
              badge={totalAgents > 0 ? `${Math.round((activeAgents / totalAgents) * 100)}% eficiência` : undefined}
              badgeColor="bg-blue-50 text-blue-700 border-blue-200"
            />
            
            <ElegantCard
              title="Composições"
              description="Fluxos criados"
              icon={Users}
              iconColor="text-purple-600"
              bgColor="bg-purple-100 dark:bg-purple-900/20"
              value={totalCompositions}
              badge={totalCompositions > 0 ? `${activeCompositions} ativas` : undefined}
              badgeColor="bg-green-50 text-green-700 border-green-200"
            />

            <ElegantCard
              title="Especialistas"
              description="Templates disponíveis"
              icon={Sparkles}
              iconColor="text-orange-600"
              bgColor="bg-orange-100 dark:bg-orange-900/20"
              value={specialists.length}
              badge={specialists.length > 0 ? "Prontos para uso" : undefined}
              badgeColor="bg-purple-50 text-purple-700 border-purple-200"
            />
          </div>
        )}

        {/* Main Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-lg border">
            <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 rounded-lg transition-all">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Visão Geral</span>
              <span className="sm:hidden">Visão</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-2 data-[state=active]:bg-green-100 dark:data-[state=active]:bg-green-900 rounded-lg transition-all">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">Agentes</span>
              <span className="sm:hidden">IA</span>
            </TabsTrigger>
            <TabsTrigger value="specialists" className="flex items-center space-x-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 rounded-lg transition-all">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Especialistas</span>
              <span className="sm:hidden">Esp</span>
            </TabsTrigger>
            <TabsTrigger value="composition" className="flex items-center space-x-2 data-[state=active]:bg-orange-100 dark:data-[state=active]:bg-orange-900 rounded-lg transition-all">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Composição</span>
              <span className="sm:hidden">Comp</span>
            </TabsTrigger>
            <TabsTrigger value="studio" className="flex items-center space-x-2 data-[state=active]:bg-red-100 dark:data-[state=active]:bg-red-900 rounded-lg transition-all">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Studio</span>
              <span className="sm:hidden">Dev</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Painel de Controle Zanai
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Sistema completo de gestão de agentes de IA, especialistas e composições para automatizar seus processos de negócio
              </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-lg transition-shadow border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    <span>Criar Agente</span>
                  </CardTitle>
                  <CardDescription>
                    Configure um novo agente de IA para suas necessidades
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href="/admin/agents">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Agente
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span>Especialistas</span>
                  </CardTitle>
                  <CardDescription>
                    Acesse templates de especialistas prontos para uso
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href="/admin/specialists">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Ver Especialistas
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span>Studio</span>
                  </CardTitle>
                  <CardDescription>
                    Ambiente de desenvolvimento e teste de agentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href="/admin/studio">
                      <Zap className="w-4 h-4 mr-2" />
                      Acessar Studio
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>
                  Últimas atualizações e ações no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.slice(0, 3).map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">{agent.description}</p>
                        </div>
                      </div>
                      <Badge className={getTypeColor(agent.type)}>
                        {agent.type === 'template' ? 'Template' : agent.type === 'custom' ? 'Personalizado' : 'Composto'}
                      </Badge>
                    </div>
                  ))}
                  
                  {compositions.slice(0, 2).map((composition) => (
                    <div key={composition.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">{composition.name}</p>
                          <p className="text-sm text-muted-foreground">{composition.description}</p>
                        </div>
                      </div>
                      <Badge className={getCompositionStatusColor(composition.status)}>
                        {composition.status === 'active' ? 'Ativo' : composition.status === 'draft' ? 'Rascunho' : 'Inativo'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Agentes de IA</h2>
                <p className="text-muted-foreground">Gerencie seus agentes de inteligência artificial</p>
              </div>
              <Button asChild>
                <Link href="/admin/agents">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Agente
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <LoadingCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                      </div>
                      <CardDescription>{agent.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Tipo</span>
                          <Badge className={getTypeColor(agent.type)}>
                            {agent.type === 'template' ? 'Template' : agent.type === 'custom' ? 'Personalizado' : 'Composto'}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Workspace</span>
                          <span className="text-sm">{agent.workspace?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Status</span>
                          <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                            {agent.status === 'active' ? 'Ativo' : agent.status === 'inactive' ? 'Inativo' : 'Treinando'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Specialists Tab */}
          <TabsContent value="specialists" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Especialistas</h2>
                <p className="text-muted-foreground">Templates de especialistas prontos para uso</p>
              </div>
              <Button asChild>
                <Link href="/admin/specialists">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Gerenciar Especialistas
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <LoadingCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialists.map((specialist) => (
                  <Card key={specialist.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{specialist.name}</CardTitle>
                      <CardDescription>{specialist.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-muted-foreground">Categoria</span>
                          <Badge variant="outline" className="ml-2">{specialist.category}</Badge>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Habilidades</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {specialist.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {specialist.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{specialist.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Composition Tab */}
          <TabsContent value="composition" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Composições</h2>
                <p className="text-muted-foreground">Fluxos de trabalho com múltiplos agentes</p>
              </div>
              <Button asChild>
                <Link href="/admin/compositions">
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Composições
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => <LoadingCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {compositions.map((composition) => (
                  <Card key={composition.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{composition.name}</CardTitle>
                        <Badge className={getCompositionStatusColor(composition.status)}>
                          {composition.status === 'active' ? 'Ativo' : composition.status === 'draft' ? 'Rascunho' : 'Inativo'}
                        </Badge>
                      </div>
                      <CardDescription>{composition.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Agentes</span>
                          <span className="text-sm">{composition.agents?.length || 0} agentes</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Workspace</span>
                          <span className="text-sm">{composition.workspaceId}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Studio Tab */}
          <TabsContent value="studio" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Studio de Desenvolvimento</h2>
              <p className="text-muted-foreground">Ambiente para criar, testar e refinar seus agentes de IA</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span>Testar Agentes</span>
                  </CardTitle>
                  <CardDescription>
                    Execute e teste seus agentes em tempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href="/admin/studio">
                      <Zap className="w-4 h-4 mr-2" />
                      Acessar Studio
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Análise de Performance</span>
                  </CardTitle>
                  <CardDescription>
                    Monitore métricas e performance dos agentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link href="/admin/executions">
                      <Activity className="w-4 h-4 mr-2" />
                      Ver Execuções
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}