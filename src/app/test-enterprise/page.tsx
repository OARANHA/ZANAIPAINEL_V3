'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, Eye, Settings, Building } from 'lucide-react';

export default function EnterpriseTestPage() {
  const [cookies, setCookies] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para ler todos os cookies
    const readAllCookies = () => {
      const allCookies = document.cookie.split(';');
      const cookieObj: any = {
        allCookies: document.cookie,
        parsedCookies: {},
        isAuthenticated: false,
        userRole: null,
        userEmail: null,
        timestamp: new Date().toISOString()
      };

      allCookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          cookieObj.parsedCookies[name] = value;
          
          if (name === 'isAuthenticated') {
            cookieObj.isAuthenticated = value === 'true';
          } else if (name === 'userRole') {
            cookieObj.userRole = value;
          } else if (name === 'userEmail') {
            cookieObj.userEmail = decodeURIComponent(value);
          }
        }
      });

      setCookies(cookieObj);
      setLoading(false);
    };

    readAllCookies();
  }, []);

  const handleManualRedirect = () => {
    console.log('Manual redirect to enterprise...');
    window.location.href = '/enterprise';
  };

  const handleUserRedirect = () => {
    console.log('Manual redirect to enterprise...');
    window.location.href = '/enterprise';
  };

  const clearCookies = () => {
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando diagnóstico...</p>
        </div>
      </div>
    );
  }

  const canAccessEnterprise = cookies.isAuthenticated && ['COMPANY_ADMIN', 'COMPANY_USER'].includes(cookies.userRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Página de Teste - Enterprise
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Diagnóstico de acesso ao Dashboard Empresarial
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {canAccessEnterprise ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span>Status de Acesso</span>
            </CardTitle>
            <CardDescription>
              Verificação das permissões de acesso ao dashboard empresarial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Autenticado:</span>
                  {cookies.isAuthenticated ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>{cookies.isAuthenticated ? 'SIM' : 'NÃO'}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Papel:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    cookies.userRole === 'COMPANY_ADMIN' ? 'bg-purple-100 text-purple-800' :
                    cookies.userRole === 'COMPANY_USER' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {cookies.userRole || 'NÃO DEFINIDO'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Email:</span>
                  <span>{cookies.userEmail || 'NÃO DEFINIDO'}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Acesso ao Enterprise:</span>
                  {canAccessEnterprise ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span>{canAccessEnterprise ? 'PERMITIDO' : 'BLOQUEADO'}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Rota Esperada:</span>
                  <span className="font-mono text-sm">/enterprise</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ArrowRight className="h-5 w-5 text-blue-600" />
                <span>Ações de Redirecionamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleManualRedirect}
                className="w-full mb-2"
                disabled={!canAccessEnterprise}
              >
                <Building className="w-4 h-4 mr-2" />
                Ir para Enterprise
              </Button>
              <Button 
                onClick={handleUserRedirect}
                variant="outline"
                className="w-full"
                disabled={!canAccessEnterprise}
              >
                Ir para Enterprise
              </Button>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Clique para redirecionar manualmente para o dashboard empresarial
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-orange-600" />
                <span>Gerenciamento de Cookies</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                onClick={clearCookies}
                className="w-full"
              >
                Limpar Cookies
              </Button>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Remove todos os cookies de autenticação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Debug Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <span>Informações de Depuração</span>
            </CardTitle>
            <CardDescription>
              Dados completos dos cookies para diagnóstico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg">
              <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-auto">
                {JSON.stringify(cookies, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        {!canAccessEnterprise && (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você não tem permissão para acessar o dashboard empresarial. Verifique se está autenticado e se tem o papel correto (COMPANY_ADMIN ou COMPANY_USER).
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Instruções:</strong><br />
            • Se o acesso estiver permitido, clique em "Ir para Enterprise"<br />
            • O conteúdo será exibido com base no seu papel (Admin ou Funcionário)<br />
            • Se o acesso estiver bloqueado, limpe os cookies e faça login novamente<br />
            • Use esta página para diagnosticar problemas de redirecionamento
          </p>
        </div>
      </div>
    </div>
  );
}