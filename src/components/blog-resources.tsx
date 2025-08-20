"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  TrendingUp, 
  Lightbulb, 
  FileText, 
  Search, 
  Filter,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  MessageSquare,
  Plus,
  Loader2
} from "lucide-react"

interface BlogPost {
  id: string
  title: string
  summary: string
  content: string
  type: 'article' | 'tutorial' | 'case_study' | 'trends'
  topic: string
  audience: string
  createdAt: string
  readTime: number
  isGenerated?: boolean
}

interface BlogResourcesProps {
  onPostSelect?: (post: BlogPost) => void
}

export function BlogResources({ onPostSelect }: BlogResourcesProps) {
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'O Futuro do Atendimento ao Cliente com IA',
      summary: 'Como agentes de IA estão revolucionando o atendimento e aumentando a satisfação dos clientes em até 87%',
      content: '# O Futuro do Atendimento ao Cliente com IA\n\nA inteligência artificial está transformando radicalmente...',
      type: 'article',
      topic: 'Atendimento ao Cliente',
      audience: 'Gestores',
      createdAt: '2024-01-15',
      readTime: 8
    },
    {
      id: '2',
      title: 'Como Implementar Chatbots no WhatsApp Business',
      summary: 'Guia completo para integrar chatbots inteligentes no WhatsApp e automatizar seu atendimento',
      content: '# Como Implementar Chatbots no WhatsApp Business\n\nO WhatsApp se tornou o principal canal...',
      type: 'tutorial',
      topic: 'WhatsApp Business',
      audience: 'Desenvolvedores',
      createdAt: '2024-01-12',
      readTime: 12
    },
    {
      id: '3',
      title: 'E-commerce Reduz Custos em 40% com Automação',
      summary: 'Estudo de caso de como uma loja online implementou agentes de IA e reduziu custos operacionais',
      content: '# E-commerce Reduz Custos em 40% com Automação\n\nUma loja de e-commerce de médio porte...',
      type: 'case_study',
      topic: 'E-commerce',
      audience: 'Empreendedores',
      createdAt: '2024-01-10',
      readTime: 6
    },
    {
      id: '4',
      title: 'Tendências de IA para Pequenos Negócios em 2024',
      summary: 'As principais tendências de inteligência artificial que impactarão pequenos e médios negócios este ano',
      content: '# Tendências de IA para Pequenos Negócios em 2024\n\nO ano de 2024 promete ser...',
      type: 'trends',
      topic: 'Tendências de IA',
      audience: 'Empresários',
      createdAt: '2024-01-08',
      readTime: 10
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)
  
  const [newPost, setNewPost] = useState({
    topic: "",
    type: "article",
    audience: "Geral"
  })

  const contentTypes = [
    { id: "all", name: "Todos", icon: <BookOpen className="h-4 w-4" /> },
    { id: "article", name: "Artigos", icon: <FileText className="h-4 w-4" /> },
    { id: "tutorial", name: "Tutoriais", icon: <Target className="h-4 w-4" /> },
    { id: "case_study", name: "Estudos de Caso", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "trends", name: "Tendências", icon: <TrendingUp className="h-4 w-4" /> }
  ]

  const topics = [
    "Atendimento ao Cliente",
    "Automação", 
    "E-commerce",
    "Marketing Digital",
    "CRM",
    "WhatsApp Business",
    "Tendências de IA",
    "Vendas",
    "Produtividade",
    "Análise de Dados"
  ]

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || post.type === selectedType
    const matchesTopic = selectedTopic === "all" || post.topic === selectedTopic
    
    return matchesSearch && matchesType && matchesTopic
  })

  const generateContent = async () => {
    if (!newPost.topic) return

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: newPost.topic,
          type: newPost.type,
          audience: newPost.audience
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const generatedPost = await response.json()
      
      const newBlogPost: BlogPost = {
        id: Date.now().toString(),
        title: generatedPost.title,
        summary: generatedPost.summary,
        content: generatedPost.content,
        type: generatedPost.type,
        topic: generatedPost.topic,
        audience: generatedPost.audience,
        createdAt: new Date().toISOString(),
        readTime: Math.ceil(generatedPost.content.length / 200), // Estimate reading time
        isGenerated: true
      }

      setPosts(prev => [newBlogPost, ...prev])
      setShowGenerator(false)
      setNewPost({ topic: "", type: "article", audience: "Geral" })
      
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />
      case 'tutorial': return <Target className="h-4 w-4" />
      case 'case_study': return <BarChart3 className="h-4 w-4" />
      case 'trends': return <TrendingUp className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return "bg-blue-100 text-blue-800"
      case 'tutorial': return "bg-green-100 text-green-800"
      case 'case_study': return "bg-purple-100 text-purple-800"
      case 'trends': return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'article': return "Artigo"
      case 'tutorial': return "Tutorial"
      case 'case_study': return "Estudo de Caso"
      case 'trends': return "Tendências"
      default: return "Conteúdo"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Recursos e Conhecimento</h2>
        <p className="text-lg text-muted-foreground">
          Conteúdo exclusivo gerado por IA para impulsionar seu negócio
        </p>
      </div>

      {/* Content Generator */}
      <Card className="mb-8 border-2 border-dashed border-blue-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span>Gerador de Conteúdo IA</span>
          </CardTitle>
          <CardDescription>
            Crie conteúdo personalizado sobre qualquer tema relacionado a IA e negócios
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showGenerator ? (
            <Button 
              onClick={() => setShowGenerator(true)}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Gerar Novo Conteúdo
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Tema</label>
                  <Input
                    placeholder="Ex: Automação de vendas"
                    value={newPost.topic}
                    onChange={(e) => setNewPost(prev => ({ ...prev, topic: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select value={newPost.type} onValueChange={(value) => setNewPost(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Artigo</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="case_study">Estudo de Caso</SelectItem>
                      <SelectItem value="trends">Tendências</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Público</label>
                  <Select value={newPost.audience} onValueChange={(value) => setNewPost(prev => ({ ...prev, audience: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Geral">Geral</SelectItem>
                      <SelectItem value="Empreendedores">Empreendedores</SelectItem>
                      <SelectItem value="Gestores">Gestores</SelectItem>
                      <SelectItem value="Desenvolvedores">Desenvolvedores</SelectItem>
                      <SelectItem value="Empresários">Empresários</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={generateContent}
                  disabled={!newPost.topic || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Gerar Conteúdo
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowGenerator(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center space-x-2">
                      {type.icon}
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Todos os temas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os temas</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge className={`${getTypeColor(post.type)} flex items-center space-x-1`}>
                  {getTypeIcon(post.type)}
                  <span>{getTypeText(post.type)}</span>
                </Badge>
                {post.isGenerated && (
                  <Badge className="bg-blue-100 text-blue-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    IA
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">{post.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime} min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {post.topic}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <User className="h-3 w-3 mr-1" />
                    {post.audience}
                  </Badge>
                </div>

                <Button 
                  className="w-full" 
                  onClick={() => onPostSelect?.(post)}
                >
                  Ler Artigo
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
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Artigos Gerados</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">15k+</div>
              <div className="text-blue-100">Leitores/Mês</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Conteúdo Relevante</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Novo Conteúdo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Newsletter Exclusiva</span>
          </CardTitle>
          <CardDescription>
            Receba os melhores conteúdos sobre IA e negócios diretamente no seu e-mail
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input 
              placeholder="Seu melhor e-mail"
              className="flex-1"
            />
            <Button className="bg-blue-600 hover:bg-blue-700">
              Inscrever-se
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * Prometemos não enviar spam. Você pode cancelar a qualquer momento.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}