import AuthModal from '@/components/auth/AuthModal'
import { useState } from 'react'

export default function LoginRequired() {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)

  return (
    <>
      <section className="py-28 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl">Acceso Restringido</h2>
        <p className="mb-10 mt-2 text-sm">
          Inicia sesión para desbloquear medallas.
        </p>

        <button
          onClick={() => setShowAuthModal(true)}
          className="btn btn-primary"
        >
          Iniciar sesión
        </button>
      </section>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}
