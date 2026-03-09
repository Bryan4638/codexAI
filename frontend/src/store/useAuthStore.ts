import { User } from '@/types/user'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  otpSent: boolean
  email: string
  setUser: (user: User | null) => void
  setOtpSent: (value: boolean) => void
  setEmail: (email: string) => void
  updateUser: (updates: Partial<User>) => void
  resetAuth: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  email: '',
  otpSent: false,
  setUser: (user) => set({ user }),
  setOtpSent: (value) => set({ otpSent: value }),
  setEmail: (email) => set({ email }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  resetAuth: () =>
    set({
      user: null,
      otpSent: false,
      email: '',
    }),
}))
