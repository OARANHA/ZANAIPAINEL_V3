'use client';

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, Settings, Users } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  role: string;
  expertise: string[];
  status: 'active' | 'inactive' | 'training';
  performance: number;
  lastExecution?: string;
  executionCount: number;
  successRate: number;
  avgResponseTime: number;
  createdAt: string;
  updatedAt: string;
  workspace?: {
    id: string;
    name: string;
    description: string;
  };
}

interface Workspace {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface NewSpecialist {
  name: string;
  description: string;
  role: string;
  expertise: string[];
  workspaceId: string;
}

export default function SpecialistsPage() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    technologies: '',
    businessDomain: '',
    projectType: '',
    teamSize: '',
    budget: '',
    timeline: '',
    clientIndustry: '',
    requirements: ''
  });

  const executeStaticComposition = async (compositionId: string) => setShowProjectDialog(true);

  const executeAnalysis = async () => {
    try {
      toast({
        title: "Executando Composição",
        description: "Analisando projetos de clientes...",
      });

      const analysisAgents = [
        {
          id: "cmed1m191000fs4kjxpx0a0hy",
          name: "Arquiteto de Software",
          role: "análise de arquitetura e design patterns"
        },
        {
          id: "cmed1m18o0003s4kje0n78m2f",
          name: "Cientista de Dados",
          role: "análise de dados e métricas"
        },
        {
          id: "cmed1m195000js4kjqyvhx9s1",
          name: "Engenheiro de DevOps",
          role: "análise de infraestrutura e CI/CD"
        }
      ];

      const results = [];
      
      const clientProjectExample = {
        name: projectData.name || "Sistema de Gestão Empresarial",
        description: projectData.description || "Plataforma SaaS para gestão de empresas",
        technologies: projectData.technologies ? projectData.technologies.split(', ') : ["React", "Node.js", "MongoDB", "Docker", "AWS"],
        businessDomain: projectData.businessDomain || "Gestão Empresarial",
        projectType: projectData.projectType || "SaaS",
        teamSize: projectData.teamSize || "Médio (10-20 pessoas)",
        budget: projectData.budget || "R$ 500.000 - R$ 1.000.000",
        timeline: projectData.timeline || "6 meses",
        clientIndustry: projectData.clientIndustry || "Varejo",
        requirements: projectData.requirements ? projectData.requirements.split(', ') : ["Automação de processos", "Relatórios em tempo real", "Integração com sistemas legados"]
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
              input: `Você é um consultor especializado em ${agent.role}. Analise um projeto cliente com as seguintes características:

Projeto Cliente:
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
                compositionId: 'analise-cliente-projeto',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'training': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Especialistas</h1>
            <p className="text-muted-foreground">Gerencie seus agentes especializados e composições</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Workspace:</span>
              <select 
                className="px-3 py-1 border rounded-md bg-background"
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
              >
                <option value="">Todos os Workspaces</option>
                {workspaces.map(workspace => (
                  <option key={workspace.id} value={workspace.id}>{workspace.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/agents">
              <button className={`px-4 py-2 rounded-lg ${pathname === '/agents' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                Agentes
              </button>
            </Link>
            <Link href="/specialists">
              <button className={`px-4 py-2 rounded-lg ${pathname === '/specialists' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                Especialistas
              </button>
            </Link>
            <Link href="/compositions">
              <button className={`px-4 py-2 rounded-lg ${pathname === '/compositions' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                Composições
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total de Agentes</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{agents.length}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Agentes ativos e disponíveis para execução</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Agentes Ativos</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{agents.filter(a => a.status === 'active').length}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Agentes prontos para execução imediata</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Performance Média</h3>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {agents.length > 0 ? Math.round(agents.reduce((sum, agent) => sum + agent.performance, 0) / agents.length) : 0}%
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Taxa de sucesso média de todos os agentes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Execuções Hoje</h3>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">127</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Total de execuções realizadas hoje</p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Workspaces</h3>
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{workspaces.length}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Ambientes de trabalho disponíveis</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Composição de Agentes</h2>
              <p className="text-muted-foreground">Configure e execute composições de agentes especializados</p>
            </div>
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
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">Arquitetura de Software</span>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">Ciência de Dados</span>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">DevOps</span>
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
          </div>
        </div>

        <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Dados do Projeto Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Projeto</Label>
                  <Input
                    id="name"
                    value={projectData.name}
                    onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                    placeholder="Sistema de Gestão Empresarial"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={projectData.description}
                    onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                    placeholder="Plataforma SaaS para gestão de empresas"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="technologies">Tecnologias (separadas por vírgula)</Label>
                  <Input
                    id="technologies"
                    value={projectData.technologies}
                    onChange={(e) => setProjectData({...projectData, technologies: e.target.value})}
                    placeholder="React, Node.js, MongoDB, Docker, AWS"
                  />
                </div>
                <div>
                  <Label htmlFor="businessDomain">Domínio de Negócio</Label>
                  <Input
                    id="businessDomain"
                    value={projectData.businessDomain}
                    onChange={(e) => setProjectData({...projectData, businessDomain: e.target.value})}
                    placeholder="Gestão Empresarial"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectType">Tipo de Projeto</Label>
                  <Input
                    id="projectType"
                    value={projectData.projectType}
                    onChange={(e) => setProjectData({...projectData, projectType: e.target.value})}
                    placeholder="SaaS"
                  />
                </div>
                <div>
                  <Label htmlFor="teamSize">Tamanho da Equipe</Label>
                  <Input
                    id="teamSize"
                    value={projectData.teamSize}
                    onChange={(e) => setProjectData({...projectData, teamSize: e.target.value})}
                    placeholder="Médio (10-20 pessoas)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Orçamento</Label>
                  <Input
                    id="budget"
                    value={projectData.budget}
                    onChange={(e) => setProjectData({...projectData, budget: e.target.value})}
                    placeholder="R$ 500.000 - R$ 1.000.000"
                  />
                </div>
                <div>
                  <Label htmlFor="timeline">Prazo</Label>
                  <Input
                    id="timeline"
                    value={projectData.timeline}
                    onChange={(e) => setProjectData({...projectData, timeline: e.target.value})}
                    placeholder="6 meses"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientIndustry">Indústria</Label>
                  <Input
                    id="clientIndustry"
                    value={projectData.clientIndustry}
                    onChange={(e) => setProjectData({...projectData, clientIndustry: e.target.value})}
                    placeholder="Varejo"
                  />
                </div>
                <div>
                  <Label htmlFor="requirements">Requisitos (separados por vírgula)</Label>
                  <Input
                    id="requirements"
                    value={projectData.requirements}
                    onChange={(e) => setProjectData({...projectData, requirements: e.target.value})}
                    placeholder="Automação de processos, Relatórios em tempo real, Integração com sistemas legados"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowProjectDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => {
                  setShowProjectDialog(false);
                  executeAnalysis();
                }}>
                  Analisar Projeto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </MainLayout>
  );
}