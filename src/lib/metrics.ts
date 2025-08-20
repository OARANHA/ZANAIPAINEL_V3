import { db } from './db';

export interface MetricData {
  agentId: string;
  metricName: string;
  metricValue: number;
  tags?: Record<string, any>;
}

export interface TimeRange {
  start: number; // Unix timestamp in ms
  end: number;   // Unix timestamp in ms
}

export class MetricsCollector {
  /**
   * Coleta uma métrica individual
   */
  async collectMetric(data: MetricData) {
    try {
      const timestamp = Date.now();
      const tags = data.tags ? JSON.stringify(data.tags) : null;
      
      return await db.agentMetrics.create({
        data: {
          timestamp: BigInt(timestamp),
          agentId: data.agentId,
          metricName: data.metricName,
          metricValue: data.metricValue,
          tags
        }
      });
    } catch (error) {
      console.error('Error collecting metric:', error);
      throw error;
    }
  }

  /**
   * Coleta múltiplas métricas de uma vez
   */
  async collectMetrics(metrics: MetricData[]) {
    try {
      const timestamp = Date.now();
      const records = metrics.map(metric => ({
        timestamp: BigInt(timestamp),
        agentId: metric.agentId,
        metricName: metric.metricName,
        metricValue: metric.metricValue,
        tags: metric.tags ? JSON.stringify(metric.tags) : null
      }));

      return await db.agentMetrics.createMany({
        data: records
      });
    } catch (error) {
      console.error('Error collecting metrics:', error);
      throw error;
    }
  }

  /**
   * Busca métricas de um agente em um intervalo de tempo
   */
  async getAgentMetrics(agentId: string, timeRange: TimeRange, metricName?: string) {
    try {
      const where: any = {
        agentId,
        timestamp: {
          gte: BigInt(timeRange.start),
          lte: BigInt(timeRange.end)
        }
      };

      if (metricName) {
        where.metricName = metricName;
      }

      return await db.agentMetrics.findMany({
        where,
        orderBy: { timestamp: 'desc' }
      });
    } catch (error) {
      console.error('Error getting agent metrics:', error);
      throw error;
    }
  }

  /**
   * Busca métricas agregadas por nome de métrica
   */
  async getAggregatedMetrics(metricName: string, timeRange: TimeRange, agentId?: string) {
    try {
      const where: any = {
        metricName,
        timestamp: {
          gte: BigInt(timeRange.start),
          lte: BigInt(timeRange.end)
        }
      };

      if (agentId) {
        where.agentId = agentId;
      }

      const result = await db.agentMetrics.groupBy({
        by: ['agentId', 'metricName'],
        where,
        _avg: {
          metricValue: true
        },
        _min: {
          metricValue: true
        },
        _max: {
          metricValue: true
        },
        _count: true
      });

      return result;
    } catch (error) {
      console.error('Error getting aggregated metrics:', error);
      throw error;
    }
  }

  /**
   * Busca estatísticas de um agente
   */
  async getAgentStats(agentId: string, timeRange: TimeRange) {
    try {
      const metrics = await this.getAgentMetrics(agentId, timeRange);
      
      // Agrupar por tipo de métrica
      const stats: Record<string, {
        count: number;
        avg: number;
        min: number;
        max: number;
        latest: number;
      }> = {};

      metrics.forEach(metric => {
        if (!stats[metric.metricName]) {
          stats[metric.metricName] = {
            count: 0,
            avg: 0,
            min: Infinity,
            max: -Infinity,
            latest: 0
          };
        }

        const stat = stats[metric.metricName];
        stat.count++;
        stat.avg += Number(metric.metricValue);
        stat.min = Math.min(stat.min, Number(metric.metricValue));
        stat.max = Math.max(stat.max, Number(metric.metricValue));
        stat.latest = Math.max(stat.latest, Number(metric.timestamp));
      });

      // Calcular médias
      Object.keys(stats).forEach(key => {
        stats[key].avg = stats[key].avg / stats[key].count;
      });

      return stats;
    } catch (error) {
      console.error('Error getting agent stats:', error);
      throw error;
    }
  }

  /**
   * Busca métricas recentes para dashboard
   */
  async getRecentMetrics(limit: number = 100) {
    try {
      return await db.agentMetrics.findMany({
        orderBy: { timestamp: 'desc' },
        take: limit,
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              status: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting recent metrics:', error);
      throw error;
    }
  }

  /**
   * Limpa métricas antigas (manutenção)
   */
  async cleanupOldMetrics(olderThanDays: number = 30) {
    try {
      const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
      
      const result = await db.agentMetrics.deleteMany({
        where: {
          timestamp: {
            lt: BigInt(cutoffTime)
          }
        }
      });

      console.log(`Cleaned up ${result.count} old metrics`);
      return result;
    } catch (error) {
      console.error('Error cleaning up old metrics:', error);
      throw error;
    }
  }
}

// Exportar instância única
export const metricsCollector = new MetricsCollector();