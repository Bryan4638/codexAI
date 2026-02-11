import { useAuthStore } from '@/store/useAuthStore'
import { SyntheticEvent, useState } from 'react'

interface AuthModalProps {
  onClose: () => void
}

function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { login, register } = useAuthStore()

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
      } else {
        await register(formData.username, formData.email, formData.password)
      }
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal max-w-[420px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6">
          {isLogin ? '🔐 Iniciar Sesión' : '🚀 Registrarse'}
        </h2>

        <form onSubmit={handleSubmit} className="text-left">
          {!isLogin && (
            <div className="mb-6">
              <label className="block mb-2 text-text-secondary">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
                className="w-full p-4 bg-bg-primary border-2 border-neon-cyan/30 rounded-xl text-text-main text-base outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300"
                placeholder="tu_nombre"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block mb-2 text-text-secondary">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 bg-bg-primary border-2 border-neon-cyan/30 rounded-xl text-text-main text-base outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300"
              placeholder="tu@email.com"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-text-secondary">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full p-4 bg-bg-primary border-2 border-neon-cyan/30 rounded-xl text-text-main text-base outline-none focus:border-neon-cyan focus:shadow-neon-cyan transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 bg-neon-pink/10 border border-neon-pink rounded-xl text-neon-pink mb-6 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full mb-6"
            disabled={loading}
          >
            {loading
              ? '⏳ Cargando...'
              : isLogin
                ? 'Iniciar Sesión'
                : 'Registrarse'}
          </button>
        </form>

        <p className="text-text-secondary text-sm">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <span
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            className="text-neon-cyan cursor-pointer hover:underline"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default AuthModal
