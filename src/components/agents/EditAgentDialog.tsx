'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Loader2, Save, FileText, Code, Database } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  config: string;
  knowledge?: string;
  status: 'active' | 'inactive' | 'training';
  workspaceId: string;
  workspace?: {
    id: string;
    name: string;
  };
}

interface Workspace {
  id: string;
  name: string;
}

interface EditAgentDialogProps {
  agent: Agent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentUpdated: () => void;
}

export default function EditAgentDialog({ agent, open, onOpenChange, onAgentUpdated }: EditAgentDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'template' as 'template' | 'custom' | 'composed',
    config: '',
    knowledge: '',
    status: 'active' as 'active' | 'inactive' | 'training',
    workspaceId: ''
  });
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (open) {
      loadWorkspaces();
      loadAgentData();
      setActiveTab('basic');
    }
  }, [open, agent.id]);

  const loadWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces');
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
      }
    } catch (error) {
      console.error('Erro ao carregar workspaces:', error);
    }
  };

  const loadAgentData = async () => {
    try {
      const response = await fetch(`/api/agents/${agent.id}`);
      if (response.ok) {
        const agentData = await response.json();
        setFormData({
          name: agentData.name || '',
          description: agentData.description || '',
          type: agentData.type || 'template',
          config: agentData.config || '',
          knowledge: agentData.knowledge || '',
          status: agentData.status || 'active',
          workspaceId: agentData.workspaceId || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do agente:', error);
    }
  };

  const handleSaveAgent = async () => {
    if (!formData.name || !formData.workspaceId) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onAgentUpdated();
        onOpenChange(false);
      } else {
        const error = await response.json();
        alert(`Erro ao atualizar agente: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar agente:', error);
      alert('Erro ao atualizar agente');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
  };

  const validateYAML = (yaml: string): boolean => {
    // Validação básica de YAML
    if (!yaml || yaml.trim() === '') return true;
    
    // Verificar se tem estrutura básica de YAML
    const lines = yaml.split('\n');
    let hasValidStructure = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        // Verificar se tem key: value ou estrutura de lista
        if (trimmed.includes(':') || trimmed.startsWith('-')) {
          hasValidStructure = true;
        }
      }
    }
    
    return hasValidStructure;
  };

  const formatConfig = () => {
    // Formatação básica do YAML
    let formatted = formData.config;
    
    // Remover espaços extras
    formatted = formatted.replace(/\n\s*\n/g, '\n');
    
    // Garantir que haja uma quebra de linha no final
    if (formatted && !formatted.endsWith('\n')) {
      formatted += '\n';
    }
    
    setFormData(prev => ({ ...prev, config: formatted }));
  };

  const isConfigValid = validateYAML(formData.config);
  const hasUnsavedChanges = 
    formData.name !== agent.name ||
    formData.description !== agent.description ||
    formData.type !== agent.type ||
    formData.config !== agent.config ||
    formData.knowledge !== (agent.knowledge || '') ||
    formData.status !== agent.status ||
    formData.workspaceId !== agent.workspaceId;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">Editar Agente: {agent.name}</DialogTitle>
              <DialogDescription className="mt-2">
                Modifique as configurações e propriedades do agente
              </DialogDescription>
            </div>
            <Badge className={
              formData.status === 'active' ? 'bg-green-100 text-green-800' : 
              formData.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
              'bg-blue-100 text-blue-800'
            }>
              {formData.status}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
            <TabsTrigger value="knowledge">Conhecimento</TabsTrigger>
            <TabsTrigger value="advanced">Avançado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Agente</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Assistente de Código"
                />
              </div>
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="custom">Customizado</SelectItem>
                    <SelectItem value="composed">Composto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva as funcionalidades do agente..."
                className="min-h-20"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="training">Em Treinamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="workspace">Workspace</Label>
                <Select value={formData.workspaceId} onValueChange={(value) => setFormData({ ...formData, workspaceId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="config" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="config">Configuração YAML</Label>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={formatConfig}>
                    <FileText className="w-4 h-4 mr-1" />
                    Format
                  </Button>
                  <Badge variant={isConfigValid ? "default" : "destructive"}>
                    {isConfigValid ? "Válido" : "Inválido"}
                  </Badge>
                </div>
              </div>
              
              <div className="relative">
                <ScrollArea className="h-96 w-full border rounded-md">
                  <div className="p-4 bg-muted/30">
                    <Textarea
                      value={formData.config}
                      onChange={(e) => setFormData({ ...formData, config: e.target.value })}
                      placeholder={`name: My Agent
version: 1.0.0
description: Agent description
capabilities:
  - task1
  - task2
settings:
  param1: value1
  param2: value2`}
                      className="min-h-80 font-mono text-sm resize-none border-none bg-transparent p-0 focus:ring-0"
                    />
                  </div>
                </ScrollArea>
              </div>
              
              {!isConfigValid && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                  A configuração YAML parece inválida. Verifique a sintaxe.
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                <p>Dicas para configuração YAML:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Use key: value para pares chave-valor</li>
                  <li>Use - item para listas</li>
                  <li>Indentação consistente é importante</li>
                  <li>Comentários começam com #</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge" className="space-y-4">
            <div>
              <Label htmlFor="knowledge">Base de Conhecimento (Markdown)</Label>
              <ScrollArea className="h-96 w-full border rounded-md">
                <div className="p-4 bg-muted/30">
                  <Textarea
                    value={formData.knowledge}
                    onChange={(e) => setFormData({ ...formData, knowledge: e.target.value })}
                    placeholder={`# Base de Conhecimento

## Especialidades
- Especialidade 1
- Especialidade 2

## Diretrizes
- Diretriz 1
- Diretriz 2

## Exemplos
### Exemplo 1
Descrição do exemplo 1

### Exemplo 2
Descrição do exemplo 2`}
                    className="min-h-80 resize-none border-none bg-transparent p-0 focus:ring-0"
                  />
                </div>
              </ScrollArea>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>A base de conhecimento é usada para fornecer contexto adicional ao agente durante as execuções.</p>
              <p>Use Markdown para formatar o conteúdo com títulos, listas, código, etc.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Database className="w-4 h-4 mr-2" />
                    Informações do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">ID:</span> {agent.id}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Criado em:</span> {new Date(agent.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Workspace:</span> {agent.workspace?.name || 'N/A'}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Configuração:</span> {formData.config.length} caracteres
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Conhecimento:</span> {formData.knowledge.length} caracteres
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Status:</span> <Badge className={
                      formData.status === 'active' ? 'bg-green-100 text-green-800' : 
                      formData.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                      'bg-blue-100 text-blue-800'
                    }>
                      {formData.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={() => {
                    setFormData(prev => ({ ...prev, config: `name: ${prev.name}
version: 1.0.0
description: ${prev.description}
capabilities:
  - process_data
  - generate_content
settings:
  language: pt-BR
  auto_save: true` }));
                  }}>
                    <Code className="w-4 h-4 mr-1" />
                    Template Básico
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setFormData(prev => ({ ...prev, knowledge: `# Base de Conhecimento

## Especialidades
- Processamento de dados
- Geração de conteúdo

## Diretrizes
- Ser claro e objetivo
- Seguir padrões estabelecidos
- Manter consistência nas respostas` }));
                  }}>
                    <FileText className="w-4 h-4 mr-1" />
                    Template Conhecimento
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {hasUnsavedChanges ? "Há alterações não salvas" : "Nenhuma alteração pendente"}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveAgent} 
              disabled={isSaving || !formData.name || !formData.workspaceId || !isConfigValid}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}