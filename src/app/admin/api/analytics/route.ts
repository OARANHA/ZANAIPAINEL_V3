import { NextRequest, NextResponse } from 'next/server';
import { metricsCollector } from '@/lib/metrics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const metric = searchParams.get('metric');
    const range = searchParams.get('range') || '24h';
    const action = searchParams.get('action');

    // Calcular range em milissegundos
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const endTime = Date.now();
    const startTime = endTime - ranges[range as keyof typeof ranges];

    switch (action) {
      case 'agent-stats':
        if (!agentId) {
          return NextResponse.json({ error: 'Agent ID required' }, { status: 400 });
        }

        const stats = await metricsCollector.getAgentStats(agentId, {
          start: startTime,
          end: endTime
        });

        return NextResponse.json({
          agentId,
          timeRange: range,
          stats,
          timestamp: new Date().toISOString()
        });

      case 'aggregated-metrics':
        if (!metric) {
          return NextResponse.json({ error: 'Metric name required' }, { status: 400 });
        }

        const aggregated = await metricsCollector.getAggregatedMetrics(metric, {
          start: startTime,
          end: endTime
        }, agentId || undefined);

        return NextResponse.json({
          metric,
          timeRange: range,
          agentId: agentId || 'all',
          data: aggregated,
          timestamp: new Date().toISOString()
        });

      case 'recent-metrics':
        const limit = parseInt(searchParams.get('limit') || '100');
        const recent = await metricsCollector.getRecentMetrics(limit);

        return NextResponse.json({
          limit,
          data: recent,
          timestamp: new Date().toISOString()
        });

      case 'agent-metrics':
        if (!agentId) {
          return NextResponse.json({ error: 'Agent ID required' }, { status: 400 });
        }

        const agentMetrics = await metricsCollector.getAgentMetrics(agentId, {
          start: startTime,
          end: endTime
        }, metric || undefined);

        // Processar dados para gráficos
        const processedData = processMetricsForCharts(agentMetrics);

        return NextResponse.json({
          agentId,
          metric: metric || 'all',
          timeRange: range,
          data: processedData,
          raw: agentMetrics,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'collect-metric':
        await metricsCollector.collectMetric(data);
        return NextResponse.json({ success: true, message: 'Metric collected' });

      case 'collect-metrics':
        await metricsCollector.collectMetrics(data);
        return NextResponse.json({ 
          success: true, 
          message: `${data.length} metrics collected` 
        });

      case 'cleanup-old-metrics':
        const olderThanDays = data.olderThanDays || 30;
        const result = await metricsCollector.cleanupOldMetrics(olderThanDays);
        return NextResponse.json({ 
          success: true, 
          message: `Cleaned up ${result.count} old metrics`,
          cleaned: result.count
        });

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Analytics POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Processa métricas brutas para formato de gráfico
 */
function processMetricsForCharts(metrics: any[]) {
  // Agrupar por nome de métrica
  const grouped: Record<string, any[]> = {};
  
  metrics.forEach(metric => {
    if (!grouped[metric.metricName]) {
      grouped[metric.metricName] = [];
    }
    grouped[metric.metricName].push({
      timestamp: Number(metric.timestamp),
      value: Number(metric.metricValue),
      tags: metric.tags ? JSON.parse(metric.tags) : {}
    });
  });

  // Ordenar por timestamp e calcular estatísticas básicas
  const result: Record<string, any> = {};
  
  Object.keys(grouped).forEach(metricName => {
    const data = grouped[metricName].sort((a, b) => a.timestamp - b.timestamp);
    
    result[metricName] = {
      data: data,
      stats: {
        count: data.length,
        avg: data.reduce((sum, item) => sum + item.value, 0) / data.length,
        min: Math.min(...data.map(item => item.value)),
        max: Math.max(...data.map(item => item.value)),
        latest: data[data.length - 1]?.value || 0
      },
      // Dados formatados para gráficos de linha
      chartData: data.map(item => ({
        x: item.timestamp,
        y: item.value
      }))
    };
  });

  return result;
}