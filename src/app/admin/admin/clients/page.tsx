'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Edit, Trash2, CheckCircle, Calendar } from 'lucide-react'

interface Client {
  id: string
  name: string
  cpf: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  birthDate?: string
  status: string
  createdAt: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    birthDate: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/admin/clients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setClients(data)
      } else {
        setError('Erro ao carregar clientes')
      }
    } catch (error) {
      console.error('Error loading clients:', error)
      setError('Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const validateCPF = (cpf: string) => {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '')
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false
    
    // Cálculo do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * (10 - i)
    }
    let remainder = sum % 11
    const digit1 = remainder < 2 ? 0 : 11 - remainder
    
    // Cálculo do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i)
    }
    remainder = sum % 11
    const digit2 = remainder < 2 ? 0 : 11 - remainder
    
    // Verifica os dígitos verificadores
    return parseInt(cpf[9]) === digit1 && parseInt(cpf[10]) === digit2
  }

  const formatCPF = (value: string) => {
    // Remove caracteres não numéricos
    value = value.replace(/[^\d]/g, '')
    
    // Aplica a máscara
    if (value.length <= 3) return value
    if (value.length <= 6) return `${value.slice(0, 3)}.${value.slice(3)}`
    if (value.length <= 9) return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`
    return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate CPF
    if (!validateCPF(formData.cpf)) {
      setError('CPF inválido')
      return
    }

    try {
      const token = localStorage.getItem('auth-token')
      const url = editingClient ? '/api/admin/clients' : '/api/admin/clients'
      const method = editingClient ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingClient ? { ...formData, id: editingClient.id } : formData)
      })

      if (response.ok) {
        setSuccess(editingClient ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!')
        setShowForm(false)
        setEditingClient(null)
        setFormData({
          name: '',
          cpf: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          birthDate: ''
        })
        await loadClients()
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao salvar cliente')
      }
    } catch (error) {
      console.error('Error saving client:', error)
      setError('Erro ao salvar cliente')
    }
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      cpf: client.cpf,
      email: client.email,
      phone: client.phone || '',
      address: client.address || '',
      city: client.city || '',
      state: client.state || '',
      zipCode: client.zipCode || '',
      birthDate: client.birthDate ? new Date(client.birthDate).toISOString().split('T')[0] : ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return

    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/admin/clients', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        setSuccess('Cliente excluído com sucesso!')
        await loadClients()
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao excluir cliente')
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      setError('Erro ao excluir cliente')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return ''
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return `${age} anos`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Gestão de Clientes</h1>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </CardTitle>
              <CardDescription>
                Preencha os dados do cliente pessoa física
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={formatCPF(formData.cpf)}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value.replace(/[^\d]/g, '') })}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingClient ? 'Atualizar' : 'Criar'} Cliente
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingClient(null)
                      setFormData({
                        name: '',
                        cpf: '',
                        email: '',
                        phone: '',
                        address: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        birthDate: ''
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Clients List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{client.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(client.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="font-mono text-sm">
                  {formatCPF(client.cpf)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    {client.phone && (
                      <p className="text-sm text-gray-600">{client.phone}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(client.status)}>
                      {client.status === 'active' ? 'Ativo' : 
                       client.status === 'inactive' ? 'Inativo' : 'Pendente'}
                    </Badge>
                    {client.birthDate && (
                      <Badge variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        {calculateAge(client.birthDate)}
                      </Badge>
                    )}
                  </div>
                  
                  {client.address && (
                    <div className="text-sm text-gray-500">
                      <p>{client.address}</p>
                      {client.city && client.state && (
                        <p>{client.city}, {client.state}</p>
                      )}
                      {client.zipCode && <p>CEP: {client.zipCode}</p>}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    <p>Cadastrado em: {new Date(client.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {clients.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum cliente cadastrado ainda.</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Primeiro Cliente
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}