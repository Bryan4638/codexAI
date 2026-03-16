import api from '@/services/api'
import type { Lesson } from '@/types/lesson'

export const lessonApi = {
  async getAll(params: Record<string, string> = {}): Promise<Lesson[]> {
    return (await api.get('/lessons', { params })) as Lesson[]
  },
}
