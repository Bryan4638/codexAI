import { authApi } from '@/services/endpoints/auth'
import { AuthResponse, User } from '@/types/user'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  loading: boolean
  otpSent: boolean
  email: string
  setUser: (user: User | null) => void
  requestOtp: (email: string) => Promise<void>
  verifyOtp: (code: string) => Promise<AuthResponse>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  checkAuth: () => Promise<void>
  resetAuth: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  otpSent: false,
  email: '',
  setUser: (user) => set({ user }),
  requestOtp: async (email) => {
    try {
      await authApi.requestEmailCode(email)
      set({ otpSent: true, email })
    } catch (e) {
      throw e
    }
  },
  verifyOtp: async (code) => {
    const { email } = get()
    try {
      const data = await authApi.verifyEmailCode(email, code)
      const user = await authApi.getMe()
      set({ user, otpSent: false, email: '' })
      return data
    } catch (e) {
      throw e
    }
  },
  logout: () => {
    authApi.logout()
    set({ user: null, otpSent: false, email: '' })
  },
  resetAuth: () => {
    set({ otpSent: false, email: '' })
  },
  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    }))
  },
  checkAuth: async () => {
    const token = localStorage.getItem('chamba-code-access-token')
    if (!token) {
      set({ user: null, loading: false })
      return
    }
    try {
      const user = await authApi.getMe()
      set({ user })
    } catch (error) {
      console.error('Error verificando auth:', error)
      authApi.logout()
      set({ user: null, loading: false })
    }
  },
}))
