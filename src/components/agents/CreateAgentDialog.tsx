'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';

interface CreateAgentDialogProps {
  onAgentCreated: () => void;
}

interface Workspace {
  id: string;
  name: string;
}

export default function CreateAgentDialog({ onAgentCreated }: CreateAgentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'template',
    workspaceId: ''
  });

  const loadWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces');
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data);
        if (data.length > 0 && !formData.workspaceId) {
          setFormData(prev => ({ ...prev, workspaceId: data[0].id }));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar workspaces:', error);
    }
  };

  const handleCreateAgent = async () => {
    if (!formData.name || !formData.workspaceId) {
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onAgentCreated();
        setIsOpen(false);
        setFormData({
          name: '',
          description: '',
          type: 'template',
          workspaceId: workspaces[0]?.id || ''
        });
      } else {
        const error = await response.json();
        alert(`Erro ao criar agente: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao criar agente:', error);
      alert('Erro ao criar agente');
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadWorkspaces();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Agente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Agente</DialogTitle>
          <DialogDescription>
            Crie um novo agente inteligente para automatizar tarefas
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva as funcionalidades do agente..."
              className="min-h-20"
            />
          </div>
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
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
          <Button 
            onClick={handleCreateAgent} 
            className="w-full"
            disabled={isCreating || !formData.name || !formData.workspaceId}
          >
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Agente'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}