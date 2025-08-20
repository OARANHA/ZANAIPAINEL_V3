'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, RefreshCw, CheckCircle, XCircle, ExternalLink, Users, Workflow } from 'lucide-react'

export default function FlowiseSyncPage() {
  const [canvasId, setCanvasId] = useState('d84b3578-daff-4161-bbe1-451f87f11423')
  const [chatflowId, setChatflowId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('sync') // sync, assistants, chatflows

  const testConnection = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/flowise-external-sync?action=test_connection`, {
        method: 'GET'
      })
      const data = await response.json()
      setResult(data)
      
      if (!response.ok) {
        setError(data.error || 'Erro ao testar conexão')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const syncCanvas = async () => {
    if (!canvasId) {
      setError('ID do canvas é obrigatório')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/flowise-external-sync?action=sync_canvas&canvasId=${canvasId}`, {
        method: 'GET'
      })
      const data = await response.json()
      setResult(data)
      
      if (!response.ok) {
        setError(data.error || 'Erro ao sincronizar canvas')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getHealth = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/flowise-external-sync?action=get_health`, {
        method: 'GET'
      })
      const data = await response.json()
      setResult(data)
      
      if (!response.ok) {
        setError(data.error || 'Erro ao obter status de saúde')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getAssistants = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/flowise-external-sync?action=get_assistants`, {
        method: 'GET'
      })
      const data = await response.json()
      setResult(data)
      
      if (!response.ok) {
        setError(data.error || 'Erro ao obter assistants')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getChatflows = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/flowise-external-sync?action=get_workflows`, {
        method: 'GET'
      })
      const data = await response.json()
      setResult(data)
      
      if (!response.ok) {
        setError(data.error || 'Erro ao obter chatflows')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getChatflow = async () => {
    if (!chatflowId) {
      setError('ID do chatflow é obrigatório')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/flowise-external-sync?action=get_chatflow&chatflowId=${chatflowId}`, {
        method: 'GET'
      })
      const data = await response.json()
      setResult(data)
      
      if (!response.ok) {
        setError(data.error || 'Erro ao obter chatflow')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const syncCanvasNodes = async () => {
    if (!canvasId) {
      setError('ID do canvas é obrigatório')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/flowise-external-sync?action=sync_canvas_nodes&canvasId=${canvasId}`)
      const data = await response.json()
      setResult(data)
      
      if (!response.ok) {
        setError(data.error || 'Erro ao sincronizar nós do canvas')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Flowise Sincronização Externa</h1>
          <p className="text-muted-foreground">
            Ferramenta para sincronizar canvases, assistants e chatflows do Flowise hospedados em instâncias externas
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sync" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Sincronização
            </TabsTrigger>
            <TabsTrigger value="assistants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assistants
            </TabsTrigger>
            <TabsTrigger value="chatflows" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Chatflows
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sync" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Configuração
                  </CardTitle>
                  <CardDescription>
                    Configure a conexão com a instância externa do Flowise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="baseUrl">URL Base</Label>
                    <Input
                      id="baseUrl"
                      value="https://aaranha-zania.hf.space"
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="canvasId">ID do Canvas</Label>
                    <Input
                      id="canvasId"
                      value={canvasId}
                      onChange={(e) => setCanvasId(e.target.value)}
                      placeholder="Digite o ID do canvas"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={testConnection} 
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Testar Conexão
                    </Button>
                    
                    <Button 
                      onClick={getHealth} 
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Verificar Saúde
                    </Button>
                  </div>

                  <Button 
                    onClick={syncCanvas} 
                    disabled={isLoading || !canvasId}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Sincronizar Canvas
                  </Button>

                  <Button 
                    onClick={syncCanvasNodes} 
                    disabled={isLoading || !canvasId}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Sincronizar Nós do Canvas
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resultado</CardTitle>
                  <CardDescription>
                    Status das operações de sincronização
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {result && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "Sucesso" : "Falha"}
                        </Badge>
                      </div>

                      <div>
                        <Label>Mensagem</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.message}
                        </p>
                      </div>

                      {result.data && (
                        <div>
                          <Label>Dados</Label>
                          <Textarea
                            value={JSON.stringify(result.data, null, 2)}
                            readOnly
                            className="mt-1 h-32 font-mono text-xs"
                          />
                        </div>
                      )}

                      {result.error && (
                        <div>
                          <Label>Erro</Label>
                          <p className="text-sm text-red-500 mt-1">
                            {result.error}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!result && !error && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma operação realizada ainda
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Informações do Canvas</CardTitle>
                <CardDescription>
                  Link direto para o canvas externo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label>URL do Canvas</Label>
                    <Input
                      value={`https://aaranha-zania.hf.space/canvas/${canvasId}`}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://aaranha-zania.hf.space/canvas/${canvasId}`, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir Canvas Externo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistants" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Assistants
                  </CardTitle>
                  <CardDescription>
                    Gerenciar assistants da instância externa do Flowise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={getAssistants} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Users className="mr-2 h-4 w-4" />
                    )}
                    Listar Assistants
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resultado</CardTitle>
                  <CardDescription>
                    Dados dos assistants obtidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {result && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "Sucesso" : "Falha"}
                        </Badge>
                      </div>

                      <div>
                        <Label>Mensagem</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.message}
                        </p>
                      </div>

                      {result.data && (
                        <div>
                          <Label>Dados</Label>
                          <Textarea
                            value={JSON.stringify(result.data, null, 2)}
                            readOnly
                            className="mt-1 h-48 font-mono text-xs"
                          />
                        </div>
                      )}

                      {result.error && (
                        <div>
                          <Label>Erro</Label>
                          <p className="text-sm text-red-500 mt-1">
                            {result.error}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!result && !error && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma operação realizada ainda
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chatflows" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Workflow className="h-5 w-5" />
                    Chatflows
                  </CardTitle>
                  <CardDescription>
                    Gerenciar chatflows da instância externa do Flowise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={getChatflows} 
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Workflow className="mr-2 h-4 w-4" />
                    )}
                    Listar Chatflows
                  </Button>

                  <div>
                    <Label htmlFor="chatflowId">ID do Chatflow</Label>
                    <Input
                      id="chatflowId"
                      value={chatflowId}
                      onChange={(e) => setChatflowId(e.target.value)}
                      placeholder="Digite o ID do chatflow"
                    />
                  </div>

                  <Button 
                    onClick={getChatflow} 
                    disabled={isLoading || !chatflowId}
                    className="w-full"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Workflow className="mr-2 h-4 w-4" />
                    )}
                    Obter Chatflow
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resultado</CardTitle>
                  <CardDescription>
                    Dados dos chatflows obtidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {result && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "Sucesso" : "Falha"}
                        </Badge>
                      </div>

                      <div>
                        <Label>Mensagem</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.message}
                        </p>
                      </div>

                      {result.data && (
                        <div>
                          <Label>Dados</Label>
                          <Textarea
                            value={JSON.stringify(result.data, null, 2)}
                            readOnly
                            className="mt-1 h-48 font-mono text-xs"
                          />
                        </div>
                      )}

                      {result.error && (
                        <div>
                          <Label>Erro</Label>
                          <p className="text-sm text-red-500 mt-1">
                            {result.error}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {!result && !error && (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma operação realizada ainda
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}