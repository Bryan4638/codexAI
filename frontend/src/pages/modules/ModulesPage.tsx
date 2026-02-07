import { modulesData } from '@/data/data'
import ModuleCard from '@/pages/modules/components/ModuleCard'
import { useState } from 'react'

export default function ModulesPage() {
  const [moduleProgress, setModuleProgress] = useState<
    Record<string, { completed: number; total: number }>
  >({})

  return (
    <section
      className="modules-section container"
      style={{ paddingTop: '120px' }}
    >
      <div className="section-header">
        <h2>Todos los Módulos</h2>
        <p>Selecciona un módulo para comenzar a aprender.</p>
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
  )
}
