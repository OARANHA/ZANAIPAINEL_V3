'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Building, 
  Users, 
  Target, 
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Database,
  BarChart3,
  FileText,
  Globe,
  TrendingUp,
  Code,
  Download,
  Copy
} from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

export default function RegisterPage() {
  const vscodeFeatures = [
    { icon: Code, title: 'Plugin VS Code', description: 'Integração completa com VS Code' },
    { icon: FileText, title: '100+ Prompts', description: 'Biblioteca de prompts especializados' },
    { icon: Download, title: 'Download Templates', description: 'Templates prontos para uso' },
    { icon: Copy, title: 'Montagem de Prompts', description: 'Crie seus próprios prompts' }
  ];

  const basicFeatures = [
    { icon: Users, title: 'Acesso à Extensão', description: 'Use nossos agentes no navegador' },
    { icon: Zap, title: 'Agentes Básicos', description: 'Acesso a agentes pré-configurados' },
    { icon: Shield, title: 'Suporte por Email', description: 'Atendimento básico via email' },
    { icon: Star, title: 'Atualizações', description: 'Acesso a novas funcionalidades' }
  ];

  const completeFeatures = [
    { icon: Target, title: 'Pipelines Avançados', description: 'Crie fluxos complexos de IA' },
    { icon: Database, title: 'Análise de Documentos', description: 'Processamento ilimitado de docs' },
    { icon: BarChart3, title: 'Dashboards Personalizados', description: 'Relatórios e insights avançados' },
    { icon: FileText, title: 'OCR e Extração', description: 'Extração inteligente de dados' },
    { icon: Globe, title: 'API Completa', description: 'Integração com seus sistemas' },
    { icon: TrendingUp, title: 'Suporte Prioritário', description: 'Atendimento 24/7 dedicado' },
    { icon: Users, title: 'Múltiplos Usuários', description: 'Gerenciamento de equipes' },
    { icon: Shield, title: 'Segurança Avançada', description: 'Criptografia e compliance' }
  ];

  return (
    <MainLayout currentPath="/register">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Escolha seu Tipo de Cadastro
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Oferecemos três tipos de cadastro para atender diferentes necessidades. 
              Escolha o que melhor se adapta ao seu perfil de uso.
            </p>
          </div>

          {/* Comparison Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* VS Code Registration */}
            <Card className="relative overflow-hidden border-2 border-green-200 hover:border-green-300 transition-colors">
              <div className="absolute top-0 left-0 w-full bg-green-500 text-white text-center py-2 text-sm font-medium">
                VS Code Gratuito
              </div>
              <div className="pt-8">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Para Desenvolvedores</CardTitle>
                  <CardDescription className="text-lg">
                    Plugin VS Code para montagem e download de prompts
                  </CardDescription>
                  <div className="flex justify-center mt-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Gratuito
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {vscodeFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Indicado para:</h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                      <li>• Desenvolvedores e programadores</li>
                      <li>• Entusiastas de IA e prompts</li>
                      <li>• Quem usa VS Code diariamente</li>
                      <li>• Quer testar prompts especializados</li>
                    </ul>
                  </div>

                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <Link href="/register/vscode">
                      Registrar VS Code
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>

            {/* Basic Registration */}
            <Card className="relative overflow-hidden border-2 border-blue-200 hover:border-blue-300 transition-colors">
              <div className="absolute top-0 left-0 w-full bg-blue-500 text-white text-center py-2 text-sm font-medium">
                Cadastro Básico
              </div>
              <div className="pt-8">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Para Uso Individual</CardTitle>
                  <CardDescription className="text-lg">
                    Ideal para quem quer usar a extensão e serviços básicos
                  </CardDescription>
                  <div className="flex justify-center mt-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl font-bold text-blue-600">R$ 290,00</span>
                        <span className="text-lg text-gray-500 line-through">R$ 380,00</span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-2">
                        24% de desconto
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {basicFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Indicado para:</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Profissionais autônomos</li>
                      <li>• Estudantes e pesquisadores</li>
                      <li>• Pequenos empreendedores</li>
                      <li>• Quem busca recursos essenciais</li>
                    </ul>
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <Link href="/register/basic">
                      Começar Cadastro Básico
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>

            {/* Complete Registration */}
            <Card className="relative overflow-hidden border-2 border-purple-200 hover:border-purple-300 transition-colors">
              <div className="absolute top-0 left-0 w-full bg-purple-500 text-white text-center py-2 text-sm font-medium">
                Cadastro Completo
              </div>
              <div className="pt-8">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl">Para Uso Avançado</CardTitle>
                  <CardDescription className="text-lg">
                    Para empresas e quem precisa de recursos completos
                  </CardDescription>
                  <div className="flex justify-center mt-4">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Recursos Avançados
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    {completeFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">{feature.title}</h4>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Indicado para:</h4>
                    <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                      <li>• Empresas de todos os portes</li>
                      <li>• Equipes que precisam de colaboração</li>
                      <li>• Projetos com grande volume de dados</li>
                      <li>• Quem precisa de integração avançada</li>
                    </ul>
                  </div>

                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link href="/register/complete">
                      Começar Cadastro Completo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Comparison Table */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Comparação Detalhada</CardTitle>
              <CardDescription>
                Veja as diferenças entre os tipos de cadastro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Funcionalidade</th>
                      <th className="text-center py-3 px-4">VS Code</th>
                      <th className="text-center py-3 px-4">Cadastro Básico</th>
                      <th className="text-center py-3 px-4">Cadastro Completo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Plugin VS Code</td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Biblioteca de Prompts</td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Acesso à Extensão</td>
                      <td className="text-center py-3 px-4">
                        <span className="text-yellow-600">Limitado</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Agentes Pré-configurados</td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Criação de Pipelines</td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Análise de Documentos</td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-yellow-600">Limitado</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">API de Integração</td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Suporte Prioritário</td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Múltiplos Usuários</td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Dashboards Avançados</td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="text-red-600">✗</span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Preço</td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="secondary">Gratuito</Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-blue-600">R$ 290,00</div>
                          <div className="text-xs text-gray-500 line-through">R$ 380,00</div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="secondary">Sob Consulta</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* LGPD Information */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Compromisso com a LGPD</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Proteção de Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    Todos os cadastros são protegidos pela Lei Geral de Proteção de Dados. 
                    Seus informações são seguras e tratadas com o máximo de cuidado.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Transparência</h4>
                  <p className="text-sm text-muted-foreground">
                    Informamos claramente como seus dados serão usados e você tem 
                    total controle sobre eles, podendo solicitá-los ou excluí-los a qualquer momento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}