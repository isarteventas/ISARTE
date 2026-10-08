'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductGrid from './ProductGrid'
import { fetchStoreProducts } from '@/lib/products'
import { isOffer } from '@/lib/format'
import type { Product } from '@/lib/types'

/** Ofertas y novedades de la portada. Si no hay artículos o falla la carga, no muestra nada. */
export default function LatestProducts() {
  const [products, setProducts] = useState<Product[] | null>(null)

  useEffect(() => {
    fetchStoreProducts({ limit: 24 })
      .then((list) => setProducts(list.filter((p) => !p.sold_out)))
      .catch(() => setProducts([]))
  }, [])

  if (!products || products.length === 0) return null

  const offers = products.filter(isOffer).slice(0, 4)
  const latest = products.slice(0, 4)

  return (
    <>
      {offers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
          <h2 className="mb-8 font-display text-4xl text-rosa-osc">Ofertas</h2>
          <ProductGrid products={offers} />
        </section>
      )}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl text-rosa-osc">Novedades</h2>
          <Link href="/creaciones/" className="inline-flex min-h-11 items-center gap-2 font-bold text-lavanda-osc hover:text-rosa-osc">
            Ver creaciones <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ProductGrid products={latest} />
      </section>
    </>
  )
}
