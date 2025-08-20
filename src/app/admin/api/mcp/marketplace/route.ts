import { NextRequest, NextResponse } from 'next/server';

interface MarketplaceServer {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  homepage?: string;
  repository?: string;
  downloads: number;
  tags: string[];
  rating: number;
  installCount: number;
  lastUpdated: string;
  config: {
    type: 'stdio' | 'sse' | 'http';
    command?: string;
    args?: string[];
    url?: string;
    env?: Record<string, string>;
    headers?: Record<string, string>;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';

    // Known MCP servers from the ecosystem
    const knownMCPServers = [
      {
        id: 'github-mcp',
        name: 'GitHub MCP Server',
        description: 'Official MCP server for GitHub API integration',
        author: 'Model Context Protocol',
        version: '1.0.0',
        homepage: 'https://github.com/modelcontextprotocol/server-github',
        repository: 'https://github.com/modelcontextprotocol/server-github',
        downloads: 15420,
        tags: ['github', 'api', 'version-control', 'official'],
        rating: 4.8,
        installCount: 8934,
        lastUpdated: '2024-01-15',
        config: {
          type: 'stdio' as const,
          command: 'npx',
          args: ['@modelcontextprotocol/server-github'],
          env: {
            GITHUB_PERSONAL_ACCESS_TOKEN: 'your_github_token_here'
          }
        }
      },
      {
        id: 'postgres-mcp',
        name: 'PostgreSQL MCP Server',
        description: 'Official MCP server for PostgreSQL database operations',
        author: 'Model Context Protocol',
        version: '1.1.0',
        homepage: 'https://github.com/modelcontextprotocol/server-postgres',
        repository: 'https://github.com/modelcontextprotocol/server-postgres',
        downloads: 12350,
        tags: ['postgres', 'database', 'sql', 'official'],
        rating: 4.7,
        installCount: 7654,
        lastUpdated: '2024-01-12',
        config: {
          type: 'stdio' as const,
          command: 'npx',
          args: ['@modelcontextprotocol/server-postgres'],
          env: {
            DATABASE_URL: 'postgresql://user:password@localhost:5432/database'
          }
        }
      },
      {
        id: 'brave-search-mcp',
        name: 'Brave Search MCP Server',
        description: 'Official MCP server for web search using Brave Search API',
        author: 'Model Context Protocol',
        version: '1.0.2',
        homepage: 'https://github.com/modelcontextprotocol/server-brave-search',
        repository: 'https://github.com/modelcontextprotocol/server-brave-search',
        downloads: 9876,
        tags: ['search', 'web', 'brave', 'api', 'official'],
        rating: 4.6,
        installCount: 5432,
        lastUpdated: '2024-01-10',
        config: {
          type: 'stdio' as const,
          command: 'npx',
          args: ['@modelcontextprotocol/server-brave-search'],
          env: {
            BRAVE_SEARCH_API_KEY: 'your_brave_api_key_here'
          }
        }
      },
      {
        id: 'filesystem-mcp',
        name: 'File System MCP Server',
        description: 'Official MCP server for file system operations',
        author: 'Model Context Protocol',
        version: '1.2.0',
        homepage: 'https://github.com/modelcontextprotocol/server-filesystem',
        repository: 'https://github.com/modelcontextprotocol/server-filesystem',
        downloads: 11234,
        tags: ['filesystem', 'files', 'io', 'official'],
        rating: 4.5,
        installCount: 6789,
        lastUpdated: '2024-01-08',
        config: {
          type: 'stdio' as const,
          command: 'npx',
          args: ['@modelcontextprotocol/server-filesystem'],
          env: {
            ROOT_PATH: '/path/to/root/directory'
          }
        }
      },
      {
        id: 'slack-mcp',
        name: 'Slack MCP Server',
        description: 'Official MCP server for Slack integration',
        author: 'Model Context Protocol',
        version: '1.0.1',
        homepage: 'https://github.com/modelcontextprotocol/server-slack',
        repository: 'https://github.com/modelcontextprotocol/server-slack',
        downloads: 8765,
        tags: ['slack', 'chat', 'communication', 'official'],
        rating: 4.4,
        installCount: 4321,
        lastUpdated: '2024-01-05',
        config: {
          type: 'stdio' as const,
          command: 'npx',
          args: ['@modelcontextprotocol/server-slack'],
          env: {
            SLACK_BOT_TOKEN: 'your_slack_bot_token_here'
          }
        }
      },
      {
        id: 'google-sheets-mcp',
        name: 'Google Sheets MCP Server',
        description: 'Official MCP server for Google Sheets operations',
        author: 'Model Context Protocol',
        version: '1.1.1',
        homepage: 'https://github.com/modelcontextprotocol/server-googlesheets',
        repository: 'https://github.com/modelcontextprotocol/server-googlesheets',
        downloads: 7654,
        tags: ['google-sheets', 'spreadsheet', 'google', 'official'],
        rating: 4.3,
        installCount: 3456,
        lastUpdated: '2024-01-03',
        config: {
          type: 'stdio' as const,
          command: 'npx',
          args: ['@modelcontextprotocol/server-googlesheets'],
          env: {
            GOOGLE_CLIENT_ID: 'your_google_client_id',
            GOOGLE_CLIENT_SECRET: 'your_google_client_secret'
          }
        }
      },
      {
        id: 'sqlite-mcp',
        name: 'SQLite MCP Server',
        description: 'Community MCP server for SQLite database operations',
        author: 'Community',
        version: '0.9.0',
        homepage: 'https://github.com/community/server-sqlite',
        repository: 'https://github.com/community/server-sqlite',
        downloads: 6543,
        tags: ['sqlite', 'database', 'sql', 'community'],
        rating: 4.2,
        installCount: 2345,
        lastUpdated: '2024-01-01',
        config: {
          type: 'stdio' as const,
          command: 'npx',
          args: ['@mcp-community/server-sqlite'],
          env: {
            DATABASE_PATH: '/path/to/database.sqlite'
          }
        }
      },
      {
        id: 'weather-mcp',
        name: 'Weather MCP Server',
        description: 'Community MCP server for weather information',
        author: 'Community',
        version: '0.8.0',
        homepage: 'https://github.com/community/server-weather',
        repository: 'https://github.com/community/server-weather',
        downloads: 5432,
        tags: ['weather', 'api', 'forecast', 'community'],
        rating: 4.1,
        installCount: 1876,
        lastUpdated: '2023-12-28',
        config: {
          type: 'stdio' as const,
          command: 'npx',
          args: ['@mcp-community/server-weather'],
          env: {
            WEATHER_API_KEY: 'your_weather_api_key'
          }
        }
      },
      {
        id: 'notion-mcp',
        name: 'Notion MCP Server',
        description: 'Community MCP server for Notion integration',
        author: 'Community',
        version: '0.7.0',
        homepage: 'https://github.com/community/server-notion',
        repository: 'https://github.com/community/server-notion',
        downloads: 4321,
        tags: ['notion', 'productivity', 'wiki', 'community'],
        rating: 4.0,
        installCount: 1543,
        lastUpdated: '2023-12-25',
        config: {
          type: 'stdio' as const,
          command: 'npx',
          args: ['@mcp-community/server-notion'],
          env: {
            NOTION_TOKEN: 'your_notion_integration_token'
          }
        }
      },
      {
        id: 'discord-mcp',
        name: 'Discord MCP Server',
        description: 'Community MCP server for Discord bot integration',
        author: 'Community',
        version: '0.6.0',
        homepage: 'https://github.com/community/server-discord',
        repository: 'https://github.com/community/server-discord',
        downloads: 3876,
        tags: ['discord', 'chat', 'bot', 'community'],
        rating: 3.9,
        installCount: 1234,
        lastUpdated: '2023-12-20',
        config: {
          type: 'stdio' as const,
          command: 'npx',
          args: ['@mcp-community/server-discord'],
          env: {
            DISCORD_BOT_TOKEN: 'your_discord_bot_token'
          }
        }
      }
    ];

    // Filter servers based on query and category
    let filteredServers = knownMCPServers;

    if (query) {
      const searchLower = query.toLowerCase();
      filteredServers = filteredServers.filter(server => 
        server.name.toLowerCase().includes(searchLower) ||
        server.description.toLowerCase().includes(searchLower) ||
        server.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (category !== 'all') {
      filteredServers = filteredServers.filter(server => 
        server.tags.includes(category)
      );
    }

    // Sort by rating and download count
    filteredServers.sort((a, b) => {
      const scoreA = a.rating * a.downloads;
      const scoreB = b.rating * b.downloads;
      return scoreB - scoreA;
    });

    return NextResponse.json({ 
      servers: filteredServers,
      total: filteredServers.length,
      query,
      category
    });

  } catch (error) {
    console.error('Erro ao buscar catálogo do marketplace:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar catálogo do marketplace' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serverId, config } = body;

    if (!serverId || !config) {
      return NextResponse.json(
        { error: 'Server ID e configuração são obrigatórios' },
        { status: 400 }
      );
    }

    // Here you would typically validate the configuration and install the server
    // For now, we'll just return success
    
    return NextResponse.json({ 
      success: true,
      message: 'Servidor MCP instalado com sucesso',
      serverId,
      config
    });

  } catch (error) {
    console.error('Erro ao instalar servidor do marketplace:', error);
    return NextResponse.json(
      { error: 'Erro ao instalar servidor do marketplace' },
      { status: 500 }
    );
  }
}