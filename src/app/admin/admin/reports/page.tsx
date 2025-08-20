'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building, 
  DollarSign, 
  Calendar,
  Download,
  RefreshCw,
  FileText,
  PieChart,
  Activity
} from 'lucide-react'

interface ReportData {
  totalRevenue: number
  monthlyGrowth: number
  activeCompanies: number
  activeClients: number
  projectsByStatus: {
    planning: number
    active: number
    completed: number
    cancelled: number
  }
  revenueByMonth: Array<{
    month: string
    revenue: number
  }>
  topCompanies: Array<{
    name: string
    revenue: number
    projects: number
  }>
  recentReports: Array<{
    id: string
    title: string
    type: string
    createdAt: string
  }>
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeCompanies: 0,
    activeClients: 0,
    projectsByStatus: {
      planning: 0,
      active: 0,
      completed: 0,
      cancelled: 0
    },
    revenueByMonth: [],
    topCompanies: [],
    recentReports: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedReportType, setSelectedReportType] = useState('financial')

  useEffect(() => {
    loadReportData()
  }, [selectedPeriod])

  const loadReportData = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch(`/api/admin/reports?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else {
        console.error('Error loading report data')
      }
    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/admin/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: selectedReportType,
          period: selectedPeriod
        })
      })

      if (response.ok) {
        await loadReportData()
      }
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const downloadReport = async (reportId: string) => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/admin/reports/${reportId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `relatorio-${selectedReportType}-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading report:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Relatórios e Métricas</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mês</SelectItem>
                  <SelectItem value="quarter">Trimestre</SelectItem>
                  <SelectItem value="year">Ano</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={loadReportData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(reportData.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                <span className={reportData.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(reportData.monthlyGrowth)}
                </span>{' '}
                em relação ao período anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.activeCompanies}</div>
              <p className="text-xs text-muted-foreground">
                Empresas com projetos ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.activeClients}</div>
              <p className="text-xs text-muted-foreground">
                Clientes com contratos ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.projectsByStatus.active}</div>
              <p className="text-xs text-muted-foreground">
                de {reportData.projectsByStatus.planning + reportData.projectsByStatus.active + reportData.projectsByStatus.completed + reportData.projectsByStatus.cancelled} projetos totais
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="financial">Financeiro</TabsTrigger>
              <TabsTrigger value="projects">Projetos</TabsTrigger>
              <TabsTrigger value="custom">Personalizados</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-4 ml-4">
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial">Financeiro</SelectItem>
                  <SelectItem value="progress">Progresso</SelectItem>
                  <SelectItem value="analytics">Análise</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={generateReport}>
                <FileText className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Projetos por Status</CardTitle>
                  <CardDescription>
                    Distribuição dos projetos por status atual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Planejamento</span>
                      </div>
                      <span className="text-sm font-medium">{reportData.projectsByStatus.planning}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Ativos</span>
                      </div>
                      <span className="text-sm font-medium">{reportData.projectsByStatus.active}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Concluídos</span>
                      </div>
                      <span className="text-sm font-medium">{reportData.projectsByStatus.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Cancelados</span>
                      </div>
                      <span className="text-sm font-medium">{reportData.projectsByStatus.cancelled}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Empresas</CardTitle>
                  <CardDescription>
                    Empresas com maior receita no período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.topCompanies.slice(0, 5).map((company, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{company.name}</p>
                            <p className="text-xs text-gray-500">{company.projects} projetos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(company.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise Financeira</CardTitle>
                <CardDescription>
                  Métricas financeiras detalhadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Receita por Mês</h4>
                    <div className="space-y-2">
                      {reportData.revenueByMonth.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{item.month}</span>
                          <span className="text-sm font-semibold">{formatCurrency(item.revenue)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Projetos</CardTitle>
                <CardDescription>
                  Métricas detalhadas de projetos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Análise detalhada de projetos será implementada aqui.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Personalizados</CardTitle>
                <CardDescription>
                  Crie e gerencie relatórios personalizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <PieChart className="h-8 w-8 text-blue-600" />
                        <Badge variant="outline">Financeiro</Badge>
                      </div>
                      <h4 className="font-semibold">Relatório Financeiro</h4>
                      <p className="text-sm text-gray-600 mt-1">Análise completa de receitas e despesas</p>
                      <Button size="sm" className="mt-3 w-full" onClick={() => setSelectedReportType('financial')}>
                        Gerar
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="h-8 w-8 text-green-600" />
                        <Badge variant="outline">Progresso</Badge>
                      </div>
                      <h4 className="font-semibold">Relatório de Progresso</h4>
                      <p className="text-sm text-gray-600 mt-1">Acompanhamento de projetos e tarefas</p>
                      <Button size="sm" className="mt-3 w-full" onClick={() => setSelectedReportType('progress')}>
                        Gerar
                      </Button>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Activity className="h-8 w-8 text-purple-600" />
                        <Badge variant="outline">Análise</Badge>
                      </div>
                      <h4 className="font-semibold">Análise de Dados</h4>
                      <p className="text-sm text-gray-600 mt-1">Métricas e indicadores de performance</p>
                      <Button size="sm" className="mt-3 w-full" onClick={() => setSelectedReportType('analytics')}>
                        Gerar
                      </Button>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Reports */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
            <CardDescription>
              Relatórios gerados recentemente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{report.type}</Badge>
                    <Button size="sm" variant="outline" onClick={() => downloadReport(report.id)}>
                      <Download className="h-4 w-4 mr-1" />
                      Baixar
                    </Button>
                  </div>
                </div>
              ))}
              
              {reportData.recentReports.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum relatório gerado ainda.</p>
                  <Button className="mt-4" onClick={generateReport}>
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Primeiro Relatório
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}