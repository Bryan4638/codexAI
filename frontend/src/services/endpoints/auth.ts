import api from '@/services/api'
import type { AuthResponse, User } from '@/types/user'

export const authApi = {
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const data = (await api.post('/auth/register', {
      username,
      email,
      password,
    })) as AuthResponse
    if (data.token) localStorage.setItem('codex-token', data.token)
    return data
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = (await api.post('/auth/login', {
      email,
      password,
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
