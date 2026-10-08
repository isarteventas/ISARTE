'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) setError('Correo o contraseña incorrectos. Inténtalo de nuevo.')
    setBusy(false)
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <div className="text-center">
        <img src="/logo.png" alt="" width={96} height={96} className="mx-auto size-24 rounded-full" />
        <h1 className="mt-4 font-display text-4xl text-rosa-osc">Panel de Isarte</h1>
        <p className="mt-1 text-tinta-suave">Ingresa para agregar y editar tus artículos.</p>
      </div>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-1.5 text-sm font-bold">
          Correo
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-12 rounded-2xl border-2 border-rosa-suave px-4 text-base font-normal focus:border-lavanda focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-bold">
          Contraseña
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-12 rounded-2xl border-2 border-rosa-suave px-4 text-base font-normal focus:border-lavanda focus:outline-none"
          />
        </label>
        {error && <p role="alert" className="rounded-xl bg-rosa-claro px-4 py-2 text-sm font-bold text-rosa-osc">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rosa-osc font-bold text-white transition hover:bg-[#a33d55] disabled:opacity-60"
        >
          <Lock className="size-4" aria-hidden /> {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <Link href="/" className="mt-6 text-center font-bold text-lavanda-osc hover:text-rosa-osc">← Volver a la tienda</Link>
    </main>
  )
}
