import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import WhatsAppFloat from '@/components/WhatsAppFloat'

export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}
