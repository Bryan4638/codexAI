import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/useAuthStore'
import { IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loadingOAuth, setLoadingOAuth] = useState<null | 'google' | 'github'>(
    null
  )

  const otpSent = useAuthStore((s) => s.otpSent)
  const resetAuth = useAuthStore((s) => s.resetAuth)

  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const navigate = useNavigate()

  const { requestEmailCodeMutation, verifyEmailCodeMutation } = useAuth()

  const handleRequestOtp = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError('')

    requestEmailCodeMutation.mutate(email, {
      onError: (err: any) => {
        setError(err?.message || 'Error al enviar código')
      },
    })
  }

  const handleVerifyOtp = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError('')

    verifyEmailCodeMutation.mutate(
      { email, code },
      {
        onError: (err: any) => {
          setError(err?.message || 'Código inválido')
        },
        onSuccess: () => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'bottom-right',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#0a0a0f',
            color: '#fff',
            customClass: {
              popup:
                'border border-neon-green/30 shadow-[0_0_20px_rgba(0,255,100,0.1)]',
            },
          })

          Toast.fire({
            icon: 'success',
            title: '¡Bienvenido de vuelta! 🚀',
          })
        },
      }
    )
  }

  const handleBack = () => {
    resetAuth()
    setCode('')
    setError('')
  }

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    setLoadingOAuth(provider)
    const url = `${import.meta.env.VITE_API_URL}/auth/${provider}`
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 bg-primary/80 border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,243,255,0.1)] overflow-hidden backdrop-blur-md">
        {/* LEFT - FORM */}
        <div className="p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
              {otpSent ? '🔐 Verificar Código' : 'Bienvenido'}
            </h1>

            <p className="text-text-secondary text-sm mb-8">
              {otpSent
                ? 'Introduce el código que enviamos a tu correo'
                : 'Accede a tu cuenta para continuar'}
            </p>

            {/* EMAIL FORM */}
            {!otpSent && (
              <>
                <form onSubmit={handleRequestOtp} className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-text-secondary text-sm">
                      Email
                    </label>

                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-white/5 border-2 border-white/10 rounded-xl text-white outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-xl text-neon-pink text-sm">
                      ⚠️ {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={requestEmailCodeMutation.isPending}
                    className="btn btn-primary w-full py-3 shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                  >
                    {requestEmailCodeMutation.isPending
                      ? '⏳ Enviando...'
                      : 'Enviar Código'}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                  <span className="text-xs text-text-muted uppercase tracking-wider">
                    o continúa con
                  </span>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                </div>

                {/* OAuth Buttons */}
                <div className="flex gap-3">
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
                    onClick={() => handleOAuthLogin('google')}
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
                </div>
              </>
            )}

            {/* OTP FORM */}
            {otpSent && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block mb-2 text-text-secondary text-sm">
                    Código de verificación
                  </label>

                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-4 bg-white/5 border-2 border-neon-cyan/30 rounded-xl text-white outline-none focus:border-neon-cyan/60 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] text-center tracking-[0.8em] font-mono text-2xl"
                    placeholder="000000"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-xl text-neon-pink text-sm">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={verifyEmailCodeMutation.isPending}
                  className="btn btn-primary w-full py-3 text-lg"
                >
                  {verifyEmailCodeMutation.isPending
                    ? '⏳ Verificando...'
                    : '🚀 Entrar'}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full text-text-muted hover:text-white text-sm"
                >
                  ← Volver
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT - IMAGE */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-purple/10 relative">
          <img
            src="/images/auth-illustration.png"
            alt="Auth illustration"
            className="max-w-md opacity-90"
          />
        </div>
      </div>
    </div>
  )
}
