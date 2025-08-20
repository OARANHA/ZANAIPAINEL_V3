"use client"

import { useState } from 'react'
import { FlowiseChat } from '@/components/flowise-chat'
import { Layout } from '@/components/layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle,
  Code,
  Cpu,
  Database,
  MessageSquare,
  Network,
  Settings,
  Sparkles,
  Users,
  Zap
} from 'lucide-react'
import Link from 'next/link'

// Exemplos de prompts para cada tipo de agente
const agentExamples = {
  vendas: [
    {
      title: "Qualificação de Leads",
      prompt: "Como qualificar leads de forma eficiente para aumentar as taxas de conversão?",
      icon: Users
    },
    {
      title: "Estratégias de Vendas",
      prompt: "Quais estratégias de vendas você recomenda para o mercado B2B?",
      icon: Brain
    },
    {
      title: "Follow-up Automatizado",
      prompt: "Como automatizar o follow-up de clientes para não perder oportunidades?",
      icon: Zap
    },
    {
      title: "Negociação",
      prompt: "Me mostre um exemplo de negociação eficaz com um cliente difícil.",
      icon: MessageSquare
    }
  ],
  suporte: [
    {
      title: "Resolução de Problemas",
      prompt: "Como resolver problemas técnicos comuns de forma eficiente?",
      icon: Settings
    },
    {
      title: "Atendimento de Qualidade",
      prompt: "Me mostre um exemplo de atendimento ao cliente de alta qualidade.",
      icon: CheckCircle
    },
    {
      title: "Personalização",
      prompt: "Como personalizar o suporte ao cliente para diferentes perfis?",
      icon: Users
    },
    {
      title: "Métricas",
      prompt: "Quais métricas devo acompanhar para medir a eficiência do suporte?",
      icon: Brain
    }
  ],
  marketing: [
    {
      title: "Campanhas Eficazes",
      prompt: "Como criar campanhas de marketing digital que geram resultados?",
      icon: Sparkles
    },
    {
      title: "Estratégias de Conteúdo",
      prompt: "Quais estratégias de conteúdo você recomenda para engajar o público?",
      icon: MessageSquare
    },
    {
      title: "Análise de Comportamento",
      prompt: "Como analisar o comportamento do consumidor para otimizar campanhas?",
      icon: Brain
    },
    {
      title: "Geração de Leads",
      prompt: "Me mostre um exemplo de geração de leads qualificados.",
      icon: Users
    }
  ]
}

const integrationFeatures = [
  {
    icon: Network,
    title: "API REST Completa",
    description: "Integração via API REST com endpoints para chat, predição e gerenciamento de flows"
  },
  {
    icon: Database,
    title: "Contexto Persistente",
    description: "Mantém o contexto da conversa e histórico de interações"
  },
  {
    icon: Cpu,
    title: "Processamento em Tempo Real",
    description: "Respostas rápidas com streaming de dados para melhor experiência"
  },
  {
    icon: Code,
    title: "Customização Avançada",
    description: "Configuração flexível de parâmetros e comportamento dos agentes"
  }
]

const technicalSpecs = [
  {
    category: "API Endpoints",
    items: [
      "POST /api/flowise-chat - Envio de mensagens",
      "GET /api/flowise-chat - Listagem de chatflows",
      "POST /api/v1/prediction/{id} - Predição do Flowise",
      "GET /api/v1/chatflows - Gerenciamento de flows"
    ]
  },
  {
    category: "Configuração",
    items: [
      "FLOWISE_API_URL - URL do servidor Flowise",
      "FLOWISE_API_KEY - Chave de autenticação",
      "FLOWISE_VENDAS_FLOW_ID - ID do flow de vendas",
      "FLOWISE_SUPORTE_FLOW_ID - ID do flow de suporte",
      "FLOWISE_MARKETING_FLOW_ID - ID do flow de marketing"
    ]
  },
  {
    category: "Features",
    items: [
      "Suporte a múltiplos tipos de agentes",
      "Contexto de conversa persistente",
      "Tratamento de erros robusto",
      "Status de conexão em tempo real",
      "Interface responsiva e acessível"
    ]
  }
]

export default function FlowiseDemoPage() {
  const [selectedAgent, setSelectedAgent] = useState<'vendas' | 'suporte' | 'marketing'>('vendas')

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-orange-900 dark:from-purple-950 dark:via-blue-950 dark:to-orange-950">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-4 text-purple-100 bg-purple-800/50 border-purple-600">
            <Code className="w-4 h-4 mr-2" />
            Demonstração Prática
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-orange-100 bg-clip-text text-transparent">
            Agentes de IA com
            <br />
            <span className="text-orange-400">Flowise Integration</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            Experimente na prática como nossos agentes de IA integrados com Flowise 
            podem transformar seus negócios com automação inteligente.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/planos">
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-blue-400 text-blue-100 hover:bg-blue-800/50 font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/agentes">
                Ver Mais Agentes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Integração Flowise Completa
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nossa solução oferece integração total com o ecossistema Flowise,
              permitindo criar e gerenciar agentes de IA poderosos.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {integrationFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Demo Interativa
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experimente nossos agentes em ação. Escolha um tipo de agente e comece uma conversa.
            </p>
          </div>

          <Tabs value={selectedAgent} onValueChange={(value) => setSelectedAgent(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="vendas" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Vendas
              </TabsTrigger>
              <TabsTrigger value="suporte" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Suporte
              </TabsTrigger>
              <TabsTrigger value="marketing" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Marketing
              </TabsTrigger>
            </TabsList>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Examples Panel */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Exemplos de Uso
                    </CardTitle>
                    <CardDescription>
                      Clique em um exemplo para começar a conversa
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {agentExamples[selectedAgent].map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto p-3"
                        onClick={() => {
                          // This would typically set the input value in the chat component
                          console.log('Example clicked:', example.prompt)
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <example.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">{example.title}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {example.prompt}
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Panel */}
              <div className="lg:col-span-3">
                <FlowiseChat
                  agentType={selectedAgent}
                  title={`Agente de ${selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} IA`}
                  description={`Assistente especializado em ${selectedAgent} com inteligência artificial`}
                  placeholder={`Digite sua mensagem sobre ${selectedAgent}...`}
                />
              </div>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Especificações Técnicas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Detalhes técnicos da integração e implementação
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {technicalSpecs.map((spec, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{spec.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {spec.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Exemplo de Implementação
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Veja como é fácil integrar nossos agentes em sua aplicação
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Integração Básica
                </CardTitle>
                <CardDescription>
                  Exemplo de código para usar o componente FlowiseChat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <code>{`import { FlowiseChat } from '@/components/flowise-chat'

function MyComponent() {
  return (
    <FlowiseChat
      agentType="vendas"
      title="Agente de Vendas IA"
      description="Assistente especializado em vendas"
      placeholder="Digite sua pergunta sobre vendas..."
    />
  )
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  )
}