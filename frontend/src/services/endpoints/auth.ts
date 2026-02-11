import api from '@/services/api'
import type { AuthResponse, User } from '@/types/user'

export const authApi = {
  async requestEmailCode(email: string): Promise<{ message: string }> {
    return api.post('/auth/email/request', { email })
  },

  async verifyEmailCode(email: string, code: string): Promise<AuthResponse> {
    const data = (await api.post('/auth/email/verify', {
      email,
      code,
    })) as AuthResponse
    if (data.token) localStorage.setItem('codex-token', data.token)
    return data
  },

  async getMe(): Promise<User> {
    return (await api.get('/auth/me')) as User
  },

  logout() {
    localStorage.removeItem('codex-token')
  },

  isLoggedIn() {
    return !!localStorage.getItem('codex-token')
  },
}
