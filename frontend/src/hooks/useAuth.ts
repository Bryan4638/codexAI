import { useMe } from '@/hooks/custom-hooks/useMe'
import { authApi } from '@/services/endpoints/auth'
import { useAuthStore } from '@/store/useAuthStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'

export const useAuth = () => {
  const { requestEmailCode, verifyEmailCode, logout } = authApi
  const { setOtpSent, setEmail, resetAuth } = useAuthStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from || '/'

  const meQuery = useMe()

  const requestEmailCodeMutation = useMutation({
    mutationFn: (email: string) => requestEmailCode(email),
    onSuccess: (_, email) => {
      setOtpSent(true)
      setEmail(email)
    },
  })

  const verifyEmailCodeMutation = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      verifyEmailCode(email, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      navigate(from)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => logout(),
    onSuccess: () => {
      queryClient.clear()
      resetAuth()
      navigate('/')
    },
  })

  return {
    meQuery,
    requestEmailCodeMutation,
    verifyEmailCodeMutation,
    logoutMutation,
  }
}
