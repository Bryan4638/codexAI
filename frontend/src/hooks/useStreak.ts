import { useQuery } from '@tanstack/react-query'
import { streakApi } from '@/services/endpoints/streaks'

export function useStreak() {
  const streakQuery = useQuery({
    queryKey: ['streak'],
    queryFn: streakApi.getStreak,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return { streakQuery }
}
