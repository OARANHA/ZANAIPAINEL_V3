"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  CheckCircle,
  ArrowRight,
  BarChart3,
  Target
} from "lucide-react"

interface ROICalculatorProps {
  onPlanRecommendation?: (plan: string) => void
}

export function ROICalculator({ onPlanRecommendation }: ROICalculatorProps) {
  const [formData, setFormData] = useState({
    monthlyAttendances: "",
    averageTimePerAttendance: "",
    employeeHourlyCost: "",
    currentMonthlyCost: "",
    businessType: "",
    growthProjection: ""
  })

  const [results, setResults] = useState<{
    monthlySavings: number
    annualSavings: number
    roi: number
    paybackPeriod: number
    recommendedPlan: string
    efficiencyGain: number
  } | null>(null)

  const [isCalculating, setIsCalculating] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setResults(null)
  }

  const calculateROI = async () => {
    setIsCalculating(true)
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const monthlyAttendances = parseFloat(formData.monthlyAttendances) || 0
    const averageTimePerAttendance = parseFloat(formData.averageTimePerAttendance) || 0
    const employeeHourlyCost = parseFloat(formData.employeeHourlyCost) || 0
    const currentMonthlyCost = parseFloat(formData.currentMonthlyCost) || 0
    const growthProjection = parseFloat(formData.growthProjection) || 0

    // Calculate current costs
    const hoursPerMonth = (monthlyAttendances * averageTimePerAttendance) / 60
    const laborCostPerMonth = hoursPerMonth * employeeHourlyCost
    const totalCurrentCost = currentMonthlyCost + laborCostPerMonth

    // Calculate AI agent costs and savings
    const aiEfficiencyGain = 0.75 // 75% efficiency improvement
    const aiCostMultiplier = 0.3 // AI costs 30% of current operation
    const newMonthlyCost = totalCurrentCost * aiCostMultiplier
    const monthlySavings = totalCurrentCost - newMonthlyCost
    const annualSavings = monthlySavings * 12

    // Calculate ROI
    const investment = newMonthlyCost * 12 // Annual AI cost
    const roi = ((annualSavings - investment) / investment) * 100
    const paybackPeriod = investment / monthlySavings

    // Determine recommended plan based on volume
    let recommendedPlan = "Iniciante"
    if (monthlyAttendances > 5000) {
      recommendedPlan = "Empresarial"
    } else if (monthlyAttendances > 2000) {
      recommendedPlan = "Profissional"
    } else if (monthlyAttendances > 1000) {
      recommendedPlan = "Iniciante"
    } else {
      recommendedPlan = "Iniciante"
    }

    const efficiencyGain = aiEfficiencyGain * 100

    setResults({
      monthlySavings,
      annualSavings,
      roi,
      paybackPeriod,
      recommendedPlan,
      efficiencyGain
    })

    setIsCalculating(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Iniciante": return "bg-blue-100 text-blue-800 border-blue-300"
      case "Profissional": return "bg-orange-100 text-orange-800 border-orange-300"
      case "Empresarial": return "bg-purple-100 text-purple-800 border-purple-300"
      default: return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-blue-600" />
              <div>
                <span>Calculadora de ROI</span>
                <div className="text-sm font-normal text-muted-foreground">(retorno sobre investimentos)</div>
              </div>
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo para calcular o retorno sobre investimento com nossos agentes de IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessType">Tipo de Negócio</Label>
                <Select onValueChange={(value) => handleInputChange("businessType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu tipo de negócio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="varejo">Varejo</SelectItem>
                    <SelectItem value="industria">Indústria</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="monthlyAttendances">Atendimentos por mês</Label>
                <Input
                  id="monthlyAttendances"
                  type="number"
                  placeholder="Ex: 1000"
                  value={formData.monthlyAttendances}
                  onChange={(e) => handleInputChange("monthlyAttendances", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="averageTimePerAttendance">Tempo médio por atendimento (minutos)</Label>
                <Input
                  id="averageTimePerAttendance"
                  type="number"
                  placeholder="Ex: 15"
                  value={formData.averageTimePerAttendance}
                  onChange={(e) => handleInputChange("averageTimePerAttendance", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="employeeHourlyCost">Custo hora/funcionário (R$)</Label>
                <Input
                  id="employeeHourlyCost"
                  type="number"
                  placeholder="Ex: 50"
                  value={formData.employeeHourlyCost}
                  onChange={(e) => handleInputChange("employeeHourlyCost", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="currentMonthlyCost">Custos mensais atuais (R$)</Label>
                <Input
                  id="currentMonthlyCost"
                  type="number"
                  placeholder="Ex: 5000"
                  value={formData.currentMonthlyCost}
                  onChange={(e) => handleInputChange("currentMonthlyCost", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="growthProjection">Projeção de crescimento anual (%)</Label>
                <Input
                  id="growthProjection"
                  type="number"
                  placeholder="Ex: 20"
                  value={formData.growthProjection}
                  onChange={(e) => handleInputChange("growthProjection", e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={calculateROI} 
              className="w-full" 
              disabled={isCalculating || !formData.monthlyAttendances}
            >
              {isCalculating ? "Calculando..." : "Calcular ROI"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <span>Resultados da Projeção</span>
            </CardTitle>
            <CardDescription>
              Veja como nossos agentes de IA podem transformar seus resultados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Economia Mensal</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">
                      {formatCurrency(results.monthlySavings)}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Economia Anual</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatCurrency(results.annualSavings)}
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">ROI</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">
                      {formatPercentage(results.roi)}
                    </div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">Payback</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-900">
                      {results.paybackPeriod.toFixed(1)} meses
                    </div>
                  </div>
                </div>

                {/* Efficiency Gain */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm opacity-90">Ganho de Eficiência</div>
                      <div className="text-3xl font-bold">{formatPercentage(results.efficiencyGain)}</div>
                    </div>
                    <BarChart3 className="h-12 w-12 opacity-80" />
                  </div>
                </div>

                {/* Recommended Plan */}
                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">Plano Recomendado</div>
                    <Badge className={`text-lg px-4 py-2 ${getPlanColor(results.recommendedPlan)}`}>
                      {results.recommendedPlan}
                    </Badge>
                    <div className="mt-3 text-sm text-gray-600">
                      Baseado no seu volume de {formData.monthlyAttendances} atendimentos/mês
                    </div>
                    <Button 
                      className="mt-3" 
                      onClick={() => onPlanRecommendation?.(results.recommendedPlan)}
                    >
                      Ver Detalhes do Plano
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="space-y-2">
                  <h4 className="font-semibold">Benefícios Adicionais:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Atendimento 24/7 sem custos extras</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Escalabilidade automática</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Análise de dados em tempo real</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Integração com seus sistemas</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Preencha os dados ao lado para ver sua projeção de ROI</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}