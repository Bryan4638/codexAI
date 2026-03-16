import api from '@/services/api'
import type {
  Challenge,
  CreateChallengeFormData,
  LiveCodingHistoryResponse,
  LiveCodingResult,
  LiveCodingSessionResponse,
  LiveCodingSubmitRequest,
  LiveCodingSyncRequest,
  PaginatedChallenges,
  ToggleReactionResponse,
} from '@/types/challenge'

export const challengeApi = {
  async getAll(
    params: Record<string, number | string> = {}
  ): Promise<PaginatedChallenges> {
    return (await api.get('/challenges', { params })) as PaginatedChallenges
  },

  async getById(id: string): Promise<Challenge> {
    return (await api.get(`/challenges/${id}`)) as Challenge
  },

  async create(challenge: CreateChallengeFormData): Promise<Challenge> {
    return (await api.post('/challenges', challenge)) as Challenge
  },

  async toggleReaction(id: string): Promise<ToggleReactionResponse> {
    return (await api.post(`/challenges/${id}/react`)) as ToggleReactionResponse
  },

  // TODO: Verificar que devuelve DELETE
  async delete(id: string): Promise<any> {
    const res = api.delete(`/challenges/${id}`)
    console.log(res)
    return res
  },

  // ── Live Coding ──────────────────────────────────────

  async startLiveCoding(
    difficulty?: string
  ): Promise<LiveCodingSessionResponse> {
    const body = difficulty ? { difficulty } : {}
    return (await api.post(
      '/challenges/live-coding/start',
      body
    )) as LiveCodingSessionResponse
  },

  async submitLiveCoding(
    data: LiveCodingSubmitRequest
  ): Promise<LiveCodingResult> {
    return (await api.post(
      '/challenges/live-coding/submit',
      data
    )) as LiveCodingResult
  },

  async getLiveCodingHistory(
    page = 1,
    limit = 10
  ): Promise<LiveCodingHistoryResponse> {
    return (await api.get('/challenges/live-coding/history', {
      params: { page, limit },
    })) as LiveCodingHistoryResponse
  },

  async syncLiveCoding(data: LiveCodingSyncRequest): Promise<void> {
    return await api.patch('/challenges/live-coding/sync', data)
  },

  async cancelLiveCoding(): Promise<void> {
    return await api.delete('/challenges/live-coding/cancel')
  },
}
