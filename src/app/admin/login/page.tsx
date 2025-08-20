'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Shield } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/admin/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType: 'admin' }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token in localStorage for client-side auth
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('user-role', data.user.role)
        
        // Set cookies for middleware authentication
        document.cookie = `isAuthenticated=true; path=/; max-age=86400`
        document.cookie = `userRole=${data.user.role}; path=/; max-age=86400`
        document.cookie = `userEmail=${encodeURIComponent(data.user.email)}; path=/; max-age=86400`
        document.cookie = `userName=${encodeURIComponent(data.user.name)}; path=/; max-age=86400`
        
        // Redirect to appropriate dashboard based on role
        if (data.user.role === 'SUPER_ADMIN') {
          router.push('/admin')
        } else {
          router.push('/painel')
        }
      } else {
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-700 bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Painel de Administração</CardTitle>
          <CardDescription className="text-gray-300">
            Acesso exclusivo para Super Administradores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Super Admin Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email de Administrador</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@zanai.com"
                  required
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-300">Senha de Acesso</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold" 
                disabled={loading}
              >
                {loading ? 'Autenticando...' : 'Acessar Painel Administrativo'}
              </Button>
            </form>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            <p className="flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Acesso restrito e monitorado
            </p>
            <p className="mt-1 text-xs">Todas as ações são registradas para segurança</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}