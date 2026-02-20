import ModulesGrid from '@/components/share/ModulesGrid'

export default function ModulesPage() {
  return (
    <section className="py-28 max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl">Todos los Módulos</h2>
        <p className="mt-2 text-sm">
          Selecciona un módulo para comenzar a aprender.
        </p>
      </div>
      <ModulesGrid />
    </section>
  )
}
