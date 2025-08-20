'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus } from 'lucide-react';

interface SpecialistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  skills: string[];
  useCases: string[];
  created: string;
}

interface SpecialistCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function SpecialistsTestPage() {
  const [categories, setCategories] = useState<SpecialistCategory[]>([]);
  const [templates, setTemplates] = useState<SpecialistTemplate[]>([]);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      console.error('Erro ao carregar especialistas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 animate-spin" />
          <p>Carregando especialistas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gerador de Especialistas (Teste)</h1>
            <p className="text-muted-foreground mt-2">
              Versão simplificada para testar o funcionamento
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Especialista
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Categorias ({categories.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Templates ({templates.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
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
                      <div className="space-y-1">
                        {template.useCases.map((useCase, index) => (
                          <div key={index} className="text-xs text-muted-foreground">
                            • {useCase}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Criado em {new Date(template.created).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}