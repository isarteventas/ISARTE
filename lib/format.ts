import { BUCKET } from './supabase'
import { NEW_DAYS, siteConfig } from './config'
import type { Product } from './types'

export function formatPrice(value: number): string {
  const n = Number(value)
  return `Bs ${new Intl.NumberFormat('es-BO', { maximumFractionDigits: 2 }).format(n)}`
}

export function whatsappLink(text: string): string {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(text)}`
}

export function orderMessage(p: Product): string {
  if (p.sold_out) {
    return `Hola Isarte 💗 Vi que *${p.name}* está agotado. ¿Me avisas cuando vuelva a haber?`
  }
  return `Hola Isarte 💗 Me interesa: *${p.name}* (${formatPrice(p.price)}). ¿Está disponible?`
}

export function isNew(p: Product): boolean {
  const created = new Date(p.created_at).getTime()
  if (Number.isNaN(created)) return false
  return Date.now() - created < NEW_DAYS * 24 * 60 * 60 * 1000
}

export function isOffer(p: Product): boolean {
  return p.old_price != null && Number(p.old_price) > Number(p.price)
}

/** Saca la ruta interna del archivo a partir de su URL pública en Supabase. */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/${BUCKET}/`
  const i = url.indexOf(marker)
  if (i === -1) return null
  return decodeURIComponent(url.slice(i + marker.length).split('?')[0])
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** Porcentaje de descuento (ej. 20 para "-20%"). 0 si no hay oferta. */
export function discountPercent(p: Product): number {
  if (!isOffer(p)) return 0
  return Math.round((1 - Number(p.price) / Number(p.old_price)) * 100)
}
