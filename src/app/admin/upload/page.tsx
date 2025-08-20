'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  Eye,
  Download,
  Trash2,
  Loader2,
  Info,
  Users
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  result?: any;
  error?: string;
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisType, setAnalysisType] = useState('');
  const [sector, setSector] = useState('');
  const [priority, setPriority] = useState('');
  const [value, setValue] = useState('');
  const [observations, setObservations] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientId, setClientId] = useState('');
  
  // Lista de clientes simulada
  const [clients] = useState<Client[]>([
    { id: '1', name: 'João Silva', cpf: '123.456.789-00', email: 'joao.silva@email.com', status: 'active' },
    { id: '2', name: 'Maria Santos', cpf: '987.654.321-00', email: 'maria.santos@email.com', status: 'active' },
    { id: '3', name: 'Pedro Oliveira', cpf: '456.789.123-00', email: 'pedro.oliveira@email.com', status: 'pending' }
  ]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
      progress: 0
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);

    // Simular upload
    uploadedFiles.forEach(file => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, status: 'processing', progress: 100 }
            : file
        ));

        // Simular processamento
        setTimeout(() => {
          simulateProcessing(fileId);
        }, 2000);
      } else {
        setFiles(prev => prev.map(file => 
          file.id === fileId 
            ? { ...file, progress: Math.min(progress, 100) }
            : file
        ));
      }
    }, 200);
  };

  const simulateProcessing = (fileId: string) => {
    // Simular resultado do processamento
    const result = {
      extractedText: "Contrato de fornecimento de materiais de construção entre Construtora ABC e Fornecedor XYZ...",
      metadata: {
        value: "R$ 500.000",
        deadline: "12 meses",
        parties: ["Construtora ABC", "Fornecedor XYZ"],
        type: "Contrato de Fornecimento"
      },
      analysis: {
        risks: ["Cláusula penal excessiva", "Prazo de entrega apertado"],
        recommendations: ["Renegociar multa", "Aumentar prazo em 2 meses"],
        compliance: 85,
        viability: "Alta"
      }
    };

    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, status: 'completed', result }
        : file
    ));
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const processAllFiles = async () => {
    if (files.length === 0) return;
    if (!clientId) {
      alert('Por favor, informe o ID do cliente');
      return;
    }
    
    setIsProcessing(true);
    
    // Simular processamento completo com todos os dados
    setTimeout(() => {
      const processedFiles = files.map(file => ({
        ...file,
        status: 'completed' as const,
        result: {
          ...file.result,
          clientId,
          context: {
            analysisType,
            sector,
            priority,
            value,
            observations
          },
          finalAnalysis: {
            juridical: {
              risks: ["Cláusula penal excessiva", "Indefinição de foro"],
              recommendations: ["Renegociar multa", "Especificar foror"],
              compliance: 85
            },
            financial: {
              totalCost: "R$ 450.000",
              roi: "22%",
              payback: "18 meses",
              viability: "Alta"
            },
            operational: {
              capacity: "Adequada",
              timeline: "8 meses",
              risks: ["Inflação", "Disponibilidade de mão de obra"]
            },
            recommendations: {
              approve: true,
              conditions: ["Revisar cláusulas", "Aumentar prazo em 2 meses"],
              estimatedSavings: "R$ 50.000",
              timeReduction: "85%"
            }
          }
        }
      }));
      
      setFiles(processedFiles);
      setIsProcessing(false);
    }, 3000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-orange-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <MainLayout currentPath="/admin/upload">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Upload de Documentos para Análise
            </h1>
            <p className="text-lg text-muted-foreground">
              Envie seus documentos e receba uma análise completa em minutos
            </p>
          </div>

          {/* Upload Area */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Enviar Documentos</CardTitle>
              <CardDescription>
                Arraste seus arquivos aqui ou clique para selecionar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Arraste seus arquivos aqui
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  ou clique para selecionar arquivos
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="cursor-pointer">
                    Selecionar Arquivos
                  </Button>
                </label>
                <div className="mt-4 text-xs text-gray-500">
                  <p>Formatos suportados: PDF, Word, Excel, Imagens, Texto (máx. 10MB)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Configuration */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Configuração da Análise</CardTitle>
              <CardDescription>
                Informe os detalhes para personalizar a análise
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cliente</label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients
                        .filter(client => client.status === 'active')
                        .map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} ({client.cpf})
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Análise</label>
                  <Select value={analysisType} onValueChange={setAnalysisType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">Análise de Contrato</SelectItem>
                      <SelectItem value="due-diligence">Due Diligence</SelectItem>
                      <SelectItem value="project">Análise de Projeto</SelectItem>
                      <SelectItem value="financial">Análise Financeira</SelectItem>
                      <SelectItem value="legal">Análise Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Setor</label>
                  <Select value={sector} onValueChange={setSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">Construção Civil</SelectItem>
                      <SelectItem value="technology">Tecnologia</SelectItem>
                      <SelectItem value="finance">Financeiro</SelectItem>
                      <SelectItem value="healthcare">Saúde</SelectItem>
                      <SelectItem value="retail">Varejo</SelectItem>
                      <SelectItem value="manufacturing">Indústria</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Prioridade</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Valor (opcional)</label>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Observações</label>
                <Textarea
                  placeholder="Descreva qualquer informação adicional ou requisito específico..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Files List */}
          {files.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Arquivos Enviados</CardTitle>
                <CardDescription>
                  Status do processamento dos documentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {files.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <h4 className="font-medium">{file.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)} • {file.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(file.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(file.status)}
                              <span className="capitalize">
                                {file.status === 'uploading' && 'Enviando'}
                                {file.status === 'processing' && 'Processando'}
                                {file.status === 'completed' && 'Concluído'}
                                {file.status === 'error' && 'Erro'}
                              </span>
                            </div>
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {file.status === 'uploading' && (
                        <Progress value={file.progress} className="w-full" />
                      )}
                      
                      {file.status === 'completed' && file.result && (
                        <div className="mt-4 space-y-3">
                          <Alert>
                            <CheckCircle className="w-4 h-4" />
                            <AlertDescription>
                              <strong>Texto extraído:</strong> {file.result.extractedText.substring(0, 200)}...
                            </AlertDescription>
                          </Alert>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                              <h5 className="font-medium mb-2">Metadados</h5>
                              <div className="text-sm space-y-1">
                                <p><strong>Valor:</strong> {file.result.metadata.value}</p>
                                <p><strong>Prazo:</strong> {file.result.metadata.deadline}</p>
                                <p><strong>Tipo:</strong> {file.result.metadata.type}</p>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                              <h5 className="font-medium mb-2">Análise Inicial</h5>
                              <div className="text-sm space-y-1">
                                <p><strong>Compliance:</strong> {file.result.analysis.compliance}%</p>
                                <p><strong>Viabilidade:</strong> {file.result.analysis.viability}</p>
                                <p><strong>Riscos:</strong> {file.result.analysis.risks.length}</p>
                              </div>
                            </div>
                          </div>
                          
                          {file.result.finalAnalysis && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                              <h5 className="font-medium text-green-800 dark:text-green-200 mb-3">
                                Análise Completa
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <strong>Economia:</strong> {file.result.finalAnalysis.recommendations.estimatedSavings}
                                </div>
                                <div>
                                  <strong>Redução de Tempo:</strong> {file.result.finalAnalysis.recommendations.timeReduction}
                                </div>
                                <div>
                                  <strong>Status:</strong> {file.result.finalAnalysis.recommendations.approve ? 'Aprovado' : 'Reprovado'}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {file.status === 'error' && file.error && (
                        <Alert className="mt-3">
                          <AlertCircle className="w-4 h-4" />
                          <AlertDescription className="text-red-700">
                            {file.error}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button
                    onClick={processAllFiles}
                    disabled={isProcessing || files.length === 0}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Processar Todos os Arquivos'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>Funcionalidade em desenvolvimento:</strong> Esta é uma demonstração da interface de upload. 
              Em produção, os documentos serão processados por nossos agentes de IA especializados e 
              você receberá uma análise completa com insights e recomendações acionáveis.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </MainLayout>
  );
}