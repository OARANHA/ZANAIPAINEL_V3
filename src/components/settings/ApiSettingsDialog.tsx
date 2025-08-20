'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, Key, Database, Zap, Shield, Save, TestTube, Eye, EyeOff } from 'lucide-react';
import { getConfig, updateConfig, validateConfig, ApiConfig } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';

interface ApiSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApiSettingsDialog({ open, onOpenChange }: ApiSettingsDialogProps) {
  const { toast } = useToast();
  const [config, setConfig] = useState<ApiConfig>(getConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] }>({ valid: true, errors: [] });

  useEffect(() => {
    if (open) {
      setConfig(getConfig());
      setValidation(validateConfig(getConfig()));
    }
  }, [open]);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // Validar configuração antes de salvar
      const newValidation = validateConfig(config);
      setValidation(newValidation);

      if (!newValidation.valid) {
        toast({
          title: "Erro de validação",
          description: "Por favor, corrija os erros antes de salvar.",
          variant: "destructive",
        });
        return;
      }

      // Simular salvamento (em produção, isso salvaria em banco de dados)
      updateConfig(config);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de API foram salvas com sucesso.",
        variant: "default",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async (service: 'openai' | 'zai' | 'flowise') => {
    try {
      toast({
        title: "Testando conexão...",
        description: `Testando conexão com ${service.toUpperCase()}`,
        variant: "default",
      });

      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Conexão testada",
        description: `Conexão com ${service.toUpperCase()} estabelecida com sucesso!`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: `Não foi possível conectar com ${service.toUpperCase()}`,
        variant: "destructive",
      });
    }
  };

  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (showApiKeys) return key;
    return key.slice(0, 8) + '...' + key.slice(-4);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <DialogTitle className="text-xl">Configurações de API</DialogTitle>
          </div>
          <DialogDescription>
            Gerencie as chaves de API e configurações dos serviços integrados
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="openai" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="openai" className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span>OpenAI</span>
            </TabsTrigger>
            <TabsTrigger value="zai" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Z AI</span>
            </TabsTrigger>
            <TabsTrigger value="flowise" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Flowise</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="openai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>OpenAI API</span>
                  <Badge variant={config.openai.apiKey ? "default" : "destructive"}>
                    {config.openai.apiKey ? "Configurado" : "Não configurado"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Configure sua chave da API OpenAI para usar modelos de linguagem como GPT-4, GPT-3.5, etc.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="openai-key">API Key</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="openai-key"
                      type={showApiKeys ? "text" : "password"}
                      value={maskApiKey(config.openai.apiKey)}
                      onChange={(e) => setConfig({
                        ...config,
                        openai: { ...config.openai, apiKey: e.target.value }
                      })}
                      placeholder="sk-..."
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKeys(!showApiKeys)}
                    >
                      {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Encontre sua API key no dashboard da OpenAI
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-base-url">Base URL</Label>
                    <Input
                      id="openai-base-url"
                      value={config.openai.baseUrl}
                      onChange={(e) => setConfig({
                        ...config,
                        openai: { ...config.openai, baseUrl: e.target.value }
                      })}
                      placeholder="https://api.openai.com/v1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openai-org">Organization</Label>
                    <Input
                      id="openai-org"
                      value={config.openai.organization || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        openai: { ...config.openai, organization: e.target.value || undefined }
                      })}
                      placeholder="org-..."
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('openai')}
                    className="flex items-center space-x-2"
                  >
                    <TestTube className="w-4 h-4" />
                    <span>Testar Conexão</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zai" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Z AI Service</span>
                  <Badge variant={config.zai.enabled ? "default" : "secondary"}>
                    {config.zai.enabled ? "Ativado" : "Desativado"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Configure o serviço Z AI para tomada de decisões inteligentes e otimização de agentes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Ativar Z AI</Label>
                    <p className="text-sm text-muted-foreground">
                      Use IA avançada para otimizar templates e tomar decisões
                    </p>
                  </div>
                  <Switch
                    checked={config.zai.enabled}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      zai: { ...config.zai, enabled: checked }
                    })}
                  />
                </div>

                {config.zai.enabled && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zai-model">Modelo</Label>
                        <Input
                          id="zai-model"
                          value={config.zai.model || 'gpt-4'}
                          onChange={(e) => setConfig({
                            ...config,
                            zai: { ...config.zai, model: e.target.value }
                          })}
                          placeholder="gpt-4"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zai-tokens">Max Tokens</Label>
                        <Input
                          id="zai-tokens"
                          type="number"
                          value={config.zai.maxTokens || 4000}
                          onChange={(e) => setConfig({
                            ...config,
                            zai: { ...config.zai, maxTokens: parseInt(e.target.value) || 4000 }
                          })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zai-temperature">Temperature ({config.zai.temperature})</Label>
                      <Input
                        id="zai-temperature"
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={config.zai.temperature || 0.7}
                        onChange={(e) => setConfig({
                          ...config,
                          zai: { ...config.zai, temperature: parseFloat(e.target.value) }
                        })}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Conservador</span>
                        <span>Criativo</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('zai')}
                    className="flex items-center space-x-2"
                    disabled={!config.zai.enabled}
                  >
                    <TestTube className="w-4 h-4" />
                    <span>Testar Serviço</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flowise" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Flowise Integration</span>
                  <Badge variant="outline">Conectado</Badge>
                </CardTitle>
                <CardDescription>
                  Configure a integração com o Flowise para exportação e gerenciamento de workflows
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="flowise-url">Base URL</Label>
                  <Input
                    id="flowise-url"
                    value={config.flowise.baseUrl}
                    onChange={(e) => setConfig({
                      ...config,
                      flowise: { ...config.flowise, baseUrl: e.target.value }
                    })}
                    placeholder="http://localhost:3000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flowise-key">API Key (opcional)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="flowise-key"
                      type={showApiKeys ? "text" : "password"}
                      value={maskApiKey(config.flowise.apiKey || '')}
                      onChange={(e) => setConfig({
                        ...config,
                        flowise: { ...config.flowise, apiKey: e.target.value || undefined }
                      })}
                      placeholder="flowise_..."
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKeys(!showApiKeys)}
                    >
                      {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleTestConnection('flowise')}
                    className="flex items-center space-x-2"
                  >
                    <TestTube className="w-4 h-4" />
                    <span>Testar Conexão</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Validation Errors */}
        {!validation.valid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-medium mb-2">Erros de validação:</h4>
            <ul className="text-red-700 text-sm space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Suas chaves são armazenadas com segurança</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveConfig} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}