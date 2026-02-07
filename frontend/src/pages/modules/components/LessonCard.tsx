import { Lesson } from '@/types/module'

interface LessonCardProps {
  lesson: Lesson
}
function LessonCard({ lesson }: LessonCardProps) {
  return (
    <div className="module-card">
      <div className="module-number">{lesson.id}</div>
      <h3 className="module-title">{lesson.title}</h3>
      <p className="module-description">Ejercicios interactivos disponibles</p>
      <div className="module-lessons">
        <span>🎯</span>
        <span>Click para comenzar</span>
      </div>
    </div>
  )
}

export default LessonCard
