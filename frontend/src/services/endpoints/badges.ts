import api from '@/services/api'
import { BadgeResponse, UserBadgeData, UserProgress } from '@/types/badge'

export const badgeApi = {
  async getAll(): Promise<BadgeResponse> {
    return (await api.get('/badges')) as BadgeResponse
  },

  async getUserBadges(): Promise<UserBadgeData> {
    return (await api.get('/badges/user')) as UserBadgeData
  },

  async getProgress(): Promise<UserProgress> {
    const prog = (await api.get('/badges/progress')) as UserProgress
    console.log('Progreso', prog)
    return prog
  },
}
