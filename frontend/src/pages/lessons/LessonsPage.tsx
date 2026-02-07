import LessonView from '@/components/LessonView'
import { modulesData } from '@/data/data'
import { useNavigate, useParams } from 'react-router-dom'

export default function LessonsPage() {
  const { modulePath, lessonPath } = useParams()
  const navigate = useNavigate()
  const module = modulesData.find((m) => m.path === modulePath)
  const lesson = module?.lessons.find((l) => l.path === lessonPath)

  if (!module || !lesson) {
    return <p>Lección no encontrada</p>
  }
  return (
    <LessonView
      key={lesson.id}
      lessonId={lesson.id}
      module={module}
      onBack={() => navigate(`/modules/${module.path}`)}
      onNewBadges={(badges) => {
        console.log('Badges nuevos:', badges)
      }}
    />
  )
}
