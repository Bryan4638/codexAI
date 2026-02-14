import PodiumCard from '@/pages/leaderboard/components/PodiumCard'

interface Props {
  top3: any[]
  onUserClick: (id: string) => void
}

export default function LeaderboardPodium({ top3, onUserClick }: Props) {
  if (top3.length === 0) return null

  return (
    <div className="flex justify-center items-end gap-10 mb-24 flex-wrap">
      {top3[1] && (
        <PodiumCard user={top3[1]} position={2} onClick={onUserClick} />
      )}

      {top3[0] && (
        <PodiumCard user={top3[0]} position={1} onClick={onUserClick} />
      )}

      {top3[2] && (
        <PodiumCard user={top3[2]} position={3} onClick={onUserClick} />
      )}
    </div>
  )
}
