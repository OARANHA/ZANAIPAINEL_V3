'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Phone, 
  Code, 
  Download, 
  Copy, 
  Save,
  CheckCircle,
  Shield,
  ArrowLeft,
  ArrowRight,
  Info,
  VSCode,
  FileText,
  Brain,
  Zap
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface VSCodeFormData {
  name: string;
  email: string;
  company?: string;
  role: string;
  experience: string;
  interests: string[];
  termsAccepted: boolean;
}

export default function VSCodeRegistrationPage() {
  const [formData, setFormData] = useState<VSCodeFormData>({
    name: '',
    email: '',
    company: '',
    role: '',
    experience: '',
    interests: [],
    termsAccepted: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    { title: 'Informações Básicas', icon: User },
    { title: 'Experiência', icon: Code },
    { title: 'Interesses', icon: Brain },
    { title: 'Finalização', icon: CheckCircle }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Iniciante', description: 'Começando com IA e prompts' },
    { value: 'intermediate', label: 'Intermediário', description: 'Alguma experiência com prompts' },
    { value: 'advanced', label: 'Avançado', description: 'Experiente com IA e desenvolvimento' }
  ];

  const interestOptions = [
    { value: 'prompts', label: 'Criação de Prompts', icon: FileText },
    { value: 'agents', label: 'Construção de Agents', icon: Brain },
    { value: 'automation', label: 'Automação de Tarefas', icon: Zap },
    { value: 'integration', label: 'Integração VS Code', icon: Code }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      alert('É necessário aceitar os termos para continuar');
      return;
    }

    setIsSubmitting(true);

    // Simular envio para o backend
    setTimeout(() => {
      console.log('Dados do registro VS Code:', formData);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const updateFormData = (field: keyof VSCodeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = formData.interests || [];
    if (currentInterests.includes(interest)) {
      updateFormData('interests', currentInterests.filter(i => i !== interest));
    } else {
      updateFormData('interests', [...currentInterests, interest]);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSubmitted) {
    return (
      <MainLayout currentPath="/register/vscode">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-3xl text-green-600">Registro VS Code Concluído!</CardTitle>
                <CardDescription className="text-lg">
                  Parabéns! Seu registro gratuito para o plugin VS Code foi realizado com sucesso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <VSCode className="w-4 h-4" />
                    <AlertDescription className="text-base">
                      <strong>Próximos passos:</strong> Você receberá um email com as instruções 
                      para instalar o plugin VS Code e acessar a biblioteca de prompts especializados.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-blue-200">
                      <CardContent className="pt-6">
                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium">Biblioteca de Prompts</h4>
                        <p className="text-sm text-muted-foreground">Acesso ilimitado</p>
                      </CardContent>
                    </Card>
                    <Card className="border-purple-200">
                      <CardContent className="pt-6">
                        <Code className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium">Plugin VS Code</h4>
                        <p className="text-sm text-muted-foreground">Gratuito e funcional</p>
                      </CardContent>
                    </Card>
                    <Card className="border-green-200">
                      <CardContent className="pt-6">
                        <Download className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium">Templates Prontos</h4>
                        <p className="text-sm text-muted-foreground">Para começar rápido</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h4 className="font-medium mb-4">O que você terá acesso:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          100+ prompts especializados
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Templates para agents
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Plugin VS Code gratuito
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Atualizações mensais
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Comunidade exclusiva
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Tutoriais e guias
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                      <a href="https://marketplace.visualstudio.com/items?itemName=zanai.vscode-plugin" target="_blank" rel="noopener noreferrer">
                        <VSCode className="w-4 h-4 mr-2" />
                        Instalar Plugin VS Code
                      </a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="/register">
                        Ver Planos Completos
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout currentPath="/register/vscode">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <VSCode className="w-4 h-4 mr-2" />
                Registro VS Code
              </Badge>
              <Badge variant="outline">
                Gratuito
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Registro Gratuito VS Code
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Acesso gratuito ao plugin VS Code para montagem e download de prompts especializados
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Code className="w-4 h-4" />
              <span>Para desenvolvedores e entusiastas de IA</span>
            </div>
          </div>

          {/* Progress Steps */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index + 1 === currentStep;
                  const isCompleted = index + 1 < currentStep;
                  
                  return (
                    <div key={step.title} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors ${
                        isActive
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : isCompleted
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </div>
                      <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                          index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Etapa {currentStep} de {steps.length}</CardTitle>
              <CardDescription>
                {steps[currentStep - 1].title} - Campos marcados com * são obrigatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Informações Básicas */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nome Completo *</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          placeholder="Seu nome completo"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Empresa</label>
                        <Input
                          value={formData.company}
                          onChange={(e) => updateFormData('company', e.target.value)}
                          placeholder="Sua empresa (opcional)"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Cargo/Função *</label>
                        <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="developer">Desenvolvedor</SelectItem>
                            <SelectItem value="designer">Designer</SelectItem>
                            <SelectItem value="manager">Gerente/Coordenador</SelectItem>
                            <SelectItem value="entrepreneur">Empreendedor</SelectItem>
                            <SelectItem value="student">Estudante</SelectItem>
                            <SelectItem value="freelancer">Freelancer</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Experiência */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-4">Nível de Experiência com IA *</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {experienceLevels.map((level) => (
                          <div
                            key={level.value}
                            onClick={() => updateFormData('experience', level.value)}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              formData.experience === level.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <h4 className="font-medium mb-1">{level.label}</h4>
                            <p className="text-sm text-muted-foreground">{level.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Interesses */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-4">Quais são seus principais interesses? *</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {interestOptions.map((interest) => {
                          const Icon = interest.icon;
                          return (
                            <label
                              key={interest.value}
                              className="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors hover:border-blue-300"
                            >
                              <Checkbox
                                checked={formData.interests?.includes(interest.value)}
                                onCheckedChange={() => toggleInterest(interest.value)}
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Icon className="w-4 h-4" />
                                  <span className="font-medium">{interest.label}</span>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Finalização */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    {/* Terms */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                      <div className="flex items-start space-x-3 mb-4">
                        <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 dark:text-blue-100">Termos de Uso</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Este registro é para uso gratuito do plugin VS Code e acesso a prompts.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="terms-accepted"
                            checked={formData.termsAccepted}
                            onCheckedChange={(checked) => updateFormData('termsAccepted', checked)}
                          />
                          <label htmlFor="terms-accepted" className="text-sm leading-relaxed cursor-pointer">
                            <strong>Aceito os termos de uso *</strong> - Concordo com os termos de uso 
                            do plugin VS Code e entendo que este é um registro gratuito com acesso 
                            limitado a funcionalidades de montagem e download de prompts.
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Resumo do Registro</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Nome:</span> {formData.name}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {formData.email}
                          </div>
                          <div>
                            <span className="font-medium">Cargo:</span> {formData.role}
                          </div>
                          <div>
                            <span className="font-medium">Experiência:</span> {experienceLevels.find(l => l.value === formData.experience)?.label}
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Interesses:</span> {formData.interests?.join(', ') || 'Nenhum selecionado'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>

                  <div className="flex space-x-2">
                    {currentStep < steps.length ? (
                      <Button type="button" onClick={nextStep}>
                        Próximo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? 'Finalizando...' : 'Finalizar Registro VS Code'}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}