'use client';

import { ReactNode, useEffect, useState } from 'react';
import { 
  LayoutDashboard, Brain, BarChart3, Settings, Users, Building, 
  LogOut, User, Activity, Star, Zap, FileText, MessageSquare, TrendingUp
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

type UserRole = 'FREE' | 'INICIANTE' | 'PROFISSIONAL' | 'COMPANY_ADMIN' | 'COMPANY_USER' | null;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user role from cookie
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()!.split(';').shift();
      return null;
    };

    const userRole = getCookie('userRole');
    const isAuthenticated = getCookie('isAuthenticated') === 'true';

    if (isAuthenticated && (userRole === 'FREE' || userRole === 'INICIANTE' || 
        userRole === 'PROFISSIONAL' || userRole === 'COMPANY_ADMIN' || userRole === 'COMPANY_USER')) {
      setUserRole(userRole as UserRole);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const getNavItems = () => {
    const baseItems = [
      {
        href: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        active: true
      }
    ];

    // Add items based on user role
    if (userRole === 'FREE') {
      baseItems.push(
        {
          href: '/planos',
          label: 'Planos',
          icon: Star
        },
        {
          href: 'https://code.visualstudio.com/',
          label: 'VS Code',
          icon: FileText,
          external: true
        }
      );
    } else if (userRole === 'INICIANTE' || userRole === 'PROFISSIONAL') {
      baseItems.push(
        {
          href: '/dashboard/agents',
          label: 'Meus Agentes',
          icon: Brain
        },
        {
          href: '/dashboard/analytics',
          label: 'Analytics',
          icon: BarChart3
        }
      );
    }

    // Add settings for all authenticated users
    baseItems.push({
      href: '/dashboard/settings',
      label: 'Configurações',
      icon: Settings
    });

    return baseItems;
  };

  const getHeaderInfo = () => {
    switch (userRole) {
      case 'FREE':
        return {
          title: 'Zanai Gratuito',
          subtitle: 'Painel VS Code',
          color: 'text-blue-600'
        };
      case 'INICIANTE':
        return {
          title: 'Zanai Iniciante',
          subtitle: 'Painel Individual',
          color: 'text-green-600'
        };
      case 'PROFISSIONAL':
        return {
          title: 'Zanai Profissional',
          subtitle: 'Painel Avançado',
          color: 'text-purple-600'
        };
      default:
        return {
          title: 'Zanai Dashboard',
          subtitle: 'Painel Principal',
          color: 'text-blue-600'
        };
    }
  };

  const navItems = getNavItems();
  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-slate-800 shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className={`text-xl font-bold ${headerInfo.color} dark:text-blue-400`}>
                  {headerInfo.title}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {headerInfo.subtitle}
                </p>
              </div>
            </div>
          </div>
          
          <nav className="mt-6">
            <div className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Principal
            </div>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : '_self'}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 ${
                  item.active ? 'bg-blue-50 dark:bg-slate-700' : ''
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
                {item.external && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </a>
            ))}
          </nav>
          
          <div className="absolute bottom-0 w-64 p-6">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="mb-3">
                <div className="flex items-center space-x-2 px-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {userRole === 'FREE' ? 'Usuário Gratuito' :
                     userRole === 'INICIANTE' ? 'Usuário Iniciante' :
                     userRole === 'PROFISSIONAL' ? 'Usuário Profissional' :
                     'Usuário'}
                  </span>
                </div>
              </div>
              <a 
                href="/login" 
                className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 px-2"
                onClick={(e) => {
                  e.preventDefault();
                  // Clear cookies and redirect
                  document.cookie = 'isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                  document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                  document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                  window.location.href = '/login';
                }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </a>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}