'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Brain, 
  Activity, 
  Clock,
  Target,
  BarChart3,
  PieChart,
  Download,
  Calendar
} from 'lucide-react';

export default function EnterpriseAnalyticsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Corporativo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Análise de desempenho e métricas da sua organização
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Últimos 30 dias
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Agentes Utilizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Execuções Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +23% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Taxa de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2% vs mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Usage by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Uso por Departamento
            </CardTitle>
            <CardDescription>
              Número de execuções por departamento nos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="font-medium">Vendas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">423</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="font-medium">TI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-sm font-medium">356</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="font-medium">RH</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                  <span className="text-sm font-medium">289</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="font-medium">Jurídico</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-medium">179</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Desempenho dos Agentes
            </CardTitle>
            <CardDescription>
              Taxa de sucesso por tipo de agente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="font-medium">Enterprise</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">96%</Badge>
                  <TrendingUp className="w-3 h-3 text-green-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="font-medium">Custom</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-800">92%</Badge>
                  <TrendingUp className="w-3 h-3 text-green-600" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="font-medium">Template</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-purple-100 text-purple-800">89%</Badge>
                  <TrendingDown className="w-3 h-3 text-red-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Users and Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle>Usuários Mais Ativos</CardTitle>
            <CardDescription>
              Top 5 usuários por número de execuções
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-sm text-gray-500">Vendas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">156</p>
                  <p className="text-sm text-gray-500">execuções</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">MS</span>
                  </div>
                  <div>
                    <p className="font-medium">Maria Santos</p>
                    <p className="text-sm text-gray-500">TI</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">142</p>
                  <p className="text-sm text-gray-500">execuções</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">PC</span>
                  </div>
                  <div>
                    <p className="font-medium">Pedro Costa</p>
                    <p className="text-sm text-gray-500">RH</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">128</p>
                  <p className="text-sm text-gray-500">execuções</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Agents */}
        <Card>
          <CardHeader>
            <CardTitle>Agentes Mais Populares</CardTitle>
            <CardDescription>
              Top 5 agentes por número de execuções
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Assistente de Vendas</p>
                    <p className="text-sm text-gray-500">Enterprise</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">423</p>
                  <p className="text-sm text-gray-500">execuções</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Suporte Técnico</p>
                    <p className="text-sm text-gray-500">Custom</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">356</p>
                  <p className="text-sm text-gray-500">execuções</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Analisador de Contratos</p>
                    <p className="text-sm text-gray-500">Enterprise</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">289</p>
                  <p className="text-sm text-gray-500">execuções</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Atividade Recente
          </CardTitle>
          <CardDescription>
            Timeline de atividades na organização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Pico de utilização atingido</p>
                  <Badge variant="secondary">há 2 horas</Badge>
                </div>
                <p className="text-sm text-gray-500">156 execuções simultâneas registradas</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Novo agente enterprise criado</p>
                  <Badge variant="secondary">há 5 horas</Badge>
                </div>
                <p className="text-sm text-gray-500">"Recrutador IA" adicionado ao departamento de RH</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Meta mensal superada</p>
                  <Badge variant="secondary">há 1 dia</Badge>
                </div>
                <p className="text-sm text-gray-500">120% da meta de execuções atingida</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}