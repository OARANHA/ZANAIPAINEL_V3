'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  birthDate?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    birthDate: '',
    status: 'active' as const
  });

  // Dados simulados para demonstração
  useEffect(() => {
    const mockClients: Client[] = [
      {
        id: '1',
        name: 'João Silva',
        cpf: '123.456.789-00',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-9999',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        birthDate: '1980-01-15',
        status: 'active',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Maria Santos',
        cpf: '987.654.321-00',
        email: 'maria.santos@email.com',
        phone: '(11) 98888-8888',
        address: 'Av. Paulista, 456',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
        birthDate: '1985-05-20',
        status: 'active',
        createdAt: '2024-01-20T14:20:00Z',
        updatedAt: '2024-01-20T14:20:00Z'
      },
      {
        id: '3',
        name: 'Pedro Oliveira',
        cpf: '456.789.123-00',
        email: 'pedro.oliveira@email.com',
        phone: '(11) 97777-7777',
        address: 'Rua Augusta, 789',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01304-000',
        birthDate: '1975-08-10',
        status: 'pending',
        createdAt: '2024-01-25T09:15:00Z',
        updatedAt: '2024-01-25T09:15:00Z'
      }
    ];
    setClients(mockClients);
    setFilteredClients(mockClients);
  }, []);

  useEffect(() => {
    let filtered = clients;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cpf.includes(searchTerm)
      );
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, statusFilter]);

  const handleCreateClient = () => {
    setIsCreating(true);
    setEditingClient(null);
    setFormData({
      name: '',
      cpf: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      birthDate: '',
      status: 'active'
    });
  };

  const handleEditClient = (client: Client) => {
    setIsCreating(true);
    setEditingClient(client);
    setFormData({
      name: client.name,
      cpf: client.cpf,
      email: client.email,
      phone: client.phone || '',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      zipCode: client.zipCode || '',
      birthDate: client.birthDate ? new Date(client.birthDate).toISOString().split('T')[0] : '',
      status: client.status
    });
  };

  const handleSaveClient = () => {
    if (!formData.name || !formData.cpf || !formData.email) {
      alert('Preencha os campos obrigatórios: Nome, CPF e Email');
      return;
    }

    if (editingClient) {
      // Atualizar cliente existente
      const updatedClients = clients.map(client =>
        client.id === editingClient.id
          ? {
              ...client,
              ...formData,
              updatedAt: new Date().toISOString()
            }
          : client
      );
      setClients(updatedClients);
    } else {
      // Criar novo cliente
      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setClients([...clients, newClient]);
    }

    setIsCreating(false);
    setEditingClient(null);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(clients.filter(client => client.id !== clientId));
    }
  };

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <MainLayout currentPath="/admin/clients">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Cadastro de Clientes
              </h1>
              <p className="text-lg text-muted-foreground">
                Gerencie os clientes do sistema
              </p>
            </div>
            <Button onClick={handleCreateClient} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Novo Cliente</span>
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por nome, email ou CPF..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                      <SelectItem value="pending">Pendentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create/Edit Modal */}
          {isCreating && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </CardTitle>
                <CardDescription>
                  Preencha os dados do cliente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Nome completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">CPF *</label>
                    <Input
                      value={formData.cpf}
                      onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                      placeholder="000.000.000-00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@exemplo.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Endereço</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Rua, número, complemento"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Cidade</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Cidade"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Estado</label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      placeholder="UF"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">CEP</label>
                    <Input
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveClient}>
                    {editingClient ? 'Atualizar' : 'Criar'} Cliente
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Clients List */}
          <Card>
            <CardHeader>
              <CardTitle>Clientes Cadastrados</CardTitle>
              <CardDescription>
                {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado{filteredClients.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredClients.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum cliente encontrado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredClients.map((client) => (
                    <div key={client.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{client.name}</h3>
                            <Badge className={getStatusColor(client.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(client.status)}
                                <span className="capitalize">
                                  {client.status === 'active' && 'Ativo'}
                                  {client.status === 'inactive' && 'Inativo'}
                                  {client.status === 'pending' && 'Pendente'}
                                </span>
                              </div>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{client.email}</span>
                            </div>
                            
                            {client.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">CPF:</span>
                              <span>{client.cpf}</span>
                            </div>
                            
                            {client.birthDate && (
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Nasc: {formatDate(client.birthDate)}</span>
                              </div>
                            )}
                            
                            {client.address && (
                              <div className="flex items-center space-x-2 md:col-span-2">
                                <MapPin className="w-4 h-4" />
                                <span>
                                  {client.address}, {client.city} - {client.state}
                                  {client.zipCode && ` (${client.zipCode})`}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-2 text-xs text-muted-foreground">
                            Criado em {formatDate(client.createdAt)} • 
                            Atualizado em {formatDate(client.updatedAt)}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClient(client)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteClient(client.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}