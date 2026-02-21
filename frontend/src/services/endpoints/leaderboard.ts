import api from '@/services/api'
import {
  LeaderboardProfileResponse,
  LeaderboardResponse,
} from '@/types/leaderboard'
import { ProfileFormData, UserProfileData } from '@/types/profile'

export const leaderboardApi = {
  async getLeaderboard(): Promise<LeaderboardResponse> {
    return (await api.get('/leaderboard')) as LeaderboardResponse
  },

  async getUserProfile(userId: string): Promise<LeaderboardProfileResponse> {
    return (await api.get(
      `/leaderboard/profile/${userId}`
    )) as LeaderboardProfileResponse
  },

  async updateProfile(profileData: ProfileFormData): Promise<UserProfileData> {
    return api.put('/leaderboard/profile', profileData)
  },
}
