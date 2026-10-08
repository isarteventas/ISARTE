'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { siteConfig } from '@/lib/config'
import { whatsappLink } from '@/lib/format'

const tabs = [
  { href: '/', label: 'Inicio' },
  { href: '/creaciones/', label: 'Creaciones' },
  { href: '/ropa/', label: 'Ropa' },
]

export default function SiteHeader() {
  const pathname = usePathname() || '/'
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.replace(/\/$/, '') === href.replace(/\/$/, '')

  return (
    <header className="sticky top-0 z-30 border-b border-rosa-suave/70 bg-crema/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={`${siteConfig.name}, ir al inicio`}>
          <img src="/logo.png" alt="" width={56} height={56} className="size-12 rounded-full sm:size-14" />
          <span className="leading-none">
            <span className="block font-display text-2xl text-rosa-osc">Isarte</span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.3em] text-lavanda-osc">creaciones</span>
          </span>
        </Link>

        <nav aria-label="Secciones" className="hidden items-center gap-2 sm:flex">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              aria-current={isActive(t.href) ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center rounded-full px-5 font-bold transition ${
                isActive(t.href) ? 'bg-rosa-osc text-white' : 'text-tinta hover:bg-rosa-claro'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappLink('Hola Isarte 💗')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-lavanda-osc px-4 font-bold text-white hover:bg-[#5e4780]"
        >
          <MessageCircle className="size-4" aria-hidden />
          <span className="hidden sm:inline">WhatsApp</span>
          <span className="sr-only sm:hidden">WhatsApp</span>
        </a>
      </div>

      {/* Pestañas siempre visibles en celular */}
      <nav aria-label="Secciones" className="flex gap-2 px-4 pb-2 sm:hidden">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            aria-current={isActive(t.href) ? 'page' : undefined}
            className={`flex min-h-11 flex-1 items-center justify-center rounded-full text-sm font-bold transition ${
              isActive(t.href) ? 'bg-rosa-osc text-white' : 'bg-white text-tinta ring-2 ring-rosa-suave'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
