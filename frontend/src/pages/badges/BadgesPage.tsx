import Footer from '@/components/nav/Footer'
import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import LoginRequired from '@/components/share/LoginRequired'
import PageHeader from '@/components/share/PageHeader'
import { useBadges } from '@/hooks/useBadges'
import { BadgeWithDescription } from '@/types/badge'
import BadgeCard from './components/BadgeCard'

export default function BadgesPage() {
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
    <>
      <section className="py-28 max-w-7xl mx-auto px-6">
        <PageHeader
          title="Medallas"
          subtitle="Desbloquea medallas completando ejercicios y alcanzando nuevos niveles"
        />
        <div className="my-6 mx-auto px-6 py-4 bg-neon-green/10 max-w-fit border border-neon-green/30 rounded-2xl flex justify-center items-center">
          <span className="text-neon-green font-display">
            {unlockedCount || 0} / {totalCount} desbloqueadas
          </span>
        </div>

        {badgesToRender.length === 0 ? (
          <p className="text-center text-sm text-text-secondary">
            Aún no tienes medallas desbloqueadas.
          </p>
        ) : (
          <main className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
            {badgesToRender.map((badge) => {
              const unlocked = isUnlocked(badge.id)
              return (
                <BadgeCard key={badge.id} badge={badge} unlocked={unlocked} />
              )
            })}
          </main>
        )}
      </section>
      <Footer />
    </>
  )
}
