import { dashboardApi } from '@/services/endpoints/dashboard'
import { useQuery } from '@tanstack/react-query'

export const useDashboard = () => {
  const { getStats } = dashboardApi

  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStats(),
  })

  return { statsQuery }
}
