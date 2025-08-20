'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Sparkles, Zap, Target, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'composed';
  status: 'active' | 'inactive' | 'training';
}

interface QuickAgentInputProps {
  agent: Agent;
  onExecute: (input: string) => void;
  examples?: string[];
}

export default function QuickAgentInput({ agent, onExecute, examples = [] }: QuickAgentInputProps) {
  const [input, setInput] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();

  const handleExecute = async () => {
    if (!input.trim()) return;
    
    setIsExecuting(true);
    try {
      await onExecute(input.trim());
      toast({
        title: "Execução iniciada",
        description: `O agente ${agent.name} está processando sua solicitação...`,
      });
      setInput('');
    } catch (error) {
      toast({
        title: "Erro na execução",
        description: "Não foi possível executar o agente. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isExecuting) {
      e.preventDefault();
      handleExecute();
    }
  };

  const getExamplesByType = () => {
    const defaultExamples: Record<string, string[]> = {
      'template': [
        'Analise este documento e resuma os pontos principais',
        'Crie um plano de ação para melhorar a produtividade',
        'Gere ideias inovadoras para o meu projeto'
      ],
      'custom': [
        'Execute sua tarefa principal com os dados fornecidos',
        'Processe esta informação conforme suas configurações',
        'Aplique seu conhecimento especializado neste caso'
      ],
      'composed': [
        'Coordene a execução das tarefas em sequência',
        'Integre os resultados dos diferentes agentes',
        'Otimize o fluxo de trabalho completo'
      ]
    };

    return examples.length > 0 ? examples : defaultExamples[agent.type] || defaultExamples.template;
  };

  const agentExamples = getExamplesByType();

  return (
    <div className="space-y-3">
      {/* Input Rápido */}
      <div className="relative">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite um comando rápido para o agente..."
          className="pr-12 text-sm"
          disabled={agent.status !== 'active' || isExecuting}
        />
        <Button
          size="sm"
          onClick={handleExecute}
          disabled={!input.trim() || agent.status !== 'active' || isExecuting}
          className="absolute right-1 top-1 h-7 px-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          {isExecuting ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Play className="w-3 h-3" />
          )}
        </Button>
      </div>

      {/* Exemplos Rápidos */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExamples(!showExamples)}
          className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
          disabled={isExecuting}
        >
          <Lightbulb className="w-3 h-3 mr-1" />
          {showExamples ? 'Ocultar exemplos' : 'Ver exemplos'}
        </Button>
        
        {agent.status !== 'active' && (
          <Badge variant="secondary" className="text-xs">
            {agent.status === 'training' ? 'Em treinamento' : 'Inativo'}
          </Badge>
        )}
      </div>

      {showExamples && (
        <Card className="p-3 bg-muted/30">
          <CardContent className="p-0 space-y-2">
            <div className="text-xs font-medium text-muted-foreground flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Exemplos para {agent.name}:
            </div>
            <div className="space-y-1">
              {agentExamples.slice(0, 3).map((example, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setInput(example)}
                  className="w-full justify-start text-xs text-left p-2 h-auto hover:bg-muted/50"
                  disabled={isExecuting}
                >
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="line-clamp-2">{example}</span>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ação Rápida */}
      {input.trim() && (
        <Card className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-600" />
                <div className="text-sm">
                  <div className="font-medium text-green-800 dark:text-green-300">
                    {isExecuting ? 'Executando...' : 'Pronto para executar'}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {input.length} caracteres
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleExecute}
                disabled={isExecuting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {isExecuting ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-1" />
                )}
                {isExecuting ? 'Executando...' : 'Executar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}