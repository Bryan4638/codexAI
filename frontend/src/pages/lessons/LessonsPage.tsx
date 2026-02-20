import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import { useLessons } from '@/hooks/useLessons'
import { useModules } from '@/hooks/useModules'
import LessonCard from '@/pages/lessons/components/LessonCard'
import { useCurrentModule } from '@/store/useCurrentModule'
import { slugify } from '@/utils/slugify'
import { Link, useNavigate, useParams } from 'react-router'

export default function LessonsPage() {
  const { modulePath } = useParams()
  const navigate = useNavigate()
  const { moduleId } = useCurrentModule()
  console.log('Modulo actual: ', moduleId)
  const {
    data: modules,
    isLoading: isLoadingModules,
    error: modulesError,
  } = useModules().getModules
  const module = modules?.find((item) => item.icon === modulePath)
  const {
    data: lessons = [],
    isLoading: isLoadingLessons,
    error: lessonsError,
  } = useLessons(module?.id).getLessons
  const moduleLessons = lessons
    .filter((lesson) => lesson.isActive)
    .sort((a, b) => a.order - b.order)

  if (isLoadingModules || (module && isLoadingLessons)) {
    return <Loading section="lecciones" />
  }

  if (modulesError || lessonsError) return <Error section="lecciones" />

  if (!module) {
    return (
      <section className="py-28 max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Link to="/modules" className="text-neon-cyan hover:underline">
            ← Volver a módulos
          </Link>
        </div>
        <div className="text-center">
          <h2 className="text-2xl">Módulo no encontrado</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="py-28 max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <Link to="/modules" className="text-neon-cyan hover:underline">
          ← Volver a módulos
        </Link>
      </div>

      {/* Header */}
      <header className="text-left">
        <div className="flex items-top gap-6 mb-4">
          <span className="text-xl sm:text-4xl">{module.icon}</span>
          <div>
            <h1 className="mb-1 text-3xl">{module.name}</h1>
            <p className="m-0 text-sm">{module.description}</p>
          </div>
        </div>
      </header>

      {/* Lessons Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
        {moduleLessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onClick={() =>
              navigate(`/modules/${modulePath}/${slugify(lesson.title)}`)
            }
          />
        ))}
      </section>
    </section>
  )
}
