import { lessonApi } from '@/services/endpoints/lessons'
import { useQuery } from '@tanstack/react-query'

export const useLessons = (moduleId?: string) => {
  const { getAll } = lessonApi

  const getLessons = useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: () => getAll(moduleId ? { moduleId } : {}),
    enabled: Boolean(moduleId),
  })

  return { getLessons }
}
