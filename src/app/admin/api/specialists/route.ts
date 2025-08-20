import { NextRequest, NextResponse } from 'next/server';
import { SpecialistService, SPECIALIST_CATEGORIES, SPECIALIST_TEMPLATES } from '@/lib/specialist-service';

const specialistService = new SpecialistService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    if (id) {
      const template = SPECIALIST_TEMPLATES.find(t => t.id === id);
      if (!template) {
        return NextResponse.json({ error: 'Specialist not found' }, { status: 404 });
      }
      return NextResponse.json(template);
    }

    if (category) {
      const templates = SPECIALIST_TEMPLATES.filter(t => t.category === category);
      return NextResponse.json(templates);
    }

    // Check if ZAI API is configured
    let warning = '';
    try {
      const { getZAIConfig } = await import('@/lib/zai-config');
      getZAIConfig(); // This will throw if API key is not configured
    } catch (error) {
      warning = 'A chave da API Z.ai não está configurada. Os especialistas serão gerados com templates básicos. Para obter melhores resultados, configure a variável de ambiente ZAI_API_KEY no arquivo .env.';
    }

    return NextResponse.json({
      categories: SPECIALIST_CATEGORIES,
      templates: SPECIALIST_TEMPLATES,
      warning
    });
  } catch (error) {
    console.error('Error fetching specialists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specialists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, specialty, requirements } = body;

    if (!category || !specialty || !requirements) {
      return NextResponse.json(
        { error: 'Category, specialty, and requirements are required' },
        { status: 400 }
      );
    }

    const validCategory = SPECIALIST_CATEGORIES.find(c => c.id === category);
    if (!validCategory) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const template = await specialistService.generateSpecialist(
      category,
      specialty,
      requirements
    );

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error generating specialist:', error);
    return NextResponse.json(
      { error: 'Failed to generate specialist' },
      { status: 500 }
    );
  }
}