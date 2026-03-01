import api from '@/services/api'
import {
  Challenge,
  CreateChallengeFormData,
  PaginatedChallenges,
} from '@/types/challenge'

export const challengeApi = {
  async getAll(params: Record<string, any> = {}): Promise<PaginatedChallenges> {
    const res = await api.get('/challenges', { params })
    return res as unknown as PaginatedChallenges
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
