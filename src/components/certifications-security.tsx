"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  CheckCircle, 
  Lock, 
  Eye, 
  Server, 
  Database,
  Award,
  Globe,
  FileText,
  Users,
  Zap,
  Clock,
  AlertTriangle,
  Check,
  ArrowRight,
  Star,
  Fingerprint,
  Key,
  Cloud,
  Network
} from "lucide-react"

interface Certification {
  id: string
  name: string
  issuer: string
  description: string
  icon: React.ReactNode
  date: string
  status: "active" | "renewing" | "expired"
  document?: string
}

interface SecurityMeasure {
  id: string
  title: string
  description: string
  category: string
  icon: React.ReactNode
  level: "essential" | "advanced" | "enterprise"
  implemented: boolean
}

interface ComplianceItem {
  id: string
  regulation: string
  description: string
  status: "compliant" | "partial" | "non-compliant"
  lastAudit: string
  nextAudit: string
}

interface CertificationsSecurityProps {
  onDocumentRequest?: (documentId: string) => void
}

export function CertificationsSecurity({ onDocumentRequest }: CertificationsSecurityProps) {
  const certifications: Certification[] = [
    {
      id: "iso27001",
      name: "ISO 27001:2022",
      issuer: "International Organization for Standardization",
      description: "Certificação internacional para sistemas de gestão de segurança da informação",
      icon: <Award className="h-6 w-6 text-blue-600" />,
      date: "2024-01-15",
      status: "active",
      document: "iso-27001-certificate.pdf"
    },
    {
      id: "soc2",
      name: "SOC 2 Type II",
      issuer: "AICPA",
      description: "Controles de segurança, disponibilidade, integridade de processamento e confidencialidade",
      icon: <Shield className="h-6 w-6 text-green-600" />,
      date: "2024-02-20",
      status: "active",
      document: "soc2-report.pdf"
    },
    {
      id: "lgpd",
      name: "LGPD Compliance",
      issuer: "ANPD",
      description: "Conformidade com Lei Geral de Proteção de Dados brasileira",
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      date: "2024-03-10",
      status: "active",
      document: "lgpd-compliance-report.pdf"
    },
    {
      id: "gdpr",
      name: "GDPR Compliance",
      issuer: "European Commission",
      description: "Conformidade com Regulamento Geral de Proteção de Dados da UE",
      icon: <Globe className="h-6 w-6 text-orange-600" />,
      date: "2024-01-28",
      status: "renewing",
      document: "gdpr-compliance.pdf"
    }
  ]

  const securityMeasures: SecurityMeasure[] = [
    {
      id: "encryption",
      title: "Criptografia End-to-End",
      description: "Todos os dados são criptografados em trânsito e em repouso usando AES-256",
      category: "Criptografia",
      icon: <Lock className="h-5 w-5 text-blue-600" />,
      level: "essential",
      implemented: true
    },
    {
      id: "mfa",
      title: "Autenticação Multifator",
      description: "MFA obrigatório para todos os usuários e acesso administrativo",
      category: "Acesso",
      icon: <Key className="h-5 w-5 text-green-600" />,
      level: "essential",
      implemented: true
    },
    {
      id: "backup",
      title: "Backup Automático",
      description: "Backups diários com retenção de 30 dias e recuperação garantida",
      category: "Recuperação",
      icon: <Database className="h-5 w-5 text-purple-600" />,
      level: "essential",
      implemented: true
    },
    {
      id: "monitoring",
      title: "Monitoramento 24/7",
      description: "Monitoramento contínuo de segurança com detecção de anomalias",
      category: "Monitoramento",
      icon: <Eye className="h-5 w-5 text-orange-600" />,
      level: "advanced",
      implemented: true
    },
    {
      id: "pentest",
      title: "Testes de Penetração",
      description: "Testes de penetração trimestrais por terceiros especializados",
      category: "Testes",
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      level: "advanced",
      implemented: true
    },
    {
      id: "audit",
      title: "Auditoria de Acesso",
      description: "Logs detalhados de acesso e ações com retenção de 2 anos",
      category: "Auditoria",
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      level: "enterprise",
      implemented: true
    },
    {
      id: "ddos",
      title: "Proteção DDoS",
      description: "Proteção avançada contra ataques de negação de serviço",
      category: "Proteção",
      icon: <Network className="h-5 w-6 text-teal-600" />,
      level: "enterprise",
      implemented: true
    },
    {
      id: "compliance",
      title: "Conformidade Contínua",
      description: "Monitoramento automatizado de conformidade regulatória",
      category: "Compliance",
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
      level: "enterprise",
      implemented: true
    }
  ]

  const complianceItems: ComplianceItem[] = [
    {
      id: "lgpd",
      regulation: "LGPD - Lei 13.709/2018",
      description: "Tratamento de dados pessoais de clientes e funcionários",
      status: "compliant",
      lastAudit: "2024-02-15",
      nextAudit: "2024-08-15"
    },
    {
      id: "pci",
      regulation: "PCI DSS",
      description: "Padrão de segurança de dados da indústria de cartões",
      status: "compliant",
      lastAudit: "2024-01-20",
      nextAudit: "2024-07-20"
    },
    {
      id: "sox",
      regulation: "SOX - Sarbanes-Oxley",
      description: "Controles financeiros e governança corporativa",
      status: "partial",
      lastAudit: "2024-01-10",
      nextAudit: "2024-07-10"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "compliant":
        return "bg-green-100 text-green-800"
      case "renewing":
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
      case "non-compliant":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Ativo"
      case "renewing": return "Em Renovação"
      case "expired": return "Expirado"
      case "compliant": return "Conforme"
      case "partial": return "Parcial"
      case "non-compliant": return "Não Conforme"
      default: return "Desconhecido"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "essential": return "bg-blue-100 text-blue-800"
      case "advanced": return "bg-purple-100 text-purple-800"
      case "enterprise": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case "essential": return "Essencial"
      case "advanced": return "Avançado"
      case "enterprise": return "Enterprise"
      default: return "Básico"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Certificações e Segurança</h2>
        <p className="text-lg text-muted-foreground">
          Compromisso com a segurança, conformidade e proteção de seus dados
        </p>
      </div>

      {/* Hero Stats */}
      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">99.99%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">256-bit</div>
              <div className="text-blue-100">Criptografia</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Monitoramento</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-blue-100">SLA Garantido</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Certificações</span>
          </CardTitle>
          <CardDescription>
            Reconhecimento internacional por nossas práticas de segurança e qualidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {certifications.map((cert) => (
              <Card key={cert.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {cert.icon}
                      <div>
                        <CardTitle className="text-lg">{cert.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {cert.issuer}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(cert.status)}>
                      {getStatusText(cert.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {cert.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Validade: {formatDate(cert.date)}
                    </div>
                    {cert.document && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDocumentRequest?.(cert.document)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Ver Certificado
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Measures */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Medidas de Segurança</span>
          </CardTitle>
          <CardDescription>
            Camadas de proteção para garantir a segurança de seus dados e operações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityMeasures.map((measure) => (
              <Card key={measure.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {measure.icon}
                      <CardTitle className="text-base">{measure.title}</CardTitle>
                    </div>
                    {measure.implemented ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {measure.category}
                    </Badge>
                    <Badge className={`text-xs ${getLevelColor(measure.level)}`}>
                      {getLevelText(measure.level)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {measure.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Conformidade Regulatória</span>
          </CardTitle>
          <CardDescription>
            Atendimento às principais regulamentações de proteção de dados e segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{item.regulation}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div>
                      Última auditoria: {formatDate(item.lastAudit)}
                    </div>
                    <div>
                      Próxima auditoria: {formatDate(item.nextAudit)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Recursos de Segurança Adicionais</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Fingerprint className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Biometria</h4>
              <p className="text-sm text-muted-foreground">
                Autenticação biométrica para acesso seguro
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Cloud className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Segurança na Nuvem</h4>
              <p className="text-sm text-muted-foreground">
                Infraestrutura cloud com segurança enterprise
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Resposta Rápida</h4>
              <p className="text-sm text-muted-foreground">
                Time de segurança disponível 24/7
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 dark:bg-orange-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Atualizações</h4>
              <p className="text-sm text-muted-foreground">
                Sistema sempre atualizado com últimas correções
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SLA and Guarantees */}
      <Card className="mb-8 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Garantias e SLA</span>
          </CardTitle>
          <CardDescription className="text-green-100">
            Compromisso formal com a qualidade e disponibilidade do serviço
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">SLA - Service Level Agreement</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>99.99% de disponibilidade</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Tempo de resposta &lt; 15 minutos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Resolução crítica &lt; 4 horas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Monitoramento proativo 24/7</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Garantias</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>30 dias de teste grátis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Cancelamento a qualquer momento</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Reembolso garantido</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Suporte premium incluso</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
              <FileText className="mr-2 h-4 w-4" />
              Baixar SLA Completo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Security Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Equipe de Segurança</span>
          </CardTitle>
          <CardDescription>
            Dúvidas sobre segurança? Nossa equipe especializada está à disposição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Entre em contato com nosso time de segurança para informações detalhadas sobre nossas práticas e políticas
            </p>
            <Button>
              Falar com Especialista de Segurança
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}