import { UserProfileData } from './profile'

export interface LeaderboardResponse {
  leaderboard: UserProfileData[]
  totalUsers: number
}

export interface LeaderboardProfileResponse {
  profile: UserProfileData
}
