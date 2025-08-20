'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import UserHeader from './UserHeader';
import { ThemeProvider } from '@/components/theme-provider';

interface UserLayoutProps {
  children: ReactNode;
  currentPath?: string;
  showHeader?: boolean;
}

export default function UserLayout({ 
  children, 
  currentPath = '/', 
  showHeader = true 
}: UserLayoutProps) {
  const pathname = usePathname();
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {showHeader && <UserHeader currentPath={currentPath} />}
        
        {/* Main Content with padding for fixed header */}
        <main className={showHeader ? "pt-20" : ""}>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}