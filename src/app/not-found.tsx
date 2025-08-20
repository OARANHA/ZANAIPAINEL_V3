import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Home, 
  Search, 
  Mail, 
  Zap,
  AlertTriangle,
  RefreshCw,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950 dark:to-orange-950">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Error Badge */}
            <Badge variant="secondary" className="mb-6 text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Erro 404
            </Badge>
            
            {/* Main Error Message */}
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-orange-600 bg-clip-text text-transparent">
              404
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Página Não Encontrada
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Parece que a página que você está procurando não existe ou foi movida. 
              Não se preocupe, estamos aqui para ajudar você a encontrar o que precisa.
            </p>
            
            {/* Error Illustration Card */}
            <Card className="mb-12 mx-auto max-w-md bg-gradient-to-br from-blue-100 to-orange-100 dark:from-blue-900/20 dark:to-orange-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-orange-600 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-blue-800 dark:text-blue-200">
                  Ops! Algo deu errado
                </CardTitle>
                <CardDescription className="text-blue-600 dark:text-blue-400">
                  A URL que você tentou acessar não está disponível
                </CardDescription>
              </CardHeader>
            </Card>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg" asChild>
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Voltar para o Início
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-semibold px-8 py-4 text-lg" asChild>
                <Link href="/contato">
                  <Mail className="mr-2 h-5 w-5" />
                  Falar com Suporte
                </Link>
              </Button>
            </div>
            
            {/* Helpful Suggestions */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link href="/planos">
                  <CardHeader className="text-center">
                    <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Ver Planos</CardTitle>
                    <CardDescription>
                      Conheça nossos planos de agentes de IA
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link href="/demonstracao">
                  <CardHeader className="text-center">
                    <Search className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Demonstração</CardTitle>
                    <CardDescription>
                      Veja nossos agentes em ação
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
              
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" asChild>
                <Link href="/agentes">
                  <CardHeader className="text-center">
                    <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <CardTitle className="text-lg">Nossos Agentes</CardTitle>
                    <CardDescription>
                      Conheça nossas soluções de IA
                    </CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            </div>
            
            {/* Quick Search */}
            <Card className="max-w-2xl mx-auto bg-muted/30 dark:bg-muted/10">
              <CardHeader>
                <CardTitle className="text-center text-lg">
                  O que você estava procurando?
                </CardTitle>
                <CardDescription className="text-center">
                  Aqui estão algumas páginas populares que podem ajudar:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    Início
                  </Link>
                  <Link href="/planos" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    Planos
                  </Link>
                  <Link href="/demonstracao" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    Demonstração
                  </Link>
                  <Link href="/contato" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    Contato
                  </Link>
                  <Link href="/agentes" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    Agentes
                  </Link>
                  <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="http://localhost:3001/login" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    Área do Cliente
                  </Link>
                  <Link href="/api/health" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    API Status
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Footer Message */}
            <div className="mt-12 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Ainda precisa de ajuda?
              </p>
              <Button variant="link" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" asChild>
                <Link href="/contato">
                  Entre em contato com nossa equipe de suporte
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}