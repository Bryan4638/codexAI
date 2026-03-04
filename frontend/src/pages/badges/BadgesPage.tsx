import Footer from '@/components/nav/Footer'
import Error from '@/components/share/Error'
import LoginRequired from '@/components/share/LoginRequired'
import PageHeader from '@/components/share/PageHeader'
import BadgeCardSkeleton from '@/components/share/skeletons/BadgeCardSkeleton'
import { useBadges } from '@/hooks/useBadges'
import { useAuthStore } from '@/store/useAuthStore'
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
  const { user } = useAuthStore()

  if (!user) return <LoginRequired />
  if (isLoading || isUserLoading) {
    return (
      <>
        <section className="py-28 max-w-7xl mx-auto px-6">
          <PageHeader
            title="Medallas"
            subtitle="Desbloquea medallas completando ejercicios y alcanzando nuevos niveles"
          />
          <div className="my-6 mx-auto px-6 py-4 bg-neon-green/10 max-w-fit border border-neon-green/30 rounded-2xl flex justify-center items-center">
            <div className="h-6 w-32 bg-white/10 animate-pulse rounded-md" />
          </div>
          <main className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <BadgeCardSkeleton key={i} />
            ))}
          </main>
        </section>
        <Footer />
      </>
    )
  }
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
