import { badgeApi } from '@/services/endpoints/badges'
import { useQuery } from '@tanstack/react-query'

export const useBadges = () => {
  const { getAll, getUserBadges, getProgress } = badgeApi

  const getBadges = useQuery({
    queryKey: ['badges'],
    queryFn: () => getAll(),
  })

  const getAllUserBadges = useQuery({
    queryKey: ['user-badge'],
    queryFn: () => getUserBadges(),
  })

  const getUserProgress = useQuery({
    queryKey: ['user-progress'],
    queryFn: () => getProgress(),
  })
  return { getBadges, getAllUserBadges }
}
