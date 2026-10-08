'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { LogOut, Pencil, Plus, Trash2 } from 'lucide-react'
import { supabase, BUCKET } from '@/lib/supabase'
import { fetchAllProducts } from '@/lib/products'
import { formatPrice, isOffer, storagePathFromUrl } from '@/lib/format'
import { sectionInfo } from '@/lib/config'
import type { Product } from '@/lib/types'
import ProductForm from './ProductForm'

type Filter = 'todos' | 'creaciones' | 'ropa'

export default function AdminPanel({ email }: { email: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Filter>('todos')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [toast, setToast] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setProducts(await fetchAllProducts())
    } catch (e) {
      console.error(e)
      setError('No se pudieron cargar los artículos. ¿Ya ejecutaste el SQL en Supabase?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function notify(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return products.filter((p) => (filter === 'todos' || p.section === filter) && (!q || p.name.toLowerCase().includes(q)))
  }, [products, filter, query])

  async function patch(p: Product, changes: Partial<Product>) {
    if (!supabase) return
    const { error } = await supabase.from('products').update(changes).eq('id', p.id)
    if (error) return notify('No se pudo actualizar. Inténtalo de nuevo.')
    setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, ...changes } : x)))
    notify('Listo ✓')
  }

  async function remove(p: Product) {
    if (!supabase) return
    if (!window.confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) return notify('No se pudo eliminar. Inténtalo de nuevo.')
    const paths = p.images.map(storagePathFromUrl).filter((x): x is string => !!x)
    if (paths.length) await supabase.storage.from(BUCKET).remove(paths)
    setProducts((list) => list.filter((x) => x.id !== p.id))
    notify('Artículo eliminado')
  }

  if (editing) {
    return (
      <ProductForm
        product={editing === 'new' ? null : editing}
        onCancel={() => setEditing(null)}
        onSaved={(msg) => {
          setEditing(null)
          notify(msg)
          load()
        }}
      />
    )
  }

  const filters: { id: Filter; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'creaciones', label: 'Creaciones' },
    { id: 'ropa', label: 'Ropa' },
  ]

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="" width={48} height={48} className="size-12 rounded-full" />
          <div>
            <h1 className="font-display text-2xl text-rosa-osc">Panel de Isarte</h1>
            <p className="text-xs text-tinta-suave">{email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full border-2 border-lavanda px-4 text-sm font-bold text-lavanda-osc hover:bg-lavanda-suave">Ver tienda</Link>
          <button
            type="button"
            onClick={() => supabase?.auth.signOut()}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-tinta px-4 text-sm font-bold text-white"
          >
            <LogOut className="size-4" aria-hidden /> Salir
          </button>
        </div>
      </header>

      <button
        type="button"
        onClick={() => setEditing('new')}
        className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-rosa-osc text-lg font-bold text-white shadow transition hover:bg-[#a33d55]"
      >
        <Plus className="size-5" aria-hidden /> Agregar artículo
      </button>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`min-h-11 rounded-full border-2 px-4 text-sm font-bold ${filter === f.id ? 'border-rosa-osc bg-rosa-osc text-white' : 'border-rosa-suave bg-white'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre…"
          aria-label="Buscar por nombre"
          className="min-h-11 flex-1 rounded-full border-2 border-rosa-suave bg-white px-4 focus:border-lavanda focus:outline-none"
        />
      </div>

      {toast && (
        <p role="status" className="fixed inset-x-4 top-4 z-50 mx-auto max-w-sm rounded-full bg-tinta px-5 py-3 text-center text-sm font-bold text-white shadow-lg">{toast}</p>
      )}

      <div className="mt-6">
        {loading && <p className="py-10 text-center text-tinta-suave" aria-busy="true">Cargando artículos…</p>}
        {error && <p role="alert" className="rounded-2xl bg-rosa-claro p-4 text-center font-bold text-rosa-osc">{error}</p>}
        {!loading && !error && shown.length === 0 && (
          <p className="rounded-3xl bg-white p-8 text-center text-tinta-suave">
            {products.length === 0 ? 'Todavía no hay artículos. ¡Agrega el primero con el botón rosado!' : 'No hay artículos con ese filtro.'}
          </p>
        )}

        <ul className="flex flex-col gap-3">
          {shown.map((p) => (
            <li key={p.id} className="rounded-3xl bg-white p-3 shadow-sm">
              <div className="flex gap-3">
                {p.images[0] ? (
                  <img src={p.images[0]} alt="" className={`size-20 shrink-0 rounded-2xl object-cover ${p.sold_out ? 'opacity-60 grayscale' : ''}`} />
                ) : (
                  <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-lavanda-suave text-xs text-lavanda-osc">Sin foto</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{p.name}</p>
                  <p className="text-xs text-tinta-suave">{sectionInfo[p.section].label} · {p.category}</p>
                  <p className="mt-1 text-sm font-extrabold text-lavanda-osc">
                    {formatPrice(p.price)}
                    {isOffer(p) && <span className="ml-2 font-normal text-tinta-suave line-through">{formatPrice(Number(p.old_price))}</span>}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => patch(p, { sold_out: !p.sold_out })}
                  className={`min-h-11 rounded-full px-4 text-sm font-bold text-white ${p.sold_out ? 'bg-tinta-suave' : 'bg-[#1f7a46]'}`}
                  title="Tocar para cambiar"
                >
                  {p.sold_out ? 'Agotado' : 'Disponible'}
                </button>
                <button
                  type="button"
                  onClick={() => patch(p, { visible: !p.visible })}
                  className={`min-h-11 rounded-full border-2 px-4 text-sm font-bold ${p.visible ? 'border-lavanda text-lavanda-osc' : 'border-tinta-suave bg-crema-osc text-tinta-suave'}`}
                  title="Tocar para cambiar"
                >
                  {p.visible ? 'Visible' : 'Oculto'}
                </button>
                <button type="button" onClick={() => setEditing(p)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-rosa-suave px-4 text-sm font-bold hover:bg-rosa-claro">
                  <Pencil className="size-4" aria-hidden /> Editar
                </button>
                <button type="button" onClick={() => remove(p)} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold text-rosa-osc hover:bg-rosa-claro">
                  <Trash2 className="size-4" aria-hidden /> Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
