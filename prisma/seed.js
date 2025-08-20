"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');
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
    // Criar usuários
    console.log('👥 Criando usuários...');
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@zanai.com',
            name: 'Administrador Zanai',
            role: 'admin',
        },
    });
    const regularUser = await prisma.user.create({
        data: {
            email: 'joao.silva@empresa.com',
            name: 'João Silva',
            role: 'user',
        },
    });
    const companyUser = await prisma.user.create({
        data: {
            email: 'maria.santos@techcorp.com',
            name: 'Maria Santos',
            role: 'company_admin',
        },
    });
    // Criar empresas
    console.log('🏢 Criando empresas...');
    const techCorp = await prisma.company.create({
        data: {
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
            users: {
                connect: [{ id: companyUser.id }],
            },
        },
    });
    const startupXYZ = await prisma.company.create({
        data: {
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
    });
    // Criar clientes
    console.log('👤 Criando clientes...');
    const client1 = await prisma.client.create({
        data: {
            name: 'Pedro Oliveira',
            cpf: '123.456.789-00',
            email: 'pedro.oliveira@email.com',
            phone: '(11) 98765-4321',
            address: 'Rua das Flores, 123',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
            birthDate: new Date('1985-05-15'),
            userId: regularUser.id,
        },
    });
    const client2 = await prisma.client.create({
        data: {
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
    });
    // Criar workspaces para o sistema Zanai
    console.log('🏗️ Criando workspaces...');
    const workspace1 = await prisma.workspace.create({
        data: {
            name: 'Workspace Principal',
            description: 'Workspace principal para desenvolvimento de agentes IA',
            config: JSON.stringify({
                theme: 'dark',
                language: 'pt-BR',
                autoSave: true,
            }),
            userId: adminUser.id,
        },
    });
    const workspace2 = await prisma.workspace.create({
        data: {
            name: 'Workspace de Testes',
            description: 'Workspace para testes e experimentação',
            config: JSON.stringify({
                theme: 'light',
                language: 'pt-BR',
                autoSave: false,
            }),
            userId: regularUser.id,
        },
    });
    const workspace3 = await prisma.workspace.create({
        data: {
            name: 'Workspace Corporativo',
            description: 'Workspace para projetos empresariais',
            config: JSON.stringify({
                theme: 'system',
                language: 'pt-BR',
                autoSave: true,
                notifications: true,
            }),
            userId: companyUser.id,
        },
    });
    // Criar agentes
    console.log('🤖 Criando agentes...');
    const agents = [
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
            workspaceId: workspace1.id,
            userId: adminUser.id,
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
            workspaceId: workspace1.id,
            userId: adminUser.id,
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
            workspaceId: workspace2.id,
            userId: regularUser.id,
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
            workspaceId: workspace3.id,
            userId: companyUser.id,
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
            workspaceId: workspace2.id,
            userId: regularUser.id,
        },
    ];
    const createdAgents = await Promise.all(agents.map(agent => prisma.agent.create({ data: agent })));
    // Criar composições
    console.log('🔗 Criando composições...');
    const compositions = [
        {
            name: 'Pipeline de Desenvolvimento',
            description: 'Fluxo completo para análise e desenvolvimento de software',
            config: `pipeline:
  - name: "Análise de Requisitos"
    agent: "Analista de Negócios"
    output: "requisitos_documentados"
  - name: "Desenvolvimento"
    agent: "Desenvolvedor Full Stack"
    input: "requisitos_documentados"
    output: "software_desenvolvido"
  - name: "Revisão Legal"
    agent: "Consultor Jurídico"
    input: "software_desenvolvido"
    output: "software_aprovado"`,
            status: 'active',
            workspaceId: workspace1.id,
            agents: {
                connect: [
                    { id: createdAgents[0].id }, // Analista de Negócios
                    { id: createdAgents[2].id }, // Desenvolvedor Full Stack
                    { id: createdAgents[3].id }, // Consultor Jurídico
                ],
            },
        },
        {
            name: 'Marketing Digital Pipeline',
            description: 'Fluxo para estratégias de marketing digital',
            config: `pipeline:
  - name: "Análise de Mercado"
    agent: "Analista de Negócios"
    output: "analise_mercado"
  - name: "Estratégia de Marketing"
    agent: "Especialista em Marketing Digital"
    input: "analise_mercado"
    output: "estrategia_marketing"`,
            status: 'active',
            workspaceId: workspace1.id,
            agents: {
                connect: [
                    { id: createdAgents[0].id }, // Analista de Negócios
                    { id: createdAgents[1].id }, // Especialista em Marketing Digital
                ],
            },
        },
        {
            name: 'Suporte ao Cliente',
            description: 'Fluxo de atendimento ao cliente',
            config: `pipeline:
  - name: "Triagem Inicial"
    agent: "Agente de Suporte"
    output: "caso_classificado"
  - name: "Resolução Técnica"
    agent: "Desenvolvedor Full Stack"
    input: "caso_classificado"
    output: "problema_resolvido"`,
            status: 'draft',
            workspaceId: workspace2.id,
            agents: {
                connect: [
                    { id: createdAgents[4].id }, // Agente de Suporte
                    { id: createdAgents[2].id }, // Desenvolvedor Full Stack
                ],
            },
        },
    ];
    await Promise.all(compositions.map(composition => prisma.composition.create({ data: composition })));
    // Criar projetos
    console.log('📋 Criando projetos...');
    const projects = [
        {
            name: 'Sistema de Gestão Empresarial',
            description: 'Desenvolvimento de ERP para gestão empresarial',
            status: 'active',
            budget: 150000.00,
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-12-15'),
            companyId: techCorp.id,
        },
        {
            name: 'Aplicativo Mobile',
            description: 'Desenvolvimento de aplicativo para delivery',
            status: 'planning',
            budget: 75000.00,
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-08-31'),
            clientId: client1.id,
        },
        {
            name: 'Site Institucional',
            description: 'Criação de site institucional para startup',
            status: 'completed',
            budget: 25000.00,
            startDate: new Date('2023-10-01'),
            endDate: new Date('2024-01-31'),
            clientId: client2.id,
        },
    ];
    const createdProjects = await Promise.all(projects.map(project => prisma.project.create({ data: project })));
    // Criar tarefas
    console.log('✅ Criando tarefas...');
    const tasks = [
        {
            title: 'Análise de Requisitos',
            description: 'Levantar requisitos com o cliente',
            status: 'completed',
            priority: 'high',
            dueDate: new Date('2024-02-15'),
            projectId: createdProjects[0].id,
        },
        {
            title: 'Design do Banco de Dados',
            description: 'Modelar e implementar banco de dados',
            status: 'in_progress',
            priority: 'high',
            dueDate: new Date('2024-03-01'),
            projectId: createdProjects[0].id,
        },
        {
            title: 'Desenvolvimento Frontend',
            description: 'Implementar interface do usuário',
            status: 'pending',
            priority: 'medium',
            dueDate: new Date('2024-06-15'),
            projectId: createdProjects[0].id,
        },
        {
            title: 'Prototipação',
            description: 'Criar protótipos do aplicativo',
            status: 'in_progress',
            priority: 'medium',
            dueDate: new Date('2024-04-15'),
            projectId: createdProjects[1].id,
        },
        {
            title: 'Integração com APIs',
            description: 'Integrar com APIs de pagamento e mapa',
            status: 'pending',
            priority: 'medium',
            dueDate: new Date('2024-07-01'),
            projectId: createdProjects[1].id,
        },
    ];
    await Promise.all(tasks.map(task => prisma.task.create({ data: task })));
    // Criar contratos
    console.log('📄 Criando contratos...');
    const contracts = [
        {
            title: 'Contrato de Desenvolvimento ERP',
            description: 'Desenvolvimento de sistema de gestão empresarial',
            value: 150000.00,
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-12-15'),
            status: 'active',
            clientId: client1.id,
        },
        {
            title: 'Contrato de Desenvolvimento App',
            description: 'Desenvolvimento de aplicativo mobile',
            value: 75000.00,
            startDate: new Date('2024-03-01'),
            endDate: new Date('2024-08-31'),
            status: 'active',
            clientId: client2.id,
        },
    ];
    await Promise.all(contracts.map(contract => prisma.contract.create({ data: contract })));
    // Criar relatórios
    console.log('📊 Criando relatórios...');
    const reports = [
        {
            title: 'Relatório Financeiro Mensal',
            type: 'financial',
            data: JSON.stringify({
                revenue: 50000.00,
                expenses: 35000.00,
                profit: 15000.00,
                growth: 15.5,
            }),
            period: 'monthly',
            companyId: techCorp.id,
        },
        {
            title: 'Progresso do Projeto ERP',
            type: 'progress',
            data: JSON.stringify({
                completed: 35,
                inProgress: 45,
                pending: 20,
                overdue: 0,
            }),
            period: 'weekly',
            projectId: createdProjects[0].id,
        },
        {
            title: 'Análise de Métricas',
            type: 'analytics',
            data: JSON.stringify({
                users: 1250,
                sessions: 3500,
                bounceRate: 32.5,
                conversionRate: 2.8,
            }),
            period: 'monthly',
            companyId: startupXYZ.id,
        },
    ];
    await Promise.all(reports.map(report => prisma.report.create({ data: report })));
    // Criar algumas execuções de agentes para demonstração
    console.log('🚀 Criando execuções de agentes...');
    const agentExecutions = [
        {
            agentId: createdAgents[0].id,
            input: 'Analise os requisitos para um sistema de gestão empresarial',
            output: 'Baseado na análise, os requisitos principais são: 1. Gestão de usuários e permissões, 2. Controle financeiro, 3. Gestão de estoque, 4. Emissão de relatórios, 5. Integração com sistemas legados.',
            status: 'completed',
            context: JSON.stringify({ project: 'ERP System', priority: 'high' }),
            startedAt: new Date('2024-01-20T10:00:00'),
            completedAt: new Date('2024-01-20T10:15:00'),
        },
        {
            agentId: createdAgents[1].id,
            input: 'Crie uma estratégia de marketing digital para lançamento de software',
            output: 'Estratégia proposta: 1. SEO para palavras-chave relacionadas, 2. Content marketing com blog e ebooks, 3. Campanhas no Google Ads, 4. Marketing nas redes sociais, 5. Email marketing para nutrição de leads.',
            status: 'completed',
            context: JSON.stringify({ campaign: 'Software Launch', budget: 10000 }),
            startedAt: new Date('2024-01-21T14:00:00'),
            completedAt: new Date('2024-01-21T14:20:00'),
        },
        {
            agentId: createdAgents[2].id,
            input: 'Implemente uma API REST para gestão de produtos',
            output: 'API implementada com endpoints: GET /products, POST /products, PUT /products/:id, DELETE /products/:id. Validação de dados, autenticação JWT e rate limiting aplicados.',
            status: 'completed',
            context: JSON.stringify({ tech: 'Node.js, Express', database: 'PostgreSQL' }),
            startedAt: new Date('2024-01-22T09:00:00'),
            completedAt: new Date('2024-01-22T10:30:00'),
        },
    ];
    await Promise.all(agentExecutions.map(execution => prisma.agentExecution.create({ data: execution })));
    // Criar métricas de agentes
    console.log('📈 Criando métricas de agentes...');
    const agentMetrics = [
        {
            agentId: createdAgents[0].id,
            timestamp: BigInt(Date.now()),
            metricName: 'response_time',
            metricValue: 15.5,
            tags: 'type:business_analysis',
        },
        {
            agentId: createdAgents[0].id,
            timestamp: BigInt(Date.now() - 3600000),
            metricName: 'accuracy',
            metricValue: 0.95,
            tags: 'type:business_analysis',
        },
        {
            agentId: createdAgents[1].id,
            timestamp: BigInt(Date.now()),
            metricName: 'response_time',
            metricValue: 20.3,
            tags: 'type:marketing',
        },
        {
            agentId: createdAgents[2].id,
            timestamp: BigInt(Date.now()),
            metricName: 'response_time',
            metricValue: 90.0,
            tags: 'type:development',
        },
        {
            agentId: createdAgents[2].id,
            timestamp: BigInt(Date.now() - 3600000),
            metricName: 'success_rate',
            metricValue: 0.98,
            tags: 'type:development',
        },
    ];
    await Promise.all(agentMetrics.map(metric => prisma.agentMetrics.create({ data: metric })));
    // Criar logs de auditoria
    console.log('🔍 Criando logs de auditoria...');
    const auditLogs = [
        {
            action: 'create',
            entityType: 'user',
            entityId: adminUser.id,
            userId: adminUser.id,
            newValues: JSON.stringify({
                email: 'admin@zanai.com',
                name: 'Administrador Zanai',
                role: 'admin',
            }),
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Seed Script)',
        },
        {
            action: 'create',
            entityType: 'workspace',
            entityId: workspace1.id,
            userId: adminUser.id,
            newValues: JSON.stringify({
                name: 'Workspace Principal',
                description: 'Workspace principal para desenvolvimento de agentes IA',
            }),
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Seed Script)',
        },
        {
            action: 'create',
            entityType: 'agent',
            entityId: createdAgents[0].id,
            userId: adminUser.id,
            newValues: JSON.stringify({
                name: 'Analista de Negócios',
                type: 'template',
                status: 'active',
            }),
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Seed Script)',
        },
    ];
    await Promise.all(auditLogs.map(log => prisma.auditLog.create({ data: log })));
    console.log('✅ Seed do banco de dados concluído com sucesso!');
    console.log('📊 Resumo dos dados criados:');
    console.log(`   - Usuários: 3`);
    console.log(`   - Empresas: 2`);
    console.log(`   - Clientes: 2`);
    console.log(`   - Workspaces: 3`);
    console.log(`   - Agentes: 5`);
    console.log(`   - Composições: 3`);
    console.log(`   - Projetos: 3`);
    console.log(`   - Tarefas: 5`);
    console.log(`   - Contratos: 2`);
    console.log(`   - Relatórios: 3`);
    console.log(`   - Execuções de Agentes: 3`);
    console.log(`   - Métricas: 5`);
    console.log(`   - Logs de Auditoria: 3`);
}
main()
    .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map