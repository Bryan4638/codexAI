import { exerciseApi } from '@/services/endpoints/exercises'
import { useQuery } from '@tanstack/react-query'

interface UseExercisesParams {
  lessonId: string
  difficulty?: string
}

export const useExercises = ({ lessonId, difficulty }: UseExercisesParams) => {
  const { getAll } = exerciseApi

  const getExercises = useQuery({
    queryKey: ['exercises', lessonId, difficulty],
    queryFn: () => getAll({ lessonId, ...(difficulty ? { difficulty } : {}) }),
    enabled: Boolean(lessonId),
  })
  return { getExercises }
}
