import { create } from 'zustand'

interface ChallengesFiltersState {
  difficulty: 'all' | 'easy' | 'medium' | 'hard'
  sort: 'newest' | 'popularity'
  completed: 'all' | 'completed' | 'pending'
  limit: number
  setFilters: (filters: Partial<ChallengesFiltersState>) => void
  resetFilters: () => void
}

export const useChallengesFiltersStore = create<ChallengesFiltersState>(
  (set) => ({
    difficulty: 'all',
    sort: 'newest',
    completed: 'all',
    limit: 21,
    setFilters: (filters) => set((state) => ({ ...state, ...filters })),
    resetFilters: () =>
      set({ difficulty: 'all', sort: 'newest', completed: 'all', limit: 21 }),
  })
)
