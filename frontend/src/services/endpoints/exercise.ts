import api from '@/services/api'
import { ExerciseResponse, LessonExercise } from '@/types/exercise'

export const exerciseApi = {
  async getAll(params: Record<string, any> = {}): Promise<LessonExercise[]> {
    const data: ExerciseResponse = await api.get('/exercises', { params })
    return data.exercises
  },

  async getById(id: string): Promise<LessonExercise> {
    return api.get(`/exercises/${id}`)
  },

  async validate(exerciseId: string, answer: any): Promise<any> {
    return api.post('/exercises/validate', { exerciseId, answer })
  },
}
