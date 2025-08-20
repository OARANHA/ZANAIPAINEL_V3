'use client';

import { useState } from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MoreVertical, 
  Play, 
  Copy, 
  Download, 
  Share2, 
  Archive, 
  ArchiveRestore, 
  Trash2, 
  Settings, 
  BarChart3, 
  Clock, 
  Users, 
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Zap
} from 'lucide-react';

interface AgentActionsMenuProps {
  agent: any;
  onExecute?: (agent: any) => void;
  onEdit?: (agent: any) => void;
  onDuplicate?: (agent: any) => void;
  onArchive?: (agent: any) => void;
  onDelete?: (agent: any) => void;
  onExport?: (agent: any) => void;
  onShare?: (agent: any) => void;
  onExportToFlowise?: (agent: any) => void;
}

export default function AgentActionsMenu({ 
  agent, 
  onExecute,
  onEdit,
  onDuplicate,
  onArchive,
  onDelete,
  onExport,
  onShare,
  onExportToFlowise
}: AgentActionsMenuProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isExportingToFlowise, setIsExportingToFlowise] = useState(false);
  const [isFlowiseExportDialogOpen, setIsFlowiseExportDialogOpen] = useState(false);
  const [flowiseExportData, setFlowiseExportData] = useState<any>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [duplicateName, setDuplicateName] = useState(`${agent.name} (Cópia)`);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await onExecute?.(agent);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      await onDuplicate?.({ ...agent, name: duplicateName });
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleExport = () => {
    onExport?.(agent);
  };

  const handleExportToFlowise = async () => {
    setIsExportingToFlowise(true);
    try {
      const result = await onExportToFlowise?.(agent);
      if (result) {
        setFlowiseExportData(result);
        setIsFlowiseExportDialogOpen(true);
      }
    } finally {
      setIsExportingToFlowise(false);
    }
  };

  const handleShare = () => {
    // Gerar URL de compartilhamento (simulado)
    const url = `${window.location.origin}/shared/agent/${agent.id}`;
    setShareUrl(url);
    setIsShareDialogOpen(true);
  };

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.error('Erro ao copiar URL:', error);
    }
  };

  const handleCopyFlowiseUrl = async () => {
    try {
      if (flowiseExportData?.chatUrl) {
        await navigator.clipboard.writeText(flowiseExportData.chatUrl);
      }
    } catch (error) {
      console.error('Erro ao copiar URL do Flowise:', error);
    }
  };

  const handleDelete = async () => {
    await onDelete?.(agent);
    setIsDeleteDialogOpen(false);
  };

  const isArchived = agent.status === 'archived';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-muted/50"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Ações do Agente</DropdownMenuLabel>
            
            <DropdownMenuItem onClick={handleExecute} disabled={isExecuting || agent.status !== 'active'}>
              {isExecuting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Executar Agente
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => onEdit?.(agent)}>
              <Settings className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
              {isDuplicating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Duplicar
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>Compartilhamento</DropdownMenuLabel>
            
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Configuração
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleExportToFlowise} disabled={isExportingToFlowise}>
              {isExportingToFlowise ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              Exportar para Flowise
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>Gerenciamento</DropdownMenuLabel>
            
            <DropdownMenuItem onClick={() => onArchive?.(agent)}>
              {isArchived ? (
                <>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Desarquivar
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  Arquivar
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Permanentemente
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel>Informações</DropdownMenuLabel>
            
            <DropdownMenuItem disabled>
              <BarChart3 className="mr-2 h-4 w-4" />
              <div className="flex items-center justify-between w-full">
                <span>Estatísticas</span>
                <Badge variant="secondary">24 execuções</Badge>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem disabled>
              <Clock className="mr-2 h-4 w-4" />
              <div className="flex items-center justify-between w-full">
                <span>Última Execução</span>
                <Badge variant="outline">há 2 min</Badge>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>Confirmar Exclusão</span>
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir permanentemente o agente "{agent.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Compartilhamento */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Share2 className="w-5 h-5" />
              <span>Compartilhar Agente</span>
            </DialogTitle>
            <DialogDescription>
              Compartilhe este agente com outros usuários através do link abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Qualquer pessoa com este link poderá visualizar e usar este agente.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="share-url">Link de Compartilhamento</Label>
              <div className="flex space-x-2">
                <Input 
                  id="share-url" 
                  value={shareUrl} 
                  readOnly 
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopyShareUrl}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                Fechar
              </Button>
              <Button onClick={handleCopyShareUrl}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Duplicação */}
      <Dialog open={isDuplicating} onOpenChange={(open) => !open && setIsDuplicating(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Copy className="w-5 h-5" />
              <span>Duplicar Agente</span>
            </DialogTitle>
            <DialogDescription>
              Crie uma cópia deste agente com um novo nome.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="duplicate-name">Nome do Novo Agente</Label>
              <Input 
                id="duplicate-name" 
                value={duplicateName} 
                onChange={(e) => setDuplicateName(e.target.value)}
                placeholder="Nome do agente duplicado"
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                A duplicação criará um novo agente com as mesmas configurações, 
                mas com histórico de execuções separado.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDuplicating(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Exportação para Flowise */}
      <Dialog open={isFlowiseExportDialogOpen} onOpenChange={setIsFlowiseExportDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Exportado para Flowise com Sucesso!</span>
            </DialogTitle>
            <DialogDescription>
              Seu agente foi exportado para o Flowise e está pronto para ser usado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                O agente "{agent.name}" foi transformado em um chatflow no Flowise e está disponível para uso imediato.
              </AlertDescription>
            </Alert>
            
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="embed">Incorporar</TabsTrigger>
                <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chat-url">Link do Chat</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="chat-url" 
                      value={flowiseExportData?.chatUrl || ''} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopyFlowiseUrl}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => window.open(flowiseExportData?.chatUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Clique no link acima para acessar o chat ou copie para compartilhar com seus clientes.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="embed" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="embed-code">Código de Incorporação</Label>
                  <Textarea 
                    id="embed-code" 
                    value={flowiseExportData?.embedCode || ''} 
                    readOnly 
                    className="min-h-32 font-mono text-sm"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (flowiseExportData?.embedCode) {
                        navigator.clipboard.writeText(flowiseExportData.embedCode);
                      }
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Código
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="stats" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {flowiseExportData?.stats?.totalExecutions || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Total de Execuções</div>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {flowiseExportData?.stats?.successRate || '100%'}
                    </div>
                    <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    As estatísticas de uso são atualizadas em tempo real. Você pode monitorar o desempenho do seu agente diretamente do painel do Zanai.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsFlowiseExportDialogOpen(false)}>
                Fechar
              </Button>
              <Button onClick={() => window.open(flowiseExportData?.chatUrl, '_blank')}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}