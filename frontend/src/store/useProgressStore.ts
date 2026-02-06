import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LessonProgress {
  exercises: number[]
}

interface ProgressState {
  progress: Record<string, LessonProgress>
  completeExercise: (lessonId: string, exerciseIndex: number) => void
  getLessonProgress: (lessonId: string, totalExercises: number) => number
  getModuleProgress: (lessons: any[]) => number
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},

      completeExercise: (lessonId, exerciseIndex) => {
        set((state) => {
          const lessonProgress = state.progress[lessonId] || { exercises: [] }
          if (!lessonProgress.exercises.includes(exerciseIndex)) {
            return {
              progress: {
                ...state.progress,
                [lessonId]: {
                  exercises: [...lessonProgress.exercises, exerciseIndex],
                },
              },
            }
          }
          return state
        })
      },

      getLessonProgress: (lessonId, totalExercises) => {
        const state = get()
        const lessonProgress = state.progress[lessonId]
        if (!lessonProgress) return 0
        return Math.round(
          (lessonProgress.exercises.length / totalExercises) * 100
        )
      },

      getModuleProgress: (lessons) => {
        const state = get()
        if (!lessons || lessons.length === 0) return 0
        let total = 0,
          completed = 0
        lessons.forEach((lesson) => {
          const exerciseCount = lesson.exercises?.length || 0
          total += exerciseCount

          const lessonProgress = state.progress[lesson.id]
          completed += lessonProgress?.exercises?.length || 0
        })
        return total === 0 ? 0 : Math.round((completed / total) * 100)
      },

      resetProgress: () => {
        set({ progress: {} })
      },
    }),
    {
      name: 'codex-progress', // name of the item in the storage (must be unique)
    }
  )
)
