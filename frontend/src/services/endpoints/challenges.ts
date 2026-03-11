import api from '@/services/api'
import {
  Challenge,
  CreateChallengeFormData,
  LiveCodingHistoryResponse,
  LiveCodingResult,
  LiveCodingSessionResponse,
  LiveCodingSubmitRequest,
  PaginatedChallenges,
} from '@/types/challenge'

export const challengeApi = {
  async getAll(
    params: Record<string, number | string> = {}
  ): Promise<PaginatedChallenges> {
    const res = await api.get('/challenges', { params })
    return res as unknown as PaginatedChallenges
  },

  async getById(id: string): Promise<Challenge> {
    const res = await api.get(`/challenges/${id}`)
    return res as unknown as Challenge
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

  // ── Live Coding ──────────────────────────────────────

  async startLiveCoding(
    difficulty?: string
  ): Promise<LiveCodingSessionResponse> {
    const body = difficulty ? { difficulty } : {}
    const res = await api.post('/challenges/live-coding/start', body)
    return res as unknown as LiveCodingSessionResponse
  },

  async submitLiveCoding(
    data: LiveCodingSubmitRequest
  ): Promise<LiveCodingResult> {
    const res = await api.post('/challenges/live-coding/submit', data)
    return res as unknown as LiveCodingResult
  },

  async getLiveCodingHistory(
    page = 1,
    limit = 10
  ): Promise<LiveCodingHistoryResponse> {
    const res = await api.get('/challenges/live-coding/history', {
      params: { page, limit },
    })
    return res as unknown as LiveCodingHistoryResponse
  },
}

