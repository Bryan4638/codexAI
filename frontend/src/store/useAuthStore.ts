import { authApi } from '@/services/endpoints/auth'
import { User } from '@/types/user'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<any>
  register: (username: string, email: string, password: string) => Promise<any>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),

  login: async (email, password) => {
    try {
      const data = await authApi.login(email, password)
      set({ user: data.user })
      return data
    } catch (e) {
      throw e
    }
  },

  register: async (username, email, password) => {
    try {
      const data = await authApi.register(username, email, password)
      set({ user: data.user })
      return data
    } catch (e) {
      throw e
    }
  },

  logout: () => {
    authApi.logout()
    set({ user: null })
  },

  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }))
  },

  checkAuth: async () => {
    if (authApi.isLoggedIn()) {
      try {
        const data = await authApi.getMe()
        set({ user: data.user })
      } catch (error) {
        console.error('Error verificando auth:', error)
        authApi.logout()
        set({ user: null })
      }
    } else {
      set({ user: null })
    }
    set({ loading: false })
  },
}))

// Initialize auth check
useAuthStore.getState().checkAuth()
