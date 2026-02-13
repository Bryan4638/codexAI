import { exerciseApi } from '@/services/endpoints/exercises'
import { useQuery } from '@tanstack/react-query'

interface UseExercisesParams {
  moduleId: string
  lessonId: string
}

export const useExercises = ({ moduleId, lessonId }: UseExercisesParams) => {
  const { getAll } = exerciseApi

  const getExercises = useQuery({
    queryKey: ['exercises', moduleId, lessonId],
    queryFn: async () => getAll({ moduleId, lessonId }),
    enabled: !!moduleId && !!lessonId,
  })
  return { getExercises }
}
