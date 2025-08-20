'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Activity, TrendingUp, Users, BarChart3, MessageSquare, Settings, 
  Zap, Star, AlertCircle, CheckCircle, User, Target, Clock, Headphones,
  FileText, Database, Cpu, Network, Workflow, Award, Plus, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

type UserRole = 'FREE' | 'INICIANTE' | 'PROFISSIONAL' | 'COMPANY_ADMIN' | 'COMPANY_USER' | null;

interface UserInfo {
  name: string;
  email: string;
  plan: string;
  joinDate?: string;
  totalAgents: number;
  activeAgents: number;
  monthlyExecutions: number;
  successRate: number;
}

interface PlanFeatures {
  name: string;
  description: string;
  price: string;
  agents: number;
  interactions: number;
  features: string[];
}

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for different user roles
  const userRolesData: Record<string, UserInfo> = {
    FREE: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      plan: 'VS Code Gratuito',
      joinDate: '2024-01-15',
      totalAgents: 0,
      activeAgents: 0,
      monthlyExecutions: 0,
      successRate: 0
    },
    INICIANTE: {
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      plan: 'Iniciante',
      joinDate: '2024-02-01',
      totalAgents: 1,
      activeAgents: 1,
      monthlyExecutions: 450,
      successRate: 85
    },
    PROFISSIONAL: {
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      plan: 'Profissional',
      joinDate: '2024-01-10',
      totalAgents: 3,
      activeAgents: 3,
      monthlyExecutions: 2500,
      successRate: 92
    }
  };

  const planFeatures: Record<string, PlanFeatures> = {
    FREE: {
      name: 'VS Code Gratuito',
      description: 'Plugin VS Code gratuito para montagem e download de prompts',
      price: 'Gratuito',
      agents: 0,
      interactions: 0,
      features: [
        'Plugin VS Code gratuito',
        '100+ prompts especializados',
        'Download de templates',
        'Comunidade exclusiva'
      ]
    },
    INICIANTE: {
      name: 'Iniciante',
      description: 'Perfeito para pequenos negócios começando com IA',
      price: 'R$ 280/mês',
      agents: 1,
      interactions: 1000,
      features: [
        '1 Agente de IA básico',
        'Atendimento até 1.000 interações/mês',
        'Integração com WhatsApp',
        'Relatórios básicos',
        'Suporte por email'
      ]
    },
    PROFISSIONAL: {
      name: 'Profissional',
      description: 'Ideal para negócios em crescimento',
      price: 'R$ 490/mês',
      agents: 3,
      interactions: 10000,
      features: [
        '3 Agentes de IA especializados',
        'Atendimento até 10.000 interações/mês',
        'Múltiplos canais de integração',
        'Análise de dados em tempo real',
        'Automação de processos',
        'Suporte 24/7'
      ]
    }
  };

  const recentActivity: Activity[] = [
    {
      id: '1',
      type: 'agent_created',
      description: 'Agente criado com sucesso',
      time: '2 horas atrás'
    },
    {
      id: '2',
      type: 'execution',
      description: '100 execuções realizadas hoje',
      time: '5 horas atrás'
    },
    {
      id: '3',
      type: 'integration',
      description: 'WhatsApp conectado',
      time: '1 dia atrás'
    }
  ];

  useEffect(() => {
    // Role detection using cookies
    const determineRole = (): UserRole => {
      const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()!.split(';').shift();
        return null;
      };

      const userRole = getCookie('userRole');
      const isAuthenticated = getCookie('isAuthenticated') === 'true';

      if (!isAuthenticated) {
        return null;
      }

      if (userRole === 'FREE' || userRole === 'INICIANTE' || userRole === 'PROFISSIONAL' || 
          userRole === 'COMPANY_ADMIN' || userRole === 'COMPANY_USER') {
        return userRole as UserRole;
      }

      // Fallback to email-based detection
      const userEmail = user?.email || decodeURIComponent(getCookie('userEmail') || '');
      if (userEmail.includes('admin') || userEmail.includes('empresa')) {
        return 'COMPANY_ADMIN';
      } else if (userEmail.includes('funcionario') || userEmail.includes('employee')) {
        return 'COMPANY_USER';
      } else if (userEmail.includes('profissional')) {
        return 'PROFISSIONAL';
      } else if (userEmail.includes('iniciante')) {
        return 'INICIANTE';
      } else if (userEmail.includes('free') || userEmail.includes('gratis')) {
        return 'FREE';
      }

      return null;
    };

    const role = determineRole();
    setUserRole(role);
    setLoading(false);
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'agent_created':
        return <Brain className="w-4 h-4 text-blue-600" />;
      case 'execution':
        return <Activity className="w-4 h-4 text-green-600" />;
      case 'integration':
        return <Network className="w-4 h-4 text-purple-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'VS Code Gratuito':
        return 'bg-blue-100 text-blue-800';
      case 'Iniciante':
        return 'bg-green-100 text-green-800';
      case 'Profissional':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>Acesso Restrito</span>
            </CardTitle>
            <CardDescription>
              Você não tem permissão para acessar o dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/login'} className="w-full">
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userData = userRolesData[userRole] || userRolesData.FREE;
  const currentPlan = planFeatures[userRole] || planFeatures.FREE;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {userRole === 'FREE' ? 'Painel Gratuito' :
               userRole === 'INICIANTE' ? 'Dashboard Iniciante' :
               userRole === 'PROFISSIONAL' ? 'Dashboard Profissional' :
               'Dashboard'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bem-vindo, {userData.name} - {userData.plan}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getPlanBadgeColor(userData.plan)}>
              {userData.plan}
            </Badge>
            {userRole !== 'FREE' && (
              <Badge className="bg-blue-100 text-blue-800">
                {userData.totalAgents} Agente{userData.totalAgents !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {userRole === 'FREE' ? (
          <>
            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plano Atual</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Gratuito</div>
                <p className="text-xs text-muted-foreground">
                  VS Code Plugin
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prompts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100+</div>
                <p className="text-xs text-muted-foreground">
                  Templates disponíveis
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comunidade</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ativo</div>
                <p className="text-xs text-muted-foreground">
                  Acesso garantido
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ativo</div>
                <p className="text-xs text-muted-foreground">
                  Desde {new Date(userData.joinDate!).toLocaleDateString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meus Agentes</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.totalAgents}</div>
                <p className="text-xs text-muted-foreground">
                  {userData.activeAgents} ativos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Execuções/Mês</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.monthlyExecutions}</div>
                <p className="text-xs text-muted-foreground">
                  Este mês
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.successRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Performance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Limite</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentPlan.interactions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Interações/mês
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Free User View */}
        {userRole === 'FREE' && (
          <>
            {/* Upgrade CTA */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Potencialize Seu Negócio</h2>
              <div className="space-y-4">
                <Card className="hover:shadow-lg transition-shadow border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <span>Plano Iniciante</span>
                    </CardTitle>
                    <CardDescription>
                      Comece com 1 agente de IA e até 1.000 interações/mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-purple-600">R$ 280<span className="text-sm font-normal">/mês</span></div>
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Fazer Upgrade
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-orange-600" />
                      <span>Plano Profissional</span>
                    </CardTitle>
                    <CardDescription>
                      3 agentes especializados e até 10.000 interações/mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-orange-600">R$ 490<span className="text-sm font-normal">/mês</span></div>
                    </div>
                    <Button variant="outline" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                      Ver Detalhes
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Recursos Disponíveis</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {currentPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Paid Users View */}
        {(userRole === 'INICIANTE' || userRole === 'PROFISSIONAL') && (
          <>
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
              <div className="space-y-4">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="h-5 w-5 text-green-600" />
                      <span>Criar Novo Agente</span>
                    </CardTitle>
                    <CardDescription>
                      {userRole === 'INICIANTE' 
                        ? 'Configure seu primeiro agente de IA'
                        : 'Adicione mais um agente especializado'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" disabled={userData.totalAgents >= currentPlan.agents}>
                      {userData.totalAgents >= currentPlan.agents 
                        ? 'Limite Atingido' 
                        : 'Criar Agente'
                      }
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span>Ver Conversas</span>
                    </CardTitle>
                    <CardDescription>
                      Acompanhe as interações com seus agentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Abrir Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <span>Estatísticas</span>
                    </CardTitle>
                    <CardDescription>
                      Análise detalhada de performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Ver Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Atividade Recente</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Upgrade Section for Paid Users */}
      {(userRole === 'INICIANTE' || userRole === 'PROFISSIONAL') && (
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-950/20 dark:to-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span>Quer Mais Recursos?</span>
              </CardTitle>
              <CardDescription>
                {userRole === 'INICIANTE' 
                  ? 'Faça upgrade para o Plano Profissional e tenha 3 agentes e 10x mais interações'
                  : 'Precisa de mais? Conheça nossos planos empresariais'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                asChild
              >
                <a href="/planos">
                  Ver Planos Superiores
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}