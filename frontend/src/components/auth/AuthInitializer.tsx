import { ReactNode, useEffect } from 'react'
import { sileo } from 'sileo'

interface AuthInitializerProps {
  children: ReactNode
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
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
      sileo.success({
        title: '¡Bienvenido!',
      })
    }
  }, [])
  return <>{children}</>
}
