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
    if (data.accessToken)
      localStorage.setItem('chamba-code-access-token', data.accessToken)
    if (data.refreshToken)
      localStorage.setItem('chamba-code-refresh-token', data.refreshToken)
    return data
  },

  async getMe(): Promise<User> {
    return (await api.get('/auth/me')) as User
  },

  logout() {
    localStorage.removeItem('chamba-code-access-token')
    localStorage.removeItem('chamba-code-refresh-token')
  },
}
