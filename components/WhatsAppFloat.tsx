import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '@/lib/format'

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink('Hola Isarte 💗 Quisiera hacer una consulta.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#1f8a4c] text-white shadow-lg shadow-black/20 transition hover:scale-105 sm:right-6"
    >
      <MessageCircle className="size-7" aria-hidden />
    </a>
  )
}
