import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulate analytics data
    const analytics = {
      userGrowth: {
        daily: [12, 19, 15, 25, 22, 30, 28],
        weekly: [85, 92, 78, 105, 98, 112, 125],
        monthly: [320, 345, 380, 425, 468, 512, 545, 580, 625, 668, 712, 745]
      },
      projectStats: {
        byStatus: {
          active: 23,
          completed: 45,
          paused: 12,
          cancelled: 9
        },
        byCategory: {
          analytics: 18,
          automation: 15,
          integration: 12,
          monitoring: 8,
          other: 36
        }
      },
      flowPerformance: {
        averageExecutionTime: 2.4,
        successRate: 96.8,
        totalExecutions: 15420,
        errorRate: 3.2
      },
      systemMetrics: {
        cpuUsage: 45.2,
        memoryUsage: 62.8,
        diskUsage: 34.5,
        networkLatency: 12
      }
    };

    return NextResponse.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch analytics data",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}