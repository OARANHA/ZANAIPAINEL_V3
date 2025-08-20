"use client"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ROICalculator } from "@/components/roi-calculator"
import { PlanComparator } from "@/components/plan-comparator"
import { IntegrationsSection } from "@/components/integrations-section"
import { BlogResources } from "@/components/blog-resources"
import { CertificationsSecurity } from "@/components/certifications-security"
import { 
  ArrowRight, 
  Bot, 
  Code, 
  Zap, 
  Users, 
  TrendingUp, 
  CheckCircle,
  BarChart3,
  MessageSquare,
  Workflow,
  Target,
  Lightbulb,
  Shield,
  Globe,
  Smartphone,
  Database,
  Cloud,
  Settings,
  Cpu,
  Wrench,
  Monitor,
  Palette,
  Calculator,
  Filter,
  Plug,
  BookOpen,
  Award
} from "lucide-react"
import Link from "next/link"

export default function Servicos() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-orange-900 dark:from-blue-950 dark:via-blue-900 dark:to-orange-950">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-4 text-blue-100 bg-blue-800/50 border-blue-600">
            <Zap className="w-4 h-4 mr-2" />
            Serviços Profissionais
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-orange-100 bg-clip-text text-transparent">
            Soluções Completas em
            <br />
            <span className="text-orange-400">IA e Desenvolvimento Web</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transformamos sua presença digital com agentes de IA inteligentes e websites institucionais de alto impacto
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/contato">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-blue-400 text-blue-100 hover:bg-blue-800/50 font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/demonstracao">
                Ver Demonstração
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossos Serviços Especializados
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Oferecemos soluções completas que combinam inteligência artificial avançada com desenvolvimento web profissional
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* AI Agents Service */}
            <Card className="hover:shadow-lg transition-shadow border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                    <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Agentes de IA</CardTitle>
                    <CardDescription className="text-lg">
                      Automação inteligente para seu negócio
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Desenvolvemos agentes de IA personalizados que atendem, analisam e automatizam processos 
                  para pequenos e médios negócios, com integração total aos seus sistemas existentes.
                </p>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Tipos de Agentes:</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span>Agente de Atendimento ao Cliente</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-5 w-5 text-orange-600" />
                      <span>Agente de Análise de Dados</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Workflow className="h-5 w-5 text-blue-600" />
                      <span>Agente de Automação de Processos</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Target className="h-5 w-5 text-orange-600" />
                      <span>Agente de Vendas e Marketing</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Tecnologias Utilizadas:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Flowise</Badge>
                    <Badge variant="secondary">Z.ai</Badge>
                    <Badge variant="secondary">OpenAI</Badge>
                    <Badge variant="secondary">LangChain</Badge>
                    <Badge variant="secondary">Vector DBs</Badge>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href="/planos">
                    Ver Planos de Agentes de IA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Institutional Websites Service */}
            <Card className="hover:shadow-lg transition-shadow border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                    <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Sites Institucionais</CardTitle>
                    <CardDescription className="text-lg">
                      Presença digital profissional com IA integrada
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Criamos websites institucionais modernos, responsivos e otimizados, 
                  já com agentes de IA integrados para atendimento automatizado 24/7.
                </p>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Recursos Inclusos:</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-5 w-5 text-orange-600" />
                      <span>Design Responsivo e Moderno</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Palette className="h-5 w-5 text-blue-600" />
                      <span>UI/UX Personalizada</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-orange-600" />
                      <span>Agente de IA Integrado</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      <span>Otimizado para Mobile</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Database className="h-5 w-5 text-orange-600" />
                      <span>Sistema de Gestão de Conteúdo</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Cloud className="h-5 w-5 text-blue-600" />
                      <span>Hospedagem e Manutenção</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Tecnologias Utilizadas:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Next.js</Badge>
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">Tailwind CSS</Badge>
                    <Badge variant="secondary">Vercel</Badge>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-blue-500 text-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold mb-2">Sob Orçamento</div>
                  <div className="text-sm">Valores personalizados conforme necessidade</div>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                  <Link href="/contato">
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Combined Solution */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Solução Completa: Website + Agentes de IA
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A combinação perfeita para transformar sua presença digital
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Pacote Integrado Premium</CardTitle>
              <CardDescription className="text-center text-lg">
                Tudo o que sua empresa precisa em uma única solução
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-blue-600" />
                    Website Institucional
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Design exclusivo e responsivo
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Otimizado para SEO e performance
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Painel administrativo intuitivo
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Integração com redes sociais
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-orange-600" />
                    Agentes de IA Integrados
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Chatbot inteligente 24/7
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Análise de visitantes em tempo real
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Automação de lead generation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      Relatórios de performance
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-orange-600 text-white p-6 rounded-lg text-center">
                <div className="text-3xl font-bold mb-2">Sob Orçamento</div>
                <div className="text-lg mb-4">Solução personalizada para seu negócio</div>
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <Link href="/contato">
                    Solicitar Proposta Completa
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nosso Processo de Trabalho
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Metodologia comprovada para entregar resultados excepcionais
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Diagnóstico</h3>
              <p className="text-muted-foreground">
                Análise detalhada das necessidades do seu negócio
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Planejamento</h3>
              <p className="text-muted-foreground">
                Estratégia personalizada e definição de escopo
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Desenvolvimento</h3>
              <p className="text-muted-foreground">
                Implementação ágil e iterativa
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4. Suporte</h3>
              <p className="text-muted-foreground">
                Acompanhamento contínuo e otimização
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Calculator className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-bold">Calculadora de ROI</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubra quanto sua empresa pode economizar com nossos agentes de IA
            </p>
          </div>
          <ROICalculator onPlanRecommendation={(plan) => {
            // Scroll to plans section or redirect
            const element = document.getElementById('plan-comparator')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }} />
        </div>
      </section>

      {/* Plan Comparator Section */}
      <section id="plan-comparator" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Filter className="h-8 w-8 text-orange-600" />
              <h2 className="text-3xl md:text-4xl font-bold">Comparador de Planos</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Encontre o plano perfeito para suas necessidades com nossa ferramenta inteligente
            </p>
          </div>
          <PlanComparator onSelectPlan={(planId) => {
            // Handle plan selection
            console.log('Selected plan:', planId)
          }} />
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Plug className="h-8 w-8 text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold">Integrações Poderosas</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conecte nossos agentes de IA com suas ferramentas favoritas
            </p>
          </div>
          <IntegrationsSection onIntegrationRequest={(integrationId) => {
            console.log('Integration requested:', integrationId)
          }} />
        </div>
      </section>

      {/* Blog Resources Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <BookOpen className="h-8 w-8 text-green-600" />
              <h2 className="text-3xl md:text-4xl font-bold">Recursos e Conhecimento</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conteúdo exclusivo gerado por IA para impulsionar seu negócio
            </p>
          </div>
          <BlogResources onPostSelect={(post) => {
            console.log('Post selected:', post)
          }} />
        </div>
      </section>

      {/* Certifications and Security Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Award className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl md:text-4xl font-bold">Certificações e Segurança</h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Compromisso com a segurança, conformidade e proteção de seus dados
            </p>
          </div>
          <CertificationsSecurity onDocumentRequest={(documentId) => {
            console.log('Document requested:', documentId)
          }} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Transformar Seu Negócio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Entre em contato hoje mesmo e descubra como nossas soluções podem alavancar seus resultados
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/contato">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/demonstracao">
                Agendar Demonstração
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}