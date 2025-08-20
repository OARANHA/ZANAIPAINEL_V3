import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  async rewrites() {
    return [
      // Dashboard page rewrites for backward compatibility
      // {
      //   source: '/login',
      //   destination: '/admin/login',
      // },
      {
        source: '/agents',
        destination: '/admin/agents',
      },
      {
        source: '/specialists',
        destination: '/admin/specialists',
      },
      {
        source: '/compositions',
        destination: '/admin/compositions',
      },
      {
        source: '/studio',
        destination: '/admin/studio',
      },
      {
        source: '/learning',
        destination: '/admin/learning',
      },
      {
        source: '/executions',
        destination: '/admin/executions',
      },
      {
        source: '/admin/companies',
        destination: '/admin/admin/companies',
      },
      {
        source: '/admin/clients',
        destination: '/admin/admin/clients',
      },
      {
        source: '/admin/reports',
        destination: '/admin/admin/reports',
      },
      
      // API rewrites for backward compatibility
      {
        source: '/api/agents',
        destination: '/admin/api/agents',
      },
      {
        source: '/api/agents/:path*',
        destination: '/admin/api/agents/:path*',
      },
      {
        source: '/api/specialists',
        destination: '/admin/api/specialists',
      },
      {
        source: '/api/specialists/:path*',
        destination: '/admin/api/specialists/:path*',
      },
      {
        source: '/api/compositions',
        destination: '/admin/api/compositions',
      },
      {
        source: '/api/compositions/:path*',
        destination: '/admin/api/compositions/:path*',
      },
      {
        source: '/api/workspaces',
        destination: '/admin/api/workspaces',
      },
      {
        source: '/api/executions',
        destination: '/admin/api/executions',
      },
      {
        source: '/api/execute',
        destination: '/admin/api/execute',
      },
      {
        source: '/api/auth/login',
        destination: '/admin/api/auth/login',
      },
      {
        source: '/api/analytics',
        destination: '/admin/api/analytics',
      },
      {
        source: '/api/learning',
        destination: '/admin/api/learning',
      },
      {
        source: '/api/code-analysis',
        destination: '/admin/api/code-analysis',
      },
      {
        source: '/api/context',
        destination: '/admin/api/context',
      },
      {
        source: '/api/test-zai',
        destination: '/admin/api/test-zai',
      },
      {
        source: '/api/vscode',
        destination: '/admin/api/vscode',
      },
      {
        source: '/api/debug/:path*',
        destination: '/admin/api/debug/:path*',
      },
      {
        source: '/api/admin/:path*',
        destination: '/admin/api/admin/:path*',
      },
    ]
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Configuração otimizada para desenvolvimento
      config.watchOptions = {
        aggregateTimeout: 300,
        poll: 1000,
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
