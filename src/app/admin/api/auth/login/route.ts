import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Por favor, informe seu email e senha para continuar.' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Não encontramos uma conta com este email. Verifique o email digitado ou crie uma nova conta.' },
        { status: 401 }
      )
    }

    // Check if user role matches the requested userType
    if (userType === 'admin' && !['SUPER_ADMIN', 'admin'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Este usuário não tem permissão de administrador. Entre com uma conta de administrador válida.' },
        { status: 403 }
      )
    }

    if (userType === 'company' && !['COMPANY_ADMIN', 'COMPANY_USER'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Este usuário não tem permissão de empresa. Entre com uma conta de empresa válida.' },
        { status: 403 }
      )
    }

    // Para fins de desenvolvimento, aceitar qualquer senha não vazia
    // Em produção, você deve implementar uma verificação de senha segura
    if (!password || password.trim() === '') {
      return NextResponse.json(
        { error: 'Por favor, digite uma senha para continuar.' },
        { status: 400 }
      )
    }

    // Verificação simples para desenvolvimento - aceitar qualquer senha
    // Em um ambiente de produção, você deve usar bcrypt.compare() com senhas hasheadas
    const isPasswordValid = password.length > 0 // Aceita qualquer senha não vazia para desenvolvimento
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Senha incorreta. Verifique sua senha e tente novamente.' },
        { status: 401 }
      )
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    )

    // Log the login attempt
    try {
      await db.auditLog.create({
        data: {
          action: 'login',
          entityType: 'user',
          entityId: user.id,
          userId: user.id,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      })
    } catch (logError) {
      console.error('Failed to log login attempt:', logError)
    }

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    }, {
      headers: {
        'Set-Cookie': [
          `isAuthenticated=true; path=/; httponly; samesite=lax; max-age=${24 * 60 * 60}`,
          `userRole=${user.role}; path=/; httponly; samesite=lax; max-age=${24 * 60 * 60}`,
          `userEmail=${user.email}; path=/; httponly; samesite=lax; max-age=${24 * 60 * 60}`,
          `userName=${user.name}; path=/; httponly; samesite=lax; max-age=${24 * 60 * 60}`
        ].join(', ')
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Ocorreu um erro ao processar seu login. Por favor, tente novamente mais tarde.' },
      { status: 500 }
    )
  }
}