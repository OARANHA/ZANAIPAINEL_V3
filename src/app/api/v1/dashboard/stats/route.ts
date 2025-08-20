import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulate dashboard statistics data
    const stats = {
      totalUsers: 1247,
      activeUsers: 342,
      totalProjects: 89,
      activeProjects: 23,
      totalFlows: 456,
      activeFlows: 123,
      systemUptime: "99.9%",
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch dashboard stats",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}