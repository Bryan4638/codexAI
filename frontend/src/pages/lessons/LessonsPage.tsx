import LessonView from '@/components/LessonView'
import { moduleApi } from '@/services/endpoints/module'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function LessonsPage() {
  const { modulePath, lessonPath } = useParams()
  const navigate = useNavigate()

  const [allModules, setAllModules] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const module = allModules.find((m) => m.icon === modulePath)
  const lesson = module?.lessons.find((l) => l.id === lessonPath)

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

  if (!module || !lesson) {
    return <p>Lección no encontrada</p>
  }
  return (
    <LessonView
      key={lesson.id}
      lessonId={lesson.id}
      module={module}
      onBack={() => navigate(`/modules/${module.icon}`)}
      onNewBadges={(badges) => {
        console.log('Badges nuevos:', badges)
      }}
    />
  )
}
