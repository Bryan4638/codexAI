import Footer from '@/components/nav/Footer'
import ModulesGrid from '@/components/share/ModulesGrid'
import { IconSchool } from '@tabler/icons-react'

export default function ModulesPage() {
  return (
    <>
      <section className="py-28 max-w-7xl mx-auto px-6">
        <header className="flex flex-col justify-center items-center mb-12">
          <h2 className="text-3xl flex items-center gap-4">
            <IconSchool size={50} /> Módulos
          </h2>
          <p className="mt-2 text-sm">
            Selecciona un módulo para comenzar a aprender.
          </p>
        </header>
        <ModulesGrid />
      </section>
      <Footer />
    </>
  )
}
