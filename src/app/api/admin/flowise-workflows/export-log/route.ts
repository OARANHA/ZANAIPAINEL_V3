import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'log_export_attempt':
        return await logExportAttempt(data);
      case 'log_export_success':
        return await logExportSuccess(data);
      case 'log_export_error':
        return await logExportError(data);
      case 'get_export_logs':
        return await getExportLogs(data);
      case 'clear_export_logs':
        return await clearExportLogs();
      default:
        return NextResponse.json({ error: 'Ação não suportada' }, { status: 400 });
    }
  } catch (error) {
    console.error('Erro na API de logs de exportação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function logExportAttempt(data: {
  workflowId: string;
  workflowName: string;
  canvasId: string;
  exportData: any;
  userId?: string;
}) {
  try {
    const log = await db.exportLog.create({
      data: {
        workflowId: data.workflowId,
        workflowName: data.workflowName,
        canvasId: data.canvasId,
        action: 'EXPORT_ATTEMPT',
        status: 'PENDING',
        details: JSON.stringify({
          exportData: data.exportData,
          timestamp: new Date().toISOString(),
          userId: data.userId || 'unknown'
        }),
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      logId: log.id,
      message: 'Tentativa de exportação registrada'
    });
  } catch (error) {
    console.error('Erro ao registrar tentativa de exportação:', error);
    return NextResponse.json(
      { error: 'Falha ao registrar tentativa de exportação' },
      { status: 500 }
    );
  }
}

async function logExportSuccess(data: {
  logId?: string;
  workflowId: string;
  canvasId: string;
  response: any;
  action: 'created' | 'updated';
}) {
  try {
    // Se temos um logId, atualizamos o registro existente
    if (data.logId) {
      await db.exportLog.update({
        where: { id: data.logId },
        data: {
          status: 'SUCCESS',
          details: JSON.stringify({
            action: data.action,
            response: data.response,
            completedAt: new Date().toISOString()
          }),
          updatedAt: new Date()
        }
      });
    }

    // Criar um novo registro de sucesso
    const successLog = await db.exportLog.create({
      data: {
        workflowId: data.workflowId,
        canvasId: data.canvasId,
        action: 'EXPORT_SUCCESS',
        status: 'SUCCESS',
        details: JSON.stringify({
          action: data.action,
          response: data.response,
          completedAt: new Date().toISOString()
        }),
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      logId: successLog.id,
      message: 'Exportação bem-sucedida registrada'
    });
  } catch (error) {
    console.error('Erro ao registrar exportação bem-sucedida:', error);
    return NextResponse.json(
      { error: 'Falha ao registrar exportação bem-sucedida' },
      { status: 500 }
    );
  }
}

async function logExportError(data: {
  logId?: string;
  workflowId: string;
  workflowName: string;
  canvasId: string;
  error: any;
  exportData?: any;
  stackTrace?: string;
  requestDetails?: any;
}) {
  try {
    const errorDetails = {
      message: data.error?.message || 'Erro desconhecido',
      stack: data.stackTrace || data.error?.stack || '',
      exportData: data.exportData || null,
      requestDetails: data.requestDetails || null,
      timestamp: new Date().toISOString(),
      errorType: data.error?.name || 'UnknownError',
      errorCode: data.error?.code || 'UNKNOWN'
    };

    // Se temos um logId, atualizamos o registro existente
    if (data.logId) {
      await db.exportLog.update({
        where: { id: data.logId },
        data: {
          status: 'ERROR',
          details: JSON.stringify(errorDetails),
          updatedAt: new Date()
        }
      });
    }

    // Criar um novo registro de erro detalhado
    const errorLog = await db.exportLog.create({
      data: {
        workflowId: data.workflowId,
        workflowName: data.workflowName,
        canvasId: data.canvasId,
        action: 'EXPORT_ERROR',
        status: 'ERROR',
        details: JSON.stringify(errorDetails),
        createdAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      logId: errorLog.id,
      message: 'Erro de exportação registrado'
    });
  } catch (error) {
    console.error('Erro ao registrar erro de exportação:', error);
    return NextResponse.json(
      { error: 'Falha ao registrar erro de exportação' },
      { status: 500 }
    );
  }
}

async function getExportLogs(data: {
  workflowId?: string;
  canvasId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const where: any = {};
    
    if (data.workflowId) where.workflowId = data.workflowId;
    if (data.canvasId) where.canvasId = data.canvasId;
    if (data.status) where.status = data.status;

    const limit = data.limit || 50;
    const offset = data.offset || 0;

    const [logs, total] = await Promise.all([
      db.exportLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      db.exportLog.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });
  } catch (error) {
    console.error('Erro ao obter logs de exportação:', error);
    return NextResponse.json(
      { error: 'Falha ao obter logs de exportação' },
      { status: 500 }
    );
  }
}

async function clearExportLogs() {
  try {
    // Deletar logs antigos (mais de 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await db.exportLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo
        }
      }
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      message: `${result.count} logs antigos removidos`
    });
  } catch (error) {
    console.error('Erro ao limpar logs de exportação:', error);
    return NextResponse.json(
      { error: 'Falha ao limpar logs de exportação' },
      { status: 500 }
    );
  }
}