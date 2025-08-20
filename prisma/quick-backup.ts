import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando backup rápido do banco de dados...');
  
  // Limpar dados existentes
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
  console.log('👥 Criando usuários...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'superadmin@zanai.com',
        name: 'Super Administrador',
        role: 'SUPER_ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'company.admin@empresa.com',
        name: 'Administrador da Empresa',
        role: 'COMPANY_ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'company.user@empresa.com',
        name: 'Usuário da Empresa',
        role: 'COMPANY_USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'free.user@zanai.com',
        name: 'Usuário Gratuito',
        role: 'FREE',
      },
    }),
    prisma.user.create({
      data: {
        email: 'iniciante.user@zanai.com',
        name: 'Usuário Iniciante',
        role: 'INICIANTE',
      },
    }),
    prisma.user.create({
      data: {
        email: 'profissional.user@zanai.com',
        name: 'Usuário Profissional',
        role: 'PROFISSIONAL',
      },
    }),
  ]);

  const [superAdmin, companyAdmin, companyUser, freeUser, inicianteUser, profissionalUser] = users;

  // Criar workspaces
  console.log('🏗️ Criando workspaces...');
  const workspaces = await Promise.all([
    prisma.workspace.create({
      data: {
        name: 'Workspace Super Admin',
        description: 'Workspace para Super Administrador',
        config: JSON.stringify({ theme: 'dark', language: 'pt-BR', autoSave: true }),
        userId: superAdmin.id,
      },
    }),
    prisma.workspace.create({
      data: {
        name: 'Workspace Empresa Admin',
        description: 'Workspace para Administrador da Empresa',
        config: JSON.stringify({ theme: 'system', language: 'pt-BR', autoSave: true }),
        userId: companyAdmin.id,
      },
    }),
    prisma.workspace.create({
      data: {
        name: 'Workspace Empresa User',
        description: 'Workspace para Usuário da Empresa',
        config: JSON.stringify({ theme: 'light', language: 'pt-BR', autoSave: false }),
        userId: companyUser.id,
      },
    }),
    prisma.workspace.create({
      data: {
        name: 'Workspace Gratuito',
        description: 'Workspace para Usuário Gratuito',
        config: JSON.stringify({ theme: 'light', language: 'pt-BR', autoSave: false }),
        userId: freeUser.id,
      },
    }),
    prisma.workspace.create({
      data: {
        name: 'Workspace Iniciante',
        description: 'Workspace para Usuário Iniciante',
        config: JSON.stringify({ theme: 'system', language: 'pt-BR', autoSave: true }),
        userId: inicianteUser.id,
      },
    }),
    prisma.workspace.create({
      data: {
        name: 'Workspace Profissional',
        description: 'Workspace para Usuário Profissional',
        config: JSON.stringify({ theme: 'dark', language: 'pt-BR', autoSave: true }),
        userId: profissionalUser.id,
      },
    }),
  ]);

  // Criar agentes básicos
  console.log('🤖 Criando agentes...');
  const agents = await Promise.all([
    prisma.agent.create({
      data: {
        name: 'Assistente Pessoal',
        description: 'Assistente pessoal para tarefas diárias',
        type: 'custom',
        config: 'role: Assistente Pessoal\nexpertise: Organização, Comunicação, Gestão',
        status: 'active',
        workspaceId: workspaces[0].id,
        userId: superAdmin.id,
        slug: 'assistente-pessoal',
      },
    }),
    prisma.agent.create({
      data: {
        name: 'Especialista em Negócios',
        description: 'Especialista em análise e estratégia de negócios',
        type: 'template',
        config: 'role: Business Specialist\nexpertise: Estratégia, Análise, Planejamento',
        status: 'active',
        workspaceId: workspaces[1].id,
        userId: companyAdmin.id,
        slug: 'especialista-negocios',
      },
    }),
    prisma.agent.create({
      data: {
        name: 'Agente de Suporte',
        description: 'Agente de suporte técnico e atendimento ao cliente',
        type: 'custom',
        config: 'role: Support Agent\nexpertise: Suporte, Atendimento, Resolução',
        status: 'active',
        workspaceId: workspaces[2].id,
        userId: companyUser.id,
        slug: 'agente-suporte',
      },
    }),
    prisma.agent.create({
      data: {
        name: 'Assistente Gratuito',
        description: 'Assistente com funcionalidades básicas',
        type: 'custom',
        config: 'role: Basic Assistant\nexpertise: Básico, Simples, Direto',
        status: 'active',
        workspaceId: workspaces[3].id,
        userId: freeUser.id,
        slug: 'assistente-gratuito',
      },
    }),
    prisma.agent.create({
      data: {
        name: 'Assistente Iniciante',
        description: 'Assistente com funcionalidades intermediárias',
        type: 'custom',
        config: 'role: Intermediate Assistant\nexpertise: Intermediário, Organizado, Comunicativo',
        status: 'active',
        workspaceId: workspaces[4].id,
        userId: inicianteUser.id,
        slug: 'assistente-iniciante',
      },
    }),
    prisma.agent.create({
      data: {
        name: 'Assistente Profissional',
        description: 'Assistente com funcionalidades completas',
        type: 'custom',
        config: 'role: Professional Assistant\nexpertise: Avançado, Estratégico, Completo',
        status: 'active',
        workspaceId: workspaces[5].id,
        userId: profissionalUser.id,
        slug: 'assistente-profissional',
      },
    }),
  ]);

  console.log('✅ Backup rápido concluído com sucesso!');
  console.log('📊 Resumo:');
  console.log(`- Usuários: ${users.length}`);
  console.log(`- Workspaces: ${workspaces.length}`);
  console.log(`- Agentes: ${agents.length}`);
  console.log('');
  console.log('🔑 Credenciais de teste:');
  console.log('SUPER_ADMIN: superadmin@zanai.com');
  console.log('COMPANY_ADMIN: company.admin@empresa.com');
  console.log('COMPANY_USER: company.user@empresa.com');
  console.log('FREE: free.user@zanai.com');
  console.log('INICIANTE: iniciante.user@zanai.com');
  console.log('PROFISSIONAL: profissional.user@zanai.com');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o backup rápido:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });