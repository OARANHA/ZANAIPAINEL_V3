'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, Users, Brain, Activity, TrendingUp, Plus, AlertCircle, CheckCircle,
  User, BarChart3, MessageSquare, Settings
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

type UserRole = 'COMPANY_ADMIN' | 'COMPANY_USER' | null;

interface UserInfo {
  name: string;
  email: string;
  role: string;
  company: string;
  department?: string;
  joinDate?: string;
  totalAgents: number;
  activeAgents: number;
  monthlyExecutions: number;
  successRate: number;
}

interface CompanyInfo {
  name: string;
  plan: string;
  admins: number;
  totalUsers: number;
  activeUsers: number;
  totalAgents: number;
  activeAgents: number;
  monthlyExecutions: number;
  successRate: number;
}

interface Activity {
  id: string;
  type: string;
  user: string;
  description: string;
  time: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  status: string;
  executions: number;
  successRate: number;
}

export default function EnterprisePage() {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - would come from API in production
  const companyInfo: CompanyInfo = {
    name: 'Mix Corporation',
    plan: 'Empresa',
    admins: 2,
    totalUsers: 15,
    activeUsers: 12,
    totalAgents: 8,
    activeAgents: 6,
    monthlyExecutions: 1247,
    successRate: 94
  };

  const userInfo: UserInfo = {
    name: 'João Silva',
    email: 'joao.silva@mix.com',
    role: 'Funcionário',
    company: 'Mix Corporation',
    department: 'TI',
    joinDate: '2024-01-15',
    totalAgents: 3,
    activeAgents: 2,
    monthlyExecutions: 89,
    successRate: 87
  };

  const recentActivity: Activity[] = [
    {
      id: '1',
      type: 'agent_created',
      user: 'João Silva',
      description: 'Criou novo agente "Suporte ao Cliente"',
      time: '2 horas atrás'
    },
    {
      id: '2',
      type: 'user_added',
      user: 'Maria Santos',
      description: 'Novo funcionário adicionado',
      time: '5 horas atrás'
    },
    {
      id: '3',
      type: 'agent_executed',
      user: 'Pedro Oliveira',
      description: 'Executou agente de Análise de Dados',
      time: '1 dia atrás'
    }
  ];

  const userAgents: Agent[] = [
    {
      id: '1',
      name: 'Suporte ao Cliente',
      description: 'Atendimento ao cliente automatizado',
      status: 'active',
      executions: 45,
      successRate: 92
    },
    {
      id: '2',
      name: 'Análise de Dados',
      description: 'Análise de relatórios e métricas',
      status: 'active',
      executions: 32,
      successRate: 85
    },
    {
      id: '3',
      name: 'Geração de Relatórios',
      description: 'Criação de relatórios automáticos',
      status: 'inactive',
      executions: 12,
      successRate: 78
    }
  ];

  useEffect(() => {
    // Proper role detection using cookies
    const determineRole = (): UserRole => {
      // Get user role from cookie
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

      if (userRole === 'COMPANY_ADMIN') {
        return 'COMPANY_ADMIN';
      } else if (userRole === 'COMPANY_USER') {
        return 'COMPANY_USER';
      }

      // Fallback to email-based detection for demo
      const userEmail = user?.email || decodeURIComponent(getCookie('userEmail') || '');
      if (userEmail.includes('admin') || userEmail.includes('empresa')) {
        return 'COMPANY_ADMIN';
      } else if (userEmail.includes('funcionario') || userEmail.includes('employee')) {
        return 'COMPANY_USER';
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
      case 'user_added':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'agent_executed':
        return <Activity className="w-4 h-4 text-purple-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
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
              Você não tem permissão para acessar o dashboard empresarial.
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {userRole === 'COMPANY_ADMIN' ? 'Dashboard Corporativo' : 'Meu Espaço'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {userRole === 'COMPANY_ADMIN' 
                ? `${companyInfo.name} - Painel de Gerenciamento`
                : `Bem-vindo, ${userInfo.name} - ${userInfo.department}`
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={userRole === 'COMPANY_ADMIN' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
              {userRole === 'COMPANY_ADMIN' ? companyInfo.plan : userInfo.role}
            </Badge>
            {userRole === 'COMPANY_ADMIN' && (
              <Badge className="bg-blue-100 text-blue-800">
                {companyInfo.admins} Admins
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {userRole === 'COMPANY_ADMIN' ? (
          <>
            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companyInfo.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {companyInfo.activeUsers} ativos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agentes da Empresa</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companyInfo.totalAgents}</div>
                <p className="text-xs text-muted-foreground">
                  {companyInfo.activeAgents} ativos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Execuções/Mês</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companyInfo.monthlyExecutions}</div>
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
                <div className="text-2xl font-bold">{companyInfo.successRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Eficiência geral
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
                <div className="text-2xl font-bold">{userInfo.totalAgents}</div>
                <p className="text-xs text-muted-foreground">
                  {userInfo.activeAgents} ativos
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Execuções/Mês</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userInfo.monthlyExecutions}</div>
                <p className="text-xs text-muted-foreground">
                  Este mês
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userInfo.successRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Minha performance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departamento</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userInfo.department}</div>
                <p className="text-xs text-muted-foreground">
                  Desde {new Date(userInfo.joinDate!).toLocaleDateString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admin View */}
        {userRole === 'COMPANY_ADMIN' && (
          <>
            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
              <div className="space-y-4">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Plus className="h-5 w-5 text-green-600" />
                      <span>Convidar Funcionário</span>
                    </CardTitle>
                    <CardDescription>
                      Adicione novos membros à sua equipe
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Convidar Funcionário
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span>Criar Agente Empresarial</span>
                    </CardTitle>
                    <CardDescription>
                      Desenvolva agentes para toda a empresa
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Criar Agente
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-purple-600" />
                      <span>Configurações da Empresa</span>
                    </CardTitle>
                    <CardDescription>
                      Gerencie permissões e configurações
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Configurar Empresa
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
                              {activity.user}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* User View */}
        {userRole === 'COMPANY_USER' && (
          <>
            {/* My Agents */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Meus Agentes</h2>
              <div className="space-y-4">
                {userAgents.map((agent) => (
                  <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Brain className="h-5 w-5 text-blue-600" />
                          <span>{agent.name}</span>
                        </CardTitle>
                        {getStatusBadge(agent.status)}
                      </div>
                      <CardDescription>{agent.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Execuções:</span>
                          <span className="ml-2 font-medium">{agent.executions}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Sucesso:</span>
                          <span className="ml-2 font-medium">{agent.successRate}%</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Activity className="w-4 h-4 mr-2" />
                          Executar
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Estatísticas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
              <div className="space-y-4">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <span>Chat com Agentes</span>
                    </CardTitle>
                    <CardDescription>
                      Interaja com seus agentes disponíveis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Abrir Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <span>Histórico de Execuções</span>
                    </CardTitle>
                    <CardDescription>
                      Veja o histórico de suas execuções
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Ver Histórico
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-purple-600" />
                      <span>Configurações</span>
                    </CardTitle>
                    <CardDescription>
                      Personalize suas preferências
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Configurar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          {userRole === 'COMPANY_ADMIN' ? 'Informações da Empresa' : 'Meu Perfil'}
        </h2>
        <Card>
          <CardContent className="pt-6">
            {userRole === 'COMPANY_ADMIN' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-500">Nome da Empresa</div>
                  <div className="text-lg font-semibold">{companyInfo.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Plano</div>
                  <div className="text-lg font-semibold">
                    <Badge className="bg-green-100 text-green-800">
                      {companyInfo.plan}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Administradores</div>
                  <div className="text-lg font-semibold">{companyInfo.admins}/2</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Status</div>
                  <div className="text-lg font-semibold">
                    <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Ativa</span>
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-500">Nome</div>
                  <div className="text-lg font-semibold">{userInfo.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Email</div>
                  <div className="text-lg font-semibold">{userInfo.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Cargo</div>
                  <div className="text-lg font-semibold">{userInfo.role}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Empresa</div>
                  <div className="text-lg font-semibold">{userInfo.company}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}