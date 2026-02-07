import { modulesData } from '@/data/data'
import LessonCard from '@/pages/modules/components/LessonCard'
import { Link, useNavigate, useParams } from 'react-router'

export default function SingleModule() {
  const { modulePath } = useParams()
  const navigate = useNavigate()

  const module = modulesData.find((m) => m.path === modulePath)
  console.log(module)

  if (!module) {
    return (
      <section className="container" style={{ paddingTop: '120px' }}>
        <div
          className="lesson-breadcumb"
          style={{ marginBottom: 'var(--spacing-xl)' }}
        >
          <Link
            to={'/modules'}
            style={{
              cursor: 'pointer',
              color: 'var(--neon-cyan)',
            }}
          >
            ← Volver a módulos
          </Link>
        </div>
        <div className="section-header">
          <h2>Módulo no encontrado</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="container" style={{ paddingTop: '120px' }}>
      <div
        className="lesson-breadcumb"
        style={{ marginBottom: 'var(--spacing-xl)' }}
      >
        <Link
          to={'/modules'}
          style={{
            cursor: 'pointer',
            color: 'var(--neon-cyan)',
          }}
        >
          ← Volver a módulos
        </Link>
      </div>

      {/* Header */}
      <header style={{ textAlign: 'left' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          <span className="module-icon" style={{ fontSize: '2rem' }}>
            {module.icon}
          </span>
          <div>
            <h1 style={{ marginBottom: 'var(--spacing-xs)' }}>
              {module.title}
            </h1>
            <p style={{ margin: '0' }}>{module.description}</p>
          </div>
        </div>
      </header>

      {/* Lessons */}
      <section
        className="modules-grid"
        style={{ marginTop: 'var(--spacing-2xl)' }}
      >
        {module.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onClick={() =>
              navigate(`/modules/${modulePath}/lessons/${lesson.id}`)
            }
          />
        ))}
      </section>
    </section>
  )
}
