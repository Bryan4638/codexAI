import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { IconTrophy } from '@tabler/icons-react'
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
    <section className="py-28 max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center justify-center mb-12">
        <h2 className="text-3xl flex items-center gap-2">
          <IconTrophy size={50} /> Tabla de Posiciones
        </h2>
        <p className="mt-2 text-sm">Los mejores estudiantes de chamba-code</p>
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
