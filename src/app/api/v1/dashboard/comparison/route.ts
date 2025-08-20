import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulate comparison data
    const comparison = {
      periodComparison: {
        currentPeriod: {
          users: 1247,
          projects: 89,
          flows: 456,
          executions: 15420
        },
        previousPeriod: {
          users: 1120,
          projects: 76,
          flows: 398,
          executions: 13250
        },
        changes: {
          users: 11.3,
          projects: 17.1,
          flows: 14.6,
          executions: 16.4
        }
      },
      categoryComparison: {
        analytics: {
          current: 18,
          previous: 15,
          change: 20.0
        },
        automation: {
          current: 15,
          previous: 12,
          change: 25.0
        },
        integration: {
          current: 12,
          previous: 10,
          change: 20.0
        },
        monitoring: {
          current: 8,
          previous: 6,
          change: 33.3
        }
      },
      performanceComparison: {
        responseTime: {
          current: 125,
          previous: 140,
          change: -10.7,
          improvement: true
        },
        successRate: {
          current: 96.8,
          previous: 94.2,
          change: 2.6,
          improvement: true
        },
        uptime: {
          current: 99.9,
          previous: 99.5,
          change: 0.4,
          improvement: true
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: comparison,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch comparison data",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}