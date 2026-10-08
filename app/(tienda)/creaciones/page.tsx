import type { Metadata } from 'next'
import Catalog from '@/components/Catalog'

export const metadata: Metadata = {
  title: 'Creaciones | Isarte Creaciones',
  description: 'Papelería creativa, recuerdos, llaveros y agendas hechos a mano.',
}

export default function CreacionesPage() {
  return (
    <Catalog
      section="creaciones"
      title="Creaciones"
      subtitle="Papelería creativa, recuerdos, llaveros y agendas hechos a mano, uno por uno."
    />
  )
}
