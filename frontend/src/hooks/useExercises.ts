import { exerciseApi } from '@/services/endpoints/exercises'
import { useMutation, useQuery } from '@tanstack/react-query'

interface UseExercisesParams {
  lessonId: string
  difficulty?: string
  exerciseId?: string
}

export const useExercises = ({
  lessonId,
  difficulty,
  exerciseId,
}: UseExercisesParams) => {
  const { getAll, getById, validate } = exerciseApi

  const exercisesQuery = useQuery({
    queryKey: ['exercises', lessonId, difficulty],
    queryFn: () => getAll({ lessonId, ...(difficulty ? { difficulty } : {}) }),
    enabled: Boolean(lessonId),
  })

  const exerciseByIdQuery = useQuery({
    queryKey: ['exercise', exerciseId],
    queryFn: () => getById(exerciseId!),
    enabled: !!exerciseId,
  })

  const validateExersiceMutation = useMutation({
    mutationFn: (exerciseId: string, answer: any) =>
      validate(exerciseId, answer),
    onError: (error) => {
      console.error('Error validating exersice:', error)
    },
  })
  return { exercisesQuery, exerciseByIdQuery, validateExersiceMutation }
}
