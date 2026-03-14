import type { UserProgress } from '@/types/badge'

interface ProfileStatsProps {
  progress: UserProgress
}

export default function ProfileStats({ progress }: ProfileStatsProps) {
  const { level, xp, completedExercises } = progress
  return (
    <section className="grid grid-cols-3 gap-6 mb-12 max-md:grid-cols-1">
      <article className="glass-card p-6 text-center">
        <p
          className="text-5xl font-display text-neon-cyan"
          aria-label={`Nivel ${level || 1}`}
        >
          {level || 1}
        </p>
        <p
          className="text-base text-text-muted tracking-widest mt-2"
          aria-hidden="true"
        >
          NIVEL
        </p>
      </article>
      <article className="glass-card p-6 text-center">
        <p
          className="text-5xl font-display text-neon-purple"
          aria-label={`XP ${xp || 0}`}
        >
          {xp || 0}
        </p>
        <p
          className="text-base text-text-muted tracking-widest mt-2"
          aria-hidden="true"
        >
          XP
        </p>
      </article>
      <article className="glass-card p-6 text-center">
        <p
          className="text-5xl font-display text-neon-green"
          aria-label={`Ejercicios completados: ${completedExercises || 0}`}
        >
          {completedExercises || 0}
        </p>
        <p
          className="text-base text-text-muted tracking-widest mt-2"
          aria-hidden="true"
        >
          EJERCICIOS
        </p>
      </article>
    </section>
  )
}
