'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import { ThemeProvider } from '@/components/theme-provider';

interface MainLayoutProps {
  children: ReactNode;
  currentPath?: string;
  showHeader?: boolean;
}

export default function MainLayout({ 
  children, 
  currentPath = '/', 
  showHeader = true 
}: MainLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      forcedTheme="dark"
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900">
        {showHeader && <Header currentPath={currentPath} />}
        
        {/* Main Content with padding for fixed header */}
        <main className={showHeader ? "pt-20" : ""}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}