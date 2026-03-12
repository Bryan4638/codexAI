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

  const { leaderboardQuery, userProfileQuery } = useLeaderboard(
    selectedUser ?? ''
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
