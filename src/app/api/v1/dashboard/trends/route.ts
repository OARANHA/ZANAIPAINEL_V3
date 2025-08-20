import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulate trends data
    const trends = {
      userEngagement: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Active Users",
            data: [1200, 1350, 1180, 1420, 1580, 1650, 1720, 1680, 1750, 1820, 1900, 1950],
            color: "#3b82f6"
          },
          {
            label: "New Users",
            data: [150, 180, 120, 220, 280, 250, 320, 290, 350, 380, 420, 450],
            color: "#10b981"
          }
        ]
      },
      projectGrowth: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            label: "Projects Created",
            data: [12, 18, 25, 34],
            color: "#f59e0b"
          },
          {
            label: "Projects Completed",
            data: [8, 14, 20, 28],
            color: "#8b5cf6"
          }
        ]
      },
      flowUsage: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Flow Executions",
            data: [450, 520, 480, 580, 620, 380, 290],
            color: "#ef4444"
          }
        ]
      },
      performanceMetrics: {
        labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
        datasets: [
          {
            label: "Response Time (ms)",
            data: [120, 95, 110, 140, 125, 115],
            color: "#06b6d4"
          },
          {
            label: "Success Rate (%)",
            data: [98.5, 99.2, 97.8, 96.5, 98.1, 99.0],
            color: "#84cc16"
          }
        ]
      }
    };

    return NextResponse.json({
      success: true,
      data: trends,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch trends data",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}