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
  ArrowRight,
  Info
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface BasicFormData {
  name: string;
  email: string;
  phone: string;
  clientType: 'individual' | 'company';
  cpf?: string;
  cnpj?: string;
  lgpdConsent: boolean;
  marketingConsent: boolean;
}

export default function BasicRegistrationPage() {
  const [formData, setFormData] = useState<BasicFormData>({
    name: '',
    email: '',
    phone: '',
    clientType: 'individual',
    cpf: '',
    cnpj: '',
    lgpdConsent: false,
    marketingConsent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.clientType === 'individual' && !formData.cpf) {
      alert('Para pessoa física, o CPF é obrigatório');
      return;
    }

    if (formData.clientType === 'company' && !formData.cnpj) {
      alert('Para pessoa jurídica, o CNPJ é obrigatório');
      return;
    }

    if (!formData.lgpdConsent) {
      alert('É necessário aceitar os termos de LGPD para continuar');
      return;
    }

    setIsSubmitting(true);

    // Simular envio para o backend
    setTimeout(() => {
      console.log('Dados do cadastro básico:', formData);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const updateFormData = (field: keyof BasicFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSubmitted) {
    return (
      <MainLayout currentPath="/register/basic">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">Cadastro Realizado com Sucesso!</CardTitle>
                <CardDescription>
                  Seu cadastro básico foi concluído. Agora você pode usar nossos serviços básicos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      <strong>Próximos passos:</strong> Você receberá um email de confirmação 
                      e poderá acessar nossos serviços básicos imediatamente.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <a href="/admin">Ir para o Dashboard</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/register/complete">Fazer Cadastro Completo</a>
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
    <MainLayout currentPath="/register/basic">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Cadastro Básico
              </Badge>
              <Badge variant="outline">
                Gratuito
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Cadastro Básico
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Para uso da extensão e serviços básicos. Rápido e simples!
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Para uso individual e extensão</span>
            </div>
          </div>

          {/* Benefits */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">O que você ganha com o cadastro básico:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Acesso à Extensão</h4>
                    <p className="text-sm text-muted-foreground">Use nossos agentes no navegador</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Agentes Básicos</h4>
                    <p className="text-sm text-muted-foreground">Acesso a agentes pré-configurados</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Suporte por Email</h4>
                    <p className="text-sm text-muted-foreground">Atendimento básico via email</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Atualizações</h4>
                    <p className="text-sm text-muted-foreground">Acesso a novas funcionalidades</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Preencha seus dados</CardTitle>
              <CardDescription>
                Campos marcados com * são obrigatórios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de Cliente */}
                <div>
                  <label className="block text-sm font-medium mb-3">Tipo de Cliente *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => updateFormData('clientType', 'individual')}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        formData.clientType === 'individual'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <User className="w-6 h-6 mx-auto mb-2" />
                      <span className="block font-medium">Pessoa Física</span>
                      <span className="block text-xs text-muted-foreground">Uso individual</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFormData('clientType', 'company')}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        formData.clientType === 'company'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Building className="w-6 h-6 mx-auto mb-2" />
                      <span className="block font-medium">Pessoa Jurídica</span>
                      <span className="block text-xs text-muted-foreground">Uso empresarial</span>
                    </button>
                  </div>
                </div>

                {/* Dados Básicos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome Completo *</label>
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
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone *</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {formData.clientType === 'individual' ? 'CPF *' : 'CNPJ *'}
                    </label>
                    <Input
                      value={formData.clientType === 'individual' ? formData.cpf || '' : formData.cnpj || ''}
                      onChange={(e) => updateFormData(formData.clientType === 'individual' ? 'cpf' : 'cnpj', e.target.value)}
                      placeholder={formData.clientType === 'individual' ? '000.000.000-00' : '00.000.000/0001-00'}
                      required
                    />
                  </div>
                </div>

                {/* LGPD Consent */}
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">LGPD - Proteção de Dados</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Seus dados estão protegidos pela Lei Geral de Proteção de Dados.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="lgpd-consent"
                        checked={formData.lgpdConsent}
                        onCheckedChange={(checked) => updateFormData('lgpdConsent', checked)}
                      />
                      <label htmlFor="lgpd-consent" className="text-sm leading-relaxed cursor-pointer">
                        <strong>Consentimento LGPD *</strong> - Autorizo o tratamento de meus dados 
                        pessoais para os fins descritos na Política de Privacidade, incluindo o 
                        fornecimento dos serviços contratados e melhorias na experiência do usuário.
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

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro Básico'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    asChild
                  >
                    <a href="/register/complete" className="flex items-center space-x-2">
                      <span>Quero Cadastro Completo</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}