export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  authorId: string
  author?: {
    username: string
    avatarUrl?: string
  }
  hasReacted?: boolean
  reactionsCount?: number
  createdAt?: string
  initialCode: string
  testCases: { input: string; output: string }[]
}

export interface CreateChallengeFormData {
  title: string
  description: string
  difficulty: string
  initialCode: string
  testCases: string
}
