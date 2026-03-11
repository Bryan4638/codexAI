import { useAuth } from '@/hooks/useAuth'
import { ReactNode, useEffect } from 'react'
import Swal from 'sweetalert2'

interface AuthInitializerProps {
  children: ReactNode
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const { meQuery } = useAuth()

  useEffect(() => {
    // Check for tokens in URL (OAuth redirect)
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const refreshToken = params.get('refreshToken')

    if (token) {
      localStorage.setItem('chamba-code-access-token', token)
      if (refreshToken)
        localStorage.setItem('chamba-code-refresh-token', refreshToken)

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)

      // Show success toast
      const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#12121a',
        color: '#e0fbff',
        customClass: {
          popup: 'border border-neon-green/80',
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })

      Toast.fire({
        icon: 'success',
        title: '¡Sesión iniciada con éxito!',
      })
    }
    // No necesitamos llamar checkAuth()
    // React Query automáticamente llamará /auth/me si hay token
  }, [])
  return <>{children}</>
}
