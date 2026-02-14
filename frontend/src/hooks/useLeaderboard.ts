import { leaderboardApi } from '@/services/endpoints/leaderboard'
import { useQuery } from '@tanstack/react-query'

export const useLeaderboard = (id: string) => {
  const { getLeaderboard, getUserProfile } = leaderboardApi

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => getLeaderboard(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const userProfileQuery = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => getUserProfile(id),
    enabled: Boolean(id),
  })
  return { leaderboardQuery, userProfileQuery }
}
