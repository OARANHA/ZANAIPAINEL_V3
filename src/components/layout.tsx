'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth-provider'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, loading, isConfigured, signOut } = useAuth()

  useEffect(() => {
    // Don't force dark mode - let the theme provider handle it
    // document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      {/* Main Content */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}