import { badgeApi } from '@/services/endpoints/badges'
import { useQuery } from '@tanstack/react-query'

export const useBadges = () => {
  const { getAll, getUserBadges, getProgress } = badgeApi

  const badgesQuery = useQuery({
    queryKey: ['badges'],
    queryFn: () => getAll(),
  })

  const userBadgesQuery = useQuery({
    queryKey: ['user-badges'],
    queryFn: () => getUserBadges(),
  })

  const userProgressQuery = useQuery({
    queryKey: ['user-progress'],
    queryFn: () => getProgress(),
  })
  return { badgesQuery, userBadgesQuery, userProgressQuery }
}
