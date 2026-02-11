import { useAuthStore } from '@/store/useAuthStore'
import { SyntheticEvent, useEffect, useState } from 'react'
import Swal from 'sweetalert2'

interface AuthModalProps {
  onClose: () => void
}

function AuthModal({ onClose }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { otpSent, requestOtp, verifyOtp, resetAuth } = useAuthStore()

  // Reset auth state when modal opens/closes
  useEffect(() => {
    return () => resetAuth()
  }, [])

  const handleRequestOtp = async (e: SyntheticEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await requestOtp(email)
    } catch (err: any) {
      setError(err.message || 'Error al enviar código')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: SyntheticEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyOtp(code)
      onClose()
      
      // Show success toast
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#0a0a0f',
        color: '#fff',
        customClass: {
          popup: 'border border-neon-green/30 shadow-[0_0_20px_rgba(0,255,100,0.1)]'
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: '¡Bienvenido de vuelta! 🚀'
      })
    } catch (err: any) {
      setError(err.message || 'Código inválido')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    resetAuth()
    setCode('')
    setError('')
  }

  const inputClasses =
    'w-full p-4 bg-white/5 border-2 border-white/10 rounded-xl text-white text-base outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all duration-300 placeholder:text-white/20'

  return (
    <div className="modal-overlay backdrop-blur-md bg-black/60" onClick={onClose}>
      <div
        className="modal max-w-[420px] bg-[#0a0a0f]/90 border border-white/10 shadow-[0_0_50px_rgba(0,243,255,0.1)] p-8 rounded-3xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background gradients */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-neon-purple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h2 className="mb-2 text-2xl font-bold text-center bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            {otpSent ? '🔐 Verificar Código' : '👋 ¡Bienvenido!'}
          </h2>
          <p className="text-center text-text-secondary text-sm mb-8">
            {otpSent
              ? 'Introduce el código que enviamos a tu correo'
              : 'Accede a tu cuenta para continuar aprendiendo'}
          </p>

          {!otpSent && (
            <>
              <form onSubmit={handleRequestOtp} className="text-left space-y-4 mb-6">
                <div>
                  <label className="block mb-2 text-text-secondary text-sm font-medium ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClasses}
                    placeholder="ejemplo@correo.com"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-xl text-neon-pink text-sm flex items-center gap-2 animate-shake">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-full py-4 text-lg shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]"
                  disabled={loading}
                >
                  {loading ? '⏳ Enviando...' : 'Enviar Código ✨'}
                </button>
              </form>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                <span className="text-text-muted text-xs font-medium uppercase tracking-wider">
                  o continúa con
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
                  }
                  className="btn flex-1 bg-white text-black hover:bg-gray-200 border-none flex items-center justify-center gap-2 font-medium transition-transform active:scale-95 py-3"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-5 h-5"
                    alt="Google"
                  />
                  Google
                </button>
                <button
                  onClick={() =>
                    (window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`)
                  }
                  className="btn flex-1 bg-[#24292e] text-white hover:bg-[#2f363d] border border-white/10 flex items-center justify-center gap-2 font-medium transition-transform active:scale-95 py-3"
                >
                  <img
                    src="https://www.svgrepo.com/show/512317/github-142.svg"
                    className="w-5 h-5 invert"
                    alt="GitHub"
                  />
                  GitHub
                </button>
              </div>
            </>
          )}

          {otpSent && (
            <form onSubmit={handleVerifyOtp} className="text-left space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-text-secondary text-sm font-medium ml-1">
                    Código de verificación
                  </label>
                  <span className="text-xs text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded-full">
                    Enviado a {email}
                  </span>
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  maxLength={6}
                  className={`${inputClasses} text-center tracking-[0.8em] font-mono text-2xl py-5 border-neon-cyan/30`}
                  placeholder="000000"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-xl text-neon-pink text-sm flex items-center gap-2 animate-shake">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full py-4 text-lg shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                disabled={loading}
              >
                {loading ? '⏳ Verificando...' : '🚀 Entrar'}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full text-text-muted hover:text-white transition-colors text-sm py-2"
                disabled={loading}
              >
                ← Volver al inicio
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
