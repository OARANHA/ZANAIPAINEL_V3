/* eslint-disable @typescript-eslint/no-require-imports */
import { NextRequest, NextResponse } from 'next/server';
import { SpecialistService, SPECIALIST_CATEGORIES, SPECIALIST_TEMPLATES } from '@/lib/specialist-service';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const specialistService = new SpecialistService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { basePath = '.zanai/specialists' } = body;

    // Criar estrutura de diretórios
    const baseDir = join(process.cwd(), basePath);
    
    // Criar diretório base
    try {
      await mkdir(baseDir, { recursive: true });
    } catch (error) {
      // Diretório já existe
    }

    // Criar subdiretórios para cada categoria
    for (const category of SPECIALIST_CATEGORIES) {
      const categoryDir = join(baseDir, category.id);
      try {
        await mkdir(categoryDir, { recursive: true });
      } catch (error) {
        // Diretório já existe
      }
    }

    // Gerar arquivos para cada template
    const createdFiles = [];
    for (const template of SPECIALIST_TEMPLATES) {
      const content = await specialistService.createSpecialistFile(template);
      const fileName = `${template.id}.md`;
      const filePath = join(baseDir, template.category, fileName);
      
      try {
        await writeFile(filePath, content, 'utf-8');
        createdFiles.push({
          path: join(basePath, template.category, fileName),
          template: template.name
        });
      } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
      }
    }

    // Criar arquivo README.md na raiz
    const readmeContent = `# Zanai Specialists

Este diretório contém templates de agentes especialistas organizados por categorias.

## Estrutura

\`\`\`
.zanai/specialists/
├── business/           # Especialistas em negócio
│   ├── business-analyst.md
│   ├── business-marketing.md
│   └── sales-automator.md
├── technical/         # Especialistas técnicos
│   ├── payment-integration.md
│   ├── risk-manager.md
│   └── security-specialist.md
├── content/           # Especialistas em conteúdo
│   ├── content-marketer.md
│   ├── copywriter.md
│   └── seo-specialist.md
└── legal/             # Especialistas legais
    ├── legal-advisor.md
    └── compliance-officer.md
\`\`\`

## Como Usar

1. Navegue até a categoria desejada
2. Abra o arquivo do especialista (.md)
3. Copie o conteúdo para usar como template
4. Personalize conforme necessário

## Gerado por

Esta estrutura foi gerada automaticamente pelo sistema Zanai.
Data de geração: ${new Date().toISOString()}
`;

    try {
      await writeFile(join(baseDir, 'README.md'), readmeContent, 'utf-8');
      createdFiles.push({
        path: join(basePath, 'README.md'),
        template: 'README'
      });
    } catch (error) {
      console.error('Error writing README.md:', error);
    }

    return NextResponse.json({
      success: true,
      message: 'Estrutura de pastas criada com sucesso',
      basePath,
      createdFiles,
      categories: SPECIALIST_CATEGORIES.map(c => c.id),
      totalFiles: createdFiles.length
    });
  } catch (error) {
    console.error('Error creating specialist structure:', error);
    return NextResponse.json(
      { error: 'Failed to create specialist structure' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const basePath = '.zanai/specialists';
    const baseDir = path.join(process.cwd(), basePath);
    
    if (!fs.existsSync(baseDir)) {
      return NextResponse.json({
        exists: false,
        message: 'Estrutura de pastas não encontrada'
      });
    }

    const categories = SPECIALIST_CATEGORIES.map(category => {
      const categoryDir = path.join(baseDir, category.id);
      const files = [];
      
      if (fs.existsSync(categoryDir)) {
        const specialistFiles = SPECIALIST_TEMPLATES.filter(t => t.category === category.id);
        
        for (const template of specialistFiles) {
          const filePath = path.join(categoryDir, `${template.id}.md`);
          if (fs.existsSync(filePath)) {
            files.push({
              name: `${template.id}.md`,
              path: path.join(basePath, category.id, `${template.id}.md`),
              template: template.name,
              size: fs.readFileSync(filePath, 'utf-8').length
            });
          }
        }
      }
      
      return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        files
      };
    });

    return NextResponse.json({
      exists: true,
      basePath,
      categories,
      totalFiles: categories.reduce((acc, cat) => acc + cat.files.length, 0)
    });
  } catch (error) {
    console.error('Error reading specialist structure:', error);
    return NextResponse.json(
      { error: 'Failed to read specialist structure' },
      { status: 500 }
    );
  }
}