import Footer from '@/components/nav/Footer'
import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import PageHeader from '@/components/share/PageHeader'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useState } from 'react'
import LeaderboardPodium from './components/LeaderboardPodium'
import LeaderboardTable from './components/LeaderboardTable'
import ProfileModal from './components/ProfileModal'

export default function LeaderboardPage() {
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  const { leaderboardQuery, userProfileQuery } = useLeaderboard(
    selectedUser ?? ''
  )

  const leaderboard = leaderboardQuery.data?.leaderboard ?? []
  const userProfile = userProfileQuery.data?.profile ?? null

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  if (leaderboardQuery.isLoading) return <Loading section="ranking" />
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
          <ProfileModal
            isLoading={userProfileQuery.isLoading}
            profile={userProfile}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </section>
      <Footer />
    </>
  )
}
