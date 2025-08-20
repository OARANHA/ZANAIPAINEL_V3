'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, Users, Target, BookOpen, Plus, Settings, Play, Pause, Archive, MessageSquare, Sparkles, Download, BarChart3, Loader2, FolderOpen } from 'lucide-react';
import SpecialistGenerator from '@/components/specialists/SpecialistGenerator';
import CreateAgentDialog from '@/components/agents/CreateAgentDialog';
import AgentDetailsDialog from '@/components/agents/AgentDetailsDialog';
import AgentExecutionDialog from '@/components/agents/AgentExecutionDialog';
import EditAgentDialog from '@/components/agents/EditAgentDialog';
import QuickAgentInput from '@/components/agents/QuickAgentInput';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ElegantCard from '@/components/ui/ElegantCard';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Settings, Users } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  status: 'active' | 'inactive' | 'training';
  config: string;
  knowledge?: string;
  roleDefinition: string;
  groups: any[];
  customInstructions: string;
  workspaceId: string;
  workspace?: {
    name: string;
    description: string;
  };
}

interface Composition {
  id: string;
  name: string;
  description: string;
  config: string;
  status: 'draft' | 'active' | 'inactive';
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  workspace?: {
    name: string;
    description: string;
  };
  agents?: Agent[];
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface SpecialistCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface SpecialistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
  skills: string[];
  useCases: string[];
  created: string; // ISO string format
}

interface NewSpecialist {
  category: string;
  specialty: string;
  requirements: string;
}

export default function SpecialistsPage() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [compositions, setCompositions] = useState<Composition[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  
  // Test data - hardcoded para teste
  const testCategories = [
    { id: 'business', name: 'Business', description: 'Especialistas em análise de negócio', icon: '📊' },
    { id: 'technical', name: 'Technical', description: 'Especialistas técnicos', icon: '⚙️' },
    { id: 'content', name: 'Content', description: 'Especialistas em conteúdo', icon: '✍️' },
    { id: 'legal', name: 'Legal', description: 'Especialistas legais', icon: '⚖️' }
  ];

  const testTemplates = [
    {
      id: 'test-1',
      name: 'Especialista de Teste',
      description: 'Um especialista para testar o sistema',
      category: 'business',
      skills: ['Teste', 'Análise', 'Desenvolvimento'],
      useCases: ['Testar sistema', 'Analisar requisitos', 'Desenvolver soluções'],
      created: new Date().toISOString()
    }
  ];

  // Usar dados de teste por enquanto
  const [categories, setCategories] = useState<SpecialistCategory[]>(testCategories);
  const [templates, setTemplates] = useState<SpecialistTemplate[]>(testTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateSpecialistOpen, setIsCreateSpecialistOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newSpecialist, setNewSpecialist] = useState<NewSpecialist>({
    category: '',
    specialty: '',
    requirements: ''
  });

  useEffect(() => {
    // Carregar dados iniciais
    loadWorkspaces();
    loadAgents();
    loadSpecialists();
    loadCompositions();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces');
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
        if (data.length > 0) {
          setSelectedWorkspace(data[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar workspaces:', error);
    }
  };

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        // The API returns { agents: [...] } so we need to extract the agents array
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
      // Set empty array on error to prevent filter errors
      setAgents([]);
    }
  };

  const loadSpecialists = async () => {
    console.log('Carregando especialistas...');
    try {
      const response = await fetch('/api/specialists');
      console.log('Resposta da API:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Dados recebidos:', data);
        setCategories(data.categories);
        setTemplates(data.templates);
      } else {
        console.error('Erro na resposta:', await response.text());
      }
    } catch (error) {
      console.error('Erro ao carregar especialistas:', error);
    }
  };

  const loadCompositions = async () => {
    try {
      const response = await fetch('/api/compositions');
      if (response.ok) {
        const data = await response.json();
        setCompositions(data);
        console.log('Composições carregadas:', data);
      }
    } catch (error) {
      console.error('Erro ao carregar composições:', error);
    }
  };

  const generateFolderStructure = async () => {
    try {
      const response = await fetch('/api/generate-folder-structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Estrutura Gerada",
          description: "A estrutura de pastas foi gerada com sucesso.",
        });
      } else {
        throw new Error('Falha ao gerar estrutura');
      }
    } catch (error) {
      console.error('Erro ao gerar estrutura:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a estrutura de pastas.",
        variant: "destructive",
      });
    }
  };

  const parseAgentsFromConfig = (config: string): string[] => {
    try {
      const lines = config.split('\n');
      const agents: string[] = [];
      
      for (const line of lines) {
        if (line.includes('agent:')) {
          const agentMatch = line.match(/agent:\s*"([^"]+)"/);
          if (agentMatch) {
            agents.push(agentMatch[1]);
          }
        }
      }
      
      return agents;
    } catch (error) {
      console.error('Erro ao parsear configuração:', error);
      return [];
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
      case 'template': return 'bg-blue-100 text-blue-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      case 'composed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Specialist generator functions
  const generateSpecialist = async () => {
    if (!newSpecialist.category || !newSpecialist.specialty || !newSpecialist.requirements) {
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/specialists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSpecialist),
      });

      if (response.ok) {
        const generatedTemplate = await response.json();
        setTemplates(prev => [...prev, generatedTemplate]);
        setIsCreateSpecialistOpen(false);
        setNewSpecialist({
          category: '',
          specialty: '',
          requirements: ''
        });
      }
    } catch (error) {
      console.error('Erro ao gerar especialista:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSpecialist = async (specialistId: string) => {
    try {
      const response = await fetch('/api/specialists/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specialistId }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const specialist = templates.find(t => t.id === specialistId);
        a.download = `${specialist?.name || 'specialist'}.md`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erro ao baixar especialista:', error);
    }
  };

  const executeStaticComposition = async (compositionId: string) => {
    try {
      toast({
        title: "Executando Composição",
        description: "Analisando projetos de clientes...",
      });

      // Agentes reais para análise de projetos
      const analysisAgents = [
        {
          id: "cmed1m191000fs4kjxpx0a0hy", // Arquiteto de Software Sênior
          name: "Arquiteto de Software",
          role: "análise de arquitetura e design patterns"
        },
        {
          id: "cmed1m18o0003s4kje0n78m2f", // Cientista de Dados Senior
          name: "Cientista de Dados",
          role: "análise de dados e métricas"
        },
        {
          id: "cmed1m195000js4kjqyvhx9s1", // Engenheiro de DevOps
          name: "Engenheiro de DevOps",
          role: "análise de infraestrutura e CI/CD"
        }
      ];

      const results = [];
      
      // Simular análise de um projeto cliente típico
      const clientProjectExample = {
        name: "Sistema de Gestão Empresarial",
        description: "Plataforma SaaS para gestão de empresas",
        technologies: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
        businessDomain: "Gestão Empresarial",
        projectType: "SaaS",
        teamSize: "Médio (10-20 pessoas)",
        budget: "R$ 500.000 - R$ 1.000.000",
        timeline: "6 meses",
        clientIndustry: "Varejo",
        requirements: ["Automação de processos", "Relatórios em tempo real", "Integração com sistemas legados"]
      };
      
      // Executar cada agente sequencialmente
      for (const agent of analysisAgents) {
        try {
          const response = await fetch('/api/execute', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              agentId: agent.id,
              input: `Analise o projeto Zanai Project Dashboard como ${agent.role}. 

Informações do projeto:
- Nome: ${clientProjectExample.name}
- Descrição: ${clientProjectExample.description}
- Tecnologias: ${clientProjectExample.technologies.join(', ')}
- Domínio de Negócio: ${clientProjectExample.businessDomain}
- Tipo: ${clientProjectExample.projectType}
- Tamanho da Equipe: ${clientProjectExample.teamSize}
- Orçamento: ${clientProjectExample.budget}
- Prazo: ${clientProjectExample.timeline}
- Indústria: ${clientProjectExample.clientIndustry}
- Requisitos: ${clientProjectExample.requirements.join(', ')}

Forneça uma análise detalhada com:
1. Pontos fortes e fracos da arquitetura atual
2. Recomendações específicas para este tipo de projeto
3. Sugestões de melhorias e boas práticas
4. Considerações de negócio relevantes

Foque em fornecer insights acionáveis para o administrador do sistema Zanai.`,
              context: {
                compositionId,
                agentCount: analysisAgents.length,
                timestamp: new Date().toISOString(),
                clientProject: clientProjectExample
              }
            }),
          });

          if (response.ok) {
            const result = await response.json();
            results.push({
              agent: agent.name,
              result: result.output || 'Análise concluída com sucesso',
              success: true
            });
          } else {
            results.push({
              agent: agent.name,
              result: 'Erro na execução da análise',
              success: false
            });
          }
        } catch (error) {
          results.push({
            agent: agent.name,
            result: `Erro: ${error.message}`,
            success: false
          });
        }
      }

      // Mostrar resultados detalhados
      setTimeout(() => {
        const successCount = results.filter(r => r.success).length;
        toast({
          title: "Análise Concluída",
          description: `${successCount}/${results.length} análises concluídas com sucesso.`,
        });

        // Mostrar resultados individuais no console
        console.log('Resultados da análise:', results);
        
        // Aqui poderíamos mostrar os resultados em um modal ou expandir o card
      }, 2000);

    } catch (error) {
      console.error('Erro ao executar composição estática:', error);
      toast({
        title: "Erro na Execução",
        description: "Não foi possível executar a composição. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const showCompositionSettings = (compositionId: string) => {
    const settings = {
      name: "Análise Completa de Projetos",
      description: "Combinação de agentes para análise completa de projetos",
      agents: [
        {
          id: "cmed1m191000fs4kjxpx0a0hy",
          name: "Arquiteto de Software Sênior",
          role: "Análise de arquitetura e design patterns",
          expertise: ["Microservices", "Design Patterns", "Clean Architecture"]
        },
        {
          id: "cmed1m18o0003s4kje0n78m2f",
          name: "Cientista de Dados Senior",
          role: "Análise de dados e métricas",
          expertise: ["Machine Learning", "Data Analytics", "Big Data"]
        },
        {
          id: "cmed1m195000js4kjqyvhx9s1",
          name: "Engenheiro de DevOps",
          role: "Análise de infraestrutura e CI/CD",
          expertise: ["CI/CD", "Infrastructure as Code", "Monitoring"]
        }
      ],
      executionMode: "sequential",
      timeout: 30000,
      retryCount: 3
    };

    console.log("Configurações da composição:", settings);
    toast({
      title: "Configurações da Composição",
      description: `${settings.agents.length} agentes configurados em modo ${settings.executionMode}.`,
    });
  };

  const executeComposition = async (compositionId: string) => {
    try {
      const response = await fetch('/api/compositions/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          compositionId,
          input: 'Executar composição'
        }),
      });

      const result = await response.json();
      console.log('Resultado da composição:', result);
      
      // Mostrar notificação de sucesso
      toast({
        title: "Composição Executada",
        description: `A composição foi executada com ${result.results?.length || 0} agentes.`,
      });
      
    } catch (error) {
      console.error('Erro ao executar composição:', error);
      toast({
        title: "Erro na Execução",
        description: "Não foi possível executar a composição. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const executeAgentWithInput = async (agentId: string, input: string) => {
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId,
          input,
          context: {
            timestamp: new Date().toISOString(),
            source: 'quick-input'
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Agente executado com sucesso:', result);
        return result;
      } else {
        const error = await response.json();
        console.error('Erro ao executar agente:', error);
        throw new Error(error.error || 'Erro ao executar agente');
      }
    } catch (error) {
      console.error('Erro ao executar agente:', error);
      throw error;
    }
  };

  const getAgentExamples = (agent: Agent): string[] => {
    const examplesByType: Record<string, string[]> = {
      'template': [
        'Analise este relatório e destaque os principais pontos',
        'Crie um resumo executivo dos dados fornecidos',
        'Gere um plano de ação baseado nas informações'
      ],
      'custom': [
        'Execute sua tarefa principal com os dados atuais',
        'Processe esta solicitação conforme suas configurações',
        'Aplique seu conhecimento especializado neste caso'
      ],
      'composed': [
        'Coordene a execução das tarefas em sequência',
        'Integre os resultados dos diferentes agentes',
        'Otimize o fluxo de trabalho completo'
      ]
    };

    // Exemplos específicos baseados no nome do agente
    if (agent.name.toLowerCase().includes('business') || agent.name.toLowerCase().includes('analyst')) {
      return [
        'Analise o mercado e identifique oportunidades',
        'Crie um plano de negócios para um novo projeto',
        'Avalie a viabilidade financeira deste investimento'
      ];
    }

    if (agent.name.toLowerCase().includes('technical') || agent.name.toLowerCase().includes('developer')) {
      return [
        'Revise este código e sugira melhorias',
        'Crie uma solução técnica para este problema',
        'Otimize a performance desta aplicação'
      ];
    }

    if (agent.name.toLowerCase().includes('content') || agent.name.toLowerCase().includes('writer')) {
      return [
        'Crie um conteúdo engajador sobre este tema',
        'Escreva um artigo sobre as últimas tendências',
        'Desenvolva uma estratégia de conteúdo para redes sociais'
      ];
    }

    return examplesByType[agent.type] || examplesByType.template;
  };

  const filteredTemplates = selectedCategory !== 'all' 
    ? templates.filter(template => template.category === selectedCategory)
    : templates;

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '🤖';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  return (
    <MainLayout currentPath={pathname}>
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ElegantCard
            title="Total de Especialistas"
            description="Templates disponíveis"
            icon={Sparkles}
            iconColor="text-purple-600"
            bgColor="bg-purple-100 dark:bg-purple-900/20"
            value={templates.length}
            badge={templates.length > 0 ? "Prontos para uso" : undefined}
            badgeColor="bg-purple-50 text-purple-700 border-purple-200"
          />
          
          <ElegantCard
            title="Categorias"
            description="Áreas de especialização"
            icon={Target}
            iconColor="text-blue-600"
            bgColor="bg-blue-100 dark:bg-blue-900/20"
            value={categories.length}
            badge="Diversificadas"
            badgeColor="bg-blue-50 text-blue-700 border-blue-200"
          />
          
          <ElegantCard
            title="Agentes Ativos"
            description="Em operação"
            icon={Brain}
            iconColor="text-green-600"
            bgColor="bg-green-100 dark:bg-green-900/20"
            value={Array.isArray(agents) ? agents.filter(agent => agent.status === 'active').length : 0}
            badge={Array.isArray(agents) && agents.length > 0 ? `${Math.round((agents.filter(agent => agent.status === 'active').length / agents.length) * 100)}% ativos` : undefined}
            badgeColor="bg-green-50 text-green-700 border-green-200"
          />
          
          <ElegantCard
            title="Workspaces"
            description="Ambientes de trabalho"
            icon={Users}
            iconColor="text-orange-600"
            bgColor="bg-orange-100 dark:bg-orange-900/20"
            value={workspaces.length}
            badge={workspaces.length > 0 ? "Configurados" : undefined}
            badgeColor="bg-orange-50 text-orange-700 border-orange-200"
          />
        </div>

        <Tabs defaultValue="specialists" className="space-y-6">
          <div className="relative">
            <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-1 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm relative overflow-hidden">
              {/* Animated background indicator */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-red-500/5 dark:from-purple-500/10 dark:via-pink-500/10 dark:to-red-500/10 rounded-2xl animate-pulse"></div>
              
              <TabsTrigger value="specialists" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 rounded-xl transition-all duration-300 hover:scale-105 group relative z-10">
                <div className="relative">
                  <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-300 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="hidden sm:inline font-medium">Especialistas</span>
                <span className="sm:hidden font-medium">Esp</span>
              </TabsTrigger>
              <TabsTrigger value="agents" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 rounded-xl transition-all duration-300 hover:scale-105 group relative z-10">
                <div className="relative">
                  <Brain className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="hidden sm:inline font-medium">Agentes</span>
                <span className="sm:hidden font-medium">IA</span>
              </TabsTrigger>
              <TabsTrigger value="composition" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 rounded-xl transition-all duration-300 hover:scale-105 group relative z-10">
                <div className="relative">
                  <Users className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="hidden sm:inline font-medium">Composição</span>
                <span className="sm:hidden font-medium">Comp</span>
              </TabsTrigger>
              <TabsTrigger value="learning" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-amber-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 rounded-xl transition-all duration-300 hover:scale-105 group relative z-10">
                <div className="relative">
                  <BookOpen className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-300 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="hidden sm:inline font-medium">Aprendizado</span>
                <span className="sm:hidden font-medium">Apr</span>
              </TabsTrigger>
              <TabsTrigger value="studio" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-400 data-[state=active]:to-rose-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 rounded-xl transition-all duration-300 hover:scale-105 group relative z-10">
                <div className="relative">
                  <Target className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-300 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="hidden sm:inline font-medium">Studio</span>
                <span className="sm:hidden font-medium">Dev</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Specialists Tab */}
          <TabsContent value="specialists" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gerador de Especialistas</h1>
                <p className="text-lg text-muted-foreground">
                  Crie agentes especialistas personalizados usando IA para diversas áreas de negócio
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={generateFolderStructure}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Gerar Estrutura
                </Button>
                <Dialog open={isCreateSpecialistOpen} onOpenChange={setIsCreateSpecialistOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Especialista
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Gerar Novo Especialista</DialogTitle>
                      <DialogDescription>
                        Use a IA para criar um template de agente especialista personalizado
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Categoria</label>
                        <Select 
                          value={newSpecialist.category} 
                          onValueChange={(value) => setNewSpecialist({ ...newSpecialist, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                <div className="flex items-center space-x-2">
                                  <span>{category.icon}</span>
                                  <span>{category.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Especialidade</label>
                        <Input
                          value={newSpecialist.specialty}
                          onChange={(e) => setNewSpecialist({ ...newSpecialist, specialty: e.target.value })}
                          placeholder="Ex: Analista Financeiro, Especialista em SEO, etc."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Requisitos Específicos</label>
                        <Textarea
                          value={newSpecialist.requirements}
                          onChange={(e) => setNewSpecialist({ ...newSpecialist, requirements: e.target.value })}
                          placeholder="Descreva os requisitos específicos para este especialista..."
                          className="min-h-24"
                        />
                      </div>
                      <Button 
                        onClick={generateSpecialist} 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                        disabled={isGenerating || !newSpecialist.category || !newSpecialist.specialty || !newSpecialist.requirements}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Gerando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Gerar Especialista
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium">Filtrar por categoria:</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <ElegantCard
                  key={template.id}
                  title={template.name}
                  description={template.description}
                  icon={Sparkles}
                  iconColor="text-purple-600"
                  bgColor="bg-purple-100 dark:bg-purple-900/20"
                  badge={getCategoryName(template.category)}
                  badgeColor="bg-purple-50 text-purple-700 border-purple-200"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {template.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {template.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Criado em {new Date(template.created).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadSpecialist(template.id)}>
                        <Download className="w-4 h-4 mr-1" />
                        Baixar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        // Create agent from template
                        if (selectedWorkspace) {
                          // Implement create agent from template
                        }
                      }}>
                        <Brain className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </ElegantCard>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum especialista encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedCategory 
                    ? `Nenhum especialista na categoria "${getCategoryName(selectedCategory)}"`
                    : 'Comece criando seu primeiro especialista'
                  }
                </p>
                <Button onClick={() => setIsCreateSpecialistOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Especialista
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Agentes Inteligentes</h1>
                <p className="text-lg text-muted-foreground">
                  Gerencie e execute seus agentes de IA especializados
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Link href="/executions">
                  <Button variant="outline" className="border-2 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Histórico de Execuções
                  </Button>
                </Link>
                <CreateAgentDialog onAgentCreated={loadAgents} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(agents) && agents.map((agent) => (
                <ElegantCard
                  key={agent.id}
                  title={agent.name}
                  description={agent.description}
                  icon={Brain}
                  iconColor={agent.status === 'active' ? 'text-green-600' : 
                           agent.status === 'training' ? 'text-blue-600' : 'text-gray-600'}
                  bgColor={agent.status === 'active' ? 'bg-green-100 dark:bg-green-900/20' : 
                           agent.status === 'training' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-900/20'}
                  badge={agent.type}
                  badgeColor={agent.type === 'template' ? 'bg-green-50 text-green-700 border-green-200' : 
                           agent.type === 'custom' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                           'bg-blue-50 text-blue-700 border-blue-200'}
                >
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Workspace:</span> {agent.workspace?.name || 'N/A'}
                    </div>
                    
                    {/* Quick Agent Input */}
                    <QuickAgentInput 
                      agent={agent}
                      onExecute={(input) => executeAgentWithInput(agent.id, input)}
                      examples={getAgentExamples(agent)}
                    />
                    
                    <div className="flex space-x-2">
                      <AgentExecutionDialog agent={agent}>
                        <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                          <Play className="w-4 h-4 mr-1" />
                          Executar
                        </Button>
                      </AgentExecutionDialog>
                      <AgentDetailsDialog agent={agent}>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </AgentDetailsDialog>
                      <EditAgentDialog agent={agent} onAgentUpdated={loadAgents}>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </EditAgentDialog>
                    </div>
                  </div>
                </ElegantCard>
              ))}
            </div>

            {!Array.isArray(agents) || agents.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum agente encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando seu primeiro agente inteligente
                </p>
                <CreateAgentDialog onAgentCreated={loadAgents} />
              </div>
            )}
          </TabsContent>

          {/* Composition Tab */}
          <TabsContent value="composition" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Composição de Agentes</h1>
                <p className="text-lg text-muted-foreground">
                  Crie combinações poderosas de agentes para tarefas complexas
                </p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Criar Composição
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ElegantCard
                title="Análise do Projeto Atual"
                description="Análise detalhada do projeto Zanai Project Dashboard com 3 agentes especializados"
                icon={Users}
                iconColor="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/20"
                badge="3 Agentes"
                badgeColor="bg-blue-50 text-blue-700 border-blue-200"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Arquitetura de Software</Badge>
                    <Badge variant="secondary" className="text-xs">Ciência de Dados</Badge>
                    <Badge variant="secondary" className="text-xs">DevOps</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Eficiência:</span> 94% • <span className="font-medium">Último uso:</span> 2 horas atrás
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                      onClick={() => executeStaticComposition('analise-completa-projetos')}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Executar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => showCompositionSettings('analise-completa-projetos')}>
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ElegantCard>

              <ElegantCard
                title="Pipeline de Desenvolvimento"
                description="Automatização completa do ciclo de desenvolvimento"
                icon={Users}
                iconColor="text-purple-600"
                bgColor="bg-purple-100 dark:bg-purple-900/20"
                badge="5 Agentes"
                badgeColor="bg-purple-50 text-purple-700 border-purple-200"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Code Review</Badge>
                    <Badge variant="secondary" className="text-xs">Testes</Badge>
                    <Badge variant="secondary" className="text-xs">Deploy</Badge>
                    <Badge variant="secondary" className="text-xs">+2</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Eficiência:</span> 87% • <span className="font-medium">Último uso:</span> 1 dia atrás
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                      <Play className="w-4 h-4 mr-1" />
                      Executar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ElegantCard>

              <ElegantCard
                title="Sala de Guerra de Marketing"
                description="Análise competitiva e estratégias de marketing"
                icon={Users}
                iconColor="text-green-600"
                bgColor="bg-green-100 dark:bg-green-900/20"
                badge="4 Agentes"
                badgeColor="bg-green-50 text-green-700 border-green-200"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Análise de Mercado</Badge>
                    <Badge variant="secondary" className="text-xs">SEO</Badge>
                    <Badge variant="secondary" className="text-xs">Content Strategy</Badge>
                    <Badge variant="secondary" className="text-xs">Social Media</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Eficiência:</span> 91% • <span className="font-medium">Último uso:</span> 3 horas atrás
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      <Play className="w-4 h-4 mr-1" />
                      Executar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ElegantCard>
            </div>

            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Crie sua primeira composição</h3>
              <p className="text-muted-foreground mb-4">
                Combine múltiplos agentes para criar fluxos de trabalho poderosos
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Composição
              </Button>
            </div>
          </TabsContent>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Aprendizado de Agentes</h1>
                <p className="text-lg text-muted-foreground">
                  Treine seus agentes para melhorar seu desempenho e adquirir novas habilidades
                </p>
              </div>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Novo Treinamento
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ElegantCard
                title="Treinamento em Progresso"
                description="Agente aprendendo novos padrões de código"
                icon={BookOpen}
                iconColor="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/20"
                badge="65% Completo"
                badgeColor="bg-blue-50 text-blue-700 border-blue-200"
              >
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Modelo:</span> GPT-4 • <span className="font-medium">Tempo restante:</span> ~2 horas
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Pause className="w-4 h-4 mr-1" />
                      Pausar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ElegantCard>

              <ElegantCard
                title="Otimização de Performance"
                description="Ajuste fino para melhor eficiência operacional"
                icon={BookOpen}
                iconColor="text-green-600"
                bgColor="bg-green-100 dark:bg-green-900/20"
                badge="Concluído"
                badgeColor="bg-green-50 text-green-700 border-green-200"
              >
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Melhoria:</span> +23% • <span className="font-medium">Concluído:</span> 1 dia atrás
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      <Play className="w-4 h-4 mr-1" />
                      Aplicar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ElegantCard>

              <ElegantCard
                title="Aprendizado de Domínio"
                description="Especialização em análise financeira"
                icon={BookOpen}
                iconColor="text-purple-600"
                bgColor="bg-purple-100 dark:bg-purple-900/20"
                badge="Agendado"
                badgeColor="bg-purple-50 text-purple-700 border-purple-200"
              >
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Início:</span> Hoje 14:00 • <span className="font-medium">Duração:</span> ~4 horas
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Play className="w-4 h-4 mr-1" />
                      Iniciar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ElegantCard>
            </div>

            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Comece a treinar seus agentes</h3>
              <p className="text-muted-foreground mb-4">
                Melhore o desempenho dos seus agentes com treinamentos personalizados
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Treinamento
              </Button>
            </div>
          </TabsContent>

          {/* Visual Studio Tab */}
          <TabsContent value="studio" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Visual Agent Studio</h1>
                <p className="text-lg text-muted-foreground">
                  Ambiente de desenvolvimento visual com agentes de IA integrados
                </p>
              </div>
              <Button className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ElegantCard
                title="Projeto E-commerce"
                description="Análise visual de projeto de e-commerce"
                icon={Target}
                iconColor="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/20"
                badge="Ativo"
                badgeColor="bg-blue-50 text-blue-700 border-blue-200"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Análise de UI</Badge>
                    <Badge variant="secondary" className="text-xs">Otimização de UX</Badge>
                    <Badge variant="secondary" className="text-xs">Recursos de IA</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Progresso:</span> 78% • <span className="font-medium">Última atualização:</span> 1 hora atrás
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                      <Target className="w-4 h-4 mr-1" />
                      Abrir
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ElegantCard>

              <ElegantCard
                title="Dashboard Analytics"
                description="Painel de análise de dados em tempo real"
                icon={Target}
                iconColor="text-green-600"
                bgColor="bg-green-100 dark:bg-green-900/20"
                badge="Em Desenvolvimento"
                badgeColor="bg-green-50 text-green-700 border-green-200"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">Data Visualization</Badge>
                    <Badge variant="secondary" className="text-xs">Real-time</Badge>
                    <Badge variant="secondary" className="text-xs">Interactive Charts</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Progresso:</span> 45% • <span className="font-medium">Última atualização:</span> 30 min atrás
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      <Target className="w-4 h-4 mr-1" />
                      Abrir
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ElegantCard>

              <ElegantCard
                title="Mobile App Design"
                description="Design de aplicativo mobile com IA"
                icon={Target}
                iconColor="text-purple-600"
                bgColor="bg-purple-100 dark:bg-purple-900/20"
                badge="Planejamento"
                badgeColor="bg-purple-50 text-purple-700 border-purple-200"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">UI/UX Design</Badge>
                    <Badge variant="secondary" className="text-xs">Prototyping</Badge>
                    <Badge variant="secondary" className="text-xs">User Testing</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Progresso:</span> 15% • <span className="font-medium">Início:</span> Hoje
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                      <Target className="w-4 h-4 mr-1" />
                      Abrir
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </ElegantCard>
            </div>

            <div className="text-center py-12">
              <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Crie seu primeiro projeto visual</h3>
              <p className="text-muted-foreground mb-4">
                Desenvolva projetos incríveis com a ajuda de agentes de IA especializados
              </p>
              <Button className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </MainLayout>
  );
}