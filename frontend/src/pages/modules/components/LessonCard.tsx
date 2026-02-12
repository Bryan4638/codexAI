import { Lesson } from '@/types/module'

interface LessonCardProps {
  lesson: Lesson
  onClick: () => void
}

function LessonCard({ lesson, onClick }: LessonCardProps) {
  return (
    <article className="module-card" onClick={onClick}>
      <div className="font-display text-4xl font-black text-white/5 absolute top-4 right-4">
        {lesson.order}
      </div>
      <h3 className="font-display text-lg font-semibold mb-2">
        {lesson.title}
      </h3>
      <p className="text-sm text-text-secondary mb-4">{lesson.description}</p>
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <span>🎯</span>
        <span>Click para comenzar</span>
      </div>
    </article>
  )
}

export default LessonCard
