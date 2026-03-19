import Footer from '@/components/nav/Footer'
import PageHeader from '@/components/share/PageHeader'
import LeaderboardSkeleton from '@/components/share/skeletons/LeaderboardSkeleton'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import LeaderboardPodium from '@/pages/leaderboard/components/LeaderboardPodium'
import LeaderboardTable from '@/pages/leaderboard/components/LeaderboardTable'
import { IconLoader2 } from '@tabler/icons-react'
import { lazy, Suspense, useState } from 'react'

const Error = lazy(() => import('@/components/share/Error'))
const ProfileModal = lazy(
  () => import('@/pages/leaderboard/components/ProfileModal')
)

export default function LeaderboardPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('all-time')

  const { leaderboardQuery, userProfileQuery } = useLeaderboard(
    selectedUser ?? '',
    period
  )

  const leaderboard = leaderboardQuery.data?.leaderboard ?? []
  const userProfile = userProfileQuery.data?.profile ?? null

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  if (leaderboardQuery.isPending) return <LeaderboardSkeleton />
  if (leaderboardQuery.error) return <Error section="ranking" />
  return (
    <>
      <section className="py-28 max-w-7xl mx-auto px-6">
        <PageHeader
          title="Tabla de Posiciones"
          subtitle="Los mejores estudiantes de chamba—code"
        />

        {/* Period Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg bg-white/5 p-1 backdrop-blur-md border border-white/10">
            {[
              { id: 'weekly', label: 'Esta Semana' },
              { id: 'monthly', label: 'Este Mes' },
              { id: 'all-time', label: 'Global' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPeriod(tab.id as any)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  period === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <LeaderboardPodium top3={top3} onUserClick={setSelectedUser} />
        <LeaderboardTable users={rest} onUserClick={setSelectedUser} />
        {selectedUser && (
          <Suspense
            fallback={
              <div className="flex justify-center items-center">
                <IconLoader2 className="animate-spin" />
              </div>
            }
          >
            <ProfileModal
              isLoading={userProfileQuery.isLoading}
              profile={userProfile}
              onClose={() => setSelectedUser(null)}
            />
          </Suspense>
        )}
      </section>
      <Footer />
    </>
  )
}
