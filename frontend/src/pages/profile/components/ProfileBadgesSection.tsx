import type { UserBadgeData } from '@/types/badge'
import { IconTrophy } from '@tabler/icons-react'

interface ProfileBadgesSectionProps {
  badges: UserBadgeData
}

export default function ProfileBadgesSection({
  badges,
}: ProfileBadgesSectionProps) {
  const { badges: b, total, unlocked } = badges

  return (
    <section>
      <h3 className="mb-6 flex items-center gap-2">
        <IconTrophy size={24} /> Medallas ({unlocked}/{total})
      </h3>
      <div className="flex flex-wrap gap-4">
        {b.length > 0 ? (
          b.map((badge, index) => (
            <article
              key={`${badge.unlocked_at}-${index}`}
              className="glass-card p-6 text-center min-w-30 flex-1 flex flex-col justify-center items-center gap-2"
            >
              <div className="text-4xl mb-1 flex justify-center">
                {badge.icon}
              </div>
              <h4 className="text-sm font-semibold">{badge.name}</h4>
              <span className="text-xs text-text-muted mt-1">
                {new Date(badge.unlocked_at).toLocaleDateString()}
              </span>
            </article>
          ))
        ) : (
          <p className="text-text-muted italic">
            Completa ejercicios para desbloquear medallas
          </p>
        )}
      </div>
    </section>
  )
}
