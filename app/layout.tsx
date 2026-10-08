import type { Metadata, Viewport } from 'next'
import { Kaushan_Script, Nunito } from 'next/font/google'
import { siteConfig } from '@/lib/config'
import './globals.css'

const kaushan = Kaushan_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-kaushan',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description:
    'Papelería creativa, recuerdos, llaveros, agendas y ropa. Creaciones hechas a mano en Bolivia. Pídelas por WhatsApp.',
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    siteName: siteConfig.name,
    locale: 'es_BO',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fdf6f3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${kaushan.variable} ${nunito.variable}`}>
      <body>{children}</body>
    </html>
  )
}
