import { dashboardApi } from '@/services/endpoints/dashboard'
import { useQuery } from '@tanstack/react-query'

export const useDashboard = () => {
  const { getAll } = dashboardApi

  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: () => getAll(),
  })

  return { statsQuery }
}
