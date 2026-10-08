import type { Metadata } from 'next'
import Catalog from '@/components/Catalog'

export const metadata: Metadata = {
  title: 'Ropa | Isarte Creaciones',
  description: 'Ropa con detalles especiales. Mira las tallas disponibles y pide por WhatsApp.',
}

export default function RopaPage() {
  return (
    <Catalog
      section="ropa"
      title="Ropa"
      subtitle="Prendas con detalles especiales. Mira las tallas disponibles y pídelas por WhatsApp."
    />
  )
}
