'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AuthUser {
  id: string
  email?: string
  name?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<{ error: { message: string } | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(true)

  useEffect(() => {
    // Verificar autenticação através de cookies ao carregar
    const checkAuth = () => {
      const isAuthenticated = document.cookie.includes('isAuthenticated=true')
      const userEmail = document.cookie
        .split('; ')
        .find(row => row.startsWith('userEmail='))
        ?.split('=')[1]
      const userName = document.cookie
        .split('; ')
        .find(row => row.startsWith('userName='))
        ?.split('=')[1]

      if (isAuthenticated && userEmail) {
        setUser({
          id: 'demo-user',
          email: decodeURIComponent(userEmail),
          name: decodeURIComponent(userName || userEmail.split('@')[0])
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const signOut = async () => {
    // Limpar todos os cookies de autenticação
    document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'userName=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    setUser(null)
    setError(null)
  }

  const signIn = async (email: string, password: string) => {
    setError(null)
    setLoading(true)

    try {
      // Simulação de login - em produção, integrar com backend real
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular login bem-sucedido - aceita qualquer email/senha para demonstração
      document.cookie = 'isAuthenticated=true; path=/; max-age=86400' // 24 horas
      document.cookie = `userEmail=${email}; path=/; max-age=86400`
      document.cookie = `userName=${email.split('@')[0]}; path=/; max-age=86400` // Nome baseado no email
      
      setUser({
        id: 'demo-user',
        email: email,
        name: email.split('@')[0]
      })
      
      return { error: null }
    } catch (error) {
      const errorMessage = 'E-mail ou senha incorretos'
      setError(errorMessage)
      return { error: { message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string, phone?: string) => {
    setError(null)
    setLoading(true)

    try {
      // Simulação de cadastro - em produção, integrar com backend real
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres')
      }
      
      // Simular cadastro bem-sucedido
      document.cookie = 'isAuthenticated=true; path=/; max-age=86400' // 24 horas
      document.cookie = `userEmail=${email}; path=/; max-age=86400`
      document.cookie = `userName=${name || email.split('@')[0]}; path=/; max-age=86400`
      
      setUser({
        id: 'demo-user',
        email: email,
        name: name || email.split('@')[0]
      })
      
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta'
      setError(errorMessage)
      return { error: { message: errorMessage } }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, isConfigured, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}