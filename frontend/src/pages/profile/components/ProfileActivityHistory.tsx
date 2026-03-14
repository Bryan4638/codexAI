import type { UserProgress } from '@/types/badge'
import { IconHistory } from '@tabler/icons-react'

interface ProfileActivityHistoryProps {
  progress: UserProgress
}

export default function ProfileActivityHistory({
  progress,
}: ProfileActivityHistoryProps) {
  const { history } = progress

  return (
    <section className="mt-12">
      <h3 className="mb-6 flex items-center gap-2">
        <IconHistory size={24} /> Historial de Actividad
      </h3>
      <main className="glass-card !p-0 overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          {history.map((item, index) => (
            <article
              key={`${item.id}-${index}`}
              className="px-6 py-4 border-b border-white/5 flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-sm text-text-secondary">
                  {new Date(item.completedAt).toLocaleDateString()} •{' '}
                  {new Date(item.completedAt).toLocaleTimeString()}
                </p>
              </div>
              <span className="bg-white/5 px-3 py-1 rounded-full text-sm text-text-muted">
                {item.attempts} intento{item.attempts !== 1 ? 's' : ''}
              </span>
            </article>
          ))}
        </div>
      </main>
    </section>
  )
}
