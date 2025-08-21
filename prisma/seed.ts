import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar usuário de teste
  const user = await prisma.user.upsert({
    where: { email: 'admin@zanai.com' },
    update: {},
    create: {
      email: 'admin@zanai.com',
      name: 'Administrador Zanai',
      role: 'admin',
    },
  });

  // Criar workspace de teste
  const workspace = await prisma.workspace.upsert({
    where: { id: 'default-workspace' },
    update: {},
    create: {
      id: 'default-workspace',
      name: 'Workspace Padrão',
      description: 'Workspace principal para demonstração',
      config: JSON.stringify({
        theme: 'default',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo'
      }),
      userId: user.id,
    },
  });

  // Criar agentes de teste para diferentes categorias
  const agents = [
    {
      id: 'business-analyst-1',
      name: 'Analista de Negócios AI',
      slug: 'analista-de-negocios-ai',
      description: 'Especialista em análise de dados de negócios e inteligência de mercado',
      type: 'custom',
      config: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        systemPrompt: 'Você é um analista de negócios experiente, especializado em análise de dados, tendências de mercado e consultoria estratégica.',
        tools: ['web_search', 'data_analysis']
      }),
      knowledge: `# Conhecimento Base - Analista de Negócios

## Análise de Mercado
- Análise SWOT (Forças, Fraquezas, Oportunidades, Ameaças)
- Análise de concorrência
- Tendências de mercado
- Pesquisa de mercado

## Métricas de Negócio
- ROI (Return on Investment)
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)
- Churn Rate
- MRR/ARR

## Estratégia
- Planejamento estratégico
- Otimização de processos
- Análise de eficiência operacional
- Consultoria de negócios`,
      status: 'active',
      workspaceId: workspace.id,
      userId: user.id,
    },
    {
      id: 'health-consultant-1',
      name: 'Consultor de Saúde AI',
      slug: 'consultor-de-saude-ai',
      description: 'Assistente médico virtual para consultas de saúde e orientações',
      type: 'custom',
      config: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        systemPrompt: 'Você é um consultor de saúde especializado, fornecendo orientações gerais de saúde e bem-estar.',
        tools: ['web_search', 'health_analysis']
      }),
      knowledge: `# Conhecimento Base - Consultor de Saúde

## Saúde Geral
- Nutrição e alimentação saudável
- Exercícios físicos e atividade física
- Saúde mental e bem-estar
- Prevenção de doenças

## Orientações Gerais
- Hábitos saudáveis
- Qualidade de vida
- Check-ups regulares
- Saúde preventiva

## Limitações
- Não substitui médico profissional
- Não faz diagnósticos definitivos
- Não prescreve medicamentos
- Sempre recomenda consulta profissional`,
      status: 'active',
      workspaceId: workspace.id,
      userId: user.id,
    },
    {
      id: 'tutor-agent-1',
      name: 'Tutor Personalizado AI',
      slug: 'tutor-personalizado-ai',
      description: 'Agente tutor especializado em ensino personalizado e aprendizagem',
      type: 'custom',
      config: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.6,
        systemPrompt: 'Você é um tutor educacional paciente e especializado, adaptando seu ensino ao estilo de aprendizagem do aluno.',
        tools: ['content_generation', 'learning_analysis']
      }),
      knowledge: `# Conhecimento Base - Tutor Educacional

## Metodologias de Ensino
- Aprendizagem personalizada
- Ensino adaptativo
- Métodos pedagógicos
- Avaliação de aprendizagem

## Conteúdo Educacional
- Matemática
- Ciências
- Linguagens
- Estudos sociais
- Tecnologia

## Técnicas de Estudo
- Mapas mentais
- Resumo ativo
- Repetição espaçada
- Aprendizagem baseada em projetos`,
      status: 'active',
      workspaceId: workspace.id,
      userId: user.id,
    },
    {
      id: 'sales-agent-1',
      name: 'Agente de Vendas AI',
      slug: 'agente-de-vendas-ai',
      description: 'Especialista em vendas, negociação e fechamento de negócios',
      type: 'custom',
      config: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.8,
        systemPrompt: 'Você é um agente de vendas experiente, especializado em negociação, qualificação de leads e fechamento de negócios.',
        tools: ['lead_analysis', 'sales_optimization']
      }),
      knowledge: `# Conhecimento Base - Agente de Vendas

## Técnicas de Vendas
- SPIN Selling
- Consultative Selling
- Solution Selling
- Vendas consultivas

## Negociação
- Técnicas de negociação
- Gestão de objeções
- Fechamento de vendas
- Pós-venda

## Gestão de Leads
- Qualificação de leads
- Lead scoring
- Nutrição de leads
- Funil de vendas`,
      status: 'active',
      workspaceId: workspace.id,
      userId: user.id,
    },
  ];

  // Inserir agentes
  for (const agentData of agents) {
    await prisma.agent.upsert({
      where: { id: agentData.id },
      update: {},
      create: agentData,
    });
  }

  console.log('Seed concluído com sucesso!');
  console.log(`Usuário: ${user.email}`);
  console.log(`Workspace: ${workspace.name}`);
  console.log(`Agentes criados: ${agents.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });