export interface Badge {
  id: string
  name: string
  icon: string
}

export interface BadgeWithDescription extends Badge {
  description: string
  requirement: Requirement
}

export interface Requirement {
  type: string
  value: number
}

export interface UnlockedDate {
  unlocked_at: string
}

export interface UserBadgeData {
  badges: UnlockedDate[]
  total: number
  unlocked: number
}

export interface BadgeResponse {
  badges: BadgeWithDescription[]
}
