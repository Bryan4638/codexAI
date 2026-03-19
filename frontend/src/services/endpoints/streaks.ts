import api from '@/services/api'
import type { StreakData } from '@/types/streak'

export const streakApi = {
  async getStreak(): Promise<StreakData> {
    return (await api.get('/streaks')) as StreakData
  },
}
