import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
    
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || !['admin', 'company_admin'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'

    // Get basic statistics
    const [
      totalCompanies,
      totalClients,
      totalProjects,
      activeProjects,
      planningProjects,
      completedProjects,
      cancelledProjects,
      recentReports
    ] = await Promise.all([
      db.company.count({ where: { status: 'active' } }),
      db.client.count({ where: { status: 'active' } }),
      db.project.count(),
      db.project.count({ where: { status: 'active' } }),
      db.project.count({ where: { status: 'planning' } }),
      db.project.count({ where: { status: 'completed' } }),
      db.project.count({ where: { status: 'cancelled' } }),
      db.report.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          title: true,
          type: true,
          createdAt: true
        }
      })
    ])

    // Mock revenue data (in a real app, this would come from contracts or invoices)
    const totalRevenue = 1250000.00
    const monthlyGrowth = 15.5

    // Mock revenue by month data
    const revenueByMonth = [
      { month: 'Jan/2024', revenue: 95000 },
      { month: 'Fev/2024', revenue: 110000 },
      { month: 'Mar/2024', revenue: 125000 },
      { month: 'Abr/2024', revenue: 140000 },
      { month: 'Mai/2024', revenue: 155000 },
      { month: 'Jun/2024', revenue: 170000 }
    ]

    // Mock top companies data
    const topCompanies = [
      { name: 'Construtora ABC', revenue: 250000, projects: 5 },
      { name: 'Engenharia XYZ', revenue: 180000, projects: 3 },
      { name: 'Urban Tech', revenue: 150000, projects: 4 },
      { name: 'Build Master', revenue: 120000, projects: 2 },
      { name: 'City Solutions', revenue: 100000, projects: 3 }
    ]

    return NextResponse.json({
      totalRevenue,
      monthlyGrowth,
      activeCompanies: totalCompanies,
      activeClients: totalClients,
      projectsByStatus: {
        planning: planningProjects,
        active: activeProjects,
        completed: completedProjects,
        cancelled: cancelledProjects
      },
      revenueByMonth,
      topCompanies,
      recentReports
    })

  } catch (error) {
    console.error('Reports API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
    
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || !['admin', 'company_admin'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 403 }
      )
    }

    const { type, period } = await request.json()

    // Generate report data based on type
    let reportData = {}
    let title = ''

    switch (type) {
      case 'financial':
        title = 'Relatório Financeiro'
        // In a real app, this would gather actual financial data
        reportData = {
          totalRevenue: 1250000.00,
          monthlyGrowth: 15.5,
          expenses: 850000.00,
          profit: 400000.00
        }
        break
      case 'progress':
        title = 'Relatório de Progresso'
        reportData = {
          totalProjects: 45,
          completedProjects: 23,
          activeProjects: 15,
          planningProjects: 7
        }
        break
      case 'analytics':
        title = 'Análise de Dados'
        reportData = {
          userGrowth: 25.5,
          projectSuccessRate: 78.5,
          averageProjectDuration: 45
        }
        break
      default:
        title = 'Relatório Personalizado'
        reportData = { custom: true }
    }

    // Create report record
    const report = await db.report.create({
      data: {
        title,
        type,
        data: JSON.stringify(reportData),
        period,
        createdAt: new Date()
      }
    })

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'create',
        entityType: 'report',
        entityId: report.id,
        userId: user.id,
        newValues: JSON.stringify({ type, period, title }),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ 
      message: 'Relatório gerado com sucesso',
      reportId: report.id 
    })

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}