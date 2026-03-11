import { UserProgress } from '@/types/badge'

interface ProfileLevelProgressBarProps {
  progress: UserProgress
}

export default function ProfileLevelProgressBar({
  progress,
}: ProfileLevelProgressBarProps) {
  const { level, xp, nextLevelXp, levelProgress } = progress

  return (
    <section className="glass-card p-8 mb-12">
      <div className="flex justify-between mb-4">
        <span>Progreso al nivel {(level || 1) + 1}</span>
        <span className="text-neon-cyan font-mono text-lg">
          {xp || 0} / {nextLevelXp || 100} XP
        </span>
      </div>
      <div className="progress-bar h-3">
        <div
          className="progress-fill"
          style={{ width: `${levelProgress || 0}%` }}
        />
      </div>
    </section>
  )
}
