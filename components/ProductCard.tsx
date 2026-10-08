'use client'

import { MessageCircle, BellRing } from 'lucide-react'
import ImageCarousel from './ImageCarousel'
import { discountPercent, formatPrice, isNew, isOffer, orderMessage, whatsappLink } from '@/lib/format'
import type { Product } from '@/lib/types'

export function Badges({ product }: { product: Product }) {
  return (
    <>
      {product.sold_out && (
        <span className="rounded-full bg-tinta px-3 py-1 text-xs font-bold text-white shadow">Agotado</span>
      )}
      {!product.sold_out && isNew(product) && (
        <span className="rounded-full bg-lavanda-osc px-3 py-1 text-xs font-bold text-white shadow">Nuevo</span>
      )}
      {!product.sold_out && isOffer(product) && (
        <span className="rounded-full bg-rosa-osc px-3 py-1 text-xs font-bold text-white shadow">Oferta -{discountPercent(product)}%</span>
      )}
    </>
  )
}

export function Price({ product, large = false }: { product: Product; large?: boolean }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`font-extrabold text-lavanda-osc ${large ? 'text-2xl' : 'text-lg'}`}>
        {formatPrice(product.price)}
      </span>
      {isOffer(product) && (
        <span className="text-sm text-tinta-suave line-through">{formatPrice(Number(product.old_price))}</span>
      )}
    </p>
  )
}

export function Availability({ product }: { product: Product }) {
  const soldOut = product.sold_out
  return (
    <p className={`inline-flex items-center gap-1.5 text-sm font-bold ${soldOut ? 'text-tinta-suave' : 'text-[#1f7a46]'}`}>
      <span className={`size-2.5 rounded-full ${soldOut ? 'bg-tinta-suave' : 'bg-[#2fa862]'}`} aria-hidden />
      {soldOut ? 'Agotado' : 'Disponible'}
    </p>
  )
}

export function OrderButton({ product, className = '' }: { product: Product; className?: string }) {
  const soldOut = product.sold_out
  return (
    <a
      href={whatsappLink(orderMessage(product))}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 ${
        soldOut ? 'bg-lavanda-osc hover:bg-[#5e4780]' : 'bg-rosa-osc hover:bg-[#a33d55]'
      } ${className}`}
    >
      {soldOut ? <BellRing className="size-4" aria-hidden /> : <MessageCircle className="size-4" aria-hidden />}
      {soldOut ? 'Avísame cuando haya' : 'Pedir por WhatsApp'}
    </a>
  )
}

export default function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  return (
    <article className="flex flex-col">
      <div className="relative">
        <ImageCarousel
          images={product.images}
          alt={product.name}
          onOpen={onOpen}
          dim={product.sold_out}
          className="aspect-[4/5] rounded-3xl"
        />
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <Badges product={product} />
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs font-bold uppercase tracking-wider text-rosa-osc">{product.category}</p>
        <h3 className="mt-0.5 text-lg font-bold leading-snug">
          <button type="button" onClick={onOpen} className="text-left hover:text-rosa-osc">
            {product.name}
          </button>
        </h3>
        {product.note && <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-tinta-suave">{product.note}</p>}

        {product.section === 'ropa' && product.sizes.length > 0 && (
          <p className="mt-2 flex flex-wrap gap-1" aria-label="Tallas disponibles">
            {product.sizes.map((s) => (
              <span key={s} className="rounded-full bg-lavanda-suave px-2.5 py-0.5 text-xs font-bold text-lavanda-osc">
                {s}
              </span>
            ))}
          </p>
        )}

        <div className="mt-2">
          <Price product={product} />
          <Availability product={product} />
        </div>
        <div className="mt-3 pt-0">
          <OrderButton product={product} />
        </div>
      </div>
    </article>
  )
}
