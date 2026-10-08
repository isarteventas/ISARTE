# Isarte Creaciones — Guía para publicar tu tienda

Esta guía es paso a paso y no necesitas saber programar. Tiempo estimado: 1 tarde.

## Lo que tienes
- Tienda con dos pestañas: **Creaciones** y **Ropa**.
- Cada artículo muestra: fotos en carrusel (cambian solas), nombre, precio en Bs, comentario, si está **Disponible o Agotado**, etiquetas **Nuevo** y **Oferta**, y botón "Pedir por WhatsApp".
- Panel de administración en `/admin` (enlace "Acceso administradora" al final de toda la página).
- Tus datos ya están puestos: WhatsApp **+591 69356148** y tu TikTok. Para agregar Instagram o Facebook, edita `lib/config.ts`.

---

## PASO 1 — Crear la base de datos en Supabase
1. Entra a https://supabase.com y crea tu cuenta.
2. **New project**: ponle nombre (ej. `isarte`), crea una contraseña de base de datos (guárdala) y elige la región más cercana (ej. *South America (São Paulo)*).
3. Espera 1–2 minutos a que se cree.

## PASO 2 — Crear las tablas y la carpeta de fotos
1. En Supabase, menú izquierdo: **SQL Editor** → **New query**.
2. Abre el archivo `supabase/setup.sql` de este proyecto, copia TODO y pégalo.
3. Pulsa **Run**. Debe decir "Success".

## PASO 3 — Crear tu usuario administradora
1. Menú **Authentication** → **Users** → **Add user** → **Create new user**.
2. Escribe tu correo y una contraseña segura. Marca **Auto Confirm User**.

## PASO 4 — IMPORTANTE: cerrar los registros públicos
Para que nadie más pueda crear una cuenta y entrar al panel:
1. **Authentication** → **Sign In / Providers** (o *Settings*).
2. Apaga **"Allow new users to sign up"** y guarda.

## PASO 5 — Copiar tus llaves de Supabase
1. **Project Settings** (engranaje) → **API** (o *API Keys*).
2. Copia:
   - **Project URL** → será `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / publishable key** (clave pública) → será `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. ⚠️ NO uses la clave `service_role` / `secret`. Esa nunca va en la página.

## PASO 6 — Subir el proyecto a GitHub
1. Crea cuenta en https://github.com y un repositorio nuevo (ej. `isarte-tienda`), privado.
2. Pulsa **uploading an existing file** y arrastra el contenido de esta carpeta (no subas `node_modules`).
3. **Commit changes**.

## PASO 7 — Publicar en Vercel
1. Entra a https://vercel.com con tu cuenta de GitHub.
2. **Add New → Project** → elige el repositorio `isarte-tienda` → **Import**.
3. En **Environment Variables** agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu clave pública
   - `NEXT_PUBLIC_SITE_URL` = la dirección final (ej. `https://isarte.vercel.app`) — opcional, mejora cómo se ve al compartir por WhatsApp.
4. **Deploy**. En un minuto tendrás tu enlace.
   - Si cambias variables después, hay que hacer **Redeploy**.

## PASO 8 — Probar en tu celular
- [ ] Abre tu enlace y baja hasta el final → **Acceso administradora**.
- [ ] Inicia sesión con tu correo y contraseña.
- [ ] **Agregar artículo** → elige pestaña, escribe nombre, precio y comentario.
- [ ] Toca **Tomar foto** y también **Elegir de galería** (varias a la vez). Verás cuánto pesaba cada foto y cuánto quedó.
- [ ] Prueba una prenda en **Ropa** con tallas.
- [ ] Prueba el interruptor **En promoción** y el de **Disponible**.
- [ ] Guarda y mira la tienda: ¿el carrusel cambia solo? ¿el botón de WhatsApp abre el mensaje con el nombre y precio?
- [ ] En el panel, edita ese artículo y marca Agotado desde la lista.

## Dominio propio (opcional)
Compra un dominio (ej. isartecreaciones.com) y en Vercel: **Settings → Domains → Add**.

---

## Cosas que debes saber
- **Supabase gratis se pausa** si pasa ~1 semana sin actividad. Entra al panel de vez en cuando, o revisa su plan de pago.
- **Vercel gratis (Hobby)** es para uso personal; como vendes, revisa sus términos y considera el plan Pro.
- La página **no cobra en línea**: el pago se coordina por WhatsApp.
- Si olvidas la contraseña: Supabase → Authentication → Users → tu usuario → enviar enlace de recuperación, o cambiarla ahí.
- Las fotos se reducen a máx. 1200 px y ~300 KB (formato JPG) antes de subirse.

## Para cambiar textos o datos
Todo lo personal está en `lib/config.ts`: WhatsApp, Instagram, Facebook, TikTok, texto de "Sobre mí", categorías y tallas.
