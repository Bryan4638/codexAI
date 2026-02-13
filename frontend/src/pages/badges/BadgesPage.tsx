import { badgeApi } from '@/services/endpoints/badges'
import { BadgeWithDescription, UserBadgeData } from '@/types/badge'
import { useEffect, useState } from 'react'

function BadgesPage() {
  const [allBadges, setAllBadges] = useState<BadgeWithDescription[]>([])
  const [userBadges, setUserBadges] = useState<UserBadgeData>({
    badges: [],
    unlocked: 0,
  })
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadBadges()
  }, [])

  const loadBadges = async () => {
    try {
      const [all, user] = await Promise.all([
        badgeApi.getAll(),
        badgeApi.getUserBadges(),
      ])
      setAllBadges(all.badges || [])
      setUserBadges(user)
    } catch (error) {
      console.error('Error cargando medallas:', error)
    } finally {
      setLoading(false)
    }
  }

  const isUnlocked = (badgeId: string) => {
    return userBadges.badges.some((b) => b.id === badgeId)
  }

  if (loading) {
    return (
      <section className="pt-32 max-w-7xl mx-auto px-6 text-center">
        <p>Cargando medallas...</p>
      </section>
    )
  }

  return (
    <section className="pt-32 max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl">🏆 Medallas</h2>
        <p className="mt-2 text-sm">
          Desbloquea medallas completando ejercicios y alcanzando nuevos niveles
        </p>
        <div className="inline-flex mt-6 px-6 py-4 bg-neon-green/10 border border-neon-green/30 rounded-2xl">
          <span className="text-neon-green font-display">
            {userBadges.unlocked} / {allBadges.length} desbloqueadas
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
        {allBadges.map((badge) => {
          const unlocked = isUnlocked(badge.id)
          return (
            <div
              key={badge.id}
              className={`glass-card text-center ${!unlocked ? 'opacity-50 grayscale' : ''}`}
            >
              <div className="text-5xl mb-4">{badge.icon}</div>
              <h4
                className={`font-display mb-2 ${unlocked ? 'text-neon-cyan' : 'text-text-muted'}`}
              >
                {badge.name}
              </h4>
              <p className="text-sm text-text-secondary">{badge.description}</p>
              {unlocked && (
                <div className="mt-4 inline-block px-4 py-1 bg-neon-green/20 rounded-lg text-xs text-neon-green">
                  ✓ Desbloqueada
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default BadgesPage
