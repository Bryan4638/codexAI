import api from '@/services/api'

export const leaderboardApi = {
  async getLeaderboard(): Promise<any> {
    return api.get('/leaderboard')
  },

  async getUserProfile(userId: string): Promise<any> {
    return api.get(`/leaderboard/profile/${userId}`)
  },

  async updateProfile(profileData: any): Promise<any> {
    return api.put('/leaderboard/profile', profileData)
  },
}
