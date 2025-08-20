'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">Acesso Negado</CardTitle>
          <CardDescription>
            Você não tem permissão para acessar esta área
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <p className="text-gray-600">
              Esta área é restrita a usuários autorizados. 
              Por favor, entre em contato com o administrador do sistema 
              se você acredita que deveria ter acesso.
            </p>
            
            <div className="space-y-2">
              <Button 
                onClick={() => router.push('/login')} 
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para o Login
              </Button>
              
              <Button 
                onClick={() => router.push('/')} 
                variant="outline"
                className="w-full"
              >
                Ir para a Página Inicial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}