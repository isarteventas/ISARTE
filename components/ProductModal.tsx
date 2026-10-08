'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Share2, X } from 'lucide-react'
import ImageCarousel from './ImageCarousel'
import { Availability, Badges, OrderButton, Price } from './ProductCard'
import { formatPrice } from '@/lib/format'
import { sectionInfo } from '@/lib/config'
import type { Product } from '@/lib/types'

export default function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  async function share() {
    const url = `${window.location.origin}${sectionInfo[product.section].path}/?p=${product.id}`
    const text = `${product.name} · ${formatPrice(product.price)} — Isarte Creaciones`
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text, url })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      /* la persona canceló: no pasa nada */
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/50 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        onClick={(e) => e.stopPropagation()}
        className="relative grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-crema shadow-2xl sm:rounded-3xl md:grid-cols-2"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex size-11 items-center justify-center rounded-full bg-white/90 shadow"
        >
          <X className="size-5" />
        </button>

        <div className="relative">
          <ImageCarousel
            images={product.images}
            alt={product.name}
            dim={product.sold_out}
            eager
            className="aspect-square w-full md:h-full md:min-h-[420px] md:aspect-auto"
          />
          <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
            <Badges product={product} />
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6">
          <p className="text-xs font-bold uppercase tracking-wider text-rosa-osc">{product.category}</p>
          <h2 className="font-display text-3xl leading-tight">{product.name}</h2>
          <Price product={product} large />
          <Availability product={product} />
          {product.note && <p className="whitespace-pre-line leading-relaxed text-tinta-suave">{product.note}</p>}

          {product.section === 'ropa' && product.sizes.length > 0 && (
            <div>
              <p className="mb-1.5 text-sm font-bold">Tallas disponibles</p>
              <p className="flex flex-wrap gap-1.5">
                {product.sizes.map((s) => (
                  <span key={s} className="rounded-full bg-lavanda-suave px-3 py-1 text-sm font-bold text-lavanda-osc">
                    {s}
                  </span>
                ))}
              </p>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2 pt-3">
            <OrderButton product={product} />
            <button
              type="button"
              onClick={share}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-lavanda px-5 py-2 text-sm font-bold text-lavanda-osc transition hover:bg-lavanda-suave"
            >
              {copied ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
              {copied ? '¡Enlace copiado!' : 'Compartir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
