import api from '@/services/api'
import type { HeatmapData } from '@/types/analytics'

export const analyticsApi = {
  async getHeatmap(): Promise<HeatmapData> {
    return (await api.get('/analytics/heatmap')) as HeatmapData
  },
}
