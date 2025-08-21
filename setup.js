#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando setup do ZANAI PAINEL V3...\n');

function runCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} concluído!\n`);
  } catch (error) {
    console.error(`❌ Erro ao ${description.toLowerCase()}:`, error.message);
    process.exit(1);
  }
}

function checkEnvFile() {
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  if (!fs.existsSync(envPath)) {
    console.log('📝 Arquivo .env não encontrado, criando a partir do modelo...');
    
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ Arquivo .env criado! Por favor, configure as variáveis de ambiente.');
    } else {
      console.log('⚠️ Arquivo .env.example não encontrado. Criando .env com valores padrão...');
      
      const defaultEnv = `# Database Configuration
DATABASE_URL="file:./db/custom.db"
# Environment Configuration
ZANAI_ENV="development"
ZANAI_PORT="3000"
NODE_ENV=development
# Z.ai SDK Configuration - GLM Configuration
ZAI_API_KEY=your_zai_api_key_here
ZAI_BASE_URL="https://api.z.ai/api/paas/v4/"
ZAI_MODEL=glm-4.5-flash
ZAI_MAX_TOKENS=2000
ZAI_TEMPERATURE=0.7
# OpenAI Configuration (for Flowise)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.z.ai/api/paas/v4/
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_chave_secreta_muito_segura_aqui
# Flowise Configuration
NEXT_PUBLIC_FLOWISE_URL=https://aaranha-zania.hf.space
FLOWISE_BASE_URL=https://aaranha-zania.hf.space
FLOWISE_API_KEY=wNFL5HJcOA3RwJdKiVTUWqdzigK7OCUwRKo9KEgjenw
FLOWISE_TIMEOUT=30000
FLOWISE_RETRY_ATTEMPTS=3
NEXT_PUBLIC_APP_URL=http://localhost:3000`;
      
      fs.writeFileSync(envPath, defaultEnv);
      console.log('✅ Arquivo .env criado com valores padrão!');
    }
  } else {
    console.log('✅ Arquivo .env já existe!');
  }
}

function checkZAIConfig() {
  const configPath = path.join(__dirname, '.z-ai-config');
  
  if (!fs.existsSync(configPath)) {
    console.log('📝 Arquivo .z-ai-config não encontrado, criando...');
    
    const defaultConfig = `{
  "apiKey": "your_zai_api_key_here",
  "baseUrl": "https://api.z.ai/api/paas/v4/",
  "model": "glm-4.5-flash",
  "maxTokens": 2000,
  "temperature": 0.6
}`;
    
    fs.writeFileSync(configPath, defaultConfig);
    console.log('✅ Arquivo .z-ai-config criado!');
  } else {
    console.log('✅ Arquivo .z-ai-config já existe!');
  }
}

function createDbDirectory() {
  const dbPath = path.join(__dirname, 'db');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
    console.log('✅ Diretório db/ criado!');
  } else {
    console.log('✅ Diretório db/ já existe!');
  }
}

// Main setup process
console.log('🔍 Verificando pré-requisitos...\n');

checkEnvFile();
checkZAIConfig();
createDbDirectory();

console.log('🗄️ Configurando banco de dados...\n');
runCommand('npx prisma db push', 'Push do schema do banco de dados');
runCommand('npx prisma generate', 'Geração do Prisma Client');
runCommand('npm run db:seed', 'População do banco de dados com usuários padrão');

console.log('🎉 Setup concluído com sucesso!\n');
console.log('📋 Usuários padrão criados:');
console.log('   👤 SUPER_ADMIN: superadmin@zanai.com / admin123');
console.log('   🏢 Admin Empresa: admin@zanai.com.br / empresa');
console.log('   👥 Usuário Gratuito: free.user@zanai.com / gratis');
console.log('   📈 Usuário Iniciante: iniciante.user@zanai.com / iniciante');
console.log('   💼 Usuário Profissional: profissional.user@zanai.com / profissional\n');
console.log('🚀 Para iniciar o servidor de desenvolvimento, execute: npm run dev');
console.log('🌐 Acesse http://localhost:3000 para utilizar a aplicação');