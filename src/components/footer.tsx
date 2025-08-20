"use client"

import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Facebook,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Target,
  Twitter,
  Users,
  Zap
} from "lucide-react"
import Link from "next/link"

const footerSections = [
  {
    title: "Produtos",
    links: [
      { name: "Agentes de IA", href: "/agentes", icon: Users },
      { name: "Automação Avançada", href: "/automacao", icon: Zap },
      { name: "Planos e Preços", href: "/planos", icon: Target },
      { name: "Serviços", href: "/servicos", icon: Shield }
    ]
  },
  {
    title: "Empresa",
    links: [
      { name: "Sobre Nós", href: "/sobre", icon: Sparkles },
      { name: "Cases de Sucesso", href: "/cases", icon: Target },
      { name: "Blog", href: "/blog", icon: Sparkles },
      { name: "Carreiras", href: "/carreiras", icon: Users }
    ]
  },
  {
    title: "Suporte",
    links: [
      { name: "Central de Ajuda", href: "/ajuda", icon: Shield },
      { name: "Documentação", href: "/docs", icon: Sparkles },
      { name: "Status do Sistema", href: "/status", icon: Zap },
      { name: "Contato", href: "/contato", icon: Mail }
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Termos de Uso", href: "/termos", icon: Shield },
      { name: "Privacidade", href: "/privacidade", icon: Shield },
      { name: "Cookies", href: "/cookies", icon: Shield },
      { name: "LGPD", href: "/lgpd", icon: Shield }
    ]
  }
]

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/urbandev", icon: Facebook },
  { name: "Twitter", href: "https://twitter.com/urbandev", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com/company/urbandev", icon: Linkedin },
  { name: "Instagram", href: "https://instagram.com/urbandev", icon: Instagram }
]

const contactInfo = [
  { icon: Mail, label: "contato@urbandev.com", href: "mailto:contato@urbandev.com" },
  { icon: Phone, label: "+55 51 990104506", href: "tel:+5551990104506" },
  { icon: MapPin, label: "Rio Grande do Sul, RS - Brasil", href: "#" }
]

export function Footer() {
  return (
    <footer className="bg-background border-t">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-700 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-foreground">UrbanDev</h3>
                <p className="text-sm text-muted-foreground">Agentes de IA para Negócios</p>
              </div>
            </div>
            
            <p className="text-muted-foreground max-w-md">
              Transformamos pequenos e médios negócios com agentes de IA inteligentes, 
              automação avançada e soluções personalizadas que impulsionam resultados.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-orange-600 hover:bg-orange-50 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>

            {/* Newsletter */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Receba Novidades</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Fique por dentro das últimas tendências em IA para negócios
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-foreground">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-orange-600 transition-colors group"
                    >
                      <link.icon className="h-4 w-4" />
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Bar */}
      <div className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
              {contactInfo.map((contact, index) => (
                <Link
                  key={index}
                  href={contact.href}
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-orange-600 transition-colors"
                >
                  <contact.icon className="h-4 w-4" />
                  <span>{contact.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Seguro e Confiável</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-background border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© 2025 UrbanDev. Todos os direitos reservados.</span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Made with love in Brazil</span>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <span>•</span>
                <span>CNPJ: 00.000.000/0001-00</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online</span>
              </div>
              <Link
                href="#top"
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-orange-600 transition-colors"
              >
                <span>Voltar ao topo</span>
                <ArrowRight className="h-4 w-4 rotate-[-90deg]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}