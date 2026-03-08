import { UserProgress } from '@/types/badge'
import { IconChartBar } from '@tabler/icons-react'

interface ProfileModuleProgressProps {
  progress: UserProgress
}

export default function ProfileModuleProgress({
  progress,
}: ProfileModuleProgressProps) {
  const { moduleProgress } = progress
  return (
    <section>
      {moduleProgress && (
        <>
          <h3 className="mb-6 flex items-center gap-2">
            <IconChartBar size={24} /> Progreso por Módulo
          </h3>
          <section className="glass-card p-6">
            {Object.entries(moduleProgress).map(([moduleId, data]) => (
              <article key={moduleId} className="mb-6 last:mb-0">
                <header className="flex justify-between mb-1">
                  <span className="text-text-secondary">Módulo {moduleId}</span>
                  <span className="text-neon-cyan">
                    {data.completed}/{data.total}
                  </span>
                </header>
                <main className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${data.total > 0 ? (data.completed / data.total) * 100 : 0}%`,
                    }}
                  />
                </main>
              </article>
            ))}
          </section>
        </>
      )}
    </section>
  )
}
