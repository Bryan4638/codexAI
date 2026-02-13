import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import { useModules } from '@/hooks/useModules'
import ExerciseView from '@/pages/exercises/components/ExerciseView'
import { slugify } from '@/utils/slugify'
import { useNavigate, useParams } from 'react-router-dom'

export default function ExercisesPage() {
  const { modulePath, lessonPath } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useModules().getModules

  const module = data?.find((m) => m.icon === modulePath)
  const lesson = module?.lessons.find((l) => slugify(l.title) === lessonPath)
  if (isLoading) return <Loading section="ejercicio" />
  if (error) return <Error section="ejercicio" />

  if (!module || !lesson) {
    return <p>Ejercicio no encontrado</p>
  }
  return (
    <ExerciseView
      key={lesson.id}
      lessonId={lesson.id}
      module={module}
      onBack={() => navigate(`/modules/${module.icon}`)}
      onNewBadges={(badges) => {
        console.log('Medallas nuevas:', badges)
      }}
    />
  )
}
