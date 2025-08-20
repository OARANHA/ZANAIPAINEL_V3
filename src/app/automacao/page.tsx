import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, CheckCircle, ArrowRight, Settings, BarChart3, Clock, Shield, Users } from "lucide-react"
import Link from "next/link"

export default function AutomacaoPage() {
  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Automação Avançada
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Automação Inteligente com Agentes de IA
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforme seus processos com automação inteligente que aprende, se adapta e otimiza continuamente
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Capacidades da Automação Inteligente:</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Processos Adaptativos</h3>
                    <p className="text-muted-foreground">Sistemas que se ajustam automaticamente às mudanças do seu negócio</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Integração Universal</h3>
                    <p className="text-muted-foreground">Conecte-se com qualquer sistema, ferramenta ou banco de dados</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Análise Preditiva</h3>
                    <p className="text-muted-foreground">Antecipe problemas e oportunidades com análise de dados em tempo real</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Automação Contextual</h3>
                    <p className="text-muted-foreground">Decisões inteligentes baseadas em contexto e histórico</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <span>Configuração Rápida</span>
                </CardTitle>
                <CardDescription>
                  Comece a automatizar em minutos, não meses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Tempo de Implementação</span>
                  </div>
                  <span className="text-sm font-medium">24-48 horas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Suporte</span>
                  </div>
                  <span className="text-sm font-medium">Especialista dedicado</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Segurança</span>
                  </div>
                  <span className="text-sm font-medium">Enterprise-grade</span>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/contato">
                    Solicitar Demonstração
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  <span>Otimização de Custos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Reduza custos operacionais em até 70% com automação inteligente que elimina tarefas manuais e repetitivas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-500" />
                  <span>Aumento de Produtividade</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Multiplique a produtividade da sua equipe em 300% com agentes que trabalham 24/7 sem erros ou fadiga.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Conformidade e Segurança</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Garanta conformidade total com automação que segue rigorosos padrões de segurança e governança.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Casos de Sucesso</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm mb-4">
                    "A automação reduziu nosso tempo de processamento de pedidos de 48h para 15 minutos. 
                    Nossa equipe agora foca em estratégia, não em tarefas operacionais."
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Carlos Mendes</strong> - COO, LogísticaExpress
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm mb-4">
                    "Os agentes de IA analisam nossos dados de vendas em tempo real, identificando 
                    padrões que nossa equipe humana não conseguia ver. ROI de 450% no primeiro trimestre."
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Ana Paula Costa</strong> - Diretora de Marketing, E-Commerce Plus
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-12">
            <h3 className="text-xl font-semibold mb-4">Pronto para revolucionar sua operação?</h3>
            <p className="text-muted-foreground mb-6">
              Junte-se a empresas que estão transformando seus processos com automação inteligente
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/contato">
                  Solicitar Demonstração
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/planos">
                  Ver Planos e Preços
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}