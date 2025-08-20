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

    const companies = await db.company.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
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

    const data = await request.json()

    // Check if company with same CNPJ or email already exists
    const existingCompany = await db.company.findFirst({
      where: {
        OR: [
          { cnpj: data.cnpj },
          { email: data.email }
        ]
      }
    })

    if (existingCompany) {
      return NextResponse.json(
        { error: 'Empresa com este CNPJ ou email já existe' },
        { status: 400 }
      )
    }

    const company = await db.company.create({
      data: {
        name: data.name,
        cnpj: data.cnpj,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        plan: data.plan,
        maxUsers: data.maxUsers
      }
    })

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'create',
        entityType: 'company',
        entityId: company.id,
        userId: user.id,
        newValues: JSON.stringify(data),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error creating company:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const data = await request.json()

    // Get existing company for audit log
    const existingCompany = await db.company.findUnique({
      where: { id: data.id }
    })

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      )
    }

    // Check if another company with same CNPJ or email exists
    const duplicateCompany = await db.company.findFirst({
      where: {
        OR: [
          { cnpj: data.cnpj },
          { email: data.email }
        ],
        NOT: {
          id: data.id
        }
      }
    })

    if (duplicateCompany) {
      return NextResponse.json(
        { error: 'Empresa com este CNPJ ou email já existe' },
        { status: 400 }
      )
    }

    const company = await db.company.update({
      where: { id: data.id },
      data: {
        name: data.name,
        cnpj: data.cnpj,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        plan: data.plan,
        maxUsers: data.maxUsers
      }
    })

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'update',
        entityType: 'company',
        entityId: company.id,
        userId: user.id,
        oldValues: JSON.stringify(existingCompany),
        newValues: JSON.stringify(data),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('Error updating company:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const { id } = await request.json()

    const company = await db.company.delete({
      where: { id }
    })

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'delete',
        entityType: 'company',
        entityId: company.id,
        userId: user.id,
        oldValues: JSON.stringify(company),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ message: 'Empresa excluída com sucesso' })
  } catch (error) {
    console.error('Error deleting company:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}