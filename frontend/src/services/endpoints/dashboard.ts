import api from '@/services/api'
import type { Stats } from '@/types/dashboard'

export const dashboardApi = {
  async getAll(): Promise<Stats> {
    return (await api.get('/dashboard')) as Stats
  },
}
