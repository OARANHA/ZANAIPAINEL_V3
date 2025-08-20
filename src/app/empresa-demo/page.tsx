"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  Phone, 
  BarChart3, 
  Link, 
  Settings, 
  Plus,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  TrendingUp,
  Activity,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  plan: string;
  status: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  clientType: string;
  sector: string;
}

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  links: {
    chat: string;
    api: string;
    whatsapp?: string;
  };
}

interface Connection {
  id: string;
  type: string;
  status: string;
  links: {
    chatUrl?: string;
    whatsappUrl?: string;
    apiUrl?: string;
    embedCode?: string;
  };
  stats: {
    totalConnections: number;
    activeConnections: number;
    totalMessages: number;
  };
}

export default function EmpresaDemoPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data para demonstração
  const [company] = useState<Company>({
    id: 'company-demo',
    name: 'Mix Tecnologia Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@mix.com.br',
    plan: 'premium',
    status: 'active'
  });

  const [clients] = useState<Client[]>([
    {
      id: 'client-1',
      name: 'Loja Exemplo',
      email: 'contato@lojaexemplo.com.br',
      clientType: 'company',
      sector: 'E-commerce'
    },
    {
      id: 'client-2',
      name: 'Consultoria XYZ',
      email: 'admin@consultoriaxyz.com',
      clientType: 'company',
      sector: 'Serviços'
    }
  ]);

  const [agents] = useState<Agent[]>([
    {
      id: 'agent-1',
      name: 'Assistente de Vendas',
      type: 'custom',
      status: 'active',
      links: {
        chat: 'http://localhost:3000/chat/agent-1',
        api: 'http://localhost:3000/api/v1/agents/agent-1/chat',
        whatsapp: 'http://localhost:3000/api/v1/agents/agent-1/whatsapp'
      }
    },
    {
      id: 'agent-2',
      name: 'Suporte Técnico',
      type: 'custom',
      status: 'active',
      links: {
        chat: 'http://localhost:3000/chat/agent-2',
        api: 'http://localhost:3000/api/v1/agents/agent-2/chat'
      }
    }
  ]);

  const [connections] = useState<Connection[]>([
    {
      id: 'conn-1',
      type: 'chat',
      status: 'active',
      links: {
        chatUrl: 'http://localhost:3000/chat/conn-1'
      },
      stats: {
        totalConnections: 150,
        activeConnections: 12,
        totalMessages: 2847
      }
    },
    {
      id: 'conn-2',
      type: 'whatsapp',
      status: 'active',
      links: {
        whatsappUrl: 'http://localhost:3000/api/v1/whatsapp/conn-2'
      },
      stats: {
        totalConnections: 89,
        activeConnections: 5,
        totalMessages: 1234
      }
    }
  ]);

  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    persona: {
      name: '',
      role: '',
      personality: '',
      expertise: [] as string[],
      communicationStyle: '',
      language: 'pt' as const
    },
    context: {
      businessDomain: '',
      industry: '',
      targetAudience: ''
    }
  });

  const createAgent = async () => {
    if (!newAgent.name || !newAgent.persona.name || !newAgent.context.businessDomain) {
      toast({
        title: "Dados Incompletos",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newAgent.name,
          description: newAgent.description,
          type: 'custom',
          persona: newAgent.persona,
          context: newAgent.context,
          rgaConfig: {
            reasoningLevel: 'advanced',
            autonomy: 'medium',
            learningCapability: true,
            decisionMaking: 'assisted'
          }
        }),
      });

      if (response.ok) {
        const agent = await response.json();
        toast({
          title: "Agente Criado!",
          description: `${agent.name} foi criado com sucesso.`,
        });
        
        // Reset form
        setNewAgent({
          name: '',
          description: '',
          persona: {
            name: '',
            role: '',
            personality: '',
            expertise: [],
            communicationStyle: '',
            language: 'pt'
          },
          context: {
            businessDomain: '',
            industry: '',
            targetAudience: ''
          }
        });
      } else {
        const error = await response.json();
        toast({
          title: "Erro na Criação",
          description: error.error || "Não foi possível criar o agente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na Criação",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createConnection = async (agentId: string, type: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          type,
          config: {
            theme: 'auto',
            welcomeMessage: 'Olá! Como posso ajudar você hoje?'
          }
        }),
      });

      if (response.ok) {
        const connection = await response.json();
        toast({
          title: "Conexão Criada!",
          description: `Link de ${type} gerado com sucesso.`,
        });
        
        // Copiar link para área de transferência
        if (connection.links.chatUrl) {
          navigator.clipboard.writeText(connection.links.chatUrl);
          toast({
            title: "Link Copiado!",
            description: "O link foi copiado para sua área de transferência.",
          });
        }
      } else {
        const error = await response.json();
        toast({
          title: "Erro na Criação",
          description: error.error || "Não foi possível criar a conexão.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na Criação",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} foi copiado para sua área de transferência.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Building2 className="w-4 h-4 mr-2" />
              DEMO EMPRESA
            </Badge>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Painel Zanai para Empresas
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Sistema completo para criação e gerenciamento de agentes IA com integração WhatsApp, 
            analytics multi-tenant e geração de links personalizados
          </p>
        </div>

        {/* Company Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>Informações da Empresa</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <p className="font-semibold">{company.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                <p className="font-semibold">{company.cnpj}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Plano</label>
                <Badge variant={company.plan === 'premium' ? 'default' : 'secondary'}>
                  {company.plan.toUpperCase()}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  ATIVO
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Agentes</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center space-x-2">
              <Link className="w-4 h-4" />
              <span>Conexões</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Total Agentes</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold">{agents.length}</p>
                  <p className="text-sm text-muted-foreground">Ativos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Building2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Total Clientes</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold">{clients.length}</p>
                  <p className="text-sm text-muted-foreground">Cadastrados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Mensagens</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold">
                    {connections.reduce((sum, conn) => sum + conn.stats.totalMessages, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Phone className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">WhatsApp</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold">
                    {connections.filter(c => c.type === 'whatsapp').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Conexões</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Crie agentes, conexões e gerencie seu sistema rapidamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveTab('agents')}
                    className="h-20 flex-col space-y-2"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Novo Agente</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('connections')}
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                  >
                    <Link className="w-6 h-6" />
                    <span>Nova Conexão</span>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('clients')}
                    variant="outline"
                    className="h-20 flex-col space-y-2"
                  >
                    <Building2 className="w-6 h-6" />
                    <span>Novo Cliente</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Agent List */}
              <Card>
                <CardHeader>
                  <CardTitle>Seus Agentes</CardTitle>
                  <CardDescription>
                    Agentes IA personalizados para sua empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{agent.name}</h3>
                          <p className="text-sm text-muted-foreground">{agent.type}</p>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          ATIVO
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(agent.links.chat, 'Link do chat')}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Chat
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(agent.links.api, 'Link da API')}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          API
                        </Button>
                        {agent.links.whatsapp && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => createConnection(agent.id, 'whatsapp')}
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            WhatsApp
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Create Agent Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Criar Novo Agente</CardTitle>
                  <CardDescription>
                    Configure um agente IA com persona e contexto personalizados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nome do Agente</label>
                    <Input
                      value={newAgent.name}
                      onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                      placeholder="Ex: Assistente de Vendas"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Descrição</label>
                    <Textarea
                      value={newAgent.description}
                      onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                      placeholder="Descreva a função do agente..."
                      className="min-h-20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nome da Persona</label>
                      <Input
                        value={newAgent.persona.name}
                        onChange={(e) => setNewAgent({
                          ...newAgent, 
                          persona: {...newAgent.persona, name: e.target.value}
                        })}
                        placeholder="Ex: Carlos"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Função</label>
                      <Input
                        value={newAgent.persona.role}
                        onChange={(e) => setNewAgent({
                          ...newAgent, 
                          persona: {...newAgent.persona, role: e.target.value}
                        })}
                        placeholder="Ex: Vendedor"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Domínio de Negócio</label>
                    <Select onValueChange={(value) => setNewAgent({
                      ...newAgent, 
                      context: {...newAgent.context, businessDomain: value}
                    })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o domínio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Saúde">Saúde</SelectItem>
                        <SelectItem value="Educação">Educação</SelectItem>
                        <SelectItem value="Financeiro">Financeiro</SelectItem>
                        <SelectItem value="Serviços">Serviços</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={createAgent}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando Agente...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Agente
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seus Clientes</CardTitle>
                <CardDescription>
                  Gerencie clientes e projetos da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{client.name}</h3>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                          <div className="flex space-x-2 mt-2">
                            <Badge variant="secondary">{client.clientType}</Badge>
                            <Badge variant="outline">{client.sector}</Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conexões Ativas</CardTitle>
                  <CardDescription>
                    Links de chat, WhatsApp e integrações API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {connections.map((connection) => (
                    <div key={connection.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold capitalize">{connection.type}</h3>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ATIVO
                          </Badge>
                        </div>
                        <div className="text-right text-sm">
                          <p>{connection.stats.activeConnections} ativos</p>
                          <p className="text-muted-foreground">{connection.stats.totalMessages} mensagens</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {connection.links.chatUrl && (
                          <div className="flex items-center space-x-2">
                            <Input value={connection.links.chatUrl} readOnly className="flex-1" />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(connection.links.chatUrl!, 'Link do chat')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        
                        {connection.links.whatsappUrl && (
                          <div className="flex items-center space-x-2">
                            <Input value={connection.links.whatsappUrl} readOnly className="flex-1" />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(connection.links.whatsappUrl!, 'Link do WhatsApp')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Conexão</CardTitle>
                  <CardDescription>
                    Gere links de chat ou WhatsApp para seus agentes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Selecione um Agente</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha um agente" />
                      </SelectTrigger>
                      <SelectContent>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de Conexão</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chat">Chat Web</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="embed">Embed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Gerar Conexão
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Taxa de Sucesso</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold">98.5%</p>
                  <p className="text-sm text-muted-foreground">Últimos 30 dias</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Tempo Médio</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold">1.2s</p>
                  <p className="text-sm text-muted-foreground">Resposta</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Crescimento</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold">+23%</p>
                  <p className="text-sm text-muted-foreground">Este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <CardTitle className="text-lg">Uptime</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold">99.9%</p>
                  <p className="text-sm text-muted-foreground">Disponibilidade</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Relatórios e Exportação</CardTitle>
                <CardDescription>
                  Baixe relatórios detalhados do seu sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <span>📊</span>
                    <span className="text-sm">Relatório PDF</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <span>📄</span>
                    <span className="text-sm">Dados CSV</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-1">
                    <span>📈</span>
                    <span className="text-sm">Analytics API</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}