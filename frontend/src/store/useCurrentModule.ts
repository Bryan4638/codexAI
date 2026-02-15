import { create } from 'zustand'

interface CurrentModuleState {
  moduleId: string | null
  lessonId: string | null
  setModuleId: (id: string) => void
  setLessonId: (id: string) => void
}

export const useCurrentModule = create<CurrentModuleState>((set) => ({
  moduleId: null,
  lessonId: null,
  setModuleId: (moduleId) => set({ moduleId }),
  setLessonId: (lessonId) => set({ lessonId }),
}))
