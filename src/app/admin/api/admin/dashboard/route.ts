import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
    
    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user || !['admin', 'company_admin'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Acesso não autorizado' },
        { status: 403 }
      )
    }

    // Get dashboard statistics
    const [
      totalUsers,
      totalCompanies,
      totalClients,
      totalProjects,
      activeProjects,
      pendingTasks,
      recentActivity
    ] = await Promise.all([
      db.user.count(),
      db.company.count(),
      db.client.count(),
      db.project.count(),
      db.project.count({ where: { status: 'active' } }),
      db.task.count({ where: { status: 'pending' } }),
      db.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          action: true,
          entityType: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    ])

    // Format recent activity
    const formattedActivity = recentActivity.map(log => ({
      type: log.action,
      description: `${log.user?.name || 'Unknown'} ${log.action} ${log.entityType}`,
      timestamp: new Date(log.createdAt).toLocaleString('pt-BR')
    }))

    return NextResponse.json({
      totalUsers,
      totalCompanies,
      totalClients,
      totalProjects,
      activeProjects,
      pendingTasks,
      recentActivity: formattedActivity
    })

  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}