import { NextRequest, NextResponse } from 'next/server';
import { metricsCollector } from './metrics';

interface MetricsOptions {
  collectExecutionTime?: boolean;
  collectErrorRates?: boolean;
  collectResponseSize?: boolean;
  excludePaths?: string[];
}

/**
 * Middleware para coleta automática de métricas
 * Uso: export const POST = withMetrics(handler, options);
 */
export function withMetrics(
  handler: (req: NextRequest, ...args: any[]) => Promise<NextResponse>,
  options: MetricsOptions = {}
) {
  const {
    collectExecutionTime = true,
    collectErrorRates = true,
    collectResponseSize = true,
    excludePaths = []
  } = options;

  return async (req: NextRequest, ...args: any[]) => {
    const startTime = Date.now();
    const path = req.nextUrl.pathname;
    
    // Pular métricas para paths excluídos
    if (excludePaths.some(excluded => path.includes(excluded))) {
      return handler(req, ...args);
    }

    // Extrair agentId dos headers ou query params se disponível
    const agentId = req.headers.get('x-agent-id') || 
                   new URL(req.url).searchParams.get('agentId') || 
                   'unknown';

    try {
      const result = await handler(req, ...args);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Coletar métricas de sucesso
      if (collectExecutionTime) {
        await metricsCollector.collectMetric({
          agentId,
          metricName: 'execution_time',
          metricValue: duration,
          tags: {
            endpoint: path,
            method: req.method,
            status: result.status,
            success: result.status < 400
          }
        });
      }

      if (collectResponseSize) {
        const contentLength = result.headers.get('content-length');
        if (contentLength) {
          await metricsCollector.collectMetric({
            agentId,
            metricName: 'response_size',
            metricValue: parseInt(contentLength) || 0,
            tags: {
              endpoint: path,
              method: req.method
            }
          });
        }
      }

      return result;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Coletar métricas de erro
      if (collectErrorRates) {
        await metricsCollector.collectMetric({
          agentId,
          metricName: 'error_count',
          metricValue: 1,
          tags: {
            endpoint: path,
            method: req.method,
            error: error.message,
            errorType: error.constructor.name
          }
        });
      }

      if (collectExecutionTime) {
        await metricsCollector.collectMetric({
          agentId,
          metricName: 'execution_time',
          metricValue: duration,
          tags: {
            endpoint: path,
            method: req.method,
            status: 500,
            success: false
          }
        });
      }

      throw error;
    }
  };
}

/**
 * Função utilitária para coletar métricas manualmente
 */
export async function collectCustomMetric(data: {
  agentId: string;
  metricName: string;
  metricValue: number;
  tags?: Record<string, any>;
}) {
  try {
    await metricsCollector.collectMetric(data);
  } catch (error) {
    console.error('Failed to collect custom metric:', error);
  }
}

/**
 * Função utilitária para coletar métricas de execução de agentes
 */
export async function collectAgentExecutionMetric(data: {
  agentId: string;
  executionTime: number;
  success: boolean;
  inputLength?: number;
  outputLength?: number;
  error?: string;
}) {
  try {
    const metrics = [
      {
        agentId: data.agentId,
        metricName: 'agent_execution_time',
        metricValue: data.executionTime,
        tags: { success: data.success }
      },
      {
        agentId: data.agentId,
        metricName: data.success ? 'agent_success_count' : 'agent_error_count',
        metricValue: 1,
        tags: data.error ? { error: data.error } : undefined
      }
    ];

    if (data.inputLength !== undefined) {
      metrics.push({
        agentId: data.agentId,
        metricName: 'agent_input_length',
        metricValue: data.inputLength
      });
    }

    if (data.outputLength !== undefined) {
      metrics.push({
        agentId: data.agentId,
        metricName: 'agent_output_length',
        metricValue: data.outputLength
      });
    }

    await metricsCollector.collectMetrics(metrics);
  } catch (error) {
    console.error('Failed to collect agent execution metrics:', error);
  }
}