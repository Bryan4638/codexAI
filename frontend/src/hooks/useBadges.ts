import { badgeApi } from '@/services/endpoints/badges'
import { useQuery } from '@tanstack/react-query'

export const useBadges = () => {
  const { getAll, getUserBadges } = badgeApi

  const getBadges = useQuery({
    queryKey: ['badges'],
    queryFn: () => getAll(),
  })

  const getAllUserBadges = useQuery({
    queryKey: ['user-badge'],
    queryFn: () => getUserBadges(),
  })
  return { getBadges, getAllUserBadges }
}
