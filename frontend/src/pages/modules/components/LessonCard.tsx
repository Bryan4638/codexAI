import { Lesson } from '@/types/module'

interface LessonCardProps {
  lesson: Lesson
  onClick: () => void
}
function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <article className="module-card" onClick={onClick}>
      <div className="module-number">{lesson.id}</div>
      <h3 className="module-title">{lesson.title}</h3>
      <p className="module-description">Ejercicios interactivos disponibles</p>
      <div className="module-lessons">
        <span>🎯</span>
        <span>Click para comenzar</span>
      </div>
    </article>
  )
}

export default LessonCard
