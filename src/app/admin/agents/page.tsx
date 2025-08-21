'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  Brain, 
  Plus, 
  Settings, 
  Play, 
  Archive, 
  Loader2, 
  Search,
  Filter,
  Sparkles,
  Zap,
  Target,
  Code,
  Users,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Rocket,
  Cpu,
  Database,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import EditAgentDialog from '@/components/agents/EditAgentDialog';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import AgentActionsMenu from '@/components/agents/AgentActionsMenu';
import ExportFormatDialog from '@/components/agents/ExportFormatDialog';
import FunctionalCard from '@/components/FunctionalCard';
import MainLayout from '@/components/layout/MainLayout';
import ElegantCard from '@/components/ui/ElegantCard';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  roleDefinition: string;
  groups: any[];
  customInstructions: string;
  workspaceId: string;
  workspace?: {
    name: string;
    description: string;
  };
  config?: string;
  knowledge?: string;
  status?: 'active' | 'inactive' | 'training';
  chatflowUrl?: string;
  flowiseId?: string;
  exportedToFlowise?: boolean;
  exportedAt?: string;
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function AgentsPage() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'functional' | 'traditional'>('functional');
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    type: 'template' as const,
    config: '',
    knowledge: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadWorkspaces(), loadAgents()]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkspaces = async () => {
    try {
      console.log('Carregando workspaces...');
      const response = await fetch('/admin/api/workspaces');
      console.log('Resposta da API de workspaces:', response.status, response.statusText);
      if (response.ok) {
        const data = await response.json();
        console.log('Dados de workspaces recebidos:', data);
        setWorkspaces(data);
        if (data.length > 0) {
          setSelectedWorkspace(data[0].id);
        }
      } else {
        console.error('Erro na resposta da API de workspaces:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro ao carregar workspaces:', error);
    }
  };

  const loadAgents = async () => {
    try {
      console.log('Carregando agentes...');
      const response = await fetch('/admin/api/agents');
      console.log('Resposta da API:', response.status, response.statusText);
      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos da API:', data);
        console.log('Vamos chamar setAgents com:', data.agents || []);
        setAgents(data.agents || []);
      } else {
        console.error('Erro na resposta da API:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
    }
  };

  const createAgent = async () => {
    if (!newAgent.name || !selectedWorkspace) return;

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAgent,
          workspaceId: selectedWorkspace,
        }),
      });

      if (response.ok) {
        await loadAgents();
        setIsCreateAgentOpen(false);
        setNewAgent({
          name: '',
          description: '',
          type: 'template',
          config: '',
          knowledge: ''
        });
      }
    } catch (error) {
      console.error('Erro ao criar agente:', error);
    }
  };

  const toggleArchiveAgent = async (agent: Agent) => {
    try {
      const response = await fetch('/admin/api/agents/' + agent.id + '/archive', {
        method: 'PATCH',
      });

      if (response.ok) {
        await loadAgents();
      }
    } catch (error) {
      console.error('Erro ao arquivar/desarquivar agente:', error);
    }
  };

  const executeAgent = async (agent: Agent) => {
    try {
      const response = await fetch('/admin/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agent.id,
          input: 'Executar agente',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Agente executado com sucesso!",
          description: `O agente "${agent.name}" foi executado e retornou um resultado.`,
          variant: "default",
        });
        console.log('Agente executado com sucesso:', result);
      } else {
        toast({
          title: "Erro ao executar agente",
          description: `Não foi possível executar o agente "${agent.name}".`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao executar agente",
        description: `Ocorreu um erro ao tentar executar o agente "${agent.name}".`,
        variant: "destructive",
      });
      console.error('Erro ao executar agente:', error);
    }
  };

  const duplicateAgent = async (agent: Agent) => {
    try {
      // Gerar um novo slug baseado no nome
      const newSlug = agent.slug + '-copy-' + Date.now();
      
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: agent.name,
          description: agent.description,
          type: agent.type,
          config: agent.config,
          knowledge: agent.knowledge,
          workspaceId: agent.workspaceId,
          slug: newSlug,
        }),
      });

      if (response.ok) {
        await loadAgents();
        toast({
          title: "Agente duplicado com sucesso!",
          description: `O agente "${agent.name}" foi duplicado com sucesso.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Erro ao duplicar agente",
          description: `Não foi possível duplicar o agente "${agent.name}".`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao duplicar agente",
        description: `Ocorreu um erro ao tentar duplicar o agente "${agent.name}".`,
        variant: "destructive",
      });
      console.error('Erro ao duplicar agente:', error);
    }
  };

  const exportAgent = async (agent: Agent, format: 'json' | 'markdown' = 'json') => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const safeName = agent.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      if (format === 'json') {
        const exportData = {
          name: agent.name,
          description: agent.description,
          type: agent.type,
          config: agent.config,
          knowledge: agent.knowledge,
          customInstructions: agent.customInstructions,
          roleDefinition: agent.roleDefinition,
          groups: agent.groups,
          exportedAt: new Date().toISOString(),
          version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeName}_export_${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Agente exportado com sucesso!",
          description: `O agente "${agent.name}" foi exportado como arquivo JSON.`,
          variant: "default",
        });
      } else if (format === 'markdown') {
        const markdownContent = generateMarkdownExport(agent);
        const dataBlob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${safeName}_export_${timestamp}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "Agente exportado com sucesso!",
          description: `O agente "${agent.name}" foi exportado como arquivo Markdown.`,
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao exportar agente",
        description: `Ocorreu um erro ao tentar exportar o agente "${agent.name}".`,
        variant: "destructive",
      });
      console.error('Erro ao exportar agente:', error);
    }
  };

  const generateMarkdownExport = (agent: Agent): string => {
    const timestamp = new Date().toLocaleString('pt-BR');
    
    return `# ${agent.name}

> **Tipo:** ${agent.type === 'template' ? 'Template' : agent.type === 'custom' ? 'Personalizado' : 'Composto'}  
> **Exportado em:** ${timestamp}  
> **Versão:** 1.0

## Descrição

${agent.description || 'Nenhuma descrição fornecida.'}

---

## Definição de Papel

${agent.roleDefinition || `Você é um agente especialista chamado ${agent.name}.`}

---

## Instruções Personalizadas

${agent.customInstructions || 'Nenhuma instrução personalizada fornecida.'}

---

## Configuração

\`\`\`json
${agent.config || '{}'}
\`\`\`

---

## Conhecimento Base

${agent.knowledge ? `

\`\`\`markdown
${agent.knowledge}
\`\`\`
` : 'Nenhum conhecimento base fornecido.'}

---

## Grupos e Permissões

${agent.groups && agent.groups.length > 0 ? `
\`\`\`json
${JSON.stringify(agent.groups, null, 2)}
\`\`\`
` : 'Nenhum grupo ou permissão definido.'}

---

## Metadados

- **ID:** ${agent.id}
- **Slug:** ${agent.slug || 'N/A'}
- **Tipo:** ${agent.type}
- **Workspace ID:** ${agent.workspaceId}
- **Data de Exportação:** ${new Date().toISOString()}

---

*Este arquivo foi gerado automaticamente pelo sistema Zanai Project.*
`;
  };

  // Função para extrair informações da configuração do agente
  const extractAgentInfo = (agent: Agent) => {
    let llmModel = 'gpt-4o-mini'; // padrão
    let temperature = 0.7;
    let hasTools = false;
    let hasKnowledge = false;

    try {
      if (agent.config) {
        // Tentar fazer parse da configuração como JSON
        const config = JSON.parse(agent.config);
        llmModel = config.model || config.modelName || llmModel;
        temperature = config.temperature || temperature;
        hasTools = !!(config.tools && config.tools.length > 0);
      }
    } catch (error) {
      // Se não for JSON, tentar extrair do YAML/texto
      const configText = agent.config || '';
      const modelMatch = configText.match(/(?:model|modelName):\s*([^\n\s]+)/i);
      const tempMatch = configText.match(/temperature:\s*([0-9.]+)/i);
      
      if (modelMatch) llmModel = modelMatch[1];
      if (tempMatch) temperature = parseFloat(tempMatch[1]);
      
      hasTools = configText.toLowerCase().includes('tools') || configText.toLowerCase().includes('function');
    }

    hasKnowledge = !!(agent.knowledge && agent.knowledge.trim().length > 0);

    return {
      llmModel,
      temperature,
      hasTools,
      hasKnowledge
    };
  };

  const shareAgent = async (agent: Agent) => {
    try {
      // Simular compartilhamento - gerar URL
      const shareUrl = `${window.location.origin}/shared/agent/${agent.id}`;
      
      // Copiar para clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Link copiado!",
        description: `O link de compartilhamento do agente "${agent.name}" foi copiado para a área de transferência.`,
        variant: "default",
      });
      
      console.log('Link de compartilhamento copiado:', shareUrl);
    } catch (error) {
      toast({
        title: "Erro ao compartilhar agente",
        description: `Ocorreu um erro ao tentar compartilhar o agente "${agent.name}".`,
        variant: "destructive",
      });
      console.error('Erro ao compartilhar agente:', error);
    }
  };

  const deleteAgent = async (agent: Agent) => {
    try {
      const response = await fetch('/admin/api/agents/' + agent.id, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadAgents();
        toast({
          title: "Agente excluído com sucesso!",
          description: `O agente "${agent.name}" foi excluído permanentemente.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Erro ao excluir agente",
          description: `Não foi possível excluir o agente "${agent.name}".`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao excluir agente",
        description: `Ocorreu um erro ao tentar excluir o agente "${agent.name}".`,
        variant: "destructive",
      });
      console.error('Erro ao excluir agente:', error);
    }
  };

  // Event handlers para os diálogos e ações
  const handleViewDetails = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsDetailsDialogOpen(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsEditDialogOpen(true);
  };

  const handleExecute = (agent: Agent) => {
    executeAgent(agent);
  };

  const handleDuplicate = (agent: Agent) => {
    duplicateAgent(agent);
  };

  const handleExport = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsExportDialogOpen(true);
  };

  const handleExportWithFormat = async (format: 'json' | 'markdown') => {
    if (selectedAgent) {
      await exportAgent(selectedAgent, format);
    }
  };

  const handleShare = (agent: Agent) => {
    shareAgent(agent);
  };

  const handleArchive = (agent: Agent) => {
    toggleArchiveAgent(agent);
  };

  const handleDelete = (agent: Agent) => {
    deleteAgent(agent);
  };

  const handleExportToFlowise = async (agent: Agent) => {
    try {
      const response = await fetch('/admin/api/agents/export-to-flowise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: agent.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Agente exportado para Flowise!",
          description: `O agente "${agent.name}" foi exportado com sucesso.`,
          variant: "default",
        });
        console.log('Agente exportado para Flowise:', result);
      } else {
        toast({
          title: "Erro ao exportar para Flowise",
          description: `Não foi possível exportar o agente "${agent.name}" para o Flowise.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao exportar para Flowise",
        description: `Ocorreu um erro ao tentar exportar o agente "${agent.name}".`,
        variant: "destructive",
      });
      console.error('Erro ao exportar para Flowise:', error);
    }
  };

  // Filtrar agentes baseado na busca e filtros
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                          (filterType === 'active' && agent.status === 'active') ||
                          (filterType === 'inactive' && agent.status === 'inactive') ||
                          (filterType === 'template' && agent.type === 'template') ||
                          (filterType === 'custom' && agent.type === 'custom') ||
                          (filterType === 'composed' && agent.type === 'composed');

    return matchesSearch && matchesFilter;
  });

  const isArchived = (agent: Agent) => agent.status === 'archived';

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Agentes Inteligentes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie e execute seus agentes de IA com ações contextuais
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Toggle View Mode */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'traditional' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('traditional')}
                >
                  <ToggleLeft className="w-4 h-4 mr-1" />
                  Tradicional
                </Button>
                <Button
                  variant={viewMode === 'functional' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('functional')}
                >
                  <ToggleRight className="w-4 h-4 mr-1" />
                  Funcional
                </Button>
              </div>
              
              <Dialog open={isCreateAgentOpen} onOpenChange={setIsCreateAgentOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Agente
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar agentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Agentes</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="template">Templates</SelectItem>
              <SelectItem value="custom">Personalizados</SelectItem>
              <SelectItem value="composed">Compostos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Carregando agentes...</p>
            </div>
          </div>
        )}

        {/* Agents Grid */}
        {!isLoading && (
          <>
            {viewMode === 'functional' ? (
              // Functional Cards View
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => (
                  <FunctionalCard
                    key={agent.id}
                    agent={{
                      id: agent.id,
                      name: agent.name,
                      description: agent.description,
                      type: agent.type,
                      config: agent.config,
                      knowledge: agent.knowledge,
                      status: agent.status
                    }}
                  />
                ))}
              </div>
            ) : (
              // Traditional Cards View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => {
                  const agentInfo = extractAgentInfo(agent);
                  const isArchivedStatus = isArchived(agent);

                  return (
                    <ElegantCard
                      key={agent.id}
                      className={`hover:shadow-lg transition-all duration-300 ${
                        isArchivedStatus ? 'opacity-60' : ''
                      }`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                              <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{agent.name}</CardTitle>
                              <CardDescription className="text-sm">
                                {agent.workspace?.name}
                              </CardDescription>
                            </div>
                          </div>
                          <AgentActionsMenu
                            agent={agent}
                            onExecute={handleExecute}
                            onEdit={handleEditAgent}
                            onDuplicate={handleDuplicate}
                            onExport={handleExport}
                            onShare={handleShare}
                            onArchive={handleArchive}
                            onDelete={handleDelete}
                            onExportToFlowise={handleExportToFlowise}
                          />
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {agent.description}
                        </p>

                        <div className="space-y-3">
                          {/* Agent Info */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Cpu className="w-3 h-3 mr-1" />
                              {agentInfo.llmModel}
                            </span>
                            <span className="flex items-center">
                              <Database className="w-3 h-3 mr-1" />
                              {agentInfo.temperature}
                            </span>
                          </div>

                          {/* Status and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={agent.status === 'active' ? 'default' : 'secondary'}
                                className={agent.status === 'active' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }
                              >
                                {agent.status === 'active' ? 'Ativo' : agent.status === 'inactive' ? 'Inativo' : 'Em treinamento'}
                              </Badge>
                              
                              {agentInfo.hasTools && (
                                <Badge variant="outline" className="text-xs">
                                  <Code className="w-3 h-3 mr-1" />
                                  Tools
                                </Badge>
                              )}
                              
                              {agentInfo.hasKnowledge && (
                                <Badge variant="outline" className="text-xs">
                                  <Database className="w-3 h-3 mr-1" />
                                  Knowledge
                                </Badge>
                              )}
                            </div>

                            <div className="flex space-x-1">
                              {agent.chatflowUrl && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="h-8 text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => window.open(agent.chatflowUrl, '_blank')}
                                >
                                  <Rocket className="w-4 h-4 mr-1" />
                                  Chat
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8"
                                onClick={() => handleEditAgent(agent)}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </ElegantCard>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {filteredAgents.length === 0 && (
              <div className="text-center py-16">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center">
                    <Brain className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Search className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  {viewMode === 'functional' ? 'Nenhum agente funcional encontrado' : 'Nenhum agente encontrado'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery || filterType !== 'all' 
                    ? 'Nenhum agente corresponde aos seus filtros. Tente ajustar sua busca ou filtros.'
                    : viewMode === 'functional'
                    ? 'Crie seu primeiro agente funcional para começar a transformar seus projetos com o poder da IA.'
                    : 'Crie seu primeiro agente inteligente para começar a transformar seus projetos com o poder da IA.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {(searchQuery || filterType !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('all');
                      }}
                      className="h-11"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Limpar Filtros
                    </Button>
                  )}
                  <Dialog open={isCreateAgentOpen} onOpenChange={setIsCreateAgentOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg px-6">
                        <Plus className="w-5 h-5 mr-2" />
                        Criar Primeiro Agente
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            )}
          </>
        )}

        {/* Create Agent Dialog */}
        <Dialog open={isCreateAgentOpen} onOpenChange={setIsCreateAgentOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span>Criar Novo Agente</span>
              </DialogTitle>
              <DialogDescription>
                Crie um novo agente inteligente com capacidades específicas
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Agente</Label>
                  <Input
                    id="name"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    placeholder="Ex: Consultor de Negócios"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <RadioGroup 
                    value={newAgent.type} 
                    onValueChange={(value) => setNewAgent({ ...newAgent, type: value as 'template' | 'custom' | 'composed' })}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="template" id="template" />
                      <Label htmlFor="template">Template</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom">Personalizado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="composed" id="composed" />
                      <Label htmlFor="composed">Composto</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                  placeholder="Descreva as funcionalidades e propósito do agente..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace</Label>
                <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateAgentOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={createAgent} disabled={!newAgent.name || !selectedWorkspace}>
                  Criar Agente
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialogs */}
        {selectedAgent && (
          <>
            <AgentDetailsDialog
              agent={selectedAgent}
              open={isDetailsDialogOpen}
              onOpenChange={setIsDetailsDialogOpen}
              onExecute={handleExecute}
              onEdit={handleEditAgent}
            />
            
            <EditAgentDialog
              agent={selectedAgent}
              open={isEditDialogOpen}
              onOpenChange={(open) => {
                setIsEditDialogOpen(open);
                if (!open) {
                  setSelectedAgent(null);
                }
              }}
              onAgentUpdated={loadAgents}
            />
            
            <ExportFormatDialog
              agent={selectedAgent}
              isOpen={isExportDialogOpen}
              onClose={() => setIsExportDialogOpen(false)}
              onExport={handleExportWithFormat}
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}