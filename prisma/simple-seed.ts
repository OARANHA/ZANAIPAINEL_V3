import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed simples do banco de dados...');
  
  const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .toLowerCase().replace(/[^a-z0-9]+/g, "-")
   .replace(/(^-|-$)+/g, "").slice(0, 64);

  // Criar usuários
  console.log('👥 Criando usuários...');
  const usersData = [
    {
      email: 'admin@zanai.com',
      name: 'Administrador Zanai',
      role: 'admin',
    },
    {
      email: 'joao.silva@empresa.com',
      name: 'João Silva',
      role: 'user',
    },
    {
      email: 'maria.santos@techcorp.com',
      name: 'Maria Santos',
      role: 'company_admin',
    },
  ];

  const createdUsers = [];
  for (const userData of usersData) {
    try {
      const user = await prisma.user.create({
        data: userData,
      });
      createdUsers.push(user);
      console.log(`✅ Usuário criado: ${user.name}`);
    } catch (error) {
      console.log(`⚠️ Usuário já existe ou erro ao criar: ${userData.name}`);
      // Buscar usuário existente
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      if (existingUser) {
        createdUsers.push(existingUser);
      }
    }
  }

  const [adminUser, regularUser, companyUser] = createdUsers;

  // Criar empresas
  console.log('🏢 Criando empresas...');
  const companiesData = [
    {
      name: 'TechCorp Solutions',
      cnpj: '12.345.678/0001-90',
      email: 'contato@techcorp.com',
      phone: '(11) 3456-7890',
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      plan: 'premium',
      maxUsers: 20,
    },
    {
      name: 'Startup XYZ',
      cnpj: '98.765.432/0001-10',
      email: 'hello@startupxyz.com',
      phone: '(21) 2345-6789',
      address: 'Rua das Startups, 500',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20040-020',
      plan: 'basic',
      maxUsers: 5,
    },
  ];

  const createdCompanies = [];
  for (const companyData of companiesData) {
    try {
      const company = await prisma.company.create({
        data: companyData,
      });
      createdCompanies.push(company);
      console.log(`✅ Empresa criada: ${company.name}`);
    } catch (error) {
      console.log(`⚠️ Empresa já existe ou erro ao criar: ${companyData.name}`);
      // Buscar empresa existente
      const existingCompany = await prisma.company.findUnique({
        where: { cnpj: companyData.cnpj },
      });
      if (existingCompany) {
        createdCompanies.push(existingCompany);
      }
    }
  }

  const [techCorp, startupXYZ] = createdCompanies;

  // Criar clientes
  console.log('👤 Criando clientes...');
  const clientsData = [
    {
      name: 'Pedro Oliveira',
      cpf: '123.456.789-00',
      email: 'pedro.oliveira@email.com',
      phone: '(11) 98765-4321',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      birthDate: new Date('1985-05-15'),
      userId: regularUser?.id,
    },
    {
      name: 'Ana Costa',
      cpf: '987.654.321-00',
      email: 'ana.costa@email.com',
      phone: '(21) 99876-5432',
      address: 'Av. Atlântica, 200',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22070-000',
      birthDate: new Date('1990-08-22'),
    },
  ];

  const createdClients = [];
  for (const clientData of clientsData) {
    try {
      const client = await prisma.client.create({
        data: clientData,
      });
      createdClients.push(client);
      console.log(`✅ Cliente criado: ${client.name}`);
    } catch (error) {
      console.log(`⚠️ Cliente já existe ou erro ao criar: ${clientData.name}`);
      // Buscar cliente existente
      const existingClient = await prisma.client.findUnique({
        where: { cpf: clientData.cpf },
      });
      if (existingClient) {
        createdClients.push(existingClient);
      }
    }
  }

  const [client1, client2] = createdClients;

  // Criar workspaces para o sistema Zanai
  console.log('🏗️ Criando workspaces...');
  const workspacesData = [
    {
      name: 'Workspace Principal',
      description: 'Workspace principal para desenvolvimento de agentes IA',
      config: JSON.stringify({
        theme: 'dark',
        language: 'pt-BR',
        autoSave: true,
      }),
      userId: adminUser?.id || '',
    },
    {
      name: 'Workspace de Testes',
      description: 'Workspace para testes e experimentação',
      config: JSON.stringify({
        theme: 'light',
        language: 'pt-BR',
        autoSave: false,
      }),
      userId: regularUser?.id || '',
    },
    {
      name: 'Workspace Corporativo',
      description: 'Workspace para projetos empresariais',
      config: JSON.stringify({
        theme: 'system',
        language: 'pt-BR',
        autoSave: true,
        notifications: true,
      }),
      userId: companyUser?.id || '',
    },
  ];

  const createdWorkspaces = [];
  for (const workspaceData of workspacesData) {
    try {
      const workspace = await prisma.workspace.create({
        data: workspaceData,
      });
      createdWorkspaces.push(workspace);
      console.log(`✅ Workspace criado: ${workspace.name}`);
    } catch (error) {
      console.log(`⚠️ Workspace já existe ou erro ao criar: ${workspaceData.name}`);
      // Buscar workspace existente
      const existingWorkspace = await prisma.workspace.findFirst({
        where: { 
          name: workspaceData.name,
          userId: workspaceData.userId,
        },
      });
      if (existingWorkspace) {
        createdWorkspaces.push(existingWorkspace);
      }
    }
  }

  const [workspace1, workspace2, workspace3] = createdWorkspaces;

  // Criar agentes
  console.log('🤖 Criando agentes...');
  const agentsData = [
    {
      name: 'Analista de Negócios',
      description: 'Especialista em análise de requisitos e processos de negócio',
      type: 'template',
      config: `role: Analista de Negócios
expertise:
  - Análise de requisitos
  - Mapeamento de processos
  - Gestão de stakeholders
  - Modelagem de negócio
personality: profissional, analítico, comunicativo`,
      knowledge: `# Conhecimento do Analista de Negócios

## Metodologias
- Business Process Model and Notation (BPMN)
- Unified Modeling Language (UML)
- Agile methodologies (Scrum, Kanban)
- Business Analysis Body of Knowledge (BABOK)

## Habilidades
- Entrevista com stakeholders
- Documentação de requisitos
- Análise de processos
- Proposta de soluções`,
      status: 'active',
      workspaceId: workspace1?.id || '',
      userId: adminUser?.id,
    },
    {
      name: 'Especialista em Marketing Digital',
      description: 'Especialista em estratégias de marketing digital e SEO',
      type: 'template',
      config: `role: Marketing Digital Specialist
expertise:
  - SEO
  - Marketing de conteúdo
  - Redes sociais
  - Análise de dados
personality: criativo, analítico, estratégico`,
      knowledge: `# Conhecimento em Marketing Digital

## SEO
- Otimização para mecanismos de busca
- Pesquisa de palavras-chave
- Link building
- SEO técnico

## Marketing de Conteúdo
- Estratégia de conteúdo
- Calendarização
- Distribuição multicanal
- Métricas de engajamento`,
      status: 'active',
      workspaceId: workspace1?.id || '',
      userId: adminUser?.id,
    },
    {
      name: 'Desenvolvedor Full Stack',
      description: 'Especialista em desenvolvimento web e mobile',
      type: 'custom',
      config: `role: Full Stack Developer
expertise:
  - Frontend (React, Next.js, TypeScript)
  - Backend (Node.js, Python)
  - Bancos de dados (PostgreSQL, MongoDB)
  - DevOps (Docker, AWS)
personality: técnico, detalhista, colaborativo`,
      knowledge: `# Conhecimento Técnico

## Frontend
- React, Next.js, TypeScript
- Tailwind CSS, Styled Components
- Responsive design
- Performance optimization

## Backend
- Node.js, Express, FastAPI
- PostgreSQL, MongoDB, Redis
- REST APIs, GraphQL
- Authentication & Authorization`,
      status: 'active',
      workspaceId: workspace2?.id || '',
      userId: regularUser?.id,
    },
    {
      name: 'Consultor Jurídico',
      description: 'Especialista em direito digital e conformidade',
      type: 'template',
      config: `role: Legal Consultant
expertise:
  - Direito digital
  - LGPD
  - Contratos digitais
  - Conformidade regulatória
personality: preciso, cauteloso, informativo`,
      knowledge: `# Conhecimento Jurídico

## LGPD
- Lei Geral de Proteção de Dados
- Consentimento e tratamento de dados
- Direitos dos titulares
- Sanções e penalidades

## Direito Digital
- Contratos eletrônicos
- Propriedade intelectual
- Responsabilidade civil
- Crimes cibernéticos`,
      status: 'active',
      workspaceId: workspace3?.id || '',
      userId: companyUser?.id,
    },
    {
      name: 'Agente de Suporte',
      description: 'Especialista em atendimento ao cliente',
      type: 'custom',
      config: `role: Support Agent
expertise:
  - Atendimento ao cliente
  - Resolução de problemas
  - Comunicação eficaz
  - Gestão de conflitos
personality: paciente, empático, solucionador`,
      knowledge: `# Conhecimento em Suporte

## Atendimento
- Técnicas de comunicação
- Escuta ativa
- Empatia
- Resolução de conflitos

## Procedimentos
- Protocolos de atendimento
- Escalonamento de problemas
- Documentação de casos
- Métricas de satisfação`,
      status: 'inactive',
      workspaceId: workspace2?.id || '',
      userId: regularUser?.id,
    },
  ];

  for (const agentData of agentsData) {
    try {
      const agent = await prisma.agent.create({
        data: {
          ...agentData,
          slug: slugify(agentData.name),
        },
      });
      console.log(`✅ Agente criado: ${agent.name}`);
    } catch (error) {
      console.log(`⚠️ Agente já existe ou erro ao criar: ${agentData.name}`);
    }
  }

  console.log('🎉 Seed concluído com sucesso!');
  console.log('📊 Resumo:');
  console.log(`- Usuários: 3`);
  console.log(`- Empresas: 2`);
  console.log(`- Clientes: 2`);
  console.log(`- Workspaces: 3`);
  console.log(`- Agentes: ${agentsData.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });