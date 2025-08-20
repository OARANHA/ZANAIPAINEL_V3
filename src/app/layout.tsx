import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "urbanDev - Soluções em IA e Desenvolvimento Web",
  description: "Transformação digital com inteligência artificial e websites institucionais modernos",
  keywords: ["urbanDev", "IA", "Inteligência Artificial", "Desenvolvimento Web", "Next.js", "TypeScript", "Agentes de IA"],
  authors: [{ name: "urbanDev Team" }],
  openGraph: {
    title: "urbanDev - Soluções em IA e Desenvolvimento Web",
    description: "Transformação digital com inteligência artificial e websites institucionais modernos",
    url: "https://urbandev.com",
    siteName: "urbanDev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "urbanDev - Soluções em IA e Desenvolvimento Web",
    description: "Transformação digital com inteligência artificial e websites institucionais modernos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
