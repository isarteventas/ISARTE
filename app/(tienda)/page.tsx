import Link from 'next/link'
import { ArrowRight, Gift, KeyRound, MessageCircle, NotebookPen, Shirt, Sparkles } from 'lucide-react'
import LatestProducts from '@/components/LatestProducts'
import { siteConfig } from '@/lib/config'
import { whatsappLink } from '@/lib/format'

const tiles = [
  { label: 'Papelería creativa', href: '/creaciones/?cat=Papelería creativa', Icon: NotebookPen, bg: 'bg-lavanda-suave' },
  { label: 'Recuerdos', href: '/creaciones/?cat=Recuerdos', Icon: Gift, bg: 'bg-rosa-claro' },
  { label: 'Llaveros', href: '/creaciones/?cat=Llaveros', Icon: KeyRound, bg: 'bg-lavanda-suave' },
  { label: 'Agendas', href: '/creaciones/?cat=Agendas', Icon: Sparkles, bg: 'bg-rosa-claro' },
  { label: 'Ropa', href: '/ropa/', Icon: Shirt, bg: 'bg-lavanda-suave' },
]

const steps = [
  { n: '1', title: 'Elige', text: 'Mira las creaciones y la ropa, y toca la que más te guste.' },
  { n: '2', title: 'Escríbenos', text: 'Pulsa "Pedir por WhatsApp": el mensaje ya sale escrito.' },
  { n: '3', title: 'Coordina', text: 'Acordamos el pago y la entrega. ¡Y listo, hecho con amor!' },
]

export default function HomePage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-8 md:grid-cols-2 lg:py-20">
        <div className="text-center md:text-left">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-lavanda-osc">Hecho a mano en Bolivia</p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-rosa-osc sm:text-6xl">
            Pequeñas cosas, grandes emociones.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-tinta-suave md:mx-0">
            Papelería creativa, recuerdos, llaveros, agendas y ropa. Cada pieza se hace con cariño y pensando en ti.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row md:justify-start">
            <Link
              href="/creaciones/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rosa-osc px-7 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#a33d55]"
            >
              Ver creaciones <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href="/ropa/"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-lavanda px-7 font-bold text-lavanda-osc transition hover:bg-lavanda-suave"
            >
              Ver ropa
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="rounded-full bg-gradient-to-br from-rosa-suave to-lavanda-suave p-3 shadow-xl">
            <img src="/logo.png" alt="Isarte creaciones: papelería creativa, recuerdos, llaveros y agendas" width={560} height={560} className="w-full rounded-full" />
          </div>
        </div>
      </section>

      <section aria-labelledby="que-buscas" className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <h2 id="que-buscas" className="mb-6 text-center font-display text-4xl text-rosa-osc">¿Qué estás buscando?</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {tiles.map(({ label, href, Icon, bg }) => (
            <li key={label}>
              <Link
                href={href}
                className={`flex min-h-32 flex-col items-center justify-center gap-3 rounded-3xl ${bg} p-4 text-center font-bold transition hover:-translate-y-1 hover:shadow-md`}
              >
                <Icon className="size-8 text-rosa-osc" aria-hidden />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <LatestProducts />

      <section id="como-comprar" className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <h2 className="mb-8 text-center font-display text-4xl text-rosa-osc">Cómo comprar</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-3xl bg-white p-6 text-center shadow-sm">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-rosa-osc font-display text-2xl text-white">{s.n}</span>
              <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
              <p className="mt-1 text-tinta-suave">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <div className="rounded-[2rem] bg-lavanda-suave px-6 py-10 text-center">
          <h2 className="font-display text-3xl text-lavanda-osc sm:text-4xl">¿Tienes una idea especial?</h2>
          <p className="mx-auto mt-3 max-w-xl text-tinta-suave">
            Cuéntanos qué imaginas (colores, nombres, fechas) y lo hacemos para ti.
          </p>
          <a
            href={whatsappLink('Hola Isarte 💗 Tengo una idea para un encargo especial:')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-lavanda-osc px-7 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#5e4780]"
          >
            <MessageCircle className="size-5" aria-hidden /> Escríbenos por WhatsApp
          </a>
        </div>
      </section>

      <section id="sobre-mi" className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-8">
        <h2 className="font-display text-4xl text-rosa-osc">{siteConfig.aboutTitle}</h2>
        <p className="mt-4 text-lg leading-relaxed text-tinta-suave">{siteConfig.aboutText}</p>
      </section>
    </>
  )
}
