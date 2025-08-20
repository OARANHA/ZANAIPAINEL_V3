'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  Shield, 
  Bell, 
  Database, 
  Zap,
  Settings,
  Save,
  Plus,
  Trash2,
  Key
} from 'lucide-react';

export default function EnterpriseSettingsPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Configurações Corporativas
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gerencie as configurações da sua organização
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Categorias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="default" className="w-full justify-start">
                <Building2 className="w-4 h-4 mr-2" />
                Empresa
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Usuários & Permissões
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Segurança
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Notificações
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Database className="w-4 h-4 mr-2" />
                Integrações
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Zap className="w-4 h-4 mr-2" />
                API & Webhooks
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Dados básicos da sua organização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input id="companyName" defaultValue="Tech Solutions S.A." />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Setor</Label>
                  <Input id="industry" defaultValue="Tecnologia" />
                </div>
                <div>
                  <Label htmlFor="size">Porte da Empresa</Label>
                  <select id="size" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="small">Pequena (1-50 funcionários)</option>
                    <option value="medium" selected>Média (51-500 funcionários)</option>
                    <option value="large">Grande (501+ funcionários)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <textarea 
                  id="description" 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  defaultValue="Empresa especializada em soluções tecnológicas e inovação."
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Gestão de Usuários
              </CardTitle>
              <CardDescription>
                Configure permissões e limites de usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxUsers">Limite de Usuários</Label>
                  <Input id="maxUsers" type="number" defaultValue="50" />
                </div>
                <div>
                  <Label htmlFor="maxAdmins">Limite de Administradores</Label>
                  <Input id="maxAdmins" type="number" defaultValue="5" />
                </div>
              </div>

              <div>
                <Label>Permissões Padrão</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium">Criar Agentes</p>
                      <p className="text-sm text-gray-500">Permitir que usuários criem novos agentes</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ativado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium">Exportar Dados</p>
                      <p className="text-sm text-gray-500">Permitir exportação de relatórios e dados</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ativado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium">Convidar Usuários</p>
                      <p className="text-sm text-gray-500">Permitir que usuários convidem novos membros</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Desativado</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Proteja sua organização com configurações avançadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Timeout de Sessão (minutos)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="30" />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Tentativas de Login</Label>
                  <Input id="maxLoginAttempts" type="number" defaultValue="5" />
                </div>
              </div>

              <div>
                <Label>Autenticação em Dois Fatores</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium">Obrigatório para Admins</p>
                      <p className="text-sm text-gray-500">Exigir 2FA para todos os administradores</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Ativado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium">Obrigatório para Usuários</p>
                      <p className="text-sm text-gray-500">Exigir 2FA para todos os usuários</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-800">Desativado</Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label>Política de Senhas</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium">Comprimento Mínimo</p>
                      <p className="text-sm text-gray-500">8 caracteres</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium">Complexidade</p>
                      <p className="text-sm text-gray-500">Letras, números e caracteres especiais</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div>
                      <p className="font-medium">Expiração</p>
                      <p className="text-sm text-gray-500">90 dias</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Chaves de API
              </CardTitle>
              <CardDescription>
                Gerencie as chaves de API para integrações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Chave de Produção</p>
                  <p className="text-sm text-gray-500">Usada em ambiente de produção</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Copiar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Chave de Desenvolvimento</p>
                  <p className="text-sm text-gray-500">Usada em ambiente de desenvolvimento</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Copiar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Gerar Nova Chave
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}