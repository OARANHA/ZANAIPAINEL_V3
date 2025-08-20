import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obter cookies de autenticação
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const userRole = request.cookies.get('userRole')?.value;
  
  console.log('Middleware: Checking access for:', pathname);
  console.log('Middleware: isAuthenticated:', isAuthenticated);
  console.log('Middleware: userRole:', userRole);
  
  // Rotas que não precisam de autenticação
  const publicRoutes = ['/', '/login', '/register', '/planos', '/contato', '/servicos', '/demonstracao', '/doc', 'agentes', '/automacao', '/admin/login', '/admin/logout', '/flowise-external-sync'];
  
  // APIs públicas que não precisam de autenticação
  const publicAPIs = ['/api/health', '/admin/api/auth/login', '/api/chat', '/api/flowise-chat', '/api/flowise-external-sync'];
  
  // Se for rota pública ou API pública, permite acesso imediatamente
  if (publicRoutes.includes(pathname) || publicAPIs.some(api => pathname.startsWith(api))) {
    return NextResponse.next();
  }
  
  // Se for API (exceto as públicas), permite acesso sem middleware
  if (pathname.startsWith('/api/') && !publicAPIs.some(api => pathname.startsWith(api))) {
    // Para APIs de admin, verificar autenticação
    if (pathname.startsWith('/admin/api/')) {
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }
    return NextResponse.next();
  }
  
  // Se não estiver autenticado e não for rota pública, redireciona para login
  if (!isAuthenticated) {
    // Se for rota de admin, redireciona para /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/logout') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // Se for rota de painel, redireciona para /login
    if (pathname.startsWith('/painel')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Se for rota de dashboard, redireciona para /painel (já que dashboard não existe mais)
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/painel', request.url));
    }
    // Se for rota de enterprise, redireciona para /login
    if (pathname.startsWith('/enterprise')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Para outras rotas protegidas, redireciona para /login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Se estiver autenticado, verifica permissões específicas por rota
  
  // /admin = Painel de SUPER_ADMIN e admin (controle total do sistema)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/logout') {
    if (!['SUPER_ADMIN', 'admin'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // /painel = Painel para usuários normais (FREE, INICIANTE, PROFISSIONAL)
  if (pathname.startsWith('/painel')) {
    console.log('Middleware: Checking /painel access for role:', userRole);
    if (!['FREE', 'INICIANTE', 'PROFISSIONAL'].includes(userRole || '')) {
      console.log('Middleware: Access denied for /painel, redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('Middleware: Access granted for /painel');
  }
  
  // /dashboard = Redireciona para /painel (não deve existir mais)
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/painel', request.url));
  }
  
  // /enterprise = Painel para empresas (COMPANY_ADMIN, COMPANY_USER)
  if (pathname.startsWith('/enterprise')) {
    if (!['COMPANY_ADMIN', 'COMPANY_USER'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Se passou por todas as verificações, permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};