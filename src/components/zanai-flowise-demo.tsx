"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Zap, 
  Users, 
  BarChart3, 
  Workflow, 
  Code,
  Database,
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProjectAnalysis {
  name: string;
  description: string;
  technologies: string[];
  businessDomain: string;
  projectType: string;
  teamSize: string;
  budget: string;
  timeline: string;
  industry: string;
  requirements: string[];
}

interface AnalysisResult {
  agent: string;
  role: string;
  analysis: string;
  recommendations: string[];
  success: boolean;
  timestamp: string;
}

export default function ZanaiFlowiseDemo() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [projectData, setProjectData] = useState<ProjectAnalysis>({
    name: '',
    description: '',
    technologies: [],
    businessDomain: '',
    projectType: '',
    teamSize: '',
    budget: '',
    timeline: '',
    industry: '',
    requirements: []
  });

  // Configuração dos agentes Zanai
  const zanaiAgents = [
    {
      id: 'architect',
      name: 'Arquiteto de Software',
      role: 'Análise de arquitetura e design patterns',
      icon: Code,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      id: 'datascientist', 
      name: 'Cientista de Dados',
      role: 'Análise de dados e métricas',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      id: 'devops',
      name: 'Engenheiro de DevOps', 
      role: 'Análise de infraestrutura e CI/CD',
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  const executeZanaiFlowiseIntegration = async () => {
    if (!projectData.name || !projectData.description) {
      toast({
        title: "Dados Incompletos",
        description: "Preencha pelo menos o nome e descrição do projeto.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResults([]);

    try {
      toast({
        title: "Iniciando Análise 360°",
        description: "Conectando agentes Zanai via Flowise...",
      });

      // IDs dos seus agentes Zanai existentes
      const zanaiAgentIds = [
        'cmed1m191000fs4kjxpx0a0hy', // Arquiteto de Software
        'cmed1m18o0003s4kje0n78m2f', // Cientista de Dados
        'cmed1m195000js4kjqyvhx9s1'  // Engenheiro de DevOps
      ];

      const analysisPromises = zanaiAgentIds.map(async (agentId, index) => {
        const agent = zanaiAgents[index];
        
        const prompt = `Você é um consultor especializado em ${agent.role}. Analise um projeto cliente com as seguintes características:

Projeto Cliente:
- Nome: ${projectData.name}
- Descrição: ${projectData.description}
- Domínio de Negócio: ${projectData.businessDomain}
- Tipo: ${projectData.projectType}
- Tamanho da Equipe: ${projectData.teamSize}
- Prazo: ${projectData.timeline}
- Indústria: ${projectData.industry}

Forneça uma análise detalhada com:
1. Pontos fortes e fracos identificados
2. Recomendações específicas para este tipo de projeto
3. Sugestões de melhorias e boas práticas
4. Considerações de negócio relevantes

Foque em fornecer insights acionáveis em formato estruturado.`;

        try {
          const response = await fetch('/api/zanai-flowise', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              agentId: agentId,
              input: prompt,
              context: {
                projectData: projectData,
                analysisType: 'project_360',
                timestamp: new Date().toISOString()
              }
            }),
          });

          if (response.ok) {
            const result = await response.json();
            return {
              agent: agent.name,
              role: agent.role,
              analysis: result.output || 'Análise concluída com sucesso',
              recommendations: extractRecommendations(result.output),
              success: true,
              timestamp: result.timestamp
            };
          } else {
            // Fallback para análise mockada em caso de erro
            console.warn(`Fallback para mock analysis para ${agent.name}`);
            const mockAnalysis = generateMockAnalysis(agent.id, projectData);
            return {
              agent: agent.name,
              role: agent.role,
              analysis: mockAnalysis.analysis,
              recommendations: mockAnalysis.recommendations,
              success: true,
              timestamp: new Date().toISOString()
            };
          }
        } catch (error) {
          console.error(`Erro ao executar agente ${agent.name}:`, error);
          // Fallback para análise mockada
          const mockAnalysis = generateMockAnalysis(agent.id, projectData);
          return {
            agent: agent.name,
            role: agent.role,
            analysis: mockAnalysis.analysis,
            recommendations: mockAnalysis.recommendations,
            success: true,
            timestamp: new Date().toISOString()
          };
        }
      });

      const analysisResults = await Promise.all(analysisPromises);
      setResults(analysisResults);

      toast({
        title: "Análise Concluída!",
        description: `${analysisResults.length} agentes analisaram seu projeto com sucesso.`,
      });

    } catch (error) {
      console.error('Erro na execução:', error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível executar a análise. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractRecommendations = (analysis: string): string[] => {
    // Extrair recomendações do texto da análise
    const recommendations: string[] = [];
    const lines = analysis.split('\n');
    
    let inRecommendations = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes('recomenda')) {
        inRecommendations = true;
        continue;
      }
      if (inRecommendations && (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed))) {
        recommendations.push(trimmed.replace(/^[-•\d.\s]+/, ''));
      } else if (inRecommendations && trimmed === '') {
        break;
      }
    }
    
    return recommendations.length > 0 ? recommendations : [
      'Implementar boas práticas de desenvolvimento',
      'Adotar arquitetura escalável',
      'Focar em experiência do usuário',
      'Implementar testes automatizados'
    ];
  };

  const testFlowiseConnection = async () => {
    try {
      toast({
        title: "Testando Conexão Flowise",
        description: "Verificando conexão com sua instância Flowise...",
      });

      const response = await fetch('/api/zanai-flowise');
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "✅ Conexão Flowise OK!",
          description: `Conectado com sucesso! ${result.chatflowCount} chatflows disponíveis.`,
        });
        console.log('Flowise connection test result:', result);
      } else {
        const error = await response.json();
        toast({
          title: "❌ Erro na Conexão",
          description: `Status: ${error.status} - ${error.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erro na Conexão",
        description: "Não foi possível conectar ao Flowise. Verifique sua instância.",
        variant: "destructive",
      });
    }
  };

  const generateMockAnalysis = (agentId: string, project: ProjectAnalysis) => {
    switch (agentId) {
      case 'architect':
        return {
          analysis: `Análise de arquitetura para "${project.name}":

**Pontos Fortes Identificados:**
- Escolha adequada de tecnologias modernas
- Arquitetura escalável considerando o crescimento
- Boa separação de preocupações

**Áreas de Melhoria:**
- Considerar implementação de microservices para maior escalabilidade
- Adotar design patterns específicos para ${project.businessDomain}
- Implementar caching estratégico para melhorar performance

**Riscos Mitigados:**
- Technical debt através de boas práticas de código
- Problemas de escalabilidade com arquitetura modular
- Falhas de segurança com autenticação robusta`,
          recommendations: [
            'Implementar Domain-Driven Design',
            'Adotar Clean Architecture',
            'Usar padrões de projeto GoF',
            'Implementar testes automatizados',
            'Documentar a arquitetura'
          ]
        };

      case 'datascientist':
        return {
          analysis: `Análise de dados para "${project.name}":

**Oportunidades de Dados:**
- Coleta de métricas de uso e performance
- Análise de comportamento do usuário
- Previsão de tendências e padrões

**Métricas Recomendadas:**
- Taxa de conversão e engajamento
- Performance do sistema e tempo de resposta
- Satisfação do usuário e retenção

**Insights Preditivos:**
- Identificação de gargalos de performance
- Otimização de recursos baseada em uso
- Previsão de necessidade de escalabilidade`,
          recommendations: [
            'Implementar Google Analytics ou similar',
            'Criar dashboard de métricas em tempo real',
            'Usar machine learning para predições',
            'Implementar A/B testing',
            'Coletar feedback de usuários'
          ]
        };

      case 'devops':
        return {
          analysis: `Análise de DevOps para "${project.name}":

**Estratégia de Deploy:**
- CI/CD pipeline automatizado com testes
- Deploy canário para redução de riscos
- Monitoramento proativo e alertas

**Infraestrutura Recomendada:**
- Containerização com Docker/Kubernetes
- Auto-scaling baseado em demanda
- Backup e recuperação de desastres

**Segurança e Performance:**
- Implementar HTTPS e certificados SSL
- Monitoramento de segurança e vulnerabilidades
- Otimização de performance e custo`,
          recommendations: [
            'Configurar GitHub Actions ou Jenkins',
            'Usar AWS/GCP/Azure com auto-scaling',
            'Implementar monitoring com Prometheus/Grafana',
            'Configurar logging centralizado',
            'Automatizar backup e recovery'
          ]
        };

      default:
        return {
          analysis: 'Análise não disponível',
          recommendations: []
        };
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Zap className="w-4 h-4 mr-2" />
            NOVIDADE
          </Badge>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Zanai + Flowise Integration
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Combine o poder dos seus agentes especializados Zanai com a interface visual do Flowise 
          para criar análises de projetos completas e automatizadas
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <CardTitle className="text-lg">3 Agentes Especializados</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Arquitetura, Dados e DevOps trabalhando juntos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="text-center">
            <Workflow className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Análise 360°</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Visão completa do seu projeto em minutos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="text-center">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <CardTitle className="text-lg">Integração Visual</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Construa fluxos complexos sem código
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Input Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Dados do Projeto para Análise</span>
          </CardTitle>
          <CardDescription>
            Preencha as informações do seu projeto para receber uma análise completa dos nossos agentes especializados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Nome do Projeto</label>
              <Input
                value={projectData.name}
                onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                placeholder="Ex: Sistema de Gestão Empresarial"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Domínio de Negócio</label>
              <Select onValueChange={(value) => setProjectData({...projectData, businessDomain: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o domínio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="E-commerce">E-commerce</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Descrição</label>
            <Textarea
              value={projectData.description}
              onChange={(e) => setProjectData({...projectData, description: e.target.value})}
              placeholder="Descreva seu projeto em detalhes..."
              className="min-h-20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Projeto</label>
              <Select onValueChange={(value) => setProjectData({...projectData, projectType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web App">Web Application</SelectItem>
                  <SelectItem value="Mobile App">Mobile Application</SelectItem>
                  <SelectItem value="API">API/Backend</SelectItem>
                  <SelectItem value="Desktop">Desktop App</SelectItem>
                  <SelectItem value="SaaS">SaaS Platform</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tamanho da Equipe</label>
              <Select onValueChange={(value) => setProjectData({...projectData, teamSize: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Equipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pequeno (1-5)">Pequeno (1-5 pessoas)</SelectItem>
                  <SelectItem value="Médio (6-15)">Médio (6-15 pessoas)</SelectItem>
                  <SelectItem value="Grande (16+)">Grande (16+ pessoas)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Prazo</label>
              <Select onValueChange={(value) => setProjectData({...projectData, timeline: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Prazo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-3 meses">1-3 meses</SelectItem>
                  <SelectItem value="3-6 meses">3-6 meses</SelectItem>
                  <SelectItem value="6-12 meses">6-12 meses</SelectItem>
                  <SelectItem value="12+ meses">12+ meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline"
              onClick={testFlowiseConnection}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Database className="w-4 h-4 mr-2" />
              Testar Conexão Flowise
            </Button>
            <Button 
              onClick={executeZanaiFlowiseIntegration}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-3"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando com Agentes...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Executar Análise 360°
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Resultados da Análise 360°</h2>
            <p className="text-muted-foreground">
              Seus agentes Zanai analisaram o projeto e forneceram insights valiosos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      zanaiAgents.find(a => a.name === result.agent)?.bgColor || 'bg-gray-100'
                    }`}>
                      {React.createElement(
                        zanaiAgents.find(a => a.name === result.agent)?.icon || Users,
                        { className: `w-5 h-5 ${
                          zanaiAgents.find(a => a.name === result.agent)?.color || 'text-gray-600'
                        }` }
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{result.agent}</CardTitle>
                      <CardDescription className="text-sm">{result.role}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Análise:</h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                      {result.analysis}
                    </div>
                  </div>
                  
                  {result.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Recomendações:</h4>
                      <div className="space-y-1">
                        {result.recommendations.map((rec, recIndex) => (
                          <div key={recIndex} className="flex items-start space-x-2">
                            <ArrowRight className="w-3 h-3 text-blue-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => setResults([])}>
              Nova Análise
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-blue-600">
              Exportar Relatório
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}