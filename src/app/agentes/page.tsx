"use client"
import { ChatInterface } from "@/components/chat-interface"
import { Layout } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Megaphone,
  MessageSquare,
  Network,
  Puzzle,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const capabilities = [
  {
    icon: Brain,
    title: "Raciocínio Complexo",
    description: "Nossos agentes analisam informações, fazem conexões e tomam decisões baseadas em contexto, não apenas respondem a comandos."
  },
  {
    icon: Target,
    title: "Autonomia Total",
    description: "Operam de forma independente, definindo seus próprios objetivos e estratégias para alcançá-los sem supervisão constante."
  },
  {
    icon: Zap,
    title: "Aprendizado Contínuo",
    description: "Aprendem com cada interação, melhorando seu desempenho e adaptando-se a novos cenários automaticamente."
  },
  {
    icon: Puzzle,
    title: "Integração Multiplataforma",
    description: "Conectam-se com diversos sistemas e APIs, operando perfeitamente em qualquer ambiente tecnológico."
  }
]

const useCases = [
  {
    icon: Users,
    title: "Automação de Vendas",
    description: "Agentes que qualificam leads, agendam reuniões, fazem follow-ups e até negociam fechamentos 24/7.",
    color: "bg-purple-100 dark:bg-purple-900/20"
  },
  {
    icon: MessageSquare,
    title: "Suporte ao Cliente",
    description: "Resolvem problemas complexos, acessam sistemas internos e oferecem suporte personalizado em escala.",
    color: "bg-blue-100 dark:bg-blue-900/20"
  },
  {
    icon: BarChart3,
    title: "Análise de Dados",
    description: "Processam grandes volumes de dados, identificam padrões e geram insights acionáveis automaticamente.",
    color: "bg-green-100 dark:bg-green-900/20"
  },
  {
    icon: Workflow,
    title: "Operações e Processos",
    description: "Automatizam workflows complexos, gerenciam projetos e otimizam operações empresariais.",
    color: "bg-orange-100 dark:bg-orange-900/20"
  }
]

const comparisonData = [
  {
    feature: "Autonomia",
    chatbot: "Limitada a respostas predefinidas",
    agent: "Tomada de decisão independente"
  },
  {
    feature: "Aprendizado",
    chatbot: "Requer treinamento manual",
    agent: "Aprendizado contínuo automático"
  },
  {
    feature: "Contexto",
    chatbot: "Sem memória de longo prazo",
    agent: "Memória contextual persistente"
  },
  {
    feature: "Integração",
    chatbot: "Apenas canais de comunicação",
    agent: "Sistemas completos e APIs"
  },
  {
    feature: "Personalização",
    chatbot: "Respostas genéricas",
    agent: "Experiência totalmente personalizada"
  }
]

const agentTypes = [
  {
    id: "vendas",
    title: "Agente de Vendas IA",
    description: "Especializado em qualificação de leads, agendamento e fechamento de vendas",
    icon: Users,
    color: "bg-purple-600",
    questions: [
      "Como qualificar leads de forma eficiente?",
      "Quais estratégias de vendas você recomenda?",
      "Como automatizar o follow-up de clientes?",
      "Me mostre um exemplo de negociação"
    ]
  },
  {
    id: "suporte",
    title: "Agente de Suporte IA",
    description: "Focado em resolução de problemas e atendimento ao cliente personalizado",
    icon: MessageSquare,
    color: "bg-blue-600",
    questions: [
      "Como resolver problemas técnicos comuns?",
      "Me mostre um atendimento de qualidade",
      "Como personalizar o suporte ao cliente?",
      "Quais métricas devo acompanhar no suporte?"
    ]
  },
  {
    id: "marketing",
    title: "Agente de Marketing IA",
    description: "Especializado em criação de campanhas, análise de mercado e geração de leads",
    icon: Megaphone,
    color: "bg-green-600",
    questions: [
      "Como criar campanhas de marketing eficazes?",
      "Quais estratégias de conteúdo você recomenda?",
      "Como analisar o comportamento do consumidor?",
      "Me mostre um exemplo de geração de leads"
    ]
  }
]

export default function AgentesPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedAgent, setSelectedAgent] = useState("vendas")
  const [chatKey, setChatKey] = useState(0) // Key to force chat re-render

  // Handle agent change with chat reset
  const handleAgentChange = (agentId: string) => {
    setSelectedAgent(agentId)
    setChatKey(prev => prev + 1) // Force chat component to reinitialize
  }
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-orange-900 dark:from-purple-950 dark:via-purple-900 dark:to-orange-950">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-4 text-purple-100 bg-purple-800/50 border-purple-600">
            <Brain className="w-4 h-4 mr-2" />
            O Futuro da Automação Inteligente
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-100 to-orange-100 bg-clip-text text-transparent">
            Agentes de IA que
            <br />
            <span className="text-orange-400">Pensam e Agem</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            "Agentes de IA representam a próxima fronteira da automação inteligente, 
            capazes de raciocinar, aprender e agir de forma autônoma para atingir objetivos complexos."
            <span className="block text-sm text-purple-200 mt-2">- Databricks Glossary</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/planos">
                Experimentar Agentes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-purple-400 text-purple-100 hover:bg-purple-800/50 font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/demonstracao">
                Ver Demonstração
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">10x</div>
              <div className="text-purple-100">mais eficiente que humanos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-purple-100">operação contínua</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">99.9%</div>
              <div className="text-purple-100">precisão nas tarefas</div>
            </div>
          </div>
        </div>
      </section>

      {/* What are AI Agents */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O Que São Agentes de IA?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Agentes de IA são sistemas autônomos que percebem seu ambiente, raciocinam sobre informações 
              e tomam ações para atingir objetivos específicos sem intervenção humana constante.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Percepção e Análise</h3>
                  <p className="text-muted-foreground">
                    Agentes coletam dados de múltiplas fontes, analisam padrões e compreendem 
                    o contexto para tomar decisões informadas.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Raciocínio e Planejamento</h3>
                  <p className="text-muted-foreground">
                    Utilizam algoritmos avançados para planejar sequências de ações, 
                    antecipar resultados e ajustar estratégias em tempo real.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ação e Adaptação</h3>
                  <p className="text-muted-foreground">
                    Executam tarefas automaticamente, aprendem com os resultados e 
                    adaptam seu comportamento para melhorar continuamente.
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-purple-50 to-orange-50 dark:from-purple-950/50 dark:to-orange-950/50 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span>A Evolução da Automação</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base space-y-3">
                  <p>
                    Enquanto chatbots tradicionais seguem scripts e respondem a comandos simples, 
                    Agentes de IA representam um salto quântico em automação inteligente.
                  </p>
                  <p>
                    Eles não apenas respondem - eles antecipam necessidades, identificam 
                    oportunidades e agem proativamente para alcançar objetivos de negócio.
                  </p>
                  <div className="flex items-center space-x-2 mt-4">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Autonomia real e tomada de decisão</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Aprendizado contínuo e adaptação</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Integração com sistemas empresariais</span>
                  </div>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Capabilities */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Capacidades Avançadas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nossos Agentes de IA possuem capacidades que os tornam verdadeiros parceiros estratégicos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <capability.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {capability.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Casos de Uso Reais
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubra como nossos Agentes de IA estão transformando diferentes setores
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full ${useCase.color} flex items-center justify-center mb-4`}>
                    <useCase.icon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                  </div>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  <CardDescription className="text-base">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Eficiência</span>
                      <Badge variant="secondary">+85%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">ROI</span>
                      <Badge variant="secondary">300%</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Implementação</span>
                      <Badge variant="secondary">2 semanas</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Agentes de IA vs Chatbots Tradicionais
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Entenda a diferença fundamental entre as tecnologias
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="grid grid-cols-3 gap-0">
                <div className="p-4 border-b font-semibold">Funcionalidade</div>
                <div className="p-4 border-b font-semibold text-center">Chatbots Tradicionais</div>
                <div className="p-4 border-b font-semibold text-center">Agentes de IA</div>
              </div>
              
              {comparisonData.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-0">
                  <div className="p-4 border-r border-b font-medium">{item.feature}</div>
                  <div className="p-4 border-r border-b text-muted-foreground text-sm">
                    {item.chatbot}
                  </div>
                  <div className="p-4 border-b text-green-600 font-medium text-sm">
                    {item.agent}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tecnologia de Ponta
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Construído com as tecnologias mais avançadas de IA do mercado
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Cpu className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>GLM-4.5-Flash</CardTitle>
                <CardDescription>
                  Modelo de linguagem avançado para raciocínio complexo
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Network className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>FlowiseAI</CardTitle>
                <CardDescription>
                  Plataforma visual para criação de workflows complexos
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Database className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Supabase</CardTitle>
                <CardDescription>
                  Infraestrutura escalável e segura de dados
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Chat Demo Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Experimente Nosso Agente de IA em Ação
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Veja como nosso agente analisa dados, gera insights e toma decisões em tempo real
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Agent Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-purple-600" />
                    <span>Escolha o Tipo de Agente</span>
                  </CardTitle>
                  <CardDescription>
                    Selecione o agente especializado para sua necessidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agentTypes.map((agent) => (
                    <div
                      key={agent.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAgent === agent.id
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleAgentChange(agent.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${agent.color}`}>
                          <agent.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{agent.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <ChatInterface 
                  key={chatKey}
                  agentTitle={selectedAgent === "vendas" ? "Agente de Vendas IA" : selectedAgent === "suporte" ? "Agente de Suporte IA" : "Agente de Marketing IA"}
                  agentDescription={selectedAgent === "vendas" 
                    ? "Especializado em qualificação de leads e fechamento de vendas" 
                    : selectedAgent === "suporte" 
                    ? "Focado em resolução de problemas e atendimento ao cliente"
                    : "Especializado em criação de campanhas e análise de mercado"}
                  suggestedQuestions={agentTypes.find(agent => agent.id === selectedAgent)?.questions}
                />
              </div>
            </div>

            {/* Agent Capabilities */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <span>Capacidades em Ação</span>
                  </CardTitle>
                  <CardDescription>
                    Veja o que este agente acabou de realizar automaticamente
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Análise em Tempo Real</h4>
                        <p className="text-xs text-muted-foreground">
                          Processa dados e gera insights instantaneamente
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Compreensão Contextual</h4>
                        <p className="text-xs text-muted-foreground">
                          Entende o contexto e fornece respostas relevantes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Insights Acionáveis</h4>
                        <p className="text-xs text-muted-foreground">
                          Gera recomendações específicas e estratégicas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-full">
                        <Zap className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Aprendizado Contínuo</h4>
                        <p className="text-xs text-muted-foreground">
                          Adapta-se com base em novas informações
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="bg-gradient-to-r from-purple-50 to-orange-50 dark:from-purple-950/20 dark:to-orange-950/20 rounded-lg p-4">
                      <h4 className="font-medium text-sm mb-2">Tecnologia Utilizada:</h4>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Modelo GLM-4.5 da Z.AI</li>
                        <li>• Processamento de linguagem natural</li>
                        <li>• Análise contextual em tempo real</li>
                        <li>• Integração com sistemas empresariais</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Badge variant="outline" className="mb-4">
                Demonstração com IA Real
              </Badge>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Este chat utiliza o modelo GLM da Z.AI para fornecer respostas 
                inteligentes e contextualizadas em tempo real. Experimente fazer perguntas 
                sobre negócios, análise de dados ou automação!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Revolucionar Seu Negócio?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Junte-se a empresas que já estão transformando suas operações com Agentes de IA autônomos
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/planos">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/contato">
                Falar com Especialista
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">urbanDev</h3>
              <p className="text-gray-400 text-sm">
                Especialistas em configuração de Agentes de IA para pequenos e médios negócios com assinatura mensal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Soluções</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/agentes" className="hover:text-white transition-colors">Agentes de IA</Link></li>
                <li><Link href="/planos" className="hover:text-white transition-colors">Planos e Preços</Link></li>
                <li><Link href="/demonstracao" className="hover:text-white transition-colors">Demonstração</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tecnologia</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>GLM-4.5-Flash</li>
                <li>FlowiseAI</li>
                <li>Supabase</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 urbanDev. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </Layout>
  )
}