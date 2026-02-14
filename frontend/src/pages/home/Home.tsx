import ModulesGrid from '@/components/share/ModulesGrid'
import Hero from '@/pages/home/components/Hero'

export default function Home() {
  return (
    <>
      <Hero />
      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl">Módulos de Aprendizaje</h2>
          <p className="mt-2 text-sm">
            Explora nuestros módulos diseñados para llevarte desde cero hasta
            programador.
          </p>
        </div>
        <ModulesGrid />
      </section>
    </>
  )
}
