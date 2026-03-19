import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/services/endpoints/analytics'

export function useAnalytics() {
  const heatmapQuery = useQuery({
    queryKey: ['heatmap'],
    queryFn: analyticsApi.getHeatmap,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })

  return { heatmapQuery }
}
