import api from '@/services/api'
import { BadgeResponse, UserBadgeData } from '@/types/badge'

export const badgeApi = {
  async getAll(): Promise<BadgeResponse> {
    return (await api.get('/badges')) as BadgeResponse
  },

  async getUserBadges(): Promise<UserBadgeData> {
    return (await api.get('/badges/user')) as UserBadgeData
  },

  async getProgress(): Promise<any> {
    const prog = api.get('/badges/progress')
    // console.log('Progreso', prog)
    return prog
  },
}
