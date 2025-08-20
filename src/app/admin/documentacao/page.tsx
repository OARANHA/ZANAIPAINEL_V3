'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Database, 
  Zap, 
  Users, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Target,
  DollarSign,
  Clock,
  Shield,
  BarChart3,
  BookOpen,
  Cpu,
  Server,
  Wrench,
  Bot,
  Code,
  Search,
  Heart
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ElegantCard from '@/components/ui/ElegantCard';
import MCPManual from '@/components/admin/MCPManual';

export default function DocumentacaoPage() {
  const [activeTab, setActiveTab] = useState('fluxo');

  return (
    <MainLayout currentPath="/admin/documentacao">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Centro de Documentação
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Documentação completa do sistema, incluindo guias de fluxo de dados, modelos de negócio e manual MCP
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Tab 1: Fluxo de Dados */}
          <TabsContent value="fluxo" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Etapa 1: Entrada de Dados */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">1. Entrada de Dados</CardTitle>
                  </div>
                  <CardDescription>O cliente fornece as informações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Upload de Documentos</h4>
                        <p className="text-sm text-muted-foreground">PDF, Word, Excel, Imagens</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Database className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Formulários Estruturados</h4>
                        <p className="text-sm text-muted-foreground">Dados específicos do negócio</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Zap className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Integração via API</h4>
                        <p className="text-sm text-muted-foreground">Sistemas existentes</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Exemplo Prático:</h5>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p>• Contrato em PDF (upload)</p>
                      <p>• Setor: Construção Civil</p>
                      <p>• Valor: R$ 500.000</p>
                      <p>• Prioridade: Alta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Etapa 2: Processamento */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">2. Processamento</CardTitle>
                  </div>
                  <CardDescription>Agentes especializados analisam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Extração de Texto</h4>
                        <p className="text-sm text-muted-foreground">OCR e estruturação</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Enriquecimento</h4>
                        <p className="text-sm text-muted-foreground">Contexto do cliente</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Análise Paralela</h4>
                        <p className="text-sm text-muted-foreground">Múltiplos agentes</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">Agentes em Ação:</h5>
                    <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <p>• Jurídico: Análise de cláusulas</p>
                      <p>• Compliance: Verificação legal</p>
                      <p>• Financeiro: Viabilidade econômica</p>
                      <p>• Operacional: Capacidade de entrega</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Etapa 3: Resultados */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">3. Resultados</CardTitle>
                  </div>
                  <CardDescription>Insights e recomendações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <BarChart3 className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Análise Completa</h4>
                        <p className="text-sm text-muted-foreground">Relatório multidimensional</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Target className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Recomendações</h4>
                        <p className="text-sm text-muted-foreground">Ações específicas</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <DollarSign className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Métricas de Valor</h4>
                        <p className="text-sm text-muted-foreground">ROI e economia</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Resultado Final:</h5>
                    <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                      <p>• Riscos identificados e mitigados</p>
                      <p>• Economia de R$ 50.000 estimada</p>
                      <p>• Tempo de análise: 20 minutos</p>
                      <p>• Precisão: 99%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fluxo Visual */}
            <Card>
              <CardHeader>
                <CardTitle>Fluxo Visual Completo</CardTitle>
                <CardDescription>Como os dados fluem pelo sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between space-x-4 overflow-x-auto">
                  <div className="flex flex-col items-center min-w-[200px]">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-center">Cliente</h3>
                    <p className="text-sm text-muted-foreground text-center">Envia documentos</p>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  
                  <div className="flex flex-col items-center min-w-[200px]">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-2">
                      <Database className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="font-medium text-center">Processamento</h3>
                    <p className="text-sm text-muted-foreground text-center">Extração e estruturação</p>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  
                  <div className="flex flex-col items-center min-w-[200px]">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-medium text-center">Agentes IA</h3>
                    <p className="text-sm text-muted-foreground text-center">Análise especializada</p>
                  </div>
                  
                  <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  
                  <div className="flex flex-col items-center min-w-[200px]">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-2">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-medium text-center">Resultados</h3>
                    <p className="text-sm text-muted-foreground text-center">Insights e ações</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Modelos de Negócio */}
          <TabsContent value="modelos" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Modelo 1: Análise Jurídica */}
              <ElegantCard
                title="Análise de Contratos"
                description="Automação de análise jurídica para escritórios"
                icon={Shield}
                iconColor="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/20"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">DADOS DE ENTRADA:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Contratos em PDF</li>
                      <li>• Tipo de contrato</li>
                      <li>• Setor da empresa</li>
                      <li>• Valor e prazo</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">AGENTES ENVOLVIDOS:</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">Jurídico</Badge>
                      <Badge variant="outline">Compliance</Badge>
                      <Badge variant="outline">Riscos</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">RESULTADOS:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Análise de riscos</li>
                      <li>• Verificação de compliance</li>
                      <li>• Sugestões de cláusulas</li>
                      <li>• Economia de 85% de tempo</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      ROI: 800% no primeiro ano
                    </p>
                  </div>
                </div>
              </ElegantCard>

              {/* Modelo 2: Desenvolvimento de Software */}
              <ElegantCard
                title="Análise de Projetos"
                description="Viabilidade e planejamento para agências"
                icon={Target}
                iconColor="text-green-600"
                bgColor="bg-green-100 dark:bg-green-900/20"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">DADOS DE ENTRADA:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Requisitos do cliente</li>
                      <li>• Orçamento disponível</li>
                      <li>• Prazo de entrega</li>
                      <li>• Stack tecnológica</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">AGENTES ENVOLVIDOS:</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">Arquiteto</Badge>
                      <Badge variant="outline">Planejador</Badge>
                      <Badge variant="outline">Financeiro</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">RESULTADOS:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Arquitetura técnica</li>
                      <li>• Cronograma detalhado</li>
                      <li>• Análise de viabilidade</li>
                      <li>• Redução de 60% em falhas</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      ROI: 500% no primeiro ano
                    </p>
                  </div>
                </div>
              </ElegantCard>

              {/* Modelo 3: Análise Financeira */}
              <ElegantCard
                title="Análise Financeira"
                description="Automação de análise financeira e investimentos"
                icon={DollarSign}
                iconColor="text-purple-600"
                bgColor="bg-purple-100 dark:bg-purple-900/20"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">DADOS DE ENTRADA:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Demonstrações financeiras</li>
                      <li>• Relatórios de desempenho</li>
                      <li>• Dados de mercado</li>
                      <li>• Projeções futuras</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">AGENTES ENVOLVIDOS:</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">Analista</Badge>
                      <Badge variant="outline">Economista</Badge>
                      <Badge variant="outline">Riscos</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">RESULTADOS:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Análise de ROI</li>
                      <li>• Projeções financeiras</li>
                      <li>• Recomendações de investimento</li>
                      <li>• Otimização de custos</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                      ROI: 1200% no primeiro ano
                    </p>
                  </div>
                </div>
              </ElegantCard>

              {/* Modelo 4: Saúde */}
              <ElegantCard
                title="Análise de Saúde"
                description="Diagnóstico e análise de dados médicos"
                icon={Heart}
                iconColor="text-red-600"
                bgColor="bg-red-100 dark:bg-red-900/20"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">DADOS DE ENTRADA:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Histórico médico</li>
                      <li>• Resultados de exames</li>
                      <li>• Sintomas relatados</li>
                      <li>• Imagens médicas</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">AGENTES ENVOLVIDOS:</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">Médico</Badge>
                      <Badge variant="outline">Radiologista</Badge>
                      <Badge variant="outline">Laboratorista</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">RESULTADOS:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Diagnóstico preliminar</li>
                      <li>• Recomendações de tratamento</li>
                      <li>• Análise de risco</li>
                      <li>• Prevenção de doenças</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      Precisão: 95% no diagnóstico
                    </p>
                  </div>
                </div>
              </ElegantCard>

              {/* Modelo 5: Educação */}
              <ElegantCard
                title="Educação Personalizada"
                description="Plataforma de aprendizado adaptativo"
                icon={BookOpen}
                iconColor="text-orange-600"
                bgColor="bg-orange-100 dark:bg-orange-900/20"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">DADOS DE ENTRADA:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Histórico escolar</li>
                      <li>• Estilo de aprendizagem</li>
                      <li>• Interesses do aluno</li>
                      <li>• Metas educacionais</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">AGENTES ENVOLVIDOS:</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">Pedagogo</Badge>
                      <Badge variant="outline">Psicólogo</Badge>
                      <Badge variant="outline">Tutor</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">RESULTADOS:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Plano de estudos personalizado</li>
                      <li>• Conteúdo adaptativo</li>
                      <li>• Acompanhamento de progresso</li>
                      <li>• Melhoria de 70% no desempenho</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Engajamento: 85% maior
                    </p>
                  </div>
                </div>
              </ElegantCard>

              {/* Modelo 6: Vendas */}
              <ElegantCard
                title="Otimização de Vendas"
                description="Automação e análise de processo de vendas"
                icon={TrendingUp}
                iconColor="text-teal-600"
                bgColor="bg-teal-100 dark:bg-teal-900/20"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">DADOS DE ENTRADA:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Dados de clientes</li>
                      <li>• Histórico de vendas</li>
                      <li>• Interações com clientes</li>
                      <li>• Dados de mercado</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">AGENTES ENVOLVIDOS:</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">Vendedor</Badge>
                      <Badge variant="outline">Analista</Badge>
                      <Badge variant="outline">Marketing</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">RESULTADOS:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Previsão de vendas</li>
                      <li>• Segmentação de clientes</li>
                      <li>• Otimização de processos</li>
                      <li>• Aumento de 40% em vendas</li>
                    </ul>
                  </div>
                  
                  <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-teal-800 dark:text-teal-200">
                      Conversão: 3x maior
                    </p>
                  </div>
                </div>
              </ElegantCard>
            </div>
          </TabsContent>

          {/* Tab 3: Manual MCP */}
          <TabsContent value="mcp" className="space-y-8">
            <MCPManual />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}