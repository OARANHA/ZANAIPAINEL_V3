'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Activity,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Plus,
  FileText,
  Database,
  Code,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import UserLayout from '@/components/layout/UserLayout';

interface StatsCard {
  title: string;
  value: number;
  description: string;
  icon: any;
  color: string;
  change?: string;
}

export default function PainelPage() {
  console.log('PainelPage carregada - pathname:', window.location.pathname);
  
  const [stats, setStats] = useState<StatsCard[]>([
    {
      title: "Agentes Ativos",
      value: 12,
      description: "Agentes em operação",
      icon: Brain,
      color: "text-blue-600",
      change: "+2 esta semana"
    },
    {
      title: "Usuários",
      value: 156,
      description: "Usuários cadastrados",
      icon: Users,
      color: "text-green-600",
      change: "+12 este mês"
    },
    {
      title: "Projetos",
      value: 8,
      description: "Projetos ativos",
      icon: Target,
      color: "text-purple-600",
      change: "+1 esta semana"
    },
    {
      title: "Taxa de Sucesso",
      value: 94,
      description: "Eficiência geral",
      icon: TrendingUp,
      color: "text-orange-600",
      change: "+3% este mês"
    }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'agent', name: 'Novo agente criado', time: '2 minutos atrás', user: 'Admin' },
    { id: 2, type: 'user', name: 'Novo usuário registrado', time: '15 minutos atrás', user: 'Sistema' },
    { id: 3, type: 'project', name: 'Projeto atualizado', time: '1 hora atrás', user: 'João Silva' },
    { id: 4, type: 'system', name: 'Backup realizado', time: '2 horas atrás', user: 'Sistema' },
  ]);

  const quickActions = [
    { title: 'Novo Agente', description: 'Criar novo agente de IA', icon: Plus, href: '/painel/agents', color: 'bg-blue-600' },
    { title: 'Estatísticas', description: 'Ver estatísticas de uso', icon: BarChart3, href: '/painel/analytics', color: 'bg-green-600' },
    { title: 'Configurações', description: 'Configurar sua conta', icon: Settings, href: '/painel/settings', color: 'bg-purple-600' },
    { title: 'Suporte', description: 'Ajuda e suporte', icon: Users, href: '/contato', color: 'bg-orange-600' },
  ];

  const handleLogout = () => {
    // O logout é gerenciado pelo UserHeader
    window.location.href = '/login';
  };

  return (
    <UserLayout currentPath="/painel">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 rounded-3xl opacity-10 blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent mb-3">
                Painel de Controle
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                Bem-vindo ao seu painel inteligente com visualizações em tempo real e controles intuitivos
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const gradientColors = [
              'from-blue-500 to-cyan-400',
              'from-green-500 to-emerald-400',
              'from-purple-500 to-violet-400',
              'from-orange-500 to-amber-400'
            ];
            const bgGradient = gradientColors[index % gradientColors.length];
            
            return (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${bgGradient} bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {stat.description}
                  </p>
                  {stat.change && (
                    <Badge variant="secondary" className="mt-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900 dark:to-emerald-900 dark:text-green-300 border-0">
                      {stat.change}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 group-hover:from-gray-100 group-hover:to-gray-200 dark:group-hover:from-gray-700 dark:group-hover:to-gray-800 transition-all duration-300"></div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                  <CardContent className="relative z-10 p-6 text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${action.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center`}>
                      <action.icon className="w-7 h-7 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-1 rounded-xl shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              Atividades
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="relative overflow-hidden border-0 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-cyan-200 opacity-30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Visão Geral do Sistema
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Status atual dos componentes do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full shadow-lg"></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Servidor API</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900 dark:to-emerald-900 dark:text-green-300 border-0 shadow-sm">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full shadow-lg"></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Banco de Dados</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900 dark:to-emerald-900 dark:text-green-300 border-0 shadow-sm">
                      Conectado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg"></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Agentes de IA</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 dark:from-blue-900 dark:to-cyan-900 dark:text-blue-300 border-0 shadow-sm">
                      12 Ativos
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-violet-400 rounded-full shadow-lg"></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Socket.IO</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 dark:from-purple-900 dark:to-violet-900 dark:text-purple-300 border-0 shadow-sm">
                      Ativo
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-0 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-violet-200 opacity-30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                    Próximos Passos
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Sugestões para otimizar seu sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mt-2 shadow-sm"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Atualizar agentes</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">2 agentes precisam de atualização</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full mt-2 shadow-sm"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Otimizar desempenho</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Sistema funcionando bem</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-sm">
                    <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mt-2 shadow-sm"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Backup programado</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Próximo backup em 2 horas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-200 opacity-30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Atividades Recentes
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Últimas atividades no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 group">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full shadow-lg ${
                          activity.type === 'agent' ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                          activity.type === 'user' ? 'bg-gradient-to-r from-green-500 to-emerald-400' :
                          activity.type === 'project' ? 'bg-gradient-to-r from-purple-500 to-violet-400' : 'bg-gradient-to-r from-orange-500 to-amber-400'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                            {activity.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">por {activity.user}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-violet-200 opacity-30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Analytics e Métricas
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Análise de desempenho do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900 dark:to-violet-900 rounded-full flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                    Analytics em Desenvolvimento
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    Gráficos e métricas detalhadas estarão disponíveis em breve com visualizações interativas e relatórios em tempo real.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-amber-200 opacity-30 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Informações do Sistema
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Status e informações técnicas
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Versão do Sistema</p>
                    <p className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">v1.0.0</p>
                  </div>
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ambiente</p>
                    <p className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Desenvolvimento</p>
                  </div>
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Último Backup</p>
                    <p className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">2 horas atrás</p>
                  </div>
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Uso de Memória</p>
                    <p className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">45% disponível</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
}