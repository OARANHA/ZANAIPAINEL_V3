'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Category, Settings, Download, RefreshCw } from 'lucide-react';

interface FlowiseNode {
  categoria: string;
  label: string;
  desc: string;
  path: string;
  inputs: string;
  outputs: string;
}

interface FlowiseNodeCatalog {
  nodes: FlowiseNode[];
  categories: string[];
  totalNodes: number;
  lastUpdated: string;
}

interface FlowiseNodeCatalogProps {
  agentType?: string;
  onNodeSelect?: (node: FlowiseNode) => void;
  onGenerateConfig?: (nodes: FlowiseNode[]) => void;
}

export function FlowiseNodeCatalog({ 
  agentType = 'default', 
  onNodeSelect,
  onGenerateConfig 
}: FlowiseNodeCatalogProps) {
  const [catalog, setCatalog] = useState<FlowiseNodeCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [recommendedNodes, setRecommendedNodes] = useState<FlowiseNode[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<FlowiseNode[]>([]);

  useEffect(() => {
    loadCatalog();
  }, []);

  useEffect(() => {
    if (catalog) {
      loadRecommendedNodes();
    }
  }, [catalog, agentType]);

  const loadCatalog = async () => {
    try {
      const response = await fetch('/api/flowise-nodes?action=catalog');
      if (response.ok) {
        const data = await response.json();
        setCatalog(data);
      } else {
        const errorData = await response.json();
        console.error('Error loading catalog:', errorData.error);
      }
    } catch (error) {
      console.error('Error loading catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedNodes = async () => {
    try {
      const response = await fetch(`/api/flowise-nodes?action=recommended&agentType=${agentType}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendedNodes(data.nodes);
      }
    } catch (error) {
      console.error('Error loading recommended nodes:', error);
    }
  };

  const searchNodes = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`/api/flowise-nodes?action=search&query=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        return data.nodes;
      }
    } catch (error) {
      console.error('Error searching nodes:', error);
    }
    return [];
  };

  const getNodesByCategory = async (category: string) => {
    try {
      const response = await fetch(`/api/flowise-nodes?action=category&category=${encodeURIComponent(category)}`);
      if (response.ok) {
        const data = await response.json();
        return data.nodes;
      }
    } catch (error) {
      console.error('Error loading category nodes:', error);
    }
    return [];
  };

  const filteredNodes = () => {
    if (!catalog) return [];
    
    let nodes = catalog.nodes;
    
    if (selectedCategory) {
      nodes = nodes.filter(node => node.categoria === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      nodes = nodes.filter(node => 
        node.label.toLowerCase().includes(query) ||
        node.desc.toLowerCase().includes(query) ||
        node.categoria.toLowerCase().includes(query)
      );
    }
    
    return nodes;
  };

  const handleNodeSelect = (node: FlowiseNode) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
    
    // Toggle selection for config generation
    setSelectedNodes(prev => {
      const isSelected = prev.some(n => n.path === node.path);
      if (isSelected) {
        return prev.filter(n => n.path !== node.path);
      } else {
        return [...prev, node];
      }
    });
  };

  const handleGenerateConfig = () => {
    if (selectedNodes.length > 0 && onGenerateConfig) {
      onGenerateConfig(selectedNodes);
    }
  };

  const isNodeSelected = (node: FlowiseNode) => {
    return selectedNodes.some(n => n.path === node.path);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Carregando catálogo de nodes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!catalog) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Catálogo de nodes do Flowise não encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Por favor, execute o script de catalogação primeiro
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Catálogo de Nodes do Flowise
          </CardTitle>
          <CardDescription>
            Total de {catalog.totalNodes} nodes disponíveis em {catalog.categories.length} categorias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {catalog.categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedNodes.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">
                {selectedNodes.length} node(s) selecionado(s)
              </span>
              <Button onClick={handleGenerateConfig} size="sm">
                Gerar Configuração
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="recommended" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommended">Recomendados</TabsTrigger>
          <TabsTrigger value="all">Todos os Nodes</TabsTrigger>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nodes Recomendados</CardTitle>
              <CardDescription>
                Nodes recomendados para agentes do tipo "{agentType}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {recommendedNodes.map(node => (
                  <NodeCard
                    key={node.path}
                    node={node}
                    isSelected={isNodeSelected(node)}
                    onSelect={() => handleNodeSelect(node)}
                  />
                ))}
                {recommendedNodes.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum node recomendado encontrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Todos os Nodes</CardTitle>
              <CardDescription>
                {filteredNodes().length} nodes encontrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredNodes().map(node => (
                  <NodeCard
                    key={node.path}
                    node={node}
                    isSelected={isNodeSelected(node)}
                    onSelect={() => handleNodeSelect(node)}
                  />
                ))}
                {filteredNodes().length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum node encontrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {catalog.categories.map(category => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Category className="h-4 w-4" />
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {catalog.nodes
                    .filter(node => node.categoria === category)
                    .map(node => (
                      <NodeCard
                        key={node.path}
                        node={node}
                        isSelected={isNodeSelected(node)}
                        onSelect={() => handleNodeSelect(node)}
                        compact
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface NodeCardProps {
  node: FlowiseNode;
  isSelected: boolean;
  onSelect: () => void;
  compact?: boolean;
}

function NodeCard({ node, isSelected, onSelect, compact = false }: NodeCardProps) {
  return (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-medium ${compact ? 'text-sm' : ''}`}>{node.label}</h4>
            <Badge variant="secondary" className="text-xs">
              {node.categoria}
            </Badge>
          </div>
          {!compact && node.desc && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {node.desc}
            </p>
          )}
          {compact && (
            <div className="flex gap-1 mt-1">
              {node.inputs && (
                <Badge variant="outline" className="text-xs">
                  I: {node.inputs.length > 20 ? node.inputs.substring(0, 20) + '...' : node.inputs}
                </Badge>
              )}
              {node.outputs && (
                <Badge variant="outline" className="text-xs">
                  O: {node.outputs.length > 20 ? node.outputs.substring(0, 20) + '...' : node.outputs}
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {isSelected ? '✓' : ''}
        </div>
      </div>
    </div>
  );
}