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
  Database
} from 'lucide-react';
import EditAgentDialog from '@/components/agents/EditAgentDialog';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import AgentActionsMenu from '@/components/agents/AgentActionsMenu';
import ExportFormatDialog from '@/components/agents/ExportFormatDialog';
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
        return result;
      } else {
        toast({
          title: "Erro ao exportar para Flowise",
          description: `Não foi possível exportar o agente "${agent.name}" para o Flowise.`,
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Erro ao exportar para Flowise",
        description: `Ocorreu um erro ao tentar exportar o agente "${agent.name}".`,
        variant: "destructive",
      });
      console.error('Erro ao exportar para Flowise:', error);
      return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'training': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'template': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'custom': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'composed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'template': return Star;
      case 'custom': return Code;
      case 'composed': return Users;
      default: return Brain;
    }
  };

  const filteredAgents = Array.isArray(agents) ? agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || agent.type === filterType;
    const matchesWorkspace = !selectedWorkspace || agent.workspaceId === selectedWorkspace;
    return matchesSearch && matchesType && matchesWorkspace;
  }) : [];

  const agentStats = {
    total: Array.isArray(agents) ? agents.length : 0,
    active: Array.isArray(agents) ? agents.filter(a => a.type === 'active').length : 0,
    templates: Array.isArray(agents) ? agents.filter(a => a.type === 'template').length : 0,
    custom: Array.isArray(agents) ? agents.filter(a => a.type === 'custom').length : 0
  };

  return (
    <MainLayout currentPath={pathname}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Agentes Inteligentes
                  </h1>
                  <p className="text-lg text-muted-foreground mt-1">
                    Gerencie seus agentes de IA com elegância e eficiência
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Select value={selectedWorkspace} onValueChange={setSelectedWorkspace}>
                <SelectTrigger className="w-full sm:w-64 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Selecione um workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{workspace.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog open={isCreateAgentOpen} onOpenChange={setIsCreateAgentOpen}>
                <DialogTrigger asChild>
                  <Button className="h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg px-6 font-medium">
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Agente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl border-slate-200 dark:border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Criar Novo Agente</DialogTitle>
                    <DialogDescription className="text-base">
                      Crie um novo agente inteligente com configuração personalizada para potencializar seus projetos.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Nome do Agente</label>
                        <Input
                          value={newAgent.name}
                          onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                          placeholder="Ex: Analista de Negócios"
                          className="h-11"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Tipo</label>
                        <Select value={newAgent.type} onValueChange={(value: any) => setNewAgent({ ...newAgent, type: value })}>
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="template">
                              <div className="flex items-center space-x-2">
                                <Star className="w-4 h-4" />
                                <span>Template</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="custom">
                              <div className="flex items-center space-x-2">
                                <Code className="w-4 h-4" />
                                <span>Custom</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="composed">
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>Composed</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Descrição</label>
                      <Textarea
                        value={newAgent.description}
                        onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                        placeholder="Descreva as funcionalidades e especialidades do agente"
                        className="min-h-20"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Configuração (YAML)</label>
                      <Textarea
                        value={newAgent.config}
                        onChange={(e) => setNewAgent({ ...newAgent, config: e.target.value })}
                        placeholder="role: Specialista\nexpertise:\n  - Análise de dados\n  - Machine Learning"
                        className="min-h-32 font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Conhecimento (Markdown)</label>
                      <Textarea
                        value={newAgent.knowledge}
                        onChange={(e) => setNewAgent({ ...newAgent, knowledge: e.target.value })}
                        placeholder="# Base de Conhecimento\n## Especialidades\n- Análise de dados\n- Machine Learning"
                        className="min-h-32"
                      />
                    </div>
                    <Button onClick={createAgent} className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-medium">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Criar Agente
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ElegantCard
              title="Total de Agentes"
              value={agentStats.total}
              description="Todos os agentes cadastrados"
              icon={Brain}
              iconColor="text-blue-600"
              bgColor="bg-blue-100 dark:bg-blue-900/20"
              badgeColor="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
            />
            <ElegantCard
              title="Templates"
              value={agentStats.templates}
              description="Agentes modelo pré-configurados"
              icon={Star}
              iconColor="text-purple-600"
              bgColor="bg-purple-100 dark:bg-purple-900/20"
              badgeColor="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700"
            />
            <ElegantCard
              title="Customizados"
              value={agentStats.custom}
              description="Agentes personalizados"
              icon={Code}
              iconColor="text-green-600"
              bgColor="bg-green-100 dark:bg-green-900/20"
              badgeColor="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
            />
            <ElegantCard
              title="Ativos"
              value={agentStats.active}
              description="Agentes em operação"
              icon={Zap}
              iconColor="text-orange-600"
              bgColor="bg-orange-100 dark:bg-orange-900/20"
              badgeColor="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700"
            />
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar agentes por nome ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="template">Templates</SelectItem>
                  <SelectItem value="custom">Customizados</SelectItem>
                  <SelectItem value="composed">Compostos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl animate-ping opacity-20"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Carregando agentes...</h3>
            <p className="text-muted-foreground">Aguarde enquanto carregamos seus agentes inteligentes.</p>
          </div>
        ) : (
          <>
            {filteredAgents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => {
                  const TypeIcon = getTypeIcon(agent.type);
                  const agentInfo = extractAgentInfo(agent);
                  return (
                    <ElegantCard
                      key={agent.id}
                      title={agent.name}
                      description={agent.description}
                      icon={TypeIcon}
                      subtitle={`Modelo: ${agentInfo.llmModel}`}
                      iconColor={agent.type === 'template' ? 'text-blue-600' : 
                               agent.type === 'custom' ? 'text-purple-600' : 'text-green-600'}
                      bgColor={agent.type === 'template' ? 'bg-blue-100 dark:bg-blue-900/20' : 
                               agent.type === 'custom' ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-green-100 dark:bg-green-900/20'}
                      badge={agent.type}
                      badgeColor={agent.type === 'template' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                               agent.type === 'custom' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                               'bg-green-50 text-green-700 border-green-200'}
                      showActions={true}
                      onViewDetails={() => handleViewDetails(agent)}
                      onEdit={() => handleEditAgent(agent)}
                      actionsMenu={
                        <AgentActionsMenu
                          agent={agent}
                          onExecute={handleExecute}
                          onEdit={handleEditAgent}
                          onDuplicate={handleDuplicate}
                          onArchive={handleArchive}
                          onDelete={handleDelete}
                          onExport={handleExport}
                          onShare={handleShare}
                          onExportToFlowise={handleExportToFlowise}
                        />
                      }
                      metadata={[
                        {
                          label: 'LLM',
                          value: agentInfo.llmModel,
                          icon: Cpu,
                          color: 'text-blue-600'
                        },
                        {
                          label: 'Temp',
                          value: agentInfo.temperature.toString(),
                          icon: Zap,
                          color: 'text-orange-600'
                        },
                        {
                          label: 'Flowise',
                          value: agent.exportedToFlowise ? 'Exportado' : 'Não exportado',
                          icon: Rocket,
                          color: agent.exportedToFlowise ? 'text-green-600' : 'text-gray-600'
                        },
                        {
                          label: 'Conhecimento',
                          value: agentInfo.hasKnowledge ? 'Sim' : 'Não',
                          icon: Database,
                          color: agentInfo.hasKnowledge ? 'text-green-600' : 'text-gray-600'
                        }
                      ]}
                    >
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 h-9 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          onClick={() => handleExecute(agent)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Executar
                        </Button>
                        {agent.exportedToFlowise && agent.chatflowUrl && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-9 text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => window.open(agent.chatflowUrl, '_blank')}
                          >
                            <Rocket className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-9"
                          onClick={() => handleEditAgent(agent)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </ElegantCard>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center">
                    <Brain className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Search className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-3">Nenhum agente encontrado</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery || filterType !== 'all' 
                    ? 'Nenhum agente corresponde aos seus filtros. Tente ajustar sua busca ou filtros.'
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
      </div>

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
    </MainLayout>
  );
}