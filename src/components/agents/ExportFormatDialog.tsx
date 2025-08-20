'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Download, FileJson, FileText } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  config: string;
  knowledge?: string;
  customInstructions?: string;
  roleDefinition?: string;
  groups?: any[];
}

interface ExportFormatDialogProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'json' | 'markdown') => void;
}

export default function ExportFormatDialog({ agent, isOpen, onClose, onExport }: ExportFormatDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'markdown'>('json');

  const handleExport = () => {
    onExport(selectedFormat);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Exportar Agente</span>
          </DialogTitle>
          <DialogDescription>
            Escolha o formato de exportação para o agente "{agent.name}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <RadioGroup value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as 'json' | 'markdown')}>
            <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex items-center space-x-3 cursor-pointer flex-1">
                <FileJson className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">JSON</div>
                  <div className="text-sm text-muted-foreground">
                    Formato estruturado, ideal para importação e integração com outros sistemas
                  </div>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="markdown" id="markdown" />
              <Label htmlFor="markdown" className="flex items-center space-x-3 cursor-pointer flex-1">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">Markdown (.md)</div>
                  <div className="text-sm text-muted-foreground">
                    Formatado para leitura humana, perfeito para documentação e compartilhamento
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleExport} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Exportar {selectedFormat === 'json' ? 'JSON' : 'Markdown'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}