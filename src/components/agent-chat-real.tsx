"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bot,
  CheckCircle,
  Clock,
  Loader2,
  MessageSquare,
  Send,
  User,
  Zap
} from "lucide-react"
import { useState } from "react"

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
}

const demoMessages: Message[] = [
  {
    id: "1",
    type: "user",
    content: "Olá! Preciso de ajuda para analisar meu relatório de vendas do último trimestre.",
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: "2",
    type: "agent",
    content: "Olá! Sou seu agente de IA analista. Já estou acessando seus dados de vendas. Enquanto isso, posso adiantar que identifiquei um padrão interessante: suas vendas aumentaram 23% no setor de tecnologia, mas diminuíram 15% no setor de varejo. Gostaria que eu aprofundasse essa análise?",
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: "3",
    type: "user",
    content: "Sim, por favor. Quero entender o que causou essa diferença.",
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: "4",
    type: "agent",
    content: "Excelente! Após analisar todos os dados, descobri que: 1) O crescimento no setor de tecnologia está diretamente ligado à sua nova campanha de marketing digital, 2) A queda no varejo coincide com a entrada de um novo concorrente na região, 3) Seus clientes de tecnologia têm um LTV 40% maior que os de varejo. Recomendo focar 70% do seu orçamento no setor de tecnologia e desenvolver uma estratégia específica para recuperar o mercado de varejo. Posso elaborar um plano detalhado de ação.",
    timestamp: new Date(Date.now() - 120000)
  }
]

export function AgentChatReal() {
  const [messages, setMessages] = useState<Message[]>(demoMessages)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (inputValue.trim() && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: inputValue,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      setInputValue("")
      setIsLoading(true)

      try {
        // Prepare messages for API (convert to API format)
        const apiMessages = messages
          .filter(msg => msg.type === 'user' || msg.type === 'agent')
          .map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        
        // Add the new user message
        apiMessages.push({
          role: 'user',
          content: inputValue
        })

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: apiMessages
          })
        })

        if (!response.ok) {
          throw new Error('Failed to get response from AI')
        }

        const data = await response.json()
        
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: data.message.content,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, agentMessage])
      } catch (error) {
        console.error('Error sending message:', error)
        
        // Add error message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'agent',
          content: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Experimente Nosso Agente de IA em Ação
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Veja como nosso agente analisa dados, gera insights e toma decisões em tempo real
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Chat Interface */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  <span>Agente Analista</span>
                </CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              </div>
              <CardDescription>
                Analisando dados e gerando insights automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Digitando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border rounded-md text-sm resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 self-end"
                  disabled={isLoading || !inputValue.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agent Capabilities */}
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
            <CardContent className="space-y-4">
              <div className="space-y-3">
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

              <div className="pt-4 border-t">
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
            Este chat utiliza o modelo  ZAI para fornecer respostas 
            inteligentes e contextualizadas em tempo real. Experimente fazer perguntas 
            sobre negócios, análise de dados ou automação!
          </p>
        </div>
      </div>
    </div>
  )
}