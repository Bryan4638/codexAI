export interface AuthResponse {
  user: User
  token: string
}

export interface User {
  id: string
  username: string
  email: string
  xp: number
  level: number
  createdAt: Date
}
