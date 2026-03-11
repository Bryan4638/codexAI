import api from '@/services/api'
import {
  ExerciseFeedback,
  ExerciseResponse,
  LessonExercise,
} from '@/types/exercise'

interface GetExercisesParams {
  lessonId?: string
  difficulty?: string
}

export const exerciseApi = {
  async getAll(params: GetExercisesParams): Promise<LessonExercise[]> {
    const data: ExerciseResponse = await api.get('/exercises', { params })
    return data.exercises
  },

  async getById(id: string): Promise<LessonExercise> {
    return api.get(`/exercises/${id}`)
  },

  async validate(
    exerciseId: string,
    answer: string | number[] | Record<string, string>
  ): Promise<ExerciseFeedback> {
    return api.post('/exercises/validate', { exerciseId, answer })
  },
}
