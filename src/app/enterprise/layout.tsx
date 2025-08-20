'use client';

import { ReactNode, useEffect, useState } from 'react';
import { 
  LayoutDashboard, Brain, BarChart3, Settings, Users, Building, 
  LogOut, User, Activity
} from 'lucide-react';

interface EnterpriseLayoutProps {
  children: ReactNode;
}

type UserRole = 'COMPANY_ADMIN' | 'COMPANY_USER' | null;

export default function EnterpriseLayout({ children }: EnterpriseLayoutProps) {
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

    if (isAuthenticated && (userRole === 'COMPANY_ADMIN' || userRole === 'COMPANY_USER')) {
      setUserRole(userRole as UserRole);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const getNavItems = () => {
    const baseItems = [
      {
        href: '/enterprise',
        label: 'Dashboard',
        icon: LayoutDashboard,
        active: true
      },
      {
        href: '/enterprise/agents',
        label: userRole === 'COMPANY_ADMIN' ? 'Agentes da Empresa' : 'Meus Agentes',
        icon: Brain
      },
      {
        href: '/enterprise/analytics',
        label: 'Analytics',
        icon: BarChart3
      }
    ];

    // Admin-only items
    if (userRole === 'COMPANY_ADMIN') {
      baseItems.push({
        href: '/enterprise/admin',
        label: 'Administração',
        icon: Users
      });
    }

    baseItems.push({
      href: '/enterprise/settings',
      label: 'Configurações',
      icon: Settings
    });

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-slate-800 shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Building className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <h1 className="text-xl font-bold text-green-600 dark:text-green-400">
                  Zanai Enterprise
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {userRole === 'COMPANY_ADMIN' ? 'Painel Administrativo' : 'Espaço do Funcionário'}
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
                className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-slate-700 ${
                  item.active ? 'bg-green-50 dark:bg-slate-700' : ''
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="absolute bottom-0 w-64 p-6">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="mb-3">
                <div className="flex items-center space-x-2 px-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {userRole === 'COMPANY_ADMIN' ? 'Administrador' : 'Funcionário'}
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