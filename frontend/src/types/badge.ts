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

export interface UserBadgeData {
  badges: Badge[]
  unlocked: number // Assuming unlocked is a count?
}
export interface BadgeResponse {
  badges: BadgeWithDescription[]
}
