import { authApi } from '@/services/endpoints/auth'
import { useAuthStore } from '@/store/useAuthStore'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export const useMe = () => {
  const setUser = useAuthStore((s) => s.setUser)

  const query = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    retry: false,
  })

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
    } else if (query.isError) {
      setUser(null)
    }
  }, [query.data, query.isError, setUser])

  return query
}
