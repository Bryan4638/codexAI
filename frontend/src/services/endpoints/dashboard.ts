import api from '@/services/api'
import type { Stats } from '@/types/dashboard'

export const dashboardApi = {
  async getStats(): Promise<Stats> {
    return (await api.get('/dashboard')) as Stats
  },
}
