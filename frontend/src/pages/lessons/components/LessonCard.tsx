import { Lesson } from '@/types/lesson'

interface LessonCardProps {
  lesson: Lesson
  onClick: () => void
}

function LessonCard({ lesson, onClick }: LessonCardProps) {
  const orderLabel = lesson.order.toString().padStart(2, '0')

  return (
    <article onClick={onClick} className="module-card">
      <header className="flex flex-row-reverse justify-between mb-2 items-center">
        <span className="font-display text-4xl font-black text-white/5">
          {orderLabel}
        </span>
        <h3 className="font-display text-lg font-semibold">{lesson.title}</h3>
      </header>
      <p className="text-sm text-text-secondary text-pretty mb-10">
        {lesson.description}
      </p>
      <footer className="flex justify-end items-end absolute bottom-4 right-4 gap-2 text-sm text-text-muted hover:text-neon-green duration-300 transition-colors">
        <span>Comenzar</span>
      </footer>
    </article>
  )
}

export default LessonCard
