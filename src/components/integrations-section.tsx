"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plug, 
  Search, 
  Check, 
  Star,
  ArrowRight,
  Zap,
  MessageSquare,
  Database,
  ShoppingCart,
  Mail,
  Calendar,
  FileText,
  Phone,
  Video,
  Cloud,
  Shield,
  BarChart3,
  Users,
  Globe,
  Settings,
  Workflow,
  Smartphone,
  CreditCard,
  MapPin,
  Truck,
  Headphones
} from "lucide-react"

interface Integration {
  id: string
  name: string
  category: string
  description: string
  icon: React.ReactNode
  features: string[]
  difficulty: "easy" | "medium" | "hard"
  popularity: number
  isPremium: boolean
  documentation?: string
}

interface IntegrationsSectionProps {
  onIntegrationRequest?: (integrationId: string) => void
}

export function IntegrationsSection({ onIntegrationRequest }: IntegrationsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "Todas", icon: <Plug className="h-4 w-4" /> },
    { id: "communication", name: "Comunicação", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "crm", name: "CRM", icon: <Users className="h-4 w-4" /> },
    { id: "ecommerce", name: "E-commerce", icon: <ShoppingCart className="h-4 w-4" /> },
    { id: "marketing", name: "Marketing", icon: <Mail className="h-4 w-4" /> },
    { id: "productivity", name: "Produtividade", icon: <Calendar className="h-4 w-4" /> },
    { id: "analytics", name: "Análise", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "infrastructure", name: "Infraestrutura", icon: <Cloud className="h-4 w-4" /> }
  ]

  const integrations: Integration[] = [
    // Comunicação
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      category: "communication",
      description: "Atendimento automatizado via WhatsApp com respostas inteligentes",
      icon: <MessageSquare className="h-6 w-6 text-green-600" />,
      features: ["Mensagens automatizadas", "Respostas rápidas", "Mídias", "Grupos", "Botões interativos"],
      difficulty: "easy",
      popularity: 95,
      isPremium: false
    },
    {
      id: "telegram",
      name: "Telegram",
      category: "communication",
      description: "Bots inteligentes para atendimento no Telegram",
      icon: <MessageSquare className="h-6 w-6 text-blue-600" />,
      features: ["Bots customizados", "Comandos", "Inline queries", "Webhooks", "Mídias"],
      difficulty: "easy",
      popularity: 75,
      isPremium: false
    },
    {
      id: "messenger",
      name: "Facebook Messenger",
      category: "communication",
      description: "Atendimento via Messenger com integração completa",
      icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
      features: ["Chatbots", "Mídias", "Botões", "Templates", "Segmentação"],
      difficulty: "medium",
      popularity: 80,
      isPremium: false
    },
    {
      id: "twilio",
      name: "Twilio",
      category: "communication",
      description: "Comunicação via SMS, voz e WhatsApp enterprise",
      icon: <Phone className="h-6 w-6 text-red-600" />,
      features: ["SMS", "Voz", "WhatsApp", "Video", "MMS"],
      difficulty: "hard",
      popularity: 70,
      isPremium: true
    },

    // CRM
    {
      id: "hubspot",
      name: "HubSpot",
      category: "crm",
      description: "Integração completa com HubSpot CRM",
      icon: <Database className="h-6 w-6 text-orange-600" />,
      features: ["Contatos", "Empresas", "Negócios", "Tickets", "Automação"],
      difficulty: "medium",
      popularity: 85,
      isPremium: false
    },
    {
      id: "salesforce",
      name: "Salesforce",
      category: "crm",
      description: "Conexão com Salesforce para sincronização de dados",
      icon: <Database className="h-6 w-6 text-blue-700" />,
      features: ["Leads", "Oportunidades", "Contas", "Contatos", "Relatórios"],
      difficulty: "hard",
      popularity: 90,
      isPremium: true
    },
    {
      id: "rdstation",
      name: "RD Station",
      category: "crm",
      description: "Integração com RD Station para marketing e vendas",
      icon: <Database className="h-6 w-6 text-green-600" />,
      features: ["Leads", "Email marketing", "Automação", "Relatórios", "Segmentação"],
      difficulty: "medium",
      popularity: 65,
      isPremium: false
    },

    // E-commerce
    {
      id: "shopify",
      name: "Shopify",
      category: "ecommerce",
      description: "Atendimento e automação para lojas Shopify",
      icon: <ShoppingCart className="h-6 w-6 text-green-700" />,
      features: ["Pedidos", "Produtos", "Clientes", "Estoque", "Abandono de carrinho"],
      difficulty: "easy",
      popularity: 88,
      isPremium: false
    },
    {
      id: "woocommerce",
      name: "WooCommerce",
      category: "ecommerce",
      description: "Integração com WooCommerce para WordPress",
      icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
      features: ["Pedidos", "Produtos", "Clientes", "Cupons", "Variações"],
      difficulty: "medium",
      popularity: 75,
      isPremium: false
    },
    {
      id: "nuvemshop",
      name: "Nuvemshop",
      category: "ecommerce",
      description: "Integração com Nuvemshop para e-commerce latino",
      icon: <ShoppingCart className="h-6 w-6 text-blue-600" />,
      features: ["Pedidos", "Produtos", "Clientes", "Frete", "Pagamentos"],
      difficulty: "easy",
      popularity: 60,
      isPremium: false
    },

    // Marketing
    {
      id: "mailchimp",
      name: "Mailchimp",
      category: "marketing",
      description: "Automação de email marketing com Mailchimp",
      icon: <Mail className="h-6 w-6 text-yellow-600" />,
      features: ["Campanhas", "Listas", "Segmentação", "Automação", "Relatórios"],
      difficulty: "easy",
      popularity: 82,
      isPremium: false
    },
    {
      id: "activecampaign",
      name: "ActiveCampaign",
      category: "marketing",
      description: "Marketing automation avançado",
      icon: <Mail className="h-6 w-6 text-orange-500" />,
      features: ["Email marketing", "Automação", "CRM", "Segmentação", "Score de lead"],
      difficulty: "medium",
      popularity: 70,
      isPremium: false
    },

    // Produtividade
    {
      id: "google_calendar",
      name: "Google Calendar",
      category: "productivity",
      description: "Agendamento automático de reuniões e compromissos",
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      features: ["Eventos", "Compromissos", "Lembretes", "Convidados", "Recorrência"],
      difficulty: "easy",
      popularity: 90,
      isPremium: false
    },
    {
      id: "notion",
      name: "Notion",
      category: "productivity",
      description: "Integração com Notion para gestão de conhecimento",
      icon: <FileText className="h-6 w-6 text-gray-800" />,
      features: ["Páginas", "Bancos de dados", "Templates", "Compartilhamento", "API"],
      difficulty: "medium",
      popularity: 78,
      isPremium: false
    },
    {
      id: "slack",
      name: "Slack",
      category: "productivity",
      description: "Notificações e automação no Slack",
      icon: <MessageSquare className="h-6 w-6 text-purple-600" />,
      features: ["Mensagens", "Canais", "Webhooks", "Comandos", "Bots"],
      difficulty: "easy",
      popularity: 85,
      isPremium: false
    },

    // Análise
    {
      id: "google_analytics",
      name: "Google Analytics",
      category: "analytics",
      description: "Análise de comportamento e conversões",
      icon: <BarChart3 className="h-6 w-6 text-orange-500" />,
      features: ["Eventos", "Conversões", "Usuários", "Sessões", "Relatórios"],
      difficulty: "medium",
      popularity: 92,
      isPremium: false
    },
    {
      id: "powerbi",
      name: "Power BI",
      category: "analytics",
      description: "Dashboards e relatórios avançados",
      icon: <BarChart3 className="h-6 w-6 text-yellow-500" />,
      features: ["Dashboards", "Relatórios", "Datasets", "Visualizações", "Compartilhamento"],
      difficulty: "hard",
      popularity: 68,
      isPremium: true
    },

    // Infraestrutura
    {
      id: "aws",
      name: "AWS",
      category: "infrastructure",
      description: "Integração com serviços AWS",
      icon: <Cloud className="h-6 w-6 text-orange-600" />,
      features: ["Lambda", "S3", "DynamoDB", "API Gateway", "SQS"],
      difficulty: "hard",
      popularity: 88,
      isPremium: true
    },
    {
      id: "vercel",
      name: "Vercel",
      category: "infrastructure",
      description: "Deploy e hospedagem de aplicações",
      icon: <Cloud className="h-6 w-6 text-gray-900" />,
      features: ["Deploy", "Edge Functions", "Analytics", "Webhooks", "Ambientes"],
      difficulty: "medium",
      popularity: 80,
      isPremium: false
    }
  ]

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Fácil"
      case "medium": return "Médio"
      case "hard": return "Avançado"
      default: return "Desconhecido"
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Integrações Poderosas</h2>
        <p className="text-lg text-muted-foreground">
          Conecte nossos agentes de IA com suas ferramentas favoritas e amplie suas possibilidades
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar integrações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs">
                    {category.icon}
                    <span className="hidden sm:inline ml-1">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Integration Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {integration.icon}
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {categories.find(c => c.id === integration.category)?.name}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(integration.difficulty)}`}>
                        {getDifficultyText(integration.difficulty)}
                      </Badge>
                      {integration.isPremium && (
                        <Badge className="text-xs bg-purple-100 text-purple-800">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">{integration.popularity}%</span>
                </div>
              </div>
              <CardDescription>{integration.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Recursos:</h4>
                  <div className="space-y-1">
                    {integration.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                    {integration.features.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{integration.features.length - 3} mais recursos
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${integration.popularity}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{integration.popularity}%</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => onIntegrationRequest?.(integration.id)}
                >
                  {integration.isPremium ? "Solicitar Orçamento" : "Ver Documentação"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Section */}
      <Card className="mt-8 bg-gradient-to-r from-blue-600 to-orange-600 text-white">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Integrações Disponíveis</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Garantido</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5min</div>
              <div className="text-blue-100">Setup Médio</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Suporte Técnico</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Integration */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Integração Personalizada</span>
          </CardTitle>
          <CardDescription>
            Não encontrou a integração que precisa? Criamos soluções customizadas para você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">O que oferecemos:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>API REST completa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Webhooks em tempo real</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>SDK para múltiplas linguagens</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Documentação detalhada</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Suporte especializado</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Tecnologias suportadas:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">JavaScript</Badge>
                <Badge variant="outline">Python</Badge>
                <Badge variant="outline">Java</Badge>
                <Badge variant="outline">C#</Badge>
                <Badge variant="outline">PHP</Badge>
                <Badge variant="outline">Ruby</Badge>
                <Badge variant="outline">Go</Badge>
                <Badge variant="outline">Rust</Badge>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Falar com Especialista
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}