import LessonCard from '@/pages/modules/components/LessonCard'
import { moduleApi } from '@/services/endpoints/module'
import { Lesson } from '@/types/module'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

export default function SingleModule() {
  const { modulePath } = useParams()
  const navigate = useNavigate()
  const [allModules, setAllModules] = useState<any[]>([])
  const module = allModules.find((m) => m.icon === modulePath)
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
        <p>Cargando ejercicios...</p>
      </section>
    )
  }

  if (!module) {
    return (
      <section className="pt-32 max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Link to="/modules" className="text-neon-cyan hover:underline">
            ← Volver a módulos
          </Link>
        </div>
        <div className="text-center">
          <h2>Módulo no encontrado</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-32 max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <Link to="/modules" className="text-neon-cyan hover:underline">
          ← Volver a módulos
        </Link>
      </div>

      {/* Header */}
      <header className="text-left">
        <div className="flex items-center gap-6 mb-4">
          <span className="text-4xl">{module.icon}</span>
          <div>
            <h1 className="mb-1">{module.name}</h1>
            <p className="m-0">{module.description}</p>
          </div>
        </div>
      </header>

      {/* Lessons Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
        {module.lessons.map((lesson: Lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onClick={() =>
              navigate(`/modules/${modulePath}/lesson-${lesson.order}`)
            }
          />
        ))}
      </section>
    </section>
  )
}
