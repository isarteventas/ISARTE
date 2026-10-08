export type Section = 'creaciones' | 'ropa'

export interface Product {
  id: string
  section: Section
  category: string
  name: string
  note: string | null
  price: number
  old_price: number | null
  sizes: string[]
  images: string[]
  sold_out: boolean
  visible: boolean
  created_at: string
}
