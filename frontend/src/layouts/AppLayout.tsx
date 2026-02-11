import AuthModal from '@/components/auth/AuthModal'
import Header from '@/components/nav/Header'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

function AppLayout() {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)
  const [newBadgeNotification, _setNewBadgeNotification] = useState<any>(null)

  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <>
      <Header onShowAuth={() => setShowAuthModal(true)} />

      {/* Badge Notification */}
      {newBadgeNotification && (
        <div className="fixed top-24 right-5 p-6 bg-gradient-card border-2 border-neon-green rounded-2xl z-[1001] animate-slide-up max-w-xs">
          <div className="text-3xl text-center mb-2">
            🎉 {newBadgeNotification.icon}
          </div>
          <h4 className="text-neon-green text-center mb-1">¡Nueva Medalla!</h4>
          <p className="text-center text-sm text-text-secondary">
            {newBadgeNotification.name}
          </p>
        </div>
      )}

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <footer className="py-4 border-t border-white/8 text-center mt-auto">
        <p className="text-text-muted text-sm">
          Desarrollado con 💜 por{' '}
          <span className="text-neon-cyan">CODEX</span> • Aprende a programar
          de forma interactiva
        </p>
      </footer>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}

export default AppLayout
