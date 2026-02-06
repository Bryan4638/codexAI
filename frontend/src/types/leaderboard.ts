export interface LeaderboardUser {
  id: string
  username: string
  avatarUrl?: string
  level: number
  xp: number
  badgeCount: number
  rank: number
  isPublic: boolean
}
