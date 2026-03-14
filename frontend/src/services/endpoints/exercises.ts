import api from '@/services/api'
import type {
  ExerciseFeedback,
  ExerciseResponse,
  GetExercisesParams,
  LessonExercise,
} from '@/types/exercise'

export const exerciseApi = {
  async getAll(params: GetExercisesParams): Promise<LessonExercise[]> {
    const data = (await api.get('/exercises', { params })) as ExerciseResponse
    return data.exercises
  },

  async getById(id: string): Promise<LessonExercise> {
    return (await api.get(`/exercises/${id}`)) as LessonExercise
  },

  async validate(
    exerciseId: string,
    answer: string | number[] | Record<string, string>
  ): Promise<ExerciseFeedback> {
    return (await api.post('/exercises/validate', {
      exerciseId,
      answer,
    })) as ExerciseFeedback
  },
}
