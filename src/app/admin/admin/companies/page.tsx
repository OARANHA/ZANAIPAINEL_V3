'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Building, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react'

interface Company {
  id: string
  name: string
  cnpj: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  status: string
  plan: string
  maxUsers: number
  createdAt: string
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    plan: 'basic',
    maxUsers: 5
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/admin/companies', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
      } else {
        setError('Erro ao carregar empresas')
      }
    } catch (error) {
      console.error('Error loading companies:', error)
      setError('Erro ao carregar empresas')
    } finally {
      setLoading(false)
    }
  }

  const validateCNPJ = (cnpj: string) => {
    // Remove caracteres não numéricos
    cnpj = cnpj.replace(/[^\d]/g, '')
    
    // Verifica se tem 14 dígitos
    if (cnpj.length !== 14) return false
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cnpj)) return false
    
    // Cálculo do primeiro dígito verificador
    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cnpj[i]) * (5 - (i % 6))
    }
    let remainder = sum % 11
    const digit1 = remainder < 2 ? 0 : 11 - remainder
    
    // Cálculo do segundo dígito verificador
    sum = 0
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cnpj[i]) * (6 - (i % 6))
    }
    remainder = sum % 11
    const digit2 = remainder < 2 ? 0 : 11 - remainder
    
    // Verifica os dígitos verificadores
    return parseInt(cnpj[12]) === digit1 && parseInt(cnpj[13]) === digit2
  }

  const formatCNPJ = (value: string) => {
    // Remove caracteres não numéricos
    value = value.replace(/[^\d]/g, '')
    
    // Aplica a máscara
    if (value.length <= 2) return value
    if (value.length <= 5) return `${value.slice(0, 2)}.${value.slice(2)}`
    if (value.length <= 8) return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`
    if (value.length <= 12) return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8)}`
    return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12, 14)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate CNPJ
    if (!validateCNPJ(formData.cnpj)) {
      setError('CNPJ inválido')
      return
    }

    try {
      const token = localStorage.getItem('auth-token')
      const url = editingCompany ? '/api/admin/companies' : '/api/admin/companies'
      const method = editingCompany ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingCompany ? { ...formData, id: editingCompany.id } : formData)
      })

      if (response.ok) {
        setSuccess(editingCompany ? 'Empresa atualizada com sucesso!' : 'Empresa criada com sucesso!')
        setShowForm(false)
        setEditingCompany(null)
        setFormData({
          name: '',
          cnpj: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          plan: 'basic',
          maxUsers: 5
        })
        await loadCompanies()
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao salvar empresa')
      }
    } catch (error) {
      console.error('Error saving company:', error)
      setError('Erro ao salvar empresa')
    }
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setFormData({
      name: company.name,
      cnpj: company.cnpj,
      email: company.email,
      phone: company.phone || '',
      address: company.address || '',
      city: company.city || '',
      state: company.state || '',
      zipCode: company.zipCode || '',
      plan: company.plan,
      maxUsers: company.maxUsers
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) return

    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/admin/companies', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        setSuccess('Empresa excluída com sucesso!')
        await loadCompanies()
      } else {
        const data = await response.json()
        setError(data.error || 'Erro ao excluir empresa')
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      setError('Erro ao excluir empresa')
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

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-100 text-blue-800'
      case 'premium': return 'bg-purple-100 text-purple-800'
      case 'enterprise': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando empresas...</p>
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
              <Building className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Gestão de Empresas</h1>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Empresa
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
                {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
              </CardTitle>
              <CardDescription>
                Preencha os dados da empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome da Empresa</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formatCNPJ(formData.cnpj)}
                      onChange={(e) => setFormData({ ...formData, cnpj: e.target.value.replace(/[^\d]/g, '') })}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
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

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxUsers">Máximo de Usuários</Label>
                    <Input
                      id="maxUsers"
                      type="number"
                      value={formData.maxUsers}
                      onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="plan">Plano</Label>
                  <Select value={formData.plan} onValueChange={(value) => setFormData({ ...formData, plan: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">
                    {editingCompany ? 'Atualizar' : 'Criar'} Empresa
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingCompany(null)
                      setFormData({
                        name: '',
                        cnpj: '',
                        email: '',
                        phone: '',
                        address: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        plan: 'basic',
                        maxUsers: 5
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

        {/* Companies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(company)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(company.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="font-mono text-sm">
                  {formatCNPJ(company.cnpj)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">{company.email}</p>
                    {company.phone && (
                      <p className="text-sm text-gray-600">{company.phone}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(company.status)}>
                      {company.status === 'active' ? 'Ativa' : 
                       company.status === 'inactive' ? 'Inativa' : 'Pendente'}
                    </Badge>
                    <Badge className={getPlanColor(company.plan)}>
                      {company.plan === 'basic' ? 'Básico' : 
                       company.plan === 'premium' ? 'Premium' : 'Enterprise'}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>Máximo de usuários: {company.maxUsers}</p>
                    <p>Criada em: {new Date(company.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {companies.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma empresa cadastrada ainda.</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Primeira Empresa
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}