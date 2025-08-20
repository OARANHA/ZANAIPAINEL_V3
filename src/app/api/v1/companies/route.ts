import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface CompanyCreationRequest {
  name: string;
  cnpj: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  plan?: 'basic' | 'premium' | 'enterprise';
  maxUsers?: number;
  settings?: {
    agentCreationEnabled?: boolean;
    whatsappIntegrationEnabled?: boolean;
    analyticsEnabled?: boolean;
    customBranding?: boolean;
  };
}

interface CompanyResponse {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: string;
  plan: string;
  maxUsers: number;
  currentUsers: number;
  settings: any;
  createdAt: string;
  updatedAt: string;
  stats: {
    totalAgents: number;
    activeAgents: number;
    totalMessages: number;
    whatsappMessages: number;
  };
  links: {
    dashboard: string;
    agents: string;
    analytics: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verificar se o usuário tem permissão para criar empresas
    if (session.user.role !== 'admin' && session.user.role !== 'company_admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions to create company' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      cnpj,
      email,
      phone,
      address,
      plan = 'basic',
      maxUsers = 5,
      settings = {}
    }: CompanyCreationRequest = body;

    // Validação básica
    if (!name || !cnpj || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, cnpj, email' },
        { status: 400 }
      );
    }

    // Validar formato do CNPJ
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14 || !validateCNPJ(cleanCNPJ)) {
      return NextResponse.json(
        { error: 'Invalid CNPJ format' },
        { status: 400 }
      );
    }

    // Verificar se CNPJ já existe
    const existingCompany = await db.company.findUnique({
      where: { cnpj: cleanCNPJ }
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: 'Company with this CNPJ already exists' },
        { status: 409 }
      );
    }

    // Verificar se email já existe
    const existingEmail = await db.company.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Company with this email already exists' },
        { status: 409 }
      );
    }

    console.log(`🏢 Creating company: ${name} (${cleanCNPJ})`);

    // Criar a empresa
    const company = await db.company.create({
      data: {
        name,
        cnpj: cleanCNPJ,
        email,
        phone,
        address: address ? `${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}, ${address.zipCode}` : undefined,
        city: address?.city,
        state: address?.state,
        zipCode: address?.zipCode,
        plan,
        maxUsers,
        status: 'active'
      }
    });

    // Criar workspace padrão para a empresa
    const workspace = await db.workspace.create({
      data: {
        name: `${name} - Workspace Principal`,
        description: 'Workspace principal da empresa',
        config: JSON.stringify({
          companyId: company.id,
          settings: settings || {}
        }),
        userId: session.user.id
      }
    });

    // Registrar criação no audit log
    await db.auditLog.create({
      data: {
        action: 'create',
        entityType: 'company',
        entityId: company.id,
        userId: session.user.id,
        newValues: JSON.stringify({
          name,
          cnpj: cleanCNPJ,
          email,
          plan,
          maxUsers,
          settings
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    // Preparar resposta
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response: CompanyResponse = {
      id: company.id,
      name: company.name,
      cnpj: company.cnpj,
      email: company.email,
      phone: company.phone,
      address: address,
      status: company.status,
      plan: company.plan,
      maxUsers: company.maxUsers,
      currentUsers: 1, // O usuário que criou
      settings: settings || {},
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
      stats: {
        totalAgents: 0,
        activeAgents: 0,
        totalMessages: 0,
        whatsappMessages: 0
      },
      links: {
        dashboard: `${baseUrl}/empresa/${company.id}`,
        agents: `${baseUrl}/empresa/${company.id}/agentes`,
        analytics: `${baseUrl}/empresa/${company.id}/analytics`
      }
    };

    console.log(`✅ Company created successfully: ${company.name} (${company.id})`);

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('❌ Company creation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const plan = searchParams.get('plan');
    const status = searchParams.get('status');

    // Construir filtro baseado no papel do usuário
    const where: any = {};
    
    if (session.user.role === 'admin') {
      // Admin pode ver todas as empresas
      if (plan) where.plan = plan;
      if (status) where.status = status;
    } else if (session.user.role === 'company_admin') {
      // Company admin só pode ver suas empresas
      // Precisamos implementar a relação entre usuário e empresas
      where.users = {
        some: {
          id: session.user.id
        }
      };
      if (plan) where.plan = plan;
      if (status) where.status = status;
    } else {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Buscar empresas com paginação
    const [companies, total] = await Promise.all([
      db.company.findMany({
        where,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          projects: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          _count: {
            select: {
              users: true,
              projects: true,
              reports: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.company.count({ where })
    ]);

    // Para cada empresa, buscar estatísticas de agentes
    const companiesWithStats = await Promise.all(
      companies.map(async (company) => {
        // Buscar workspaces da empresa
        const workspaces = await db.workspace.findMany({
          where: {
            config: {
              path: '$.companyId',
              equals: company.id
            }
          },
          include: {
            agents: {
              select: {
                id: true,
                status: true,
                executions: {
                  select: {
                    id: true,
                    status: true,
                    context: true
                  }
                }
              }
            }
          }
        });

        // Calcular estatísticas
        const allAgents = workspaces.flatMap(w => w.agents);
        const activeAgents = allAgents.filter(a => a.status === 'active');
        const allExecutions = allAgents.flatMap(a => a.executions);
        const whatsappExecutions = allExecutions.filter(e => 
          e.context && JSON.parse(e.context).channel === 'whatsapp'
        );

        return {
          id: company.id,
          name: company.name,
          cnpj: company.cnpj,
          email: company.email,
          phone: company.phone,
          status: company.status,
          plan: company.plan,
          maxUsers: company.maxUsers,
          currentUsers: company._count.users,
          createdAt: company.createdAt.toISOString(),
          updatedAt: company.updatedAt.toISOString(),
          users: company.users,
          projects: company.projects,
          stats: {
            totalAgents: allAgents.length,
            activeAgents: activeAgents.length,
            totalMessages: allExecutions.length,
            whatsappMessages: whatsappExecutions.length
          }
        };
      })
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return NextResponse.json({
      companies: companiesWithStats.map(company => ({
        ...company,
        links: {
          dashboard: `${baseUrl}/empresa/${company.id}`,
          agents: `${baseUrl}/empresa/${company.id}/agentes`,
          analytics: `${baseUrl}/empresa/${company.id}/analytics`,
          settings: `${baseUrl}/empresa/${company.id}/configuracoes`
        }
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Company listing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Função para validar CNPJ
function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  // Calcula primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  let digit = 11 - (sum % 11);
  let checkDigit1 = digit > 9 ? 0 : digit;
  
  if (parseInt(cnpj[12]) !== checkDigit1) return false;
  
  // Calcula segundo dígito verificador
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  digit = 11 - (sum % 11);
  let checkDigit2 = digit > 9 ? 0 : digit;
  
  if (parseInt(cnpj[13]) !== checkDigit2) return false;
  
  return true;
}