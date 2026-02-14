import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import LoginRequired from '@/components/share/LoginRequired'
import { useBadges } from '@/hooks/useBadges'
import { BadgeWithDescription } from '@/types/badge'

function BadgesPage() {
  const { getAllUserBadges, getBadges } = useBadges()
  const {
    data: userBadges,
    isLoading: isUserLoading,
    error: userError,
  } = getAllUserBadges
  const { data: allBadges, isLoading, error } = getBadges

  if (!userBadges) return <LoginRequired />
  if (isLoading || isUserLoading) return <Loading section="medallas" />
  if (error || userError) return <Error section="medallas" />

  const unlockedCount = userBadges?.unlocked ?? userBadges?.badges?.length ?? 0
  const totalCount = allBadges?.badges.length ?? userBadges?.total ?? 0
  const badgesToRender: BadgeWithDescription[] = allBadges?.badges ?? []

  const isUnlocked = (badgeId: string) => {
    return (userBadges?.badges ?? []).some(
      (b: any) => b?.id === badgeId || b?.badgeId === badgeId
    )
  }

  return (
    <section className="pt-32 max-w-7xl mx-auto px-6">
      <header className="text-center mb-12">
        <h2 className="text-3xl">🏆 Medallas</h2>
        <p className="mt-2 text-sm">
          Desbloquea medallas completando ejercicios y alcanzando nuevos niveles
        </p>
        <div className="inline-flex mt-6 px-6 py-4 bg-neon-green/10 border border-neon-green/30 rounded-2xl">
          <span className="text-neon-green font-display">
            {unlockedCount || 0} / {totalCount} desbloqueadas
          </span>
        </div>
      </header>

      {badgesToRender.length === 0 ? (
        <p className="text-center text-sm text-text-secondary">
          Aún no tienes medallas desbloqueadas.
        </p>
      ) : (
        <main className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
          {badgesToRender.map((badge) => {
            const unlocked = isUnlocked(badge.id)
            return (
              <div
                key={badge.id}
                className={`glass-card text-center ${
                  !unlocked ? 'opacity-50 grayscale' : ''
                }`}
              >
                <div className="text-5xl mb-4">{badge.icon}</div>
                <h4
                  className={`font-display mb-2 ${
                    unlocked ? 'text-neon-cyan' : 'text-text-muted'
                  }`}
                >
                  {badge.name}
                </h4>
                <p className="text-sm text-text-secondary">
                  {badge.description}
                </p>
                {unlocked && (
                  <div className="mt-4 inline-block px-4 py-1 bg-neon-green/20 rounded-lg text-xs text-neon-green">
                    ✓ Desbloqueada
                  </div>
                )}
              </div>
            )
          })}
        </main>
      )}
    </section>
  )
}

export default BadgesPage
