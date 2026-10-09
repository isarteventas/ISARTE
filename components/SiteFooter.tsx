'use client'

import Link from 'next/link'
import { Heart, Lock } from 'lucide-react'
import { siteConfig } from '@/lib/config'

export default function SiteFooter() {
  const socials = [
    { label: 'Instagram', href: siteConfig.instagram },
    { label: 'Facebook', href: siteConfig.facebook },
    { label: 'TikTok', href: siteConfig.tiktok },
  ].filter((s) => s.href)

  return (
    <footer className="mt-10 border-t border-rosa-suave bg-rosa-claro px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="" width={48} height={48} className="size-12 rounded-full" />
          <div>
            <p className="font-display text-xl text-rosa-osc">{siteConfig.name}</p>
            <p className="text-sm text-tinta-suave">Hecho a mano en Bolivia</p>
          </div>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-bold">
          <li><Link href="/creaciones/" className="inline-flex min-h-11 items-center hover:text-rosa-osc">Creaciones</Link></li>
          <li><Link href="/ropa/" className="inline-flex min-h-11 items-center hover:text-rosa-osc">Ropa</Link></li>
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-lavanda-osc hover:text-rosa-osc">
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="text-sm text-tinta-suave">
          <p>WhatsApp: {siteConfig.whatsappDisplay}</p>
          <p className="mt-1 flex items-center justify-center gap-1 sm:justify-end">
            © {new Date().getFullYear()} Isarte · Bolivia <Heart className="size-3.5 fill-rosa text-rosa" aria-hidden />
          </p>
          <p className="mt-1 text-xs text-tinta-suave sm:text-right">
            Desarrollado por{' '}
            <a
              href="https://edaisoftware.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rosa-osc hover:underline"
            >
              EDAI TECH
            </a>
          </p>
        </div>
      </div>

      <div className="mx-auto mt-6 flex max-w-7xl justify-center border-t border-rosa-suave pt-4 sm:justify-end">
        <Link href="/admin/" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-tinta-suave hover:text-rosa-osc">
          <Lock className="size-4" aria-hidden /> Acceso administradora
        </Link>
      </div>
    </footer>
  )
}
