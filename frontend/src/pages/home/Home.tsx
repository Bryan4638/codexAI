import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import { useModules } from '@/hooks/useModules'
import Hero from '@/pages/home/components/Hero'
import ModuleCard from '@/pages/modules/components/ModuleCard'
import { Module } from '@/types/module'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const [moduleProgress] = useState<
    Record<string, { completed: number; total: number }>
  >({})
  const navigate = useNavigate()
  const { data, isLoading, error } = useModules().getModules

  if (isLoading) return <Loading section="módulos" />
  if (error) return <Error section="módulos" />

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {data?.map((module: Module) => {
            const stats = moduleProgress[module.id] || {
              completed: 0,
              total: 0,
            }
            const progress =
              stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0

            return (
              <ModuleCard
                key={module.id}
                module={module}
                progress={progress}
                onClick={() => navigate(`/modules/${module.icon}`)}
              />
            )
          })}
        </div>
      </section>
    </>
  )
}
