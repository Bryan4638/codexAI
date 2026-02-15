import { Lesson } from '@/types/lesson'

export interface Module {
  id: string
  moduleNumber: number
  name: string
  description: string
  icon: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  totalExercises: number
  completedExercises: number
  lessons: Lesson[]
}
