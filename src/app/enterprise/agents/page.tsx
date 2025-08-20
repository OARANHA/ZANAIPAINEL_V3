'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Brain, Plus, Search, Filter, MoreHorizontal, Edit, Play, Trash2, Users, Building2 } from 'lucide-react';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'template' | 'custom' | 'enterprise';
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  executions: number;
  successRate: number;
  assignedUsers: number;
}

export default function EnterpriseAgentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'template' | 'custom' | 'enterprise'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Dados mockados para agentes empresariais
  const agents: Agent[] = [
    {
      id: '1',
      name: 'Assistente de Vendas',
      description: 'Auxilia equipe de vendas com follow-up e propostas',
      type: 'enterprise',
      category: 'Vendas',
      status: 'active',
      createdAt: '2024-01-15',
      executions: 145,
      successRate: 96,
      assignedUsers: 8
    },
    {
      id: '2',
      name: 'Analisador de Contratos',
      description: 'Revisa contratos e identifica cláusulas importantes',
      type: 'enterprise',
      category: 'Jurídico',
      status: 'active',
      createdAt: '2024-01-10',
      executions: 67,
      successRate: 92,
      assignedUsers: 5
    },
    {
      id: '3',
      name: 'Suporte Técnico',
      description: 'Responde perguntas técnicas e soluciona problemas',
      type: 'custom',
      category: 'TI',
      status: 'active',
      createdAt: '2024-01-08',
      executions: 234,
      successRate: 88,
      assignedUsers: 12
    },
    {
      id: '4',
      name: 'Gerador de Relatórios',
      description: 'Cria relatórios automáticos de desempenho',
      type: 'template',
      category: 'Analytics',
      status: 'active',
      createdAt: '2024-01-05',
      executions: 89,
      successRate: 94,
      assignedUsers: 3
    },
    {
      id: '5',
      name: 'Recrutador IA',
      description: 'Ajuda na triagem e seleção de candidatos',
      type: 'enterprise',
      category: 'RH',
      status: 'inactive',
      createdAt: '2024-01-03',
      executions: 45,
      successRate: 91,
      assignedUsers: 6
    }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || agent.type === filterType;
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'template': return 'bg-blue-100 text-blue-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Agentes Corporativos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie os agentes de IA da sua organização
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Criar Agente</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Total de Agentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-gray-500">2 enterprise, 2 custom, 1 template</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.reduce((sum, a) => sum + a.assignedUsers, 0)}
            </div>
            <p className="text-xs text-gray-500">Média de 7.6 usuários/agente</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building2 className="w-4 h-4 mr-2" />
              Total Execuções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agents.reduce((sum, a) => sum + a.executions, 0)}
            </div>
            <p className="text-xs text-green-600">+23% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length)}%
            </div>
            <p className="text-xs text-green-600">Acima da meta (90%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar agentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">Todos os tipos</option>
                <option value="enterprise">Enterprise</option>
                <option value="custom">Personalizados</option>
                <option value="template">Templates</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                  <Badge className={getTypeColor(agent.type)}>
                    {agent.type}
                  </Badge>
                </div>
              </div>
              <CardDescription>{agent.description}</CardDescription>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">{agent.category}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Execuções</div>
                    <div className="font-semibold">{agent.executions}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Sucesso</div>
                    <div className="font-semibold">{agent.successRate}%</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Usuários</div>
                    <div className="font-semibold">{agent.assignedUsers}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Criado</div>
                    <div className="font-semibold">{new Date(agent.createdAt).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <Play className="w-4 h-4 mr-1" />
                    Executar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum agente encontrado</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterType !== 'all' || filterStatus !== 'all' 
                ? 'Tente ajustar seus filtros ou termos de busca.'
                : 'Comece criando seu primeiro agente corporativo.'
              }
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Criar Agente
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}