"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User,
  Loader2,
  Sparkles
} from "lucide-react"

interface Message {
  id: string
  type: 'user' | 'agent'
  content: string
  timestamp: Date
}

interface MiniChatProps {
  title?: string
  placeholder?: string
  className?: string
  height?: string
  showHeader?: boolean
  initialMessages?: string[]
}

export function MiniChat({ 
  title = "Chat com IA", 
  placeholder = "Digite sua pergunta...",
  className = "",
  height = "300px",
  showHeader = true,
  initialMessages = []
}: MiniChatProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialMessages.length > 0) {
      return initialMessages.map((msg, index) => ({
        id: `initial-${index}`,
        type: 'agent' as const,
        content: msg,
        timestamp: new Date(Date.now() - (initialMessages.length - index) * 60000)
      }))
    }
    return []
  })
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
    <Card className={`w-full ${className}`}>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">{title}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              GLM-4.5-Flash
            </Badge>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className={showHeader ? "" : "pt-4"}>
        <div className="space-y-3">
          <div 
            className="border rounded-lg p-3 overflow-y-auto space-y-2 bg-muted/20"
            style={{ height }}
          >
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Comece uma conversa</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-2 ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-background border'
                  }`}
                >
                  <div className="flex items-center space-x-1 mb-1">
                    {message.type === 'user' ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Bot className="h-3 w-3" />
                    )}
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-background border rounded-lg p-2 max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="text-xs text-muted-foreground">Digitando...</span>
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
              placeholder={placeholder}
              className="flex-1 px-2 py-2 border rounded-md text-xs resize-none"
              rows={1}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 px-3 py-2"
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}