import api from '@/services/api'
import type { AuthResponse, User } from '@/types/user'

export const authApi = {
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', {
      username,
      email,
      password,
    })
    const data = res.data
    if (data.token) localStorage.setItem('codex-token', data.token)
    return data
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password })
    const data = res.data
    if (data.token) localStorage.setItem('codex-token', data.token)
    return data
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>('/auth/me')
    return res.data
  },

  logout() {
    localStorage.removeItem('codex-token')
  },

  isLoggedIn() {
    return !!localStorage.getItem('codex-token')
  },
}
