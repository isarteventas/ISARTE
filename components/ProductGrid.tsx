'use client'

import { useCallback, useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'
import type { Product } from '@/lib/types'

/** Cuadrícula de tarjetas + vista ampliada. Si la URL trae ?p=ID abre ese artículo. */
export default function ProductGrid({ products }: { products: Product[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('p')
    if (id) setOpenId(id)
  }, [])

  const close = useCallback(() => setOpenId(null), [])
  const selected = products.find((p) => p.id === openId) ?? null

  return (
    <>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={() => setOpenId(p.id)} />
        ))}
      </div>
      {selected && <ProductModal product={selected} onClose={close} />}
    </>
  )
}
