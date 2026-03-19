import { useState } from 'react'
import Footer from '@/components/nav/Footer'
import Error from '@/components/share/Error'
import LoginRequired from '@/components/share/LoginRequired'
import PageHeader from '@/components/share/PageHeader'
import BadgeCardSkeleton from '@/components/share/skeletons/BadgeCardSkeleton'
import { useBadges } from '@/hooks/useBadges'
import BadgeCard from '@/pages/badges/components/BadgeCard'
import { useAuthStore } from '@/store/useAuthStore'
import type { Badge, BadgeWithDescription } from '@/types/badge'
import { clsx } from 'clsx'

const CATEGORIES = [
  { key: 'all', label: 'Todas' },
  { key: 'exercises_completed', label: '📚 Ejercicios' },
  { key: 'level_reached', label: '⭐ Nivel' },
  { key: 'module_completed', label: '📦 Módulos' },
  { key: 'streak', label: '🔥 Rachas' },
  { key: 'challenges_completed', label: '⚔️ Retos' },
  { key: 'live_coding_no_copy', label: '✨ Código Limpio' },
  { key: 'fast_completion', label: '⚡ Velocidad' },
] as const

type CategoryKey = (typeof CATEGORIES)[number]['key']

export default function BadgesPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all')
  const { badgesQuery, userBadgesQuery } = useBadges()
  const {
    data: userBadges,
    isLoading: isUserLoading,
    error: userError,
  } = userBadgesQuery
  const { data: allBadges, isLoading, error } = badgesQuery
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
      (b: Badge) => b?.id === badgeId || b?.id === badgeId
    )
  }

  const filteredBadges =
    activeCategory === 'all'
      ? badgesToRender
      : badgesToRender.filter(
          (b) => b.requirement?.type === activeCategory
        )

  // Count unlocked per category for the tab badges
  const countByCategory = (key: CategoryKey) => {
    if (key === 'all') return { unlocked: unlockedCount, total: totalCount }
    const catBadges = badgesToRender.filter(
      (b) => b.requirement?.type === key
    )
    const catUnlocked = catBadges.filter((b) => isUnlocked(b.id)).length
    return { unlocked: catUnlocked, total: catBadges.length }
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

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center my-8">
          {CATEGORIES.map((cat) => {
            const counts = countByCategory(cat.key)
            const hasUnlocked = counts.unlocked > 0
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  'border backdrop-blur-sm',
                  activeCategory === cat.key
                    ? 'bg-white/10 border-white/20 text-white shadow-lg shadow-white/5'
                    : 'bg-white/[0.03] border-white/10 text-white/50 hover:bg-white/[0.06] hover:text-white/70',
                  hasUnlocked && activeCategory !== cat.key && 'border-neon-green/20'
                )}
              >
                {cat.label}
                <span
                  className={clsx(
                    'ml-2 text-xs tabular-nums',
                    activeCategory === cat.key
                      ? 'text-neon-green'
                      : 'text-white/30'
                  )}
                >
                  {counts.unlocked}/{counts.total}
                </span>
              </button>
            )
          })}
        </div>

        {filteredBadges.length === 0 ? (
          <p className="text-center text-sm text-text-secondary">
            No hay medallas en esta categoría.
          </p>
        ) : (
          <main className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6">
            {filteredBadges.map((badge) => {
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
