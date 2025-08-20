import { Server } from 'socket.io';
import { db } from './db';

interface VSCodeContext {
  files: any[];
  activeFile: string | null;
  workspacePath: string;
  timestamp: string;
}

interface AgentExecutionMessage {
  agentId: string;
  input: string;
  workspaceId: string;
  context?: any;
}

export const setupSocket = (io: Server) => {
  // Armazenar conexões ativas por workspace
  const workspaceConnections = new Map<string, string[]>();
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Registrar workspace do cliente
    socket.on('register_workspace', async (data: { workspaceId: string; clientType: 'vscode' | 'web' }) => {
      const { workspaceId, clientType } = data;
      
      // Verificar se workspace existe
      const workspace = await db.workspace.findUnique({
        where: { id: workspaceId }
      });
      
      if (!workspace) {
        socket.emit('error', { message: 'Workspace not found' });
        return;
      }
      
      // Adicionar conexão ao workspace
      if (!workspaceConnections.has(workspaceId)) {
        workspaceConnections.set(workspaceId, []);
      }
      workspaceConnections.get(workspaceId)?.push(socket.id);
      
      // Armazenar info do socket
      socket.data.workspaceId = workspaceId;
      socket.data.clientType = clientType;
      
      console.log(`Client ${socket.id} (${clientType}) registered to workspace ${workspaceId}`);
      
      // Notificar outros clientes do mesmo workspace
      socket.to(workspaceId).emit('client_connected', {
        clientId: socket.id,
        clientType,
        workspaceId,
        timestamp: new Date().toISOString()
      });
      
      // Enviar contexto atual do VS Code se disponível
      if (workspace.vscodeContext) {
        socket.emit('vscode_context_update', {
          context: workspace.vscodeContext,
          workspaceId,
          timestamp: workspace.lastSyncedAt
        });
      }
    });
    
    // Sincronizar contexto do VS Code
    socket.on('vscode_context_sync', async (data: { workspaceId: string; context: VSCodeContext }) => {
      const { workspaceId, context } = data;
      
      try {
        // Atualizar banco de dados
        await db.workspace.update({
          where: { id: workspaceId },
          data: {
            vscodeContext: context,
            lastSyncedAt: new Date()
          }
        });
        
        // Broadcast para todos os clientes do workspace
        io.to(workspaceId).emit('vscode_context_update', {
          context,
          workspaceId,
          timestamp: new Date().toISOString()
        });
        
        console.log(`VS Code context synchronized for workspace ${workspaceId}`);
      } catch (error) {
        console.error('Error syncing VS Code context:', error);
        socket.emit('error', { message: 'Failed to sync context' });
      }
    });
    
    // Executar agente em tempo real
    socket.on('execute_agent', async (data: AgentExecutionMessage) => {
      const { agentId, input, workspaceId, context } = data;
      
      try {
        // Verificar agente
        const agent = await db.agent.findFirst({
          where: { 
            id: agentId,
            workspaceId: workspaceId 
          }
        });
        
        if (!agent) {
          socket.emit('agent_execution_error', {
            agentId,
            error: 'Agent not found'
          });
          return;
        }
        
        // Criar execução
        const execution = await db.agentExecution.create({
          data: {
            agentId: agent.id,
            input: input,
            status: 'running',
            context: context || {},
            startedAt: new Date()
          }
        });
        
        // Notificar início da execução
        io.to(workspaceId).emit('agent_execution_started', {
          executionId: execution.id,
          agentId: agent.id,
          agentName: agent.name,
          input: input,
          timestamp: new Date().toISOString()
        });
        
        // Simular execução (aqui seria integrado com SDK de IA)
        setTimeout(async () => {
          try {
            const result = {
              output: `Agent "${agent.name}" executed successfully`,
              actions: [
                {
                  type: 'analysis',
                  description: 'Analyzed input and generated response'
                }
              ]
            };
            
            // Atualizar execução
            await db.agentExecution.update({
              where: { id: execution.id },
              data: {
                status: 'completed',
                output: result.output,
                result: result,
                completedAt: new Date()
              }
            });
            
            // Notificar conclusão
            io.to(workspaceId).emit('agent_execution_completed', {
              executionId: execution.id,
              agentId: agent.id,
              result: result,
              timestamp: new Date().toISOString()
            });
            
          } catch (error) {
            await db.agentExecution.update({
              where: { id: execution.id },
              data: {
                status: 'failed',
                error: error.message,
                completedAt: new Date()
              }
            });
            
            io.to(workspaceId).emit('agent_execution_error', {
              executionId: execution.id,
              agentId: agent.id,
              error: error.message,
              timestamp: new Date().toISOString()
            });
          }
        }, 2000); // Simular 2 segundos de processamento
        
      } catch (error) {
        console.error('Error executing agent:', error);
        socket.emit('agent_execution_error', {
          agentId,
          error: error.message
        });
      }
    });
    
    // Solicitar atualização de contexto
    socket.on('request_context_update', (data: { workspaceId: string }) => {
      const { workspaceId } = data;
      
      // Broadcast para clientes VS Code do workspace
      io.to(workspaceId).emit('context_update_requested', {
        requestedBy: socket.id,
        workspaceId,
        timestamp: new Date().toISOString()
      });
    });
    
    // Enviar mensagem para workspace
    socket.on('workspace_message', (data: { workspaceId: string; message: string; type: 'info' | 'warning' | 'error' }) => {
      const { workspaceId, message, type } = data;
      
      io.to(workspaceId).emit('workspace_message', {
        message,
        type,
        from: socket.id,
        timestamp: new Date().toISOString()
      });
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      const { workspaceId, clientType } = socket.data;
      if (workspaceId) {
        // Remover conexão do workspace
        const connections = workspaceConnections.get(workspaceId);
        if (connections) {
          const index = connections.indexOf(socket.id);
          if (index > -1) {
            connections.splice(index, 1);
          }
          
          if (connections.length === 0) {
            workspaceConnections.delete(workspaceId);
          }
        }
        
        // Notificar outros clientes
        socket.to(workspaceId).emit('client_disconnected', {
          clientId: socket.id,
          clientType,
          workspaceId,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to Zanai WebSocket Server',
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });
  });
};