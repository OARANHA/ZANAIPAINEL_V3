import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulate activity timeline data
    const activities = [
      {
        id: 1,
        type: "user_login",
        user: "João Silva",
        email: "joao.silva@example.com",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        description: "Usuário fez login no sistema"
      },
      {
        id: 2,
        type: "project_created",
        user: "Maria Santos",
        email: "maria.santos@example.com",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        description: "Novo projeto 'Urban Analytics' criado"
      },
      {
        id: 3,
        type: "flow_executed",
        user: "Carlos Oliveira",
        email: "carlos.oliveira@example.com",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        description: "Flow 'Data Processing' executado com sucesso"
      },
      {
        id: 4,
        type: "system_update",
        user: "System",
        email: "system@urbandev.com",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        description: "Atualização do sistema concluída"
      },
      {
        id: 5,
        type: "user_registration",
        user: "Ana Costa",
        email: "ana.costa@example.com",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        description: "Novo usuário registrado no sistema"
      }
    ];

    return NextResponse.json({
      success: true,
      data: activities,
      count: activities.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch activity data",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}