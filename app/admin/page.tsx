'use client'

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import LoginForm from '@/components/admin/LoginForm'
import AdminPanel from '@/components/admin/AdminPanel'

export default function AdminPage() {
  // undefined = revisando sesión, null = sin sesión
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    if (!supabase) {
      setSession(null)
      return
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (!supabase) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="font-display text-3xl text-rosa-osc">Falta conectar la base de datos</p>
        <p className="mt-3 text-tinta-suave">
          Agrega las variables de Supabase en tu hosting (mira la guía LEEME.md) y vuelve a publicar.
        </p>
      </main>
    )
  }

  if (session === undefined) {
    return <p className="py-24 text-center text-tinta-suave" aria-busy="true">Cargando…</p>
  }

  if (!session) return <LoginForm />

  return <AdminPanel email={session.user.email ?? ''} />
}
