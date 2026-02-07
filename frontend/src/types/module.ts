import { LessonExercise } from '@/types/exercise'

export interface Module {
  id: number
  title: string
  path: string
  description: string
  icon: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  exercises?: LessonExercise[]
}
