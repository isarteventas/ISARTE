import { supabase } from './supabase'
import type { Product, Section } from './types'

function normalize(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    section: row.section as Section,
    category: String(row.category ?? ''),
    name: String(row.name ?? ''),
    note: (row.note as string | null) ?? null,
    price: Number(row.price ?? 0),
    old_price: row.old_price == null ? null : Number(row.old_price),
    sizes: Array.isArray(row.sizes) ? (row.sizes as string[]) : [],
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    sold_out: Boolean(row.sold_out),
    visible: Boolean(row.visible),
    created_at: String(row.created_at ?? ''),
  }
}

/** Artículos visibles de la tienda. Los disponibles van primero, los agotados al final. */
export async function fetchStoreProducts(opts: { section?: Section; limit?: number } = {}): Promise<Product[]> {
  if (!supabase) throw new Error('SUPABASE_NO_CONFIG')
  let query = supabase.from('products').select('*').eq('visible', true).order('created_at', { ascending: false })
  if (opts.section) query = query.eq('section', opts.section)
  if (opts.limit) query = query.limit(opts.limit)
  const { data, error } = await query
  if (error) throw error
  const list = (data ?? []).map(normalize)
  return list.sort((a, b) => Number(a.sold_out) - Number(b.sold_out))
}

/** Todos los artículos (incluye ocultos). Solo funciona con la sesión del administrador. */
export async function fetchAllProducts(): Promise<Product[]> {
  if (!supabase) throw new Error('SUPABASE_NO_CONFIG')
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(normalize)
}
