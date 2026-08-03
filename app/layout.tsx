import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

/**
 * Identidad del sitio para buscadores y para la vista previa al compartir.
 *
 * El título define qué es Brújula en una línea y la descripción explica cómo
 * funciona. Ninguno promete resultados ni cifras de retorno, para no contradecir
 * la neutralidad del diagnóstico.
 */
export const SITE_NAME = "Brújula"

export const SITE_TITLE = "Brújula: diagnóstico digital gratuito para tu negocio"

export const SITE_DESCRIPTION =
  "Responde unas preguntas sobre cómo vendes, atiendes y operas hoy. En minutos recibes tus hallazgos con evidencia, qué priorizar y cómo medirlo."

/**
 * `metadataBase` es indispensable para compartir: sin ella, Next emite rutas
 * relativas en `og:image` y `canonical`, y las redes no pueden resolverlas.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.somosbrujula.com.mx"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    // Las páginas internas sólo declaran su nombre y heredan la marca.
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "es_MX",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
