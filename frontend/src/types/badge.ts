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

export interface UnlockedDate extends Badge {
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

export interface HistoryEntry {
  id: string
  title: string
  completedAt: string // ISO Date string
  attempts: number
}

export interface RecentActivity {
  exercise_id: string
  completed_at: string // ISO Date string
  attempts: number
}

export interface ModuleProgress {
  total: number
  completed: number
}

export interface UserProgress {
  xp: number
  level: number
  nextLevelXp: number
  levelProgress: number
  totalExercises: number
  completedExercises: number
  completedLessons: any[] // Basado en tu log es un array vacío por ahora
  history: HistoryEntry[]
  recentActivity: RecentActivity[]
  moduleProgress: Record<string, ModuleProgress>
}
