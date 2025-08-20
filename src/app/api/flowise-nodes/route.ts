import { NextRequest, NextResponse } from 'next/server';
import { 
  loadNodeCatalog, 
  getNodesByCategory, 
  searchNodes, 
  getRecommendedNodes,
  generateFlowiseConfig,
  isCatalogValid,
  getCatalogStats
} from '@/lib/flowise-node-catalog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const query = searchParams.get('query');
    const category = searchParams.get('category');
    const agentType = searchParams.get('agentType');

    // Check if catalog exists and is valid
    const catalogValid = await isCatalogValid();
    if (!catalogValid) {
      return NextResponse.json(
        { 
          error: 'Flowise node catalog not found or outdated',
          message: 'Please run the catalog generation script first'
        },
        { status: 404 }
      );
    }

    switch (action) {
      case 'catalog':
        const catalog = await loadNodeCatalog();
        return NextResponse.json(catalog);

      case 'search':
        if (!query) {
          return NextResponse.json(
            { error: 'Query parameter is required for search action' },
            { status: 400 }
          );
        }
        const searchResults = await searchNodes(query);
        return NextResponse.json({ nodes: searchResults });

      case 'category':
        if (!category) {
          return NextResponse.json(
            { error: 'Category parameter is required for category action' },
            { status: 400 }
          );
        }
        const categoryNodes = await getNodesByCategory(category);
        return NextResponse.json({ nodes: categoryNodes });

      case 'recommended':
        const recommendedNodes = await getRecommendedNodes(agentType || 'default');
        return NextResponse.json({ nodes: recommendedNodes });

      case 'config':
        // Get agent data from request body for config generation
        const agentData = await request.json().catch(() => ({}));
        const config = await generateFlowiseConfig(agentData);
        return NextResponse.json({ config });

      case 'stats':
        const stats = await getCatalogStats();
        return NextResponse.json(stats);

      default:
        // Return basic catalog info by default
        const basicCatalog = await loadNodeCatalog();
        return NextResponse.json({
          totalNodes: basicCatalog?.totalNodes || 0,
          categories: basicCatalog?.categories || [],
          lastUpdated: basicCatalog?.lastUpdated || null
        });
    }
  } catch (error) {
    console.error('Error in Flowise nodes API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'generate-config':
        const config = await generateFlowiseConfig(data.agentData || {});
        return NextResponse.json({ config });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Flowise nodes POST API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}