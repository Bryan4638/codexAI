import { modulesData } from '@/data/data'
import Hero from '@/pages/home/components/Hero'
import ModuleCard from '@/pages/modules/components/ModuleCard'
import { Module } from '@/types/module'
import { useState } from 'react'

export default function Home() {
  const [moduleProgress, setModuleProgress] = useState<
    Record<string, { completed: number; total: number }>
  >({})
  const [currentView, setCurrentView] = useState<string>('home')

  const handleModuleClick = (module: Module) => {
    setCurrentView('lessons')
  }
  return (
    <>
      <Hero />
      <section className="modules-section container">
        <div className="section-header">
          <h2>Módulos de Aprendizaje</h2>
          <p>
            Explora nuestros módulos diseñados para llevarte desde cero hasta
            programador.
          </p>
        </div>
        <div className="modules-grid">
          {modulesData.map((module) => {
            const stats = moduleProgress[module.id] || {
              completed: 0,
              total: 0,
            }
            const progress =
              stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0

            return (
              <ModuleCard key={module.id} module={module} progress={progress} />
            )
          })}
        </div>
      </section>
    </>
  )
}
