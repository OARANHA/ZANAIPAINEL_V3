import { NextRequest, NextResponse } from 'next/server';
import { SpecialistService, SPECIALIST_TEMPLATES } from '@/lib/specialist-service';

const specialistService = new SpecialistService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { specialistId } = body;

    if (!specialistId) {
      return NextResponse.json(
        { error: 'Specialist ID is required' },
        { status: 400 }
      );
    }

    const template = SPECIALIST_TEMPLATES.find(t => t.id === specialistId);
    if (!template) {
      return NextResponse.json(
        { error: 'Specialist not found' },
        { status: 404 }
      );
    }

    const markdownContent = await specialistService.createSpecialistFile(template);
    const fileName = `${template.id}.md`;

    return new NextResponse(markdownContent, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading specialist:', error);
    return NextResponse.json(
      { error: 'Failed to download specialist' },
      { status: 500 }
    );
  }
}