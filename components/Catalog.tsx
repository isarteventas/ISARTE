'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { MessageCircle, Search } from 'lucide-react'
import ProductGrid from './ProductGrid'
import { categories } from '@/lib/config'
import { fetchStoreProducts } from '@/lib/products'
import { whatsappLink } from '@/lib/format'
import type { Product, Section } from '@/lib/types'

interface Props {
  section: Section
  title: string
  subtitle: string
}

export default function Catalog({ section, title, subtitle }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState('Todo')
  const [query, setQuery] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setProducts(await fetchStoreProducts({ section }))
    } catch (e) {
      setError(e instanceof Error && e.message === 'SUPABASE_NO_CONFIG' ? 'no-config' : 'error')
    } finally {
      setLoading(false)
    }
  }, [section])

  useEffect(() => {
    load()
  }, [load])

  // Permite entrar directo a una categoría: /creaciones?cat=Llaveros
  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get('cat')
    if (cat) setCategory(cat)
  }, [])

  // Categorías de la configuración + cualquier otra que exista en los datos
  const chips = useMemo(() => {
    const extra = products.map((p) => p.category).filter((c) => c && !categories[section].includes(c))
    return ['Todo', ...categories[section], ...Array.from(new Set(extra))]
  }, [products, section])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter(
      (p) =>
        (category === 'Todo' || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q) || (p.note ?? '').toLowerCase().includes(q)),
    )
  }, [products, category, query])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 lg:py-14">
      <div className="text-center">
        <h1 className="font-display text-5xl text-rosa-osc sm:text-6xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-tinta-suave">{subtitle}</p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <label className="relative mx-auto block w-full max-w-md">
          <span className="sr-only">Buscar por nombre</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-tinta-suave" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre…"
            className="min-h-12 w-full rounded-full border-2 border-rosa-suave bg-white pl-12 pr-4 text-base placeholder:text-tinta-suave/70 focus:border-lavanda focus:outline-none"
          />
        </label>

        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`min-h-11 shrink-0 whitespace-nowrap rounded-full border-2 px-4 text-sm font-bold transition ${
                category === c
                  ? 'border-rosa-osc bg-rosa-osc text-white'
                  : 'border-rosa-suave bg-white text-tinta hover:border-rosa'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        {loading && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-3xl bg-rosa-suave/60" />
                <div className="mt-3 h-3 w-1/3 rounded bg-rosa-suave/60" />
                <div className="mt-2 h-5 w-3/4 rounded bg-rosa-suave/60" />
                <div className="mt-2 h-5 w-1/2 rounded bg-lavanda-suave" />
              </div>
            ))}
          </div>
        )}

        {!loading && error === 'no-config' && (
          <Message
            title="Falta conectar la base de datos"
            text="Aún no se configuraron las variables de Supabase. Sigue la guía y vuelve a publicar."
          />
        )}

        {!loading && error === 'error' && (
          <Message title="No pudimos cargar los artículos" text="Revisa tu conexión e inténtalo de nuevo.">
            <button
              type="button"
              onClick={load}
              className="mt-4 min-h-11 rounded-full bg-rosa-osc px-6 font-bold text-white hover:bg-[#a33d55]"
            >
              Reintentar
            </button>
          </Message>
        )}

        {!loading && !error && products.length === 0 && (
          <Message title="Muy pronto subiremos nuevas creaciones 💗" text="Mientras tanto, cuéntanos qué te gustaría y lo hacemos para ti.">
            <a
              href={whatsappLink('Hola Isarte 💗 Quisiera consultar por sus creaciones.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-rosa-osc px-6 font-bold text-white hover:bg-[#a33d55]"
            >
              <MessageCircle className="size-4" aria-hidden /> Escríbenos por WhatsApp
            </a>
          </Message>
        )}

        {!loading && !error && products.length > 0 && filtered.length === 0 && (
          <Message title="No encontramos nada con ese filtro" text="Prueba con otra categoría o borra lo que escribiste en el buscador.">
            <button
              type="button"
              onClick={() => {
                setCategory('Todo')
                setQuery('')
              }}
              className="mt-4 min-h-11 rounded-full border-2 border-lavanda px-6 font-bold text-lavanda-osc hover:bg-lavanda-suave"
            >
              Ver todo
            </button>
          </Message>
        )}

        {!loading && !error && filtered.length > 0 && <ProductGrid products={filtered} />}
      </div>
    </section>
  )
}

function Message({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white px-6 py-10 text-center shadow-sm">
      <p className="font-display text-2xl text-rosa-osc">{title}</p>
      <p className="mt-2 text-tinta-suave">{text}</p>
      {children}
    </div>
  )
}
