/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sitio 100% estático: funciona igual en Cloudflare, Netlify, Vercel o cualquier hosting.
  // Los datos se leen desde Supabase en el navegador.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
