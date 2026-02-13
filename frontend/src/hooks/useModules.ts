import { moduleApi } from '@/services/endpoints/modules'
import { useQuery } from '@tanstack/react-query'

export const useModules = () => {
  const { getAll } = moduleApi

  const getModules = useQuery({
    queryKey: ['modules'],
    queryFn: () => getAll(),
  })
  return { getModules }
}
