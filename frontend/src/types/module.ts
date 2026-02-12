export interface Module {
  id: number
  moduleNumber: number
  name: string
  description: string
  icon: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  description: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  moduleId: string
}
