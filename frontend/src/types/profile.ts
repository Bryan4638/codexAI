import { Badge } from '@/types/badge'

export interface UserProfileData {
  username: string
  avatarUrl?: string
  level: number
  xp: number
  badgeCount: number
  exercisesCompleted: number
  bio?: string
  isPublic: boolean
  contact?: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
  badges?: Array<{
    id: string
    name: string
    icon: string
  }>
}

export interface ProfileFormData {
  bio: string
  github: string
  linkedin: string
  twitter: string
  website: string
  isPublic: boolean
}

export interface ProgressData {
  level: number
  xp: number
  completedExercises: number
  nextLevelXp: number
  levelProgress: number
  moduleProgress?: Record<string, { completed: number; total: number }>
  history?: Array<{
    id: string
    title: string
    completedAt: string
    attempts: number
  }>
}

export interface ProfileBadgesData {
  badges: Badge[]
  total: number
  unlocked: number
}
