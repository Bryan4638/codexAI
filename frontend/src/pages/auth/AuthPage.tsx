import chambeadorDragonLogin from '@/assets/chambeador_dragon_login.webp'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/useAuthStore'
import { IconExclamationCircle, IconLoader2 } from '@tabler/icons-react'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import OAuthButtons from './components/OAuthButtons'

export function AuthPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const otpSent = useAuthStore((s) => s.otpSent)
  const resetAuth = useAuthStore((s) => s.resetAuth)
  const user = useAuthStore((s) => s.user)

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
      }
    )
  }

  const handleBack = () => {
    resetAuth()
    setCode('')
    setError('')
  }

  if (user) return <Navigate to="/" replace />
  return (
    <section className="min-h-screen bg-primary flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-6xl grid lg:grid-cols-2 bg-primary/80 border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,243,255,0.1)] overflow-hidden backdrop-blur-md">
        <main className="p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
              {otpSent ? 'Verificar Código' : 'Bienvenido'}
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
                    <div className="p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-xl text-neon-pink text-sm flex items-center gap-2">
                      <IconExclamationCircle /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={requestEmailCodeMutation.isPending}
                    className="btn btn-primary w-full py-3 shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                  >
                    {requestEmailCodeMutation.isPending ? (
                      <IconLoader2 className="animate-spin" />
                    ) : (
                      'Enviar Código'
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent flex-1" />
                  <span className="text-xs text-text-muted uppercase tracking-wider">
                    o continúa con
                  </span>
                  <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent flex-1" />
                </div>

                {/* OAuth Buttons */}
                <OAuthButtons />
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
                  <div className="p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-xl text-neon-pink text-sm flex items-center gap-2">
                    <IconExclamationCircle /> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={verifyEmailCodeMutation.isPending}
                  className="btn btn-primary w-full py-3 text-lg"
                >
                  {verifyEmailCodeMutation.isPending ? (
                    <IconLoader2 className="animate-spin" />
                  ) : (
                    'Entrar'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full text-text-muted hover:text-white text-sm"
                >
                  Volver
                </button>
              </form>
            )}
          </div>
        </main>

        {/* RIGHT - IMAGE */}
        <aside className="hidden lg:flex items-center justify-center bg-linear-to-br from-neon-cyan/10 via-transparent to-neon-purple/10 relative">
          <img
            src={chambeadorDragonLogin}
            alt="Auth illustration"
            className="max-w-md opacity-90"
          />
        </aside>
      </div>
    </section>
  )
}
