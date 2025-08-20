import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

interface ClientCreationRequest {
  name: string;
  email: string;
  phone?: string;
  clientType: 'individual' | 'company';
  registrationType: 'basic' | 'complete';
  // Identificação
  cpf?: string;
  cnpj?: string;
  rg?: string;
  ie?: string;
  birthDate?: string;
  foundingDate?: string;
  // Endereço
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  // Contato
  whatsapp?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  // Perfil Empresarial/Profissional
  sector?: string;
  companySize?: 'mei' | 'small' | 'medium' | 'large';
  employees?: number;
  mainProducts?: string[];
  targetAudience?: 'b2b' | 'b2c' | 'mixed';
  operationRegion?: 'regional' | 'national' | 'international';
  // Necessidades e Objetivos
  mainProblems?: string[];
  aiObjectives?: string[];
  digitalMaturity?: 'low' | 'medium' | 'advanced';
  currentTools?: string[];
  // Dados Operacionais
  dataVolume?: 'small' | 'medium' | 'large';
  dataType?: string[];
  updateFrequency?: 'daily' | 'weekly' | 'monthly';
  // Contratuais e Financeiros
  paymentMethod?: 'boleto' | 'pix' | 'card' | 'recurrence';
  commercialConditions?: Record<string, any>;
  legalResponsible?: string;
  // Metadados
  companyId?: string;
  tags?: string[];
}

interface ClientResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  clientType: string;
  registrationType: string;
  status: string;
  profile: {
    sector?: string;
    companySize?: string;
    employees?: number;
    targetAudience?: string;
    digitalMaturity?: string;
  };
  contact: {
    whatsapp?: string;
    website?: string;
    linkedin?: string;
    instagram?: string;
  };
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  needs: {
    mainProblems?: string[];
    aiObjectives?: string[];
    currentTools?: string[];
  };
  stats: {
    projectsCount: number;
    activeProjects: number;
    totalContracts: number;
    lastActivity?: string;
  };
  createdAt: string;
  updatedAt: string;
  links: {
    dashboard: string;
    projects: string;
    contracts: string;
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

    const body = await request.json();
    const {
      name,
      email,
      phone,
      clientType,
      registrationType,
      cpf,
      cnpj,
      rg,
      ie,
      birthDate,
      foundingDate,
      address,
      whatsapp,
      website,
      linkedin,
      instagram,
      sector,
      companySize,
      employees,
      mainProducts,
      targetAudience,
      operationRegion,
      mainProblems,
      aiObjectives,
      digitalMaturity,
      currentTools,
      dataVolume,
      dataType,
      updateFrequency,
      paymentMethod,
      commercialConditions,
      legalResponsible,
      companyId,
      tags
    }: ClientCreationRequest = body;

    // Validação básica
    if (!name || !email || !clientType || !registrationType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, clientType, registrationType' },
        { status: 400 }
      );
    }

    // Validar identificação conforme tipo
    if (clientType === 'individual' && !cpf) {
      return NextResponse.json(
        { error: 'CPF is required for individual clients' },
        { status: 400 }
      );
    }

    if (clientType === 'company' && !cnpj) {
      return NextResponse.json(
        { error: 'CNPJ is required for company clients' },
        { status: 400 }
      );
    }

    // Validar CPF/CNPJ
    if (cpf && !validateCPF(cpf)) {
      return NextResponse.json(
        { error: 'Invalid CPF format' },
        { status: 400 }
      );
    }

    if (cnpj && !validateCNPJ(cnpj)) {
      return NextResponse.json(
        { error: 'Invalid CNPJ format' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existingEmail = await db.client.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Client with this email already exists' },
        { status: 409 }
      );
    }

    // Verificar se CPF/CNPJ já existe
    if (cpf) {
      const existingCPF = await db.client.findUnique({
        where: { cpf }
      });

      if (existingCPF) {
        return NextResponse.json(
          { error: 'Client with this CPF already exists' },
          { status: 409 }
        );
      }
    }

    if (cnpj) {
      const existingCNPJ = await db.client.findUnique({
        where: { cnpj }
      });

      if (existingCNPJ) {
        return NextResponse.json(
          { error: 'Client with this CNPJ already exists' },
          { status: 409 }
        );
      }
    }

    // Verificar permissões da empresa
    if (companyId) {
      const company = await db.company.findFirst({
        where: {
          id: companyId,
          users: {
            some: {
              id: session.user.id
            }
          }
        }
      });

      if (!company) {
        return NextResponse.json(
          { error: 'Company not found or access denied' },
          { status: 404 }
        );
      }
    }

    console.log(`👥 Creating client: ${name} (${clientType})`);

    // Criar o cliente
    const client = await db.client.create({
      data: {
        name,
        email,
        phone,
        clientType,
        registrationType,
        cpf: cpf ? cpf.replace(/\D/g, '') : undefined,
        cnpj: cnpj ? cnpj.replace(/\D/g, '') : undefined,
        rg,
        ie,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        foundingDate: foundingDate ? new Date(foundingDate) : undefined,
        address: address?.street,
        neighborhood: address?.neighborhood,
        city: address?.city,
        state: address?.state,
        zipCode: address?.zipCode,
        whatsapp,
        website,
        linkedin,
        instagram,
        sector,
        companySize,
        employees,
        mainProducts: mainProducts ? JSON.stringify(mainProducts) : undefined,
        targetAudience,
        operationRegion,
        mainProblems: mainProblems ? JSON.stringify(mainProblems) : undefined,
        aiObjectives: aiObjectives ? JSON.stringify(aiObjectives) : undefined,
        digitalMaturity,
        currentTools: currentTools ? JSON.stringify(currentTools) : undefined,
        dataVolume,
        dataType: dataType ? JSON.stringify(dataType) : undefined,
        updateFrequency,
        paymentMethod,
        commercialConditions: commercialConditions ? JSON.stringify(commercialConditions) : undefined,
        legalResponsible,
        userId: session.user.id,
        companyId
      }
    });

    // Registrar criação no audit log
    await db.auditLog.create({
      data: {
        action: 'create',
        entityType: 'client',
        entityId: client.id,
        userId: session.user.id,
        companyId,
        newValues: JSON.stringify({
          name,
          email,
          clientType,
          registrationType,
          sector,
          companySize
        }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    // Preparar resposta
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response: ClientResponse = {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      clientType: client.clientType,
      registrationType: client.registrationType,
      status: client.status,
      profile: {
        sector: client.sector,
        companySize: client.companySize,
        employees: client.employees,
        targetAudience: client.targetAudience,
        digitalMaturity: client.digitalMaturity
      },
      contact: {
        whatsapp: client.whatsapp,
        website: client.website,
        linkedin: client.linkedin,
        instagram: client.instagram
      },
      address: address,
      needs: {
        mainProblems: mainProblems,
        aiObjectives: aiObjectives,
        currentTools: currentTools
      },
      stats: {
        projectsCount: 0,
        activeProjects: 0,
        totalContracts: 0
      },
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      links: {
        dashboard: `${baseUrl}/clientes/${client.id}`,
        projects: `${baseUrl}/clientes/${client.id}/projetos`,
        contracts: `${baseUrl}/clientes/${client.id}/contratos`
      }
    };

    console.log(`✅ Client created successfully: ${client.name} (${client.id})`);

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('❌ Client creation error:', error);
    
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
    const companyId = searchParams.get('companyId');
    const clientType = searchParams.get('clientType');
    const status = searchParams.get('status');
    const sector = searchParams.get('sector');

    // Construir filtro baseado no papel do usuário
    const where: any = {};

    if (session.user.role === 'admin') {
      // Admin pode ver todos os clientes
      if (companyId) where.companyId = companyId;
      if (clientType) where.clientType = clientType;
      if (status) where.status = status;
      if (sector) where.sector = sector;
    } else if (session.user.role === 'company_admin') {
      // Company admin só pode ver clientes da empresa
      if (companyId) {
        // Verificar se o usuário tem acesso à empresa
        const company = await db.company.findFirst({
          where: {
            id: companyId,
            users: {
              some: {
                id: session.user.id
              }
            }
          }
        });

        if (!company) {
          return NextResponse.json(
            { error: 'Company not found or access denied' },
            { status: 404 }
          );
        }
        where.companyId = companyId;
      } else {
        // Verificar empresas do usuário e buscar clientes dessas empresas
        const userCompanies = await db.company.findMany({
          where: {
            users: {
              some: {
                id: session.user.id
              }
            }
          },
          select: {
            id: true
          }
        });

        where.companyId = {
          in: userCompanies.map(c => c.id)
        };
      }
      if (clientType) where.clientType = clientType;
      if (status) where.status = status;
      if (sector) where.sector = sector;
    } else {
      // Usuários normais só podem ver seus próprios clientes
      where.userId = session.user.id;
      if (clientType) where.clientType = clientType;
      if (status) where.status = status;
      if (sector) where.sector = sector;
    }

    // Buscar clientes com paginação
    const [clients, total] = await Promise.all([
      db.client.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true
            }
          },
          projects: {
            select: {
              id: true,
              name: true,
              status: true
            }
          },
          contracts: {
            select: {
              id: true,
              status: true,
              value: true
            }
          },
          _count: {
            select: {
              projects: true,
              contracts: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.client.count({ where })
    ]);

    // Formatar resposta
    const formattedClients = clients.map(client => {
      const activeProjects = client.projects.filter(p => p.status === 'active').length;
      const totalContractValue = client.contracts
        .filter(c => c.status === 'active')
        .reduce((sum, c) => sum + (c.value || 0), 0);

      return {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        clientType: client.clientType,
        registrationType: client.registrationType,
        status: client.status,
        profile: {
          sector: client.sector,
          companySize: client.companySize,
          employees: client.employees,
          targetAudience: client.targetAudience,
          digitalMaturity: client.digitalMaturity
        },
        contact: {
          whatsapp: client.whatsapp,
          website: client.website,
          linkedin: client.linkedin,
          instagram: client.instagram
        },
        company: client.company,
        stats: {
          projectsCount: client._count.projects,
          activeProjects,
          totalContracts: client._count.contracts,
          totalContractValue,
          lastActivity: client.updatedAt.toISOString()
        }
      };
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return NextResponse.json({
      clients: formattedClients.map(client => ({
        ...client,
        links: {
          dashboard: `${baseUrl}/clientes/${client.id}`,
          projects: `${baseUrl}/clientes/${client.id}/projetos`,
          contracts: `${baseUrl}/clientes/${client.id}/contratos`,
          edit: `${baseUrl}/clientes/${client.id}/editar`
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
    console.error('❌ Client listing error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Funções de validação
function validateCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf[i]) * (10 - i);
  }
  
  let digit = 11 - (sum % 11);
  let checkDigit1 = digit > 9 ? 0 : digit;
  
  if (parseInt(cpf[9]) !== checkDigit1) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf[i]) * (11 - i);
  }
  
  digit = 11 - (sum % 11);
  let checkDigit2 = digit > 9 ? 0 : digit;
  
  if (parseInt(cpf[10]) !== checkDigit2) return false;
  
  return true;
}

function validateCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/\D/g, '');
  
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  
  let digit = 11 - (sum % 11);
  let checkDigit1 = digit > 9 ? 0 : digit;
  
  if (parseInt(cnpj[12]) !== checkDigit1) return false;
  
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