import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
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
    <section className="pt-32 max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl">🏆 Tabla de Posiciones</h2>
        <p className="mt-2 text-sm">Los mejores estudiantes de CODEX</p>
      </div>

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
  )
}
