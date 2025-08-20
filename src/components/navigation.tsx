"use client"
import { useAuth } from "@/components/auth-provider"
import { ComingSoonPopup } from "@/components/coming-soon-popup"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import {
  Bot,
  Home,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Moon,
  Play,
  Settings,
  Sparkles,
  Sun,
  User,
  Workflow,
  Zap,
  BookOpen,
  Database
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Demonstração", href: "/demonstracao", icon: Play },
  { name: "Agentes de IA", href: "/agentes", icon: Bot },
  { name: "Automação Avançada", href: "/automacao", icon: Zap },
  { name: "Serviços", href: "/servicos", icon: Settings },
  { name: "Planos", href: "/planos", icon: Workflow },
  { name: "Doc", href: "/doc", icon: BookOpen },
  { name: "Contato", href: "/contato", icon: Mail },
]

export function Navigation() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)
  const { user, loading, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-700 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground">
              UrbanDev
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-orange-600",       
                  pathname === item.href
                    ? "text-orange-600"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>

          {/* User Authentication */}
          {loading ? (
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse" />
          ) : user ? (
            <div className="hidden md:flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {(user as any).user_metadata?.full_name || user.name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Já Sou Cliente
                </Link>
              </Button>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" asChild>
                <Link href="/register">
                  <User className="h-4 w-4 mr-2" />
                  Cadastre-se
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-700 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-xl text-foreground">
                      UrbanDev
                    </span>
                  </Link>
                </div>

                <nav className="flex flex-col space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors hover:text-orange-600 hover:bg-accent",
                          pathname === item.href
                            ? "text-orange-600 bg-accent"
                            : "text-muted-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </nav>

                <div className="flex flex-col space-y-2 pt-4 border-t">
                  {user ? (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/admin">
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          signOut()
                          setIsOpen(false)
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start w-full"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/admin/login">
                          <LogIn className="h-4 w-4 mr-2" />
                          Já Sou Cliente
                        </Link>
                      </Button>
                      <Button
                        className="justify-start w-full bg-orange-500 hover:bg-orange-600 text-white"
                        asChild
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/register">
                          <User className="h-4 w-4 mr-2" />
                          Cadastre-se
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}