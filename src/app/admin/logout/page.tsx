'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, Shield, CheckCircle } from 'lucide-react'

export default function LogoutPage() {
  const [countdown, setCountdown] = useState(3)
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Chamar API de logout do servidor para limpar cookies no lado do servidor
        await fetch('/admin/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      } catch (error) {
        console.error('Erro ao chamar API de logout:', error)
      }
      
      // Função para limpar cookies de forma mais robusta no lado do cliente
      const clearCookies = () => {
        const cookies = ['isAuthenticated', 'userEmail', 'userName', 'userRole', 'auth-token']
        cookies.forEach(cookieName => {
          // Limpar cookie com múltiplos parâmetros para garantir remoção completa
          document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}`
          document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          document.cookie = `${cookieName}=; path=/admin; expires=Thu, 01 Jan 1970 00:00:00 GMT`
          document.cookie = `${cookieName}=; path=/admin/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        })
      }

      // Limpar todos os cookies de autenticação no cliente
      clearCookies()
      
      // Limpar localStorage
      localStorage.removeItem('auth-token')
      localStorage.removeItem('user-role')
      
      // Limpar sessionStorage também
      sessionStorage.clear()

      // Forçar uma verificação adicional após um pequeno delay
      setTimeout(() => {
        clearCookies()
      }, 100)
    }

    // Executar logout
    performLogout()

    // Countdown para redirecionamento
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Forçar redirecionamento duro em vez de usar router.push
          window.location.href = '/admin/login'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleRedirectNow = () => {
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-700 bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Até Logo!</CardTitle>
          <CardDescription className="text-gray-300">
            Você saiu do sistema com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-gray-400">
                Obrigado por usar o Zanai Project. Sua sessão foi encerrada com segurança.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Todos os dados foram limpos com segurança</span>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-2">
                Você será redirecionado para a página de login em:
              </p>
              <div className="text-2xl font-bold text-green-400">
                {countdown}
              </div>
              <p className="text-xs text-gray-400 mt-1">segundos</p>
            </div>

            <Button 
              onClick={handleRedirectNow}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Ir para o Login Agora
            </Button>

            <div className="text-xs text-gray-500">
              <p>Need help? Contact support@zanai.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}