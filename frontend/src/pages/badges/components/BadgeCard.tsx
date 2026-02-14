import { BadgeWithDescription } from '@/types/badge'

interface BadgeCardProps {
  badge: BadgeWithDescription
  unlocked: boolean
}

export default function BadgeCard({ badge, unlocked }: BadgeCardProps) {
  return (
    <article
      className={`glass-card text-center ${
        !unlocked ? 'opacity-50 grayscale' : ''
      }`}
    >
      <span className="text-5xl">{badge.icon}</span>
      <h4
        className={`font-display mb-2 mt-6 ${
          unlocked ? 'text-neon-cyan' : 'text-text-muted'
        }`}
      >
        {badge.name}
      </h4>
      <p className="text-sm text-text-secondary">{badge.description}</p>
      {unlocked && (
        <div className="mt-4 inline-block px-4 py-1 bg-neon-green/20 rounded-lg text-xs text-neon-green">
          ✓ Desbloqueada
        </div>
      )}
    </article>
  )
}
