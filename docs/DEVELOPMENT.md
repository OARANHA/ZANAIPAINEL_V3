# 🛠️ Documentação Técnica para Desenvolvedores

Guia completo para desenvolvedores trabalhando com o Zanai AI Agents Platform.

## 🏗️ Arquitetura Técnica

### Visão Geral da Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (SQLite)      │
│                 │    │                 │    │                 │
│ • Components    │    │ • Auth          │    │ • Users         │
│ • Hooks         │    │ • Agents        │    │ • Workspaces    │
│ • Utils         │    │ • Analytics     │    │ • Clients       │
│ • Layouts       │    │ • MCP           │    │ • Projects      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                │
                    ┌─────────────────┐
                    │   External      │
                    │   Services      │
                    │                 │
                    │ • Z.ai SDK      │
                    │ • Socket.io     │
                    │ • FlowiseAI     │
                    │ • Supabase      │
                    └─────────────────┘
```

### Fluxo de Dados

1. **Frontend**: React components com TypeScript
2. **API Routes**: Next.js API routes para lógica de negócio
3. **Database**: Prisma ORM com SQLite
4. **Real-time**: Socket.io para comunicação ao vivo
5. **External Services**: Integração com Z.ai e outros serviços

## 📁 Estrutura de Código Detalhada

### App Router (Next.js 15)

```
src/app/
├── api/                    # API Routes
│   ├── health/            # Health check endpoint
│   │   └── route.ts       # GET /api/health
│   ├── v1/                # API v1
│   │   ├── dashboard/     # Dashboard analytics
│   │   │   ├── stats/     # Estatísticas
│   │   │   ├── trends/    # Tendências
│   │   │   ├── activity/  # Atividades
│   │   │   ├── analytics/ # Análises
│   │   │   └── comparison/ # Comparações
│   │   └── ...
│   ├── chat/              # Chat endpoints
│   │   └── route.ts       # POST /api/chat
│   └── flowise-chat/      # Flowise integration
│       └── route.ts       # POST /api/flowise-chat
├── admin/                 # Admin dashboard
│   ├── layout.tsx         # Admin layout
│   ├── page.tsx           # Admin dashboard
│   ├── api/               # Admin API routes
│   │   ├── admin/         # Admin management
│   │   ├── agents/        # Agent management
│   │   ├── clients/       # Client management
│   │   ├── compositions/  # Composition management
│   │   ├── executions/    # Execution tracking
│   │   ├── learning/      # Learning system
│   │   ├── mcp/           # MCP management
│   │   ├── specialists/   # Specialist agents
│   │   └── workspaces/    # Workspace management
│   ├── compositions/      # Compositions page
│   ├── clients/           # Clients management
│   ├── agents/            # Agents management
│   ├── specialists/       # Specialists page
│   ├── studio/            # Agent studio
│   ├── learning/          # Learning dashboard
│   └── executions/        # Executions page
├── dashboard/             # User dashboard
│   ├── layout.tsx         # Dashboard layout
│   ├── page.tsx           # Dashboard home
│   ├── agents/            # Agent management
│   ├── analytics/         # Analytics page
│   └── settings/         # Settings page
├── enterprise/            # Enterprise dashboard
│   ├── layout.tsx         # Enterprise layout
│   ├── page.tsx           # Enterprise home
│   ├── agents/            # Enterprise agents
│   ├── analytics/         # Enterprise analytics
│   ├── admin/             # Enterprise admin
│   └── settings/          # Enterprise settings
├── painel/                # Main panel
│   └── page.tsx           # Panel dashboard
├── planos/                # Pricing plans
│   └── page.tsx           # Plans page
├── auth/                  # Authentication
│   ├── login/             # Login page
│   └── register/          # Registration pages
├── layout.tsx             # Root layout
├── page.tsx               # Home page
└── globals.css            # Global styles
```

### Components Structure

```
src/components/
├── ui/                    # shadcn/ui components
│   ├── button.tsx         # Button component
│   ├── card.tsx           # Card component
│   ├── input.tsx          # Input component
│   ├── dialog.tsx         # Dialog component
│   ├── tabs.tsx           # Tabs component
│   ├── table.tsx          # Table component
│   ├── chart.tsx          # Chart component
│   ├── form.tsx           # Form components
│   ├── toast.tsx          # Toast notifications
│   └── ...                # Other UI components
├── layout/                # Layout components
│   ├── Layout.tsx         # Main layout
│   ├── Header.tsx         # Header component
│   ├── Navigation.tsx     # Navigation component
│   ├── Footer.tsx         # Footer component
│   ├── UserLayout.tsx     # User dashboard layout
│   └── MainLayout.tsx     # Main layout component
├── charts/                # Chart components
│   ├── StatCard.tsx       # Statistics card
│   ├── BarChart.tsx       # Bar chart
│   ├── LineChart.tsx      # Line chart
│   ├── PieChart.tsx       # Pie chart
│   └── AreaChart.tsx      # Area chart
├── agents/                # Agent-related components
│   ├── AgentCard.tsx      # Agent card
│   ├── AgentList.tsx      # Agent list
│   ├── AgentForm.tsx      # Agent form
│   ├── AgentDetails.tsx   # Agent details
│   ├── AgentActions.tsx   # Agent actions
│   ├── CreateAgent.tsx    # Create agent dialog
│   ├── EditAgent.tsx      # Edit agent dialog
│   └── AgentExecution.tsx # Agent execution
├── admin/                 # Admin components
│   ├── MCPManager.tsx     # MCP server manager
│   ├── SpecialistGenerator.tsx # Specialist generator
│   └── MCPManual.tsx      # MCP manual
└── other components...
```

### Lib Structure

```
src/lib/
├── db.ts                  # Prisma database client
├── utils.ts              # Utility functions
├── auth.ts               # Authentication utilities
├── zai.ts                # Z.ai SDK integration
├── zai-config.ts         # Z.ai configuration
├── metrics.ts            # Metrics collection
├── metrics-middleware.ts # Metrics middleware
├── socket.ts             # Socket.io configuration
├── context-persistence.ts # Context persistence
├── code-context.ts       # Code context utilities
├── specialist-service.ts  # Specialist service
├── agent-execution.ts    # Agent execution utilities
└── supabase.ts           # Supabase integration
```

## 🔧 Configuração de Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git
- VS Code (recomendado)

### Setup do Ambiente

```bash
# 1. Clonar o repositório
git clone <repository-url>
cd zanai-platform

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Editar .env com suas configurações
# Exemplo de configuração:
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
ZAI_API_KEY="your-zai-api-key"

# 5. Configurar banco de dados
npm run db:push
npm run db:generate
npm run db:seed

# 6. Iniciar servidor de desenvolvimento
npm run dev
```

### Configuração do VS Code

Extensões recomendadas:
- **ESLint**: `dbaeumer.vscode-eslint`
- **Prettier**: `esbenp.prettier-vscode`
- **Tailwind CSS**: `bradlc.vscode-tailwindcss`
- **TypeScript**: `ms-vscode.typescript-next`
- **Prisma**: `Prisma.prisma`
- **GraphQL**: `GraphQL.vscode-graphql`

## 🏗️ Padrões de Código

### Convenções de Nomenclatura

- **Components**: PascalCase (`AgentCard.tsx`)
- **Files**: kebab-case para pastas, PascalCase para componentes
- **Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PascalCase com sufixo `Interface` (`UserDataInterface`)

### Estrutura de Componentes

```typescript
// Componente funcional com TypeScript
interface ComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  title,
  description,
  onAction,
  className = ""
}) => {
  return (
    <div className={`component ${className}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {onAction && (
        <button onClick={onAction}>
          Action
        </button>
      )}
    </div>
  );
};
```

### Padrões de API

```typescript
// API Route pattern
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Schema de validação
const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSchema.parse(body);
    
    // Lógica de negócio
    const result = await db.user.create({
      data: validatedData,
    });
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Database Patterns

```typescript
// Prisma operations com TypeScript
import { db } from '@/lib/db';

export class UserService {
  static async createUser(data: CreateUserInput) {
    return await db.user.create({
      data,
      include: {
        company: true,
        workspace: true,
      },
    });
  }
  
  static async getUserById(id: string) {
    return await db.user.findUnique({
      where: { id },
      include: {
        agents: true,
        workspaces: true,
      },
    });
  }
}
```

## 🔌 Integrações

### Z.ai SDK Integration

```typescript
// lib/zai.ts
import ZAI from 'z-ai-web-dev-sdk';

export class ZAIService {
  private static instance: ZAI;
  
  static async getInstance() {
    if (!this.instance) {
      this.instance = await ZAI.create();
    }
    return this.instance;
  }
  
  static async chatCompletion(messages: Array<{role: string, content: string}>) {
    const zai = await this.getInstance();
    
    try {
      const completion = await zai.chat.completions.create({
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      });
      
      return completion.choices[0]?.message?.content;
    } catch (error) {
      console.error('Z.ai chat completion error:', error);
      throw error;
    }
  }
  
  static async generateImage(prompt: string) {
    const zai = await this.getInstance();
    
    try {
      const response = await zai.images.generations.create({
        prompt,
        size: '1024x1024',
      });
      
      return response.data[0].base64;
    } catch (error) {
      console.error('Z.ai image generation error:', error);
      throw error;
    }
  }
}
```

### Socket.io Integration

```typescript
// lib/socket.ts
import { Server } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

export type SocketServer = Server;

export const initSocket = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    
    res.socket.server.io = io;
    
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      
      socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`Client ${socket.id} joined room ${room}`);
      });
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  
  return res.socket.server.io as SocketServer;
};
```

### MCP Integration

```typescript
// lib/specialist-service.ts
export class MCPSpecialistService {
  static async executeTool(serverId: string, toolName: string, input: any) {
    const server = await db.mCPServer.findUnique({
      where: { id: serverId },
      include: { tools: true },
    });
    
    if (!server) {
      throw new Error('Server not found');
    }
    
    const tool = server.tools.find(t => t.name === toolName);
    if (!tool) {
      throw new Error('Tool not found');
    }
    
    // Executar tool via MCP
    const result = await this.executeMCPTool(server, tool, input);
    
    return result;
  }
  
  private static async executeMCPTool(server: any, tool: any, input: any) {
    // Lógica de execução MCP
    // Implementação específica do protocolo MCP
  }
}
```

## 🧪 Testes

### Estrutura de Testes

```
tests/
├── __mocks__/            # Mocks para testes
├── utils/               # Utilitários de teste
├── components/          # Testes de componentes
├── api/                 # Testes de API
├── lib/                 # Testes de utilitários
└── integration/         # Testes de integração
```

### Exemplo de Teste

```typescript
// tests/components/AgentCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AgentCard } from '@/components/agents/AgentCard';

describe('AgentCard', () => {
  const mockAgent = {
    id: '1',
    name: 'Test Agent',
    description: 'Test description',
    status: 'active',
    type: 'custom',
  };
  
  it('renders agent information', () => {
    render(<AgentCard agent={mockAgent} />);
    
    expect(screen.getByText('Test Agent')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(<AgentCard agent={mockAgent} onEdit={mockOnEdit} />);
    
    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockAgent);
  });
});
```

## 🚀 Deploy

### Build para Produção

```bash
# Build da aplicação
npm run build

# Iniciar servidor de produção
npm start
```

### Configuração de Ambiente de Produção

```bash
# .env.production
NODE_ENV=production
DATABASE_URL="file:./production.db"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
ZAI_API_KEY="your-production-zai-key"
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔍 Debugging

### Ferramentas de Debug

- **React Developer Tools**: Extensão do navegador
- **Next.js Dev Tools**: Debug de Next.js
- **Prisma Studio**: Visualização do banco de dados
- **Chrome DevTools**: Debug geral

### Logging

```typescript
// lib/logger.ts
export class Logger {
  static info(message: string, data?: any) {
    console.log(`[INFO] ${message}`, data || '');
  }
  
  static error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error || '');
  }
  
  static debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }
}
```

## 📚 Recursos Adicionais

### Documentação Útil

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Ferramentas Recomendadas

- **VS Code**: Editor de código principal
- **Git**: Controle de versão
- **npm**: Gerenciador de pacotes
- **Prisma Studio**: Visualização do banco de dados
- **Postman**: Teste de APIs

---

Este guia cobre os aspectos técnicos mais importantes do projeto. Para dúvidas específicas, consulte a documentação relevante ou entre em contato com a equipe de desenvolvimento.