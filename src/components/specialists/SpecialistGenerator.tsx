'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Download, 
  Brain, 
  Users, 
  Target, 
  BookOpen, 
  FileText, 
  Settings,
  Sparkles,
  Loader2,
  FolderOpen
} from 'lucide-react';

interface SpecialistCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface SpecialistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
  skills: string[];
  useCases: string[];
  created: string;
}

interface NewSpecialist {
  category: string;
  specialty: string;
  requirements: string;
}

export default function SpecialistGenerator() {
  const [categories, setCategories] = useState<SpecialistCategory[]>([]);
  const [templates, setTemplates] = useState<SpecialistTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateSpecialistOpen, setIsCreateSpecialistOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiWarning, setApiWarning] = useState<string>('');
  const [newSpecialist, setNewSpecialist] = useState<NewSpecialist>({
    category: '',
    specialty: '',
    requirements: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/specialists');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
        setTemplates(data.templates);
        
        // Check if there's an API warning
        if (data.warning) {
          setApiWarning(data.warning);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar especialistas:', error);
    }
  };

  const generateSpecialist = async () => {
    if (!newSpecialist.category || !newSpecialist.specialty || !newSpecialist.requirements) {
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/specialists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSpecialist),
      });

      if (response.ok) {
        const generatedTemplate = await response.json();
        setTemplates(prev => [...prev, generatedTemplate]);
        setIsCreateSpecialistOpen(false);
        setNewSpecialist({
          category: '',
          specialty: '',
          requirements: ''
        });
      }
    } catch (error) {
      console.error('Erro ao gerar especialista:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSpecialist = async (specialistId: string) => {
    try {
      const response = await fetch('/api/specialists/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ specialistId }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const specialist = templates.find(t => t.id === specialistId);
        a.download = `${specialist?.name || 'specialist'}.md`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erro ao baixar especialista:', error);
    }
  };

  const generateFolderStructure = async () => {
    try {
      const response = await fetch('/api/specialists/structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ basePath: '.zanai/specialists' }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Estrutura criada com sucesso!\n\n${result.totalFiles} arquivos gerados em:\n${result.basePath}`);
      } else {
        alert('Erro ao criar estrutura de pastas');
      }
    } catch (error) {
      console.error('Erro ao gerar estrutura:', error);
      alert('Erro ao gerar estrutura de pastas');
    }
  };

  const filteredTemplates = selectedCategory !== 'all' 
    ? templates.filter(template => template.category === selectedCategory)
    : templates;

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || '🤖';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* API Warning */}
      {apiWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="text-yellow-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-yellow-800">
              <p className="font-medium">Configuração da API necessária</p>
              <p className="text-sm">{apiWarning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerador de Especialistas</h1>
          <p className="text-muted-foreground mt-2">
            Crie agentes especialistas personalizados usando IA para diversas áreas de negócio
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={generateFolderStructure}>
            <FolderOpen className="w-4 h-4 mr-2" />
            Gerar Estrutura de Pastas
          </Button>
          <Dialog open={isCreateSpecialistOpen} onOpenChange={setIsCreateSpecialistOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Especialista
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Gerar Novo Especialista</DialogTitle>
                <DialogDescription>
                  Use a IA para criar um template de agente especialista personalizado
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <Select 
                    value={newSpecialist.category} 
                    onValueChange={(value) => setNewSpecialist({ ...newSpecialist, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Especialidade</label>
                  <Input
                    value={newSpecialist.specialty}
                    onChange={(e) => setNewSpecialist({ ...newSpecialist, specialty: e.target.value })}
                    placeholder="Ex: Analista Financeiro, Especialista em SEO, etc."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Requisitos Específicos</label>
                  <Textarea
                    value={newSpecialist.requirements}
                    onChange={(e) => setNewSpecialist({ ...newSpecialist, requirements: e.target.value })}
                    placeholder="Descreva os requisitos específicos para este especialista..."
                    className="min-h-24"
                  />
                </div>
                <Button 
                  onClick={generateSpecialist} 
                  className="w-full"
                  disabled={isGenerating || !newSpecialist.category || !newSpecialist.specialty || !newSpecialist.requirements}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Gerar Especialista
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">Filtrar por categoria:</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center space-x-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Specialists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(template.category)}</span>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <Badge variant="outline">
                  {getCategoryName(template.category)}
                </Badge>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Habilidades:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Casos de Uso:</h4>
                  <ScrollArea className="h-16">
                    <div className="space-y-1">
                      {template.useCases.map((useCase, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          • {useCase}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Criado em {new Date(template.created).toLocaleDateString()}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => downloadSpecialist(template.id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum especialista encontrado</h3>
          <p className="text-muted-foreground mb-4">
            {selectedCategory 
              ? `Nenhum especialista na categoria "${getCategoryName(selectedCategory)}"`
              : 'Comece criando seu primeiro especialista'
            }
          </p>
          <Button onClick={() => setIsCreateSpecialistOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Especialista
          </Button>
        </div>
      )}
    </div>
  );
}