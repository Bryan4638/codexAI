import ModuleCard from '@/pages/modules/components/ModuleCard'
import { moduleApi } from '@/services/endpoints/module'
import { Module } from '@/types/module'
import { useEffect, useState } from 'react'

export default function ModulesPage() {
  const [moduleProgress] = useState<
    Record<string, { completed: number; total: number }>
  >({})
  const [allModules, setAllModules] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadModules()
  }, [])

  const loadModules = async () => {
    try {
      const [all] = await Promise.all([moduleApi.getAll()])
      setAllModules(all || [])
    } catch (error) {
      console.error('Error cargando modulos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="pt-32 max-w-7xl mx-auto px-6 text-center">
        <p>Cargando modulos...</p>
      </section>
    )
  }

  return (
    <section className="pt-32 max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl">Todos los Módulos</h2>
        <p className="mt-2 text-sm">
          Selecciona un módulo para comenzar a aprender.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {allModules.map((module: Module) => {
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
