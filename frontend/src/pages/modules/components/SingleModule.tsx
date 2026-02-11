import { modulesData } from '@/data/data'
import LessonCard from '@/pages/modules/components/LessonCard'
import { Link, useNavigate, useParams } from 'react-router'

export default function SingleModule() {
  const { modulePath } = useParams()
  const navigate = useNavigate()

  const module = modulesData.find((m) => m.path === modulePath)

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
            <h1 className="mb-1">{module.title}</h1>
            <p className="m-0">{module.description}</p>
          </div>
        </div>
      </header>

      {/* Lessons Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-12">
        {module.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onClick={() => navigate(`/modules/${modulePath}/${lesson.path}`)}
          />
        ))}
      </section>
    </section>
  )
}
