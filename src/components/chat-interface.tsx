"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  Bot, 
  User,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
}

const demoMessages: Message[] = [
  {
    id: "1",
    type: "agent",
    content: "Olá! Sou seu agente de IA especializado. Como posso ajudar você hoje?",
    timestamp: new Date(Date.now() - 60000)
  }
]

interface ChatInterfaceProps {
  agentTitle?: string
  agentDescription?: string
  suggestedQuestions?: string[]
}

const defaultQuestions = [
  "Como você pode ajudar meu negócio?",
  "Quais são seus principais recursos?",
  "Me dê um exemplo de análise de dados",
  "Como funciona a automação de processos?"
]

export function ChatInterface({ 
  agentTitle = "Agente Analista", 
  agentDescription = "Analisando dados e gerando insights automaticamente",
  suggestedQuestions = defaultQuestions 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(demoMessages)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [interactionCount, setInteractionCount] = useState(0)

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim()
    if (textToSend && !isLoading) {
      // Check if interaction limit reached
      if (interactionCount >= 4) {
        const limitMessage: Message = {
          id: Date.now().toString(),
          type: 'agent',
          content: "Agradecemos seu interesse em nosso agente de IA! Para continuar explorando todas as funcionalidades e ter acesso ilimitado, por favor, entre em contato com nossa equipe de vendas. Estamos à disposição para apresentar nossas soluções completas! 🚀",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, limitMessage])
        return
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: textToSend,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      setInputValue("")
      setIsLoading(true)
      setInteractionCount(prev => prev + 1)

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
          content: textToSend
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

  const handleQuestionClick = (question: string) => {
    handleSend(question)
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <span>{agentTitle}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Online
            </Badge>
            {interactionCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {interactionCount}/4 interações
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>
          {agentDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[350px]">
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
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
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
          
          {/* Suggested Questions - Only show if no user messages yet */}
          {messages.length === 1 && !isLoading && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">Perguntas sugeridas:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="text-left p-3 rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-colors text-sm text-muted-foreground hover:text-purple-700"
                  >
                    {question}
                  </button>
                ))}
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
            className="flex-1 px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
            rows={2}
            disabled={isLoading || interactionCount >= 4}
          />
          <Button 
            onClick={() => handleSend()}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 self-end"
            disabled={isLoading || !inputValue.trim() || interactionCount >= 4}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {interactionCount >= 4 && (
          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground">
              Você atingiu o limite de interações na demonstração. 
              <Link href="/contato" className="text-purple-600 hover:text-purple-700 font-medium">
                {" "}Fale com nossas vendas
              </Link>{" "}
              para acesso ilimitado!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}