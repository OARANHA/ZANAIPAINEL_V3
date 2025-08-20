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

    const clients = await db.client.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
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

    // Check if client with same CPF or email already exists
    const existingClient = await db.client.findFirst({
      where: {
        OR: [
          { cpf: data.cpf },
          { email: data.email }
        ]
      }
    })

    if (existingClient) {
      return NextResponse.json(
        { error: 'Cliente com este CPF ou email já existe' },
        { status: 400 }
      )
    }

    const client = await db.client.create({
      data: {
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        birthDate: data.birthDate ? new Date(data.birthDate) : null
      }
    })

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'create',
        entityType: 'client',
        entityId: client.id,
        userId: user.id,
        newValues: JSON.stringify(data),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error creating client:', error)
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

    // Get existing client for audit log
    const existingClient = await db.client.findUnique({
      where: { id: data.id }
    })

    if (!existingClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Check if another client with same CPF or email exists
    const duplicateClient = await db.client.findFirst({
      where: {
        OR: [
          { cpf: data.cpf },
          { email: data.email }
        ],
        NOT: {
          id: data.id
        }
      }
    })

    if (duplicateClient) {
      return NextResponse.json(
        { error: 'Cliente com este CPF ou email já existe' },
        { status: 400 }
      )
    }

    const client = await db.client.update({
      where: { id: data.id },
      data: {
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        birthDate: data.birthDate ? new Date(data.birthDate) : null
      }
    })

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'update',
        entityType: 'client',
        entityId: client.id,
        userId: user.id,
        oldValues: JSON.stringify(existingClient),
        newValues: JSON.stringify(data),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Error updating client:', error)
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

    const client = await db.client.delete({
      where: { id }
    })

    // Log the action
    await db.auditLog.create({
      data: {
        action: 'delete',
        entityType: 'client',
        entityId: client.id,
        userId: user.id,
        oldValues: JSON.stringify(client),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json({ message: 'Cliente excluído com sucesso' })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}