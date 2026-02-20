import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import { useLessons } from '@/hooks/useLessons'
import { useModules } from '@/hooks/useModules'
import ExerciseView from '@/pages/exercises/components/ExerciseView'
import { slugify } from '@/utils/slugify'
import { useNavigate, useParams } from 'react-router-dom'

export default function ExercisesPage() {
  const { modulePath, lessonPath } = useParams()
  const navigate = useNavigate()
  const {
    data: modules,
    isLoading: isLoadingModules,
    error: modulesError,
  } = useModules().getModules

  const module = modules?.find((m) => m.id === modulePath)
  const {
    data: lessons = [],
    isLoading: isLoadingLessons,
    error: lessonsError,
  } = useLessons(module?.id).getLessons
  const lesson = lessons.find((item) => slugify(item.title) === lessonPath)

  if (isLoadingModules || (module && isLoadingLessons)) {
    return <Loading section="ejercicio" />
  }

  if (modulesError || lessonsError) return <Error section="ejercicio" />

  if (!module || !lesson) {
    return <p>Ejercicio no encontrado</p>
  }

  return (
    <ExerciseView
      key={lesson.id}
      lessonId={lesson.id}
      lessonTitle={lesson.title}
      module={module}
      onBack={() => navigate(`/modules/${module.id}`)}
      onNewBadges={(badges) => {
        console.log('Medallas nuevas:', badges)
      }}
    />
  )
}
