import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Users, CheckCircle, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

export default function DemonstracaoPage() {
  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Play className="w-4 h-4 mr-2" />
              Demonstração ao Vivo
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Veja Nossos Agentes de IA em Ação
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Agende uma demonstração personalizada e descubra como nossos agentes podem transformar seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">O que você verá na demonstração:</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Agentes de IA resolvendo problemas reais</h3>
                    <p className="text-muted-foreground">Veja como nossos agentes analisam dados e tomam decisões autônomas</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Integração com seus sistemas</h3>
                    <p className="text-muted-foreground">Demonstração de como os agentes se conectam com suas ferramentas atuais</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Resultados mensuráveis</h3>
                    <p className="text-muted-foreground">Análise de ROI e métricas de performance que você pode esperar</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Cenários personalizados</h3>
                    <p className="text-muted-foreground">Adaptamos a demonstração para seus desafios específicos de negócio</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-purple-50 to-orange-50 dark:from-purple-950/20 dark:to-orange-950/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span>Agende Sua Demonstração</span>
                </CardTitle>
                <CardDescription>
                  Escolha o melhor horário para sua equipe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Duração</span>
                  </div>
                  <span className="text-sm font-medium">45 minutos</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Participantes</span>
                  </div>
                  <span className="text-sm font-medium">Até 10 pessoas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Play className="h-4 w-4" />
                    <span className="text-sm">Formato</span>
                  </div>
                  <span className="text-sm font-medium">Online ao vivo</span>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/contato">
                    Agendar Demonstração
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Depoimentos de Clientes</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm mb-4">
                    "A demonstração superou todas as expectativas. Vimos na prática como os agentes de IA 
                    podem automatizar 80% do nosso atendimento ao cliente. Estamos implementando agora!"
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>Maria Silva</strong> - CEO, TechSolutions
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
                    "Fiquei impressionado com a capacidade dos agentes de analisar nossos dados de vendas 
                    e gerar insights que nossa equipe levava semanas para descobrir. Valeu cada minuto!"
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <strong>João Santos</strong> - Diretor, VarejoPro
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="text-center mt-12">
            <h3 className="text-xl font-semibold mb-4">Pronto para transformar seu negócio?</h3>
            <p className="text-muted-foreground mb-6">
              Junte-se a centenas de empresas que já estão revolucionando suas operações com IA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="/contato">
                  Agendar Demonstração
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