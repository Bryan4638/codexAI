import { IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'

export default function OAuthButtons() {
  const [loadingOAuth, setLoadingOAuth] = useState<null | 'google' | 'github'>(
    null
  )

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    setLoadingOAuth(provider)
    const url = `${import.meta.env.VITE_API_URL}/auth/${provider}`
    window.location.href = url
  }
  return (
    <section className="flex gap-3">
      <button
        onClick={() => handleOAuthLogin('google')}
        disabled={loadingOAuth !== null}
        className="btn flex-1 bg-white text-black hover:bg-gray-200 border-none flex items-center justify-center gap-2"
      >
        {loadingOAuth === 'google' ? (
          <IconLoader2 className="animate-spin" />
        ) : (
          <>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Google
          </>
        )}
      </button>

      <button
        onClick={() => handleOAuthLogin('github')}
        disabled={loadingOAuth !== null}
        className="btn flex-1 bg-[#24292e] text-white hover:bg-[#2f363d] border border-white/10 flex items-center justify-center gap-2"
      >
        {loadingOAuth === 'github' ? (
          <IconLoader2 className="animate-spin" />
        ) : (
          <>
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              className="w-5 h-5 invert"
            />
            GitHub
          </>
        )}
      </button>
    </section>
  )
}
