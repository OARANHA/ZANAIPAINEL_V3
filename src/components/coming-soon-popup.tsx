"use client"
import { Clock, Sparkles, Star, Zap } from "lucide-react"
import * as React from "react"
import { useEffect, useState } from "react"

interface ComingSoonPopupProps {
  children?: React.ReactNode
  trigger?: React.ReactNode
  title?: string
  description?: string
}

export function ComingSoonPopup({ 
  children,
  trigger,
  title = " Em Breve!", 
  description = "Estamos trabalhando arduamente para trazer algo incrível. Fique ligado para não perder a grande revelação!"
}: ComingSoonPopupProps) {
  const [open, setOpen] = useState(false)
  const triggerContent = trigger || children;
  
  // Fechar popup ao pressionar ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])
  
  // Impedir rolagem da página quando o popup está aberto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false)
    }
  }
  
  return (
    <>
      <div onClick={() => setOpen(true)}>
        {triggerContent}
      </div>
      
      {open && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          style={{ 
            position: 'fixed',
            top: '250px' ,
            left: 0,
            right: 0,
            bottom: 0,
            padding: '20px',
            boxSizing: 'border-box'
          }}
          onClick={handleOverlayClick}
        >
          <div 
            className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-700 bg-clip-text text-transparent">
                  {title}
                </h2>
                <button 
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-accent"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  <span className="sr-only">Fechar</span>
                </button>
              </div>
              
              <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
                {description}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Estamos quase lá...</span>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500/10 to-blue-700/10 rounded-lg p-4 border border-orange-200/50 dark:border-blue-800/50">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Sparkles className="h-5 w-5 text-orange-500" />
                    <span className="font-medium text-orange-700 dark:text-orange-300">Novidades em breve</span>
                  </div>
                  <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                    Em breve, teremos recursos exclusivos para novos clientes que vão revolucionar sua experiência.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-orange-500" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Inovação</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Performance</span>
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Exclusividade</span>
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-center text-blue-700 dark:text-blue-300">
                    🚀 <strong>Fique de olho!</strong> Em breve lançaremos uma experiência incrível que vai mudar o jeito que você trabalha.
                  </p>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <button 
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-blue-700 text-white rounded-md hover:opacity-90 transition-opacity"
                  >
                    Entendi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}