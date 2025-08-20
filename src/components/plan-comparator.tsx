"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Filter, 
  SlidersHorizontal, 
  Check, 
  X, 
  Star,
  Users,
  Zap,
  Shield,
  Database,
  MessageSquare,
  BarChart3,
  Workflow,
  Target,
  ArrowRight,
  TrendingUp
} from "lucide-react"

interface PlanFeature {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
}

interface Plan {
  id: string
  name: string
  price: number
  maxInteractions: number
  features: string[]
  highlighted: boolean
  color: string
  badge?: string
}

interface PlanComparatorProps {
  onSelectPlan?: (planId: string) => void
}

export function PlanComparator({ onSelectPlan }: PlanComparatorProps) {
  const [businessType, setBusinessType] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [monthlyInteractions, setMonthlyInteractions] = useState("")
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [budget, setBudget] = useState("")
  const [showComparison, setShowComparison] = useState(false)

  const features: PlanFeature[] = [
    {
      id: "chatbot",
      name: "Chatbot Inteligente",
      description: "Atendimento automatizado 24/7",
      category: "Atendimento",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      id: "analytics",
      name: "Análise de Dados",
      description: "Insights e relatórios em tempo real",
      category: "Análise",
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      id: "automation",
      name: "Automação de Processos",
      description: "Fluxos de trabalho inteligentes",
      category: "Automação",
      icon: <Workflow className="h-4 w-4" />
    },
    {
      id: "crm_integration",
      name: "Integração CRM",
      description: "Conexão com sistemas de CRM",
      category: "Integração",
      icon: <Database className="h-4 w-4" />
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Atendimento via WhatsApp",
      category: "Canais",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      id: "voice_assistant",
      name: "Assistente de Voz",
      description: "Atendimento por voz",
      category: "Atendimento",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      id: "api_access",
      name: "Acesso API Completo",
      description: "API REST para integrações",
      category: "Desenvolvimento",
      icon: <Database className="h-4 w-4" />
    },
    {
      id: "priority_support",
      name: "Suporte Prioritário",
      description: "Atendimento preferencial",
      category: "Suporte",
      icon: <Shield className="h-4 w-4" />
    },
    {
      id: "custom_agents",
      name: "Agentes Personalizados",
      description: "Agentes sob medida",
      category: "Personalização",
      icon: <Target className="h-4 w-4" />
    },
    {
      id: "multilingual",
      name: "Multi-idiomas",
      description: "Suporte a vários idiomas",
      category: "Globalização",
      icon: <Users className="h-4 w-4" />
    }
  ]

  const plans: Plan[] = [
    {
      id: "iniciante",
      name: "Iniciante",
      price: 280,
      maxInteractions: 1000,
      features: ["chatbot", "analytics", "whatsapp"],
      highlighted: false,
      color: "blue"
    },
    {
      id: "profissional",
      name: "Profissional",
      price: 470,
      maxInteractions: 5000,
      features: ["chatbot", "analytics", "automation", "whatsapp", "crm_integration", "priority_support"],
      highlighted: true,
      color: "orange",
      badge: "Mais Popular"
    },
    {
      id: "empresarial",
      name: "Empresarial",
      price: 790,
      maxInteractions: 15000,
      features: ["chatbot", "analytics", "automation", "whatsapp", "crm_integration", "voice_assistant", "api_access", "priority_support", "custom_agents"],
      highlighted: false,
      color: "purple"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 0,
      maxInteractions: 999999,
      features: features.map(f => f.id),
      highlighted: false,
      color: "gray",
      badge: "Sob Orçamento"
    }
  ]

  const [filteredPlans, setFilteredPlans] = useState<Plan[]>(plans)
  const [recommendedPlan, setRecommendedPlan] = useState<Plan | null>(null)

  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, featureId])
    } else {
      setSelectedFeatures(selectedFeatures.filter(id => id !== featureId))
    }
  }

  const getRecommendation = () => {
    const interactions = parseInt(monthlyInteractions) || 0
    const budgetValue = parseInt(budget) || 0
    const featuresNeeded = selectedFeatures.length

    let recommended = plans[0] // Default to Iniciante

    if (interactions > 15000 || featuresNeeded > 7) {
      recommended = plans[3] // Enterprise
    } else if (interactions > 5000 || featuresNeeded > 4 || budgetValue >= 790) {
      recommended = plans[2] // Empresarial
    } else if (interactions > 1000 || featuresNeeded > 2 || budgetValue >= 470) {
      recommended = plans[1] // Profissional
    }

    return recommended
  }

  const filterPlans = () => {
    const interactions = parseInt(monthlyInteractions) || 0
    const budgetValue = parseInt(budget) || 0

    let filtered = plans.filter(plan => {
      // Filter by interactions
      if (interactions > 0 && plan.maxInteractions < interactions) {
        return false
      }
      
      // Filter by budget (except Enterprise which is custom)
      if (budgetValue > 0 && plan.id !== "enterprise" && plan.price > budgetValue) {
        return false
      }

      // Filter by selected features
      if (selectedFeatures.length > 0) {
        const hasAllFeatures = selectedFeatures.every(feature => 
          plan.features.includes(feature)
        )
        if (!hasAllFeatures) {
          return false
        }
      }

      return true
    })

    setFilteredPlans(filtered)
    setRecommendedPlan(getRecommendation())
    setShowComparison(true)
  }

  const getPlanColor = (color: string) => {
    switch (color) {
      case "blue": return "border-blue-200 bg-blue-50"
      case "orange": return "border-orange-200 bg-orange-50"
      case "purple": return "border-purple-200 bg-purple-50"
      case "gray": return "border-gray-200 bg-gray-50"
      default: return "border-gray-200 bg-gray-50"
    }
  }

  const getButtonColor = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-600 hover:bg-blue-700"
      case "orange": return "bg-orange-600 hover:bg-orange-700"
      case "purple": return "bg-purple-600 hover:bg-purple-700"
      case "gray": return "bg-gray-600 hover:bg-gray-700"
      default: return "bg-gray-600 hover:bg-gray-700"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Comparador Inteligente de Planos</h2>
        <p className="text-lg text-muted-foreground">
          Encontre o plano perfeito para suas necessidades com nosso assistente de recomendação
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filtros e Preferências</span>
          </CardTitle>
          <CardDescription>
            Configure suas necessidades para encontrar o plano ideal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="businessType">Tipo de Negócio</Label>
              <Select onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="servicos">Serviços</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="varejo">Varejo</SelectItem>
                  <SelectItem value="industria">Indústria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="teamSize">Tamanho da Equipe</Label>
              <Select onValueChange={setTeamSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 pessoas</SelectItem>
                  <SelectItem value="6-20">6-20 pessoas</SelectItem>
                  <SelectItem value="21-50">21-50 pessoas</SelectItem>
                  <SelectItem value="51+">51+ pessoas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="monthlyInteractions">Interações Mensais Estimadas</Label>
              <Input
                id="monthlyInteractions"
                type="number"
                placeholder="Ex: 2000"
                value={monthlyInteractions}
                onChange={(e) => setMonthlyInteractions(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="budget">Orçamento Mensal (R$)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Ex: 500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Recursos Necessários</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature.id}
                      checked={selectedFeatures.includes(feature.id)}
                      onCheckedChange={(checked) => 
                        handleFeatureToggle(feature.id, checked as boolean)
                      }
                    />
                    <label htmlFor={feature.id} className="text-sm cursor-pointer">
                      {feature.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={filterPlans} className="w-full mt-6">
            <Filter className="mr-2 h-4 w-4" />
            Comparar Planos
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {showComparison && (
        <div className="space-y-6">
          {/* Recommendation */}
          {recommendedPlan && (
            <Card className="border-2 border-green-500 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Star className="h-5 w-5" />
                  <span>Plano Recomendado para Você</span>
                </CardTitle>
                <CardDescription className="text-green-700">
                  Baseado nas suas necessidades, recomendamos o plano {recommendedPlan.name}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* Plans Comparison */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`${getPlanColor(plan.color)} ${plan.highlighted ? 'ring-2 ring-orange-400' : ''}`}
              >
                <CardHeader className="text-center">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {plan.badge && (
                      <Badge className="bg-orange-500 text-white">
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  {plan.price > 0 ? (
                    <div className="text-3xl font-bold">
                      {formatCurrency(plan.price)}
                      <span className="text-sm font-normal text-muted-foreground">/mês</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold">Sob Orçamento</div>
                  )}
                  <CardDescription>
                    Até {plan.maxInteractions.toLocaleString()} interações/mês
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-2">
                    {features.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        {plan.features.includes(feature.id) ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-gray-400" />
                        )}
                        <span className={`text-sm ${plan.features.includes(feature.id) ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full ${getButtonColor(plan.color)} ${plan.highlighted ? 'ring-2 ring-orange-400' : ''}`}
                    onClick={() => onSelectPlan?.(plan.id)}
                  >
                    {plan.id === "enterprise" ? "Solicitar Orçamento" : "Escolher Plano"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  {recommendedPlan?.id === plan.id && (
                    <div className="text-center">
                      <Badge className="bg-green-500 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Recomendado
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes dos Recursos</CardTitle>
              <CardDescription>Entenda o que cada recurso oferece</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature) => (
                  <div key={feature.id} className="p-3 border rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      {feature.icon}
                      <span className="font-medium">{feature.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {feature.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}