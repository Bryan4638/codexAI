import Footer from '@/components/nav/Footer'
import PageHeader from '@/components/share/PageHeader'
import ModulesGrid from '@/pages/modules/components/ModulesGrid'

export default function ModulesPage() {
  return (
    <>
      <section className="py-28 max-w-7xl mx-auto px-6">
        <PageHeader
          title="Módulos"
          subtitle="Selecciona un módulo para comenzar a aprender."
        />
        <ModulesGrid />
      </section>
      <Footer />
    </>
  )
}
