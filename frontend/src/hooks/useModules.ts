import { moduleApi } from '@/services/endpoints/modules'
import { useQuery } from '@tanstack/react-query'

export const useModules = () => {
  const { getAll } = moduleApi

  const modulesQuery = useQuery({
    queryKey: ['modules'],
    queryFn: () => getAll(),
  })
  return { modulesQuery }
}
