import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando backup seed do banco de dados...');
  
  const slugify = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
     .toLowerCase().replace(/[^a-z0-9]+/g, "-")
     .replace(/(^-|-$)+/g, "").slice(0, 64);

  // Limpar dados existentes (opcional - comente se não quiser limpar)
  console.log('🧹 Limpando dados existentes...');
  await prisma.agentExecution.deleteMany();
  await prisma.execution.deleteMany();
  await prisma.learning.deleteMany();
  await prisma.agentMetrics.deleteMany();
  await prisma.task.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.report.deleteMany();
  await prisma.composition.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  // MCP tables might not exist in all environments, so we'll skip them for now
  try {
    await prisma.mCPConnection.deleteMany();
    await prisma.mCPTool.deleteMany();
    await prisma.mCPServer.deleteMany();
  } catch (error) {
    console.log('⚠️ MCP tables not found, skipping...');
  }
  await prisma.auditLog.deleteMany();

  // Criar usuários principais
  console.log('👥 Criando usuários principais...');
  const usersData = [
    {
      email: 'superadmin@zanai.com',
      name: 'Super Administrador',
      role: 'SUPER_ADMIN',
    },
    {
      email: 'company.admin@empresa.com',
      name: 'Administrador da Empresa',
      role: 'COMPANY_ADMIN',
    },
    {
      email: 'company.user@empresa.com',
      name: 'Usuário da Empresa',
      role: 'COMPANY_USER',
    },
    {
      email: 'free.user@zanai.com',
      name: 'Usuário Gratuito',
      role: 'FREE',
    },
    {
      email: 'iniciante.user@zanai.com',
      name: 'Usuário Iniciante',
      role: 'INICIANTE',
    },
    {
      email: 'profissional.user@zanai.com',
      name: 'Usuário Profissional',
      role: 'PROFISSIONAL',
    },
  ];

  const createdUsers = [];
  for (const userData of usersData) {
    try {
      const user = await prisma.user.create({
        data: userData,
      });
      createdUsers.push(user);
      console.log(`✅ Usuário criado: ${user.name} (${user.role})`);
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

  const [superAdmin, companyAdmin, companyUser, freeUser, inicianteUser, profissionalUser] = createdUsers;

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
      userId: freeUser?.id,
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

  // Criar workspaces para cada tipo de usuário
  console.log('🏗️ Criando workspaces...');
  const workspacesData = [
    {
      name: 'Workspace Super Admin',
      description: 'Workspace para Super Administrador',
      config: JSON.stringify({
        theme: 'dark',
        language: 'pt-BR',
        autoSave: true,
        adminAccess: true,
      }),
      userId: superAdmin?.id || '',
    },
    {
      name: 'Workspace Empresa Admin',
      description: 'Workspace para Administrador da Empresa',
      config: JSON.stringify({
        theme: 'system',
        language: 'pt-BR',
        autoSave: true,
        notifications: true,
      }),
      userId: companyAdmin?.id || '',
    },
    {
      name: 'Workspace Empresa User',
      description: 'Workspace para Usuário da Empresa',
      config: JSON.stringify({
        theme: 'light',
        language: 'pt-BR',
        autoSave: false,
      }),
      userId: companyUser?.id || '',
    },
    {
      name: 'Workspace Gratuito',
      description: 'Workspace para Usuário Gratuito',
      config: JSON.stringify({
        theme: 'light',
        language: 'pt-BR',
        autoSave: false,
        limitedFeatures: true,
      }),
      userId: freeUser?.id || '',
    },
    {
      name: 'Workspace Iniciante',
      description: 'Workspace para Usuário Iniciante',
      config: JSON.stringify({
        theme: 'system',
        language: 'pt-BR',
        autoSave: true,
        intermediateFeatures: true,
      }),
      userId: inicianteUser?.id || '',
    },
    {
      name: 'Workspace Profissional',
      description: 'Workspace para Usuário Profissional',
      config: JSON.stringify({
        theme: 'dark',
        language: 'pt-BR',
        autoSave: true,
        fullFeatures: true,
      }),
      userId: profissionalUser?.id || '',
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

  const [workspaceSuperAdmin, workspaceCompanyAdmin, workspaceCompanyUser, workspaceFree, workspaceIniciante, workspaceProfissional] = createdWorkspaces;

  // Criar agentes profissionais no workspace do Super Admin
  console.log('🤖 Criando agentes profissionais templates...');
  const professionalAgentsData = [
    // Agentes de Estratégia e Negócios
    {
      name: 'Consultor de Estratégia',
      description: 'Especialista em planejamento estratégico, consultoria de negócios e transformação organizacional',
      type: 'template',
      config: `role: Strategic Consultant
expertise:
  - Planejamento estratégico
  - Consultoria de negócios
  - Transformação organizacional
  - Análise de mercado
  - Gestão de mudanças
personality: estratégico, analítico, visionário`,
      knowledge: `# Conhecimento do Consultor de Estratégia

## Planejamento Estratégico
- Análise SWOT
- Definição de visão e missão
- Estabelecimento de objetivos estratégicos
- Planejamento de longo prazo
- Alinhamento organizacional

## Consultoria de Negócios
- Diagnóstico organizacional
- Otimização de processos
- Redesenho organizacional
- Gestão da mudança
- Melhoria contínua

## Transformação Organizacional
- Liderança transformacional
- Cultura organizacional
- Inovação e disruptura
- Gestão da complexidade
- Resiliência organizacional`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    {
      name: 'Especialista em Dados',
      description: 'Especialista em análise de dados, business intelligence e data science',
      type: 'template',
      config: `role: Data Specialist
expertise:
  - Análise de dados
  - Business Intelligence
  - Data Science
  - Machine Learning
  - Visualização de dados
personality: analítico, preciso, curioso`,
      knowledge: `# Conhecimento do Especialista em Dados

## Análise de Dados
- Estatística descritiva e inferencial
- Análise exploratória de dados
- Segmentação e clustering
- Séries temporais
- Análise preditiva

## Business Intelligence
- Dashboards e relatórios
- KPIs e métricas
- Data warehousing
- ETL e data pipelines
- Governança de dados

## Data Science
- Machine Learning
- Deep Learning
- Processamento de linguagem natural
- Visão computacional
- Modelagem preditiva`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    {
      name: 'Agente de Automação Inteligente',
      description: 'Especialista em automação de processos usando IA e machine learning',
      type: 'template',
      config: `role: Intelligent Automation Agent
expertise:
  - Automação de processos
  - Machine Learning aplicado
  - RPA (Robotic Process Automation)
  - Processamento de linguagem natural
  - Visão computacional
personality: inovador, eficiente, técnico`,
      knowledge: `# Conhecimento do Agente de Automação Inteligente

## Automação de Processos
- Identificação de processos automatizáveis
- Mapeamento e otimização de fluxos
- Implementação de RPA
- Monitoramento e manutenção
- Gestão de exceções

## Machine Learning Aplicado
- Classificação e regressão
- Clusterização e segmentação
- Processamento de linguagem natural
- Visão computacional
- Aprendizado por reforço

## Integração e Deploy
- APIs e microserviços
- Containerização
- CI/CD para modelos
- Monitoramento de modelos
- Versionamento de dados`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    {
      name: 'Arquiteto de Workflows',
      description: 'Especialista em design e arquitetura de workflows complexos no Flowise',
      type: 'template',
      config: `role: Workflow Architect
expertise:
  - Design de workflows
  - Arquitetura de sistemas
  - Integração de APIs
  - Gestão de processos
  - Otimização de fluxos
personality: arquitetônico, sistemático, criativo`,
      knowledge: `# Conhecimento do Arquiteto de Workflows

## Design de Workflows
- Análise de requisitos
- Modelagem de processos
- Design de fluxos
- Documentação de workflows
- Validação e teste

## Arquitetura de Sistemas
- Microserviços
- APIs RESTful
- Event-driven architecture
- Message queues
- Database design

## Integração e Otimização
- Conectores e adaptadores
- Transformação de dados
- Gestão de erros
- Performance tuning
- Escalabilidade`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    {
      name: 'Integrador Flowise',
      description: 'Especialista em integração entre Zanai e Flowise para automação de workflows',
      type: 'template',
      config: `role: Flowise Integration Specialist
expertise:
  - Integração Zanai-Flowise
  - Automação de workflows
  - Configuração de chatflows
  - Sincronização de dados
  - API management
personality: técnico, organizado, inovador`,
      knowledge: `# Conhecimento do Integrador Flowise

## Integração Zanai-Flowise
- Configuração de APIs entre plataformas
- Mapeamento de agentes Zanai para chatflows Flowise
- Sincronização de dados em tempo real
- Gestão de autenticação e segurança
- Monitoramento de integração

## Automação de Workflows
- Criação de fluxos automatizados
- Configuração de gatilhos e ações
- Gerenciamento de variáveis e contextos
- Tratamento de erros e exceções
- Otimização de performance

## Gestão de Chatflows
- Importação e exportação de chatflows
- Versionamento de workflows
- Teste e validação de fluxos
- Documentação automática
- Deploy e rollback`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    // Agentes de Vendas e Marketing
    {
      name: 'Agente de Vendas',
      description: 'Especialista em técnicas de vendas, negociação e fechamento de negócios',
      type: 'template',
      config: `role: Sales Agent
expertise:
  - Técnicas de vendas
  - Negociação
  - Fechamento de negócios
  - CRM e gestão de relacionamentos
  - Prospecção de clientes
personality: persuasivo, confiante, estratégico`,
      knowledge: `# Conhecimento do Agente de Vendas

## Técnicas de Vendas
- Venda consultiva
- SPIN Selling
- Venda por valor
- Técnicas de fechamento
- Gestão de objeções

## Negociação
- Estratégias de negociação
- Psicologia da negociação
- Técnicas de persuasão
- Gestão de conflitos
- Win-win negotiation

## Gestão Comercial
- CRM e pipeline de vendas
- Prospecção ativa
- Qualificação de leads
- Follow-up e relacionamento
- Metas e comissionamento`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    {
      name: 'Agente de Marketing Digital',
      description: 'Especialista em estratégias de marketing, SEO, redes sociais e conteúdo',
      type: 'template',
      config: `role: Digital Marketing Agent
expertise:
  - Marketing digital
  - SEO e SEM
  - Redes sociais
  - Content marketing
  - Email marketing
personality: criativo, analítico, comunicativo`,
      knowledge: `# Conhecimento do Agente de Marketing Digital

## Marketing Digital
- Estratégias digitais
- Marketing de conteúdo
- Inbound marketing
- Marketing de performance
- Análise de ROI

## SEO e SEM
- Otimização para buscadores
- Pesquisa de palavras-chave
- Link building
- Google Ads
- Análise de tráfego

## Redes Sociais
- Estratégia de conteúdo
- Gestão de comunidades
- Anúncios pagos
- Influencer marketing
- Social listening`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    // Agentes de Tecnologia
    {
      name: 'Consultor de TI',
      description: 'Especialista em consultoria de tecnologia, arquitetura de sistemas e transformação digital',
      type: 'template',
      config: `role: IT Consultant
expertise:
  - Consultoria de tecnologia
  - Arquitetura de sistemas
  - Transformação digital
  - Gestão de projetos
  - Segurança da informação
personality: técnico, estratégico, inovador`,
      knowledge: `# Conhecimento do Consultor de TI

## Consultoria de Tecnologia
- Avaliação de sistemas
- Recomendações técnicas
- Planejamento de infraestrutura
- Otimização de recursos
- Governança de TI

## Arquitetura de Sistemas
- Design de sistemas
- Integração de plataformas
- Microserviços
- Cloud computing
- DevOps

## Transformação Digital
- Estratégia digital
- Inovação tecnológica
- Gestão da mudança
- Cultura digital
- Agilidade organizacional`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    {
      name: 'Assistente de E-commerce',
      description: 'Especialista em vendas online, atendimento ao cliente e gestão de loja virtual',
      type: 'template',
      config: `role: E-commerce Assistant
expertise:
  - Vendas online
  - Gestão de loja virtual
  - Atendimento ao cliente
  - Logística e fulfillment
  - Marketing digital
personality: dinâmico, focado no cliente, organizado`,
      knowledge: `# Conhecimento do Assistente de E-commerce

## Vendas Online
- Plataformas de e-commerce
- Gestão de catálogo
- Precificação e promoções
- Checkout e pagamento
- Conversão de vendas

## Gestão de Loja Virtual
- Design de UX/UI
- Otimização de conversão
- Gestão de estoque
- Análise de vendas
- Relatórios e métricas

## Atendimento e Logística
- Suporte ao cliente
- Gestão de pedidos
- Logística e entrega
- Trocas e devoluções
- Fidelização de clientes`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    // Agentes de Operações e Gestão
    {
      name: 'Especialista em Logística',
      description: 'Especialista em gestão da cadeia de suprimentos, logística e operações',
      type: 'template',
      config: `role: Logistics Specialist
expertise:
  - Gestão da cadeia de suprimentos
  - Logística
  - Operações
  - Gestão de estoque
  - Transporte e distribuição
personality: organizado, analítico, eficiente`,
      knowledge: `# Conhecimento do Especialista em Logística

## Gestão da Cadeia de Suprimentos
- Planejamento de demanda
- Gestão de fornecedores
- Compras estratégicas
- Gestão de contratos
- Relacionamento com fornecedores

## Logística
- Armazenamento
- Transporte
- Distribuição
- Gestão de frota
- Roteirização

## Operações
- Gestão de estoque
- Controle de qualidade
- Processos operacionais
- Melhoria contínua
- Otimização de recursos`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    {
      name: 'Agente de Recursos Humanos',
      description: 'Especialista em gestão de talentos, recrutamento e desenvolvimento organizacional',
      type: 'template',
      config: `role: Human Resources Agent
expertise:
  - Gestão de talentos
  - Recrutamento e seleção
  - Desenvolvimento organizacional
  - Gestão de desempenho
  - Cultura organizacional
personality: humano, estratégico, comunicativo`,
      knowledge: `# Conhecimento do Agente de Recursos Humanos

## Gestão de Talentos
- Atração de talentos
- Retenção de talentos
- Planejamento de sucessão
- Desenvolvimento de liderança
- Gestão de carreiras

## Recrutamento e Seleção
- Processos seletivos
- Entrevistas
- Avaliação de competências
- Onboarding
- Integração de novos colaboradores

## Desenvolvimento Organizacional
- Treinamento e desenvolvimento
- Gestão de desempenho
- Cultura organizacional
- Clima organizacional
- Mudança organizacional`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    // Agentes Financeiros
    {
      name: 'Consultor Financeiro',
      description: 'Especialista em análise financeira, planejamento orçamentário e consultoria de investimentos',
      type: 'template',
      config: `role: Financial Consultant
expertise:
  - Análise financeira
  - Planejamento orçamentário
  - Consultoria de investimentos
  - Gestão de risco
  - Controle financeiro
personality: analítico, preciso, estratégico`,
      knowledge: `# Conhecimento do Consultor Financeiro

## Análise Financeira
- Análise de demonstrações
- Indicadores financeiros
- Análise de rentabilidade
- Fluxo de caixa
- Análise de investimento

## Planejamento Orçamentário
- Elaboração de orçamentos
- Controle orçamentário
- Projeções financeiras
- Análise de variações
- Otimização de recursos

## Consultoria de Investimentos
- Análise de investimentos
- Gestão de portfólio
- Risco e retorno
- Diversificação
- Planejamento financeiro pessoal`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    // Agentes de Serviços Profissionais
    {
      name: 'Especialista em Educação',
      description: 'Especialista em métodos de ensino, planejamento educacional e tutoria',
      type: 'template',
      config: `role: Education Specialist
expertise:
  - Métodos de ensino
  - Planejamento educacional
  - Tutoria
  - Tecnologia educacional
  - Avaliação de aprendizagem
personality: paciente, educador, inovador`,
      knowledge: `# Conhecimento do Especialista em Educação

## Métodos de Ensino
- Pedagogia e andragogia
- Métodos ativos de aprendizagem
- Aprendizagem colaborativa
- Gamificação
- Ensino híbrido

## Planejamento Educacional
- Currículo e programas
- Planejamento de aulas
- Objetivos de aprendizagem
- Avaliação educacional
- Adaptação curricular

## Tecnologia Educacional
- Ferramentas digitais
- Plataformas de ensino
- Realidade virtual e aumentada
- IA na educação
- Educação a distância`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    {
      name: 'Consultor Jurídico',
      description: 'Especialista em consultoria jurídica, análise de contratos e compliance',
      type: 'template',
      config: `role: Legal Consultant
expertise:
  - Consultoria jurídica
  - Análise de contratos
  - Compliance
  - Legislação comercial
  - Gestão de riscos legais
personality: detalhista, ético, analítico`,
      knowledge: `# Conhecimento do Consultor Jurídico

## Consultoria Jurídica
- Assessoria jurídica
- Opinião legal
- Due diligence
- Estruturação de negócios
- Governança corporativa

## Análise de Contratos
- Elaboração de contratos
- Revisão contratual
- Negociação de cláusulas
- Gestão contratual
- Resolução de conflitos

## Compliance e Regulação
- Programas de compliance
- Prevenção à lavagem de dinheiro
- Proteção de dados
- Legislação setorial
- Gestão de riscos legais`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    {
      name: 'Agente de Saúde e Bem-estar',
      description: 'Especialista em saúde, bem-estar, nutrição e orientação médica básica',
      type: 'template',
      config: `role: Health and Wellness Agent
expertise:
  - Saúde e bem-estar
  - Nutrição
  - Orientação médica básica
  - Atividade física
  - Saúde mental
personality: cuidadoso, empático, informativo`,
      knowledge: `# Conhecimento do Agente de Saúde e Bem-estar

## Saúde e Bem-estar
- Promoção da saúde
- Prevenção de doenças
- Hábitos saudáveis
- Qualidade de vida
- Bem-estar integral

## Nutrição
- Alimentação equilibrada
- Planejamento alimentar
- Suplementação
- Dietas especiais
- Hidratação

## Saúde Mental e Física
- Gestão do estresse
- Atividade física
- Sono e descanso
- Saúde emocional
- Autoconhecimento`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    // Agentes Criativos e de Conteúdo
    {
      name: 'Assistente Criativo',
      description: 'Especialista em criação de conteúdo, design e comunicação criativa',
      type: 'template',
      config: `role: Creative Assistant
expertise:
  - Criação de conteúdo
  - Design gráfico
  - Comunicação criativa
  - Storytelling
  - Branding
personality: criativo, inspirador, versátil`,
      knowledge: `# Conhecimento do Assistente Criativo

## Criação de Conteúdo
- Redação criativa
- Conteúdo para redes sociais
- Copywriting
- Storytelling
- Conteúdo visual

## Design e Comunicação
- Design gráfico
- Identidade visual
- Branding
- Comunicação visual
- Experiência do usuário

## Estratégia Criativa
- Brainstorming
- Ideação criativa
- Tendências criativas
- Inovação
- Solução criativa de problemas`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    // Agente de Suporte ao Cliente
    {
      name: 'Agente de Suporte ao Cliente',
      description: 'Especialista em atendimento ao cliente, resolução de problemas e gestão de relacionamentos',
      type: 'template',
      config: `role: Customer Support Agent
expertise:
  - Atendimento ao cliente
  - Resolução de problemas
  - Gestão de relacionamentos
  - Suporte técnico
  - Satisfação do cliente
personality: paciente, prestativo, comunicativo`,
      knowledge: `# Conhecimento do Agente de Suporte ao Cliente

## Atendimento ao Cliente
- Comunicação eficaz
- Gestão de expectativas
- Escuta ativa
- Empatia
- Resolução de conflitos

## Resolução de Problemas
- Diagnóstico de problemas
- Soluções criativas
- Tomada de decisão
- Gestão de crises
- Aprendizado contínuo

## Gestão de Relacionamentos
- Fidelização de clientes
- Prospecção de necessidades
- Feedback e melhorias
- CRM e gestão de contatos
- Métricas de satisfação`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
  ];

  for (const agentData of professionalAgentsData) {
    try {
      const agent = await prisma.agent.create({
        data: {
          ...agentData,
          slug: slugify(agentData.name),
        },
      });
      console.log(`✅ Agente profissional criado: ${agent.name}`);
    } catch (error) {
      console.log(`⚠️ Agente profissional já existe ou erro ao criar: ${agentData.name}`);
    }
  }

  // Criar agentes básicos para cada workspace
  console.log('🤖 Criando agentes básicos...');
  const agentsData = [
    {
      name: 'Assistente Pessoal',
      description: 'Assistente pessoal para tarefas diárias',
      type: 'custom',
      config: `role: Assistente Pessoal
expertise:
  - Organização de tarefas
  - Gerenciamento de tempo
  - Lembretes e alertas
  - Comunicação pessoal
personality: prestativo, organizado, amigável`,
      knowledge: `# Conhecimento do Assistente Pessoal

## Funcionalidades
- Gerenciamento de agenda e compromissos
- Criação de lembretes e alertas
- Organização de tarefas diárias
- Sugestões de produtividade
- Comunicação por email e mensagem

## Habilidades
- Priorização de tarefas
- Gerenciamento de tempo
- Comunicação clara
- Solução de problemas`,
      status: 'active',
      workspaceId: workspaceSuperAdmin?.id || '',
      userId: superAdmin?.id,
    },
    {
      name: 'Especialista em Negócios',
      description: 'Especialista em análise e estratégia de negócios',
      type: 'template',
      config: `role: Business Specialist
expertise:
  - Análise de mercado
  - Estratégia empresarial
  - Planejamento financeiro
  - Gestão de projetos
personality: estratégico, analítico, profissional`,
      knowledge: `# Conhecimento em Negócios

## Análise de Mercado
- Tendências de mercado
- Análise competitiva
- Oportunidades de crescimento
- Segmentação de clientes

## Estratégia Empresarial
- Planejamento estratégico
- Modelo de negócios
- Expansão de mercado
- Inovação e competitividade

## Gestão Financeira
- Planejamento financeiro
- Análise de investimentos
- Gestão de custos
- Otimização de recursos`,
      status: 'active',
      workspaceId: workspaceCompanyAdmin?.id || '',
      userId: companyAdmin?.id,
    },
    {
      name: 'Agente de Suporte',
      description: 'Agente de suporte técnico e atendimento ao cliente',
      type: 'custom',
      config: `role: Support Agent
expertise:
  - Suporte técnico
  - Atendimento ao cliente
  - Resolução de problemas
  - Documentação
personality: paciente, prestativo, técnico`,
      knowledge: `# Conhecimento em Suporte

## Suporte Técnico
- Diagnóstico de problemas
- Soluções técnicas
- Configuração de sistemas
- Manutenção preventiva

## Atendimento ao Cliente
- Comunicação eficaz
- Gestão de expectativas
- Resolução de conflitos
- Satisfação do cliente

## Documentação
- Criação de manuais
- Registro de soluções
- Base de conhecimento
- Tutoriais e guias`,
      status: 'active',
      workspaceId: workspaceCompanyUser?.id || '',
      userId: companyUser?.id,
    },
    {
      name: 'Assistente Gratuito',
      description: 'Assistente com funcionalidades básicas',
      type: 'custom',
      config: `role: Basic Assistant
expertise:
  - Respostas rápidas
  - Informações gerais
  - Ajuda básica
  - Direcionamento de recursos
personality: simples, direto, útil`,
      knowledge: `# Conhecimento Básico

## Funcionalidades
- Respostas a perguntas comuns
- Informações gerais
- Ajuda básica
- Direcionamento para recursos

## Limitações
- Acesso a recursos básicos
- Sem análise avançada
- Sem integrações complexas
- Funcionalidades limitadas`,
      status: 'active',
      workspaceId: workspaceFree?.id || '',
      userId: freeUser?.id,
    },
    {
      name: 'Assistente Iniciante',
      description: 'Assistente com funcionalidades intermediárias',
      type: 'custom',
      config: `role: Intermediate Assistant
expertise:
  - Análise básica
  - Organização de dados
  - Planejamento simples
  - Comunicação eficiente
personality: aprendiz, organizado, comunicativo`,
      knowledge: `# Conhecimento Intermediário

## Funcionalidades
- Análise de dados básica
- Organização de informações
- Planejamento simples
- Comunicação eficiente

## Habilidades
- Interpretação de dados
- Organização lógica
- Planejamento estruturado
- Comunicação clara`,
      status: 'active',
      workspaceId: workspaceIniciante?.id || '',
      userId: inicianteUser?.id,
    },
    {
      name: 'Assistente Profissional',
      description: 'Assistente com funcionalidades completas',
      type: 'custom',
      config: `role: Professional Assistant
expertise:
  - Análise avançada
  - Estratégia complexa
  - Gestão completa
  - Integração total
personality: experiente, estratégico, completo`,
      knowledge: `# Conhecimento Profissional

## Funcionalidades
- Análise avançada de dados
- Estratégia complexa
- Gestão completa de projetos
- Integração total de sistemas

## Habilidades
- Tomada de decisão estratégica
- Gestão de recursos complexos
- Análise preditiva
- Otimização de processos`,
      status: 'active',
      workspaceId: workspaceProfissional?.id || '',
      userId: profissionalUser?.id,
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

  console.log('🎉 Backup seed concluído com sucesso!');
  console.log('📊 Resumo dos dados criados:');
  console.log(`- Usuários: ${usersData.length}`);
  console.log(`- Empresas: ${companiesData.length}`);
  console.log(`- Clientes: ${clientsData.length}`);
  console.log(`- Workspaces: ${workspacesData.length}`);
  console.log(`- Agentes Profissionais: ${professionalAgentsData.length}`);
  console.log(`- Agentes Básicos: ${agentsData.length}`);
  console.log(`- Total de Agentes: ${professionalAgentsData.length + agentsData.length}`);
  console.log('');
  console.log('📋 Papéis disponíveis:');
  console.log('- SUPER_ADMIN: Acesso total ao sistema');
  console.log('- COMPANY_ADMIN: Administração empresarial');
  console.log('- COMPANY_USER: Acesso empresarial limitado');
  console.log('- FREE: Usuário gratuito com funcionalidades básicas');
  console.log('- INICIANTE: Usuário com funcionalidades intermediárias');
  console.log('- PROFISSIONAL: Usuário com todas as funcionalidades');
  console.log('');
  console.log('🎯 Templates Profissionais (SuperAdmin):');
  console.log('- Consultor de Estratégia');
  console.log('- Especialista em Dados');
  console.log('- Agente de Automação Inteligente');
  console.log('- Arquiteto de Workflows');
  console.log('- Integrador Flowise');
  console.log('- Agente de Vendas');
  console.log('- Agente de Marketing Digital');
  console.log('- Consultor de TI');
  console.log('- Assistente de E-commerce');
  console.log('- Especialista em Logística');
  console.log('- Agente de Recursos Humanos');
  console.log('- Consultor Financeiro');
  console.log('- Especialista em Educação');
  console.log('- Consultor Jurídico');
  console.log('- Agente de Saúde e Bem-estar');
  console.log('- Assistente Criativo');
  console.log('- Agente de Suporte ao Cliente');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o backup seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });