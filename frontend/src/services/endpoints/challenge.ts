import api from '@/services/api'
import { Challenge, CreateChallengeFormData } from '@/types/challenge'

export const challengeApi = {
  async getAll(params: Record<string, any> = {}): Promise<Challenge[]> {
    return (await api.get('/challenges', { params })) as Challenge[]
  },

  async create(challenge: CreateChallengeFormData): Promise<Challenge> {
    return (await api.post('/challenges', challenge)) as Challenge
  },

  async toggleReaction(id: string): Promise<any> {
    return api.post(`/challenges/${id}/react`)
  },

  async delete(id: string): Promise<any> {
    return api.delete(`/challenges/${id}`)
  },
}
