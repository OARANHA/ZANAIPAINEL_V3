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
  Building, 
  Users, 
  CheckCircle, 
  Shield,
  ArrowLeft,
  ArrowRight,
  Info,
  Upload,
  Globe,
  Target,
  TrendingUp,
  Database,
  FileText,
  BarChart3
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface CompleteFormData {
  // Identificação e Jurídico
  name: string;
  email: string;
  clientType: 'individual' | 'company';
  cpf?: string;
  cnpj?: string;
  rg?: string;
  ie?: string;
  birthDate?: string;
  foundingDate?: string;
  
  // Endereço
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Contato
  phone: string;
  whatsapp?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  
  // Perfil Empresarial/Profissional
  sector: string;
  companySize?: string;
  employees?: number;
  mainProducts: string;
  targetAudience: string;
  operationRegion: string;
  
  // Necessidades e Objetivos
  mainProblems: string;
  aiObjectives: string;
  digitalMaturity: string;
  currentTools: string;
  
  // Dados Operacionais
  dataVolume: string;
  dataType: string[];
  updateFrequency: string;
  
  // Contratuais e Financeiros
  paymentMethod: string;
  commercialConditions: string;
  lgpdConsent: boolean;
  marketingConsent: boolean;
  legalResponsible?: string;
  
  // Histórico de Relacionamento
  acquisitionChannel: string;
}

export default function CompleteRegistrationPage() {
  const [formData, setFormData] = useState<CompleteFormData>({
    name: '',
    email: '',
    clientType: 'individual',
    cpf: '',
    cnpj: '',
    rg: '',
    ie: '',
    birthDate: '',
    foundingDate: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    whatsapp: '',
    website: '',
    linkedin: '',
    instagram: '',
    sector: '',
    companySize: '',
    employees: undefined,
    mainProducts: '',
    targetAudience: '',
    operationRegion: '',
    mainProblems: '',
    aiObjectives: '',
    digitalMaturity: '',
    currentTools: '',
    dataVolume: '',
    dataType: [],
    updateFrequency: '',
    paymentMethod: '',
    commercialConditions: '',
    lgpdConsent: false,
    marketingConsent: false,
    legalResponsible: '',
    acquisitionChannel: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = [
    { title: 'Identificação', icon: User },
    { title: 'Endereço', icon: Building },
    { title: 'Contato', icon: Phone },
    { title: 'Perfil', icon: Target },
    { title: 'Necessidades', icon: TrendingUp },
    { title: 'Dados', icon: Database },
    { title: 'Finalização', icon: CheckCircle }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.lgpdConsent) {
      alert('É necessário aceitar os termos de LGPD para continuar');
      return;
    }

    setIsSubmitting(true);

    // Simular envio para o backend
    setTimeout(() => {
      console.log('Dados do cadastro completo:', formData);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 3000);
  };

  const updateFormData = (field: keyof CompleteFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDataType = (type: string) => {
    const currentTypes = formData.dataType || [];
    if (currentTypes.includes(type)) {
      updateFormData('dataType', currentTypes.filter(t => t !== type));
    } else {
      updateFormData('dataType', [...currentTypes, type]);
    }
  };

  const formatInput = (value: string, type: 'cpf' | 'cnpj' | 'cep' | 'phone'): string => {
    const numbers = value.replace(/\D/g, '');
    
    switch (type) {
      case 'cpf':
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
        if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
        return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
      
      case 'cnpj':
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
        if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
        if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
      
      case 'cep':
        if (numbers.length <= 5) return numbers;
        return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
      
      case 'phone':
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
      
      default:
        return value;
    }
  };

  const handleInputChange = (field: keyof CompleteFormData, value: string, formatType?: 'cpf' | 'cnpj' | 'cep' | 'phone') => {
    const formattedValue = formatType ? formatInput(value, formatType) : value;
    updateFormData(field, formattedValue);
  };

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];
    
    switch (step) {
      case 1: // Identificação
        if (!formData.name.trim()) errors.push('Nome/Razão Social é obrigatório');
        if (!formData.email.trim()) errors.push('Email é obrigatório');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.push('Email inválido');
        
        if (formData.clientType === 'individual') {
          if (!formData.cpf?.trim()) errors.push('CPF é obrigatório');
          else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) errors.push('CPF inválido');
        } else {
          if (!formData.cnpj?.trim()) errors.push('CNPJ é obrigatório');
          else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) errors.push('CNPJ inválido');
        }
        break;
        
      case 2: // Endereço
        if (!formData.address.trim()) errors.push('Endereço é obrigatório');
        if (!formData.neighborhood.trim()) errors.push('Bairro é obrigatório');
        if (!formData.city.trim()) errors.push('Cidade é obrigatória');
        if (!formData.state.trim()) errors.push('Estado é obrigatório');
        if (!formData.zipCode.trim()) errors.push('CEP é obrigatório');
        else if (!/^\d{5}-\d{3}$/.test(formData.zipCode)) errors.push('CEP inválido');
        break;
        
      case 3: // Contato
        if (!formData.phone.trim()) errors.push('Telefone Principal é obrigatório');
        else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phone)) errors.push('Telefone inválido');
        break;
        
      case 4: // Perfil
        if (!formData.sector.trim()) errors.push('Setor de Atuação é obrigatório');
        if (!formData.targetAudience.trim()) errors.push('Público-alvo é obrigatório');
        if (!formData.operationRegion.trim()) errors.push('Região de Atuação é obrigatória');
        if (!formData.mainProducts.trim()) errors.push('Principais Produtos/Serviços é obrigatório');
        break;
        
      case 5: // Necessidades
        if (!formData.mainProblems.trim()) errors.push('Principais Problemas é obrigatório');
        if (!formData.aiObjectives.trim()) errors.push('Objetivos com IA é obrigatório');
        if (!formData.digitalMaturity.trim()) errors.push('Nível de Maturidade Digital é obrigatório');
        if (!formData.acquisitionChannel.trim()) errors.push('Canal de Aquisição é obrigatório');
        break;
        
      case 6: // Dados
        if (!formData.dataVolume.trim()) errors.push('Volume de Dados é obrigatório');
        if (!formData.updateFrequency.trim()) errors.push('Frequência de Atualização é obrigatória');
        if (!formData.dataType || formData.dataType.length === 0) errors.push('Selecione pelo menos um tipo de dado');
        break;
    }
    
    return errors;
  };

  const nextStep = () => {
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      alert('Por favor, preencha os campos obrigatórios:\n\n' + errors.join('\n'));
      return;
    }
    
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
      <MainLayout currentPath="/register/complete">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <CardTitle className="text-3xl text-green-600">Cadastro Completo Realizado!</CardTitle>
                <CardDescription className="text-lg">
                  Parabéns! Seu cadastro completo foi realizado com sucesso.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription className="text-base">
                      <strong>Próximos passos:</strong> Você agora tem acesso a todos os recursos 
                      avançados, incluindo pipelines de IA, análise de documentos e dashboards 
                      personalizados. Nossa equipe entrará em contato em até 24h para ativar 
                      seu acesso completo.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-green-200">
                      <CardContent className="pt-6">
                        <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-medium">Pipelines Avançados</h4>
                        <p className="text-sm text-muted-foreground">Acesso completo</p>
                      </CardContent>
                    </Card>
                    <Card className="border-blue-200">
                      <CardContent className="pt-6">
                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <h4 className="font-medium">Análise de Docs</h4>
                        <p className="text-sm text-muted-foreground">Processamento ilimitado</p>
                      </CardContent>
                    </Card>
                    <Card className="border-purple-200">
                      <CardContent className="pt-6">
                        <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <h4 className="font-medium">Suporte Prioritário</h4>
                        <p className="text-sm text-muted-foreground">24/7 dedicado</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" asChild>
                      <a href="/admin">Ir para o Dashboard</a>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a href="/admin/upload">Fazer Upload de Documentos</a>
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
    <MainLayout currentPath="/register/complete">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Cadastro Completo
              </Badge>
              <Badge variant="outline">
                Para Uso Avançado
              </Badge>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Cadastro Completo
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Para acesso a pipelines, análise avançada e todos os recursos do sistema
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>Para empresas e uso avançado de IA</span>
            </div>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              {/* Progress Steps */}
              <div className="mb-6">
                <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index + 1 === currentStep;
                    const isCompleted = index + 1 < currentStep;
                    
                    return (
                      <div key={step.title} className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors ${
                          isActive
                            ? 'border-purple-500 bg-purple-500 text-white'
                            : isCompleted
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-gray-300 text-gray-400'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </div>
                        <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${
                          isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
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
              </div>
              
              <CardTitle>Etapa {currentStep} de {steps.length}</CardTitle>
              <CardDescription>
                {steps[currentStep - 1].title} - Campos marcados com * são obrigatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Identificação e Jurídico */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-3">Tipo de Cliente *</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => updateFormData('clientType', 'individual')}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            formData.clientType === 'individual'
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <User className="w-6 h-6 mx-auto mb-2" />
                          <span className="block font-medium">Pessoa Física</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => updateFormData('clientType', 'company')}
                          className={`p-4 border rounded-lg text-center transition-colors ${
                            formData.clientType === 'company'
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Building className="w-6 h-6 mx-auto mb-2" />
                          <span className="block font-medium">Pessoa Jurídica</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {formData.clientType === 'individual' ? 'Nome Completo *' : 'Razão Social *'}
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => updateFormData('name', e.target.value)}
                          placeholder={formData.clientType === 'individual' ? 'Seu nome completo' : 'Razão Social'}
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
                      
                      {formData.clientType === 'individual' ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2">CPF *</label>
                            <Input
                              value={formData.cpf}
                              onChange={(e) => handleInputChange('cpf', e.target.value, 'cpf')}
                              placeholder="000.000.000-00"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">RG</label>
                            <Input
                              value={formData.rg}
                              onChange={(e) => updateFormData('rg', e.target.value)}
                              placeholder="00.000.000-0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
                            <Input
                              type="date"
                              value={formData.birthDate}
                              onChange={(e) => updateFormData('birthDate', e.target.value)}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2">CNPJ *</label>
                            <Input
                              value={formData.cnpj}
                              onChange={(e) => handleInputChange('cnpj', e.target.value, 'cnpj')}
                              placeholder="00.000.000/0001-00"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Inscrição Estadual</label>
                            <Input
                              value={formData.ie}
                              onChange={(e) => updateFormData('ie', e.target.value)}
                              placeholder="Inscrição Estadual"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Data de Fundação</label>
                            <Input
                              type="date"
                              value={formData.foundingDate}
                              onChange={(e) => updateFormData('foundingDate', e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Endereço */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Endereço *</label>
                        <Input
                          value={formData.address}
                          onChange={(e) => updateFormData('address', e.target.value)}
                          placeholder="Rua, número, complemento"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Bairro *</label>
                        <Input
                          value={formData.neighborhood}
                          onChange={(e) => updateFormData('neighborhood', e.target.value)}
                          placeholder="Bairro"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Cidade *</label>
                        <Input
                          value={formData.city}
                          onChange={(e) => updateFormData('city', e.target.value)}
                          placeholder="Cidade"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Estado *</label>
                        <Input
                          value={formData.state}
                          onChange={(e) => updateFormData('state', e.target.value)}
                          placeholder="UF"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">CEP *</label>
                        <Input
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value, 'cep')}
                          placeholder="00000-000"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Contato */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Telefone Principal *</label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value, 'phone')}
                          placeholder="(00) 00000-0000"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">WhatsApp</label>
                        <Input
                          value={formData.whatsapp}
                          onChange={(e) => handleInputChange('whatsapp', e.target.value, 'phone')}
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Site</label>
                        <Input
                          value={formData.website}
                          onChange={(e) => updateFormData('website', e.target.value)}
                          placeholder="https://seusite.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">LinkedIn</label>
                        <Input
                          value={formData.linkedin}
                          onChange={(e) => updateFormData('linkedin', e.target.value)}
                          placeholder="https://linkedin.com/in/seuperfil"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Instagram</label>
                        <Input
                          value={formData.instagram}
                          onChange={(e) => updateFormData('instagram', e.target.value)}
                          placeholder="@seuperfil"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Perfil Empresarial/Profissional */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Setor de Atuação *</label>
                        <Select value={formData.sector} onValueChange={(value) => updateFormData('sector', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o setor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Tecnologia</SelectItem>
                            <SelectItem value="healthcare">Saúde</SelectItem>
                            <SelectItem value="finance">Financeiro</SelectItem>
                            <SelectItem value="retail">Varejo</SelectItem>
                            <SelectItem value="manufacturing">Indústria</SelectItem>
                            <SelectItem value="education">Educação</SelectItem>
                            <SelectItem value="consulting">Consultoria</SelectItem>
                            <SelectItem value="legal">Jurídico</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {formData.clientType === 'company' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2">Porte da Empresa</label>
                            <Select value={formData.companySize} onValueChange={(value) => updateFormData('companySize', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o porte" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mei">MEI</SelectItem>
                                <SelectItem value="small">Pequena</SelectItem>
                                <SelectItem value="medium">Média</SelectItem>
                                <SelectItem value="large">Grande</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Número de Colaboradores</label>
                            <Input
                              type="number"
                              value={formData.employees || ''}
                              onChange={(e) => updateFormData('employees', parseInt(e.target.value) || undefined)}
                              placeholder="Ex: 50"
                            />
                          </div>
                        </>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Público-alvo *</label>
                        <Select value={formData.targetAudience} onValueChange={(value) => updateFormData('targetAudience', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o público" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="b2b">B2B</SelectItem>
                            <SelectItem value="b2c">B2C</SelectItem>
                            <SelectItem value="mixed">Misto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Região de Atuação *</label>
                        <Select value={formData.operationRegion} onValueChange={(value) => updateFormData('operationRegion', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a região" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regional">Regional</SelectItem>
                            <SelectItem value="national">Nacional</SelectItem>
                            <SelectItem value="international">Internacional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">
                          {formData.clientType === 'company' ? 'Principais Produtos/Serviços *' : 'Principais Habilidades/Serviços *'}
                        </label>
                        <Textarea
                          value={formData.mainProducts}
                          onChange={(e) => updateFormData('mainProducts', e.target.value)}
                          placeholder="Descreva seus principais produtos, serviços ou habilidades..."
                          rows={3}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Necessidades e Objetivos */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Principais Problemas Enfrentados *</label>
                        <Textarea
                          value={formData.mainProblems}
                          onChange={(e) => updateFormData('mainProblems', e.target.value)}
                          placeholder="Quais são os principais desafios que você enfrenta no seu negócio?"
                          rows={3}
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Objetivos com IA *</label>
                        <Textarea
                          value={formData.aiObjectives}
                          onChange={(e) => updateFormData('aiObjectives', e.target.value)}
                          placeholder="O que você espera alcançar com a utilização de Inteligência Artificial?"
                          rows={3}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Nível de Maturidade Digital *</label>
                        <Select value={formData.digitalMaturity} onValueChange={(value) => updateFormData('digitalMaturity', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baixo</SelectItem>
                            <SelectItem value="medium">Médio</SelectItem>
                            <SelectItem value="advanced">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Canal de Aquisição *</label>
                        <Select value={formData.acquisitionChannel} onValueChange={(value) => updateFormData('acquisitionChannel', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Como nos conheceu?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="indication">Indicação</SelectItem>
                            <SelectItem value="website">Site</SelectItem>
                            <SelectItem value="event">Evento</SelectItem>
                            <SelectItem value="social">Rede Social</SelectItem>
                            <SelectItem value="search">Busca Online</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Ferramentas Atuais</label>
                        <Textarea
                          value={formData.currentTools}
                          onChange={(e) => updateFormData('currentTools', e.target.value)}
                          placeholder="Quais ferramentas você usa atualmente? (CRM, ERP, BI, etc.)"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Dados Operacionais */}
                {currentStep === 6 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Volume de Dados *</label>
                        <Select value={formData.dataVolume} onValueChange={(value) => updateFormData('dataVolume', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o volume" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Pequeno</SelectItem>
                            <SelectItem value="medium">Médio</SelectItem>
                            <SelectItem value="large">Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Frequência de Atualização *</label>
                        <Select value={formData.updateFrequency} onValueChange={(value) => updateFormData('updateFrequency', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a frequência" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Diária</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Tipos de Dados Disponíveis *</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            { value: 'text', label: 'Textos (Docs, Relatórios)' },
                            { value: 'structured', label: 'Dados Estruturados (Planilhas)' },
                            { value: 'audio', label: 'Áudio/Voz' },
                            { value: 'images', label: 'Imagens' }
                          ].map(type => (
                            <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                              <Checkbox
                                checked={formData.dataType?.includes(type.value)}
                                onCheckedChange={() => toggleDataType(type.value)}
                              />
                              <span className="text-sm">{type.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Forma de Pagamento Preferencial</label>
                        <Select value={formData.paymentMethod} onValueChange={(value) => updateFormData('paymentMethod', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a forma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="boleto">Boleto</SelectItem>
                            <SelectItem value="pix">PIX</SelectItem>
                            <SelectItem value="card">Cartão</SelectItem>
                            <SelectItem value="recurrence">Recorrência</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {formData.clientType === 'company' && (
                        <div>
                          <label className="block text-sm font-medium mb-2">Responsável Legal</label>
                          <Input
                            value={formData.legalResponsible}
                            onChange={(e) => updateFormData('legalResponsible', e.target.value)}
                            placeholder="Nome do responsável legal"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 7: Finalização */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    {/* LGPD Consent */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                      <div className="flex items-start space-x-3 mb-4">
                        <Shield className="w-6 h-6 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-900 dark:text-purple-100">LGPD - Proteção de Dados</h4>
                          <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                            Seus dados estão protegidos pela Lei Geral de Proteção de Dados.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="lgpd-consent"
                            checked={formData.lgpdConsent}
                            onCheckedChange={(checked) => updateFormData('lgpdConsent', checked)}
                          />
                          <label htmlFor="lgpd-consent" className="text-sm leading-relaxed cursor-pointer">
                            <strong>Consentimento LGPD *</strong> - Autorizo o tratamento de meus dados 
                            pessoais para os fins descritos na Política de Privacidade, incluindo:
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              <li>Fornecimento dos serviços de IA e análise de dados</li>
                              <li>Personalização da experiência e melhorias nos serviços</li>
                              <li>Comunicação operacional e suporte</li>
                              <li>Análise para melhorias e desenvolvimento de novos recursos</li>
                            </ul>
                            Estou ciente de que posso solicitar a exclusão dos dados a qualquer momento.
                          </label>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="marketing-consent"
                            checked={formData.marketingConsent}
                            onCheckedChange={(checked) => updateFormData('marketingConsent', checked)}
                          />
                          <label htmlFor="marketing-consent" className="text-sm leading-relaxed cursor-pointer">
                            Aceito receber comunicações sobre novidades, produtos e serviços 
                            (opcional, posso desistir a qualquer momento).
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Resumo do Cadastro</CardTitle>
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
                            <span className="font-medium">Tipo:</span> {formData.clientType === 'individual' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                          </div>
                          <div>
                            <span className="font-medium">Setor:</span> {formData.sector}
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Objetivos com IA:</span> {formData.aiObjectives}
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
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isSubmitting ? 'Finalizando...' : 'Finalizar Cadastro Completo'}
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