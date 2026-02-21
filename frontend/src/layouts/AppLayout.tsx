import AuthModal from '@/components/auth/AuthModal'
import Footer from '@/components/nav/Footer'
import Header from '@/components/nav/Header'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Swal from 'sweetalert2'

function AppLayout() {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)
  const [newBadgeNotification, _setNewBadgeNotification] = useState<any>(null)

  const { checkAuth } = useAuthStore()

  useEffect(() => {
    // Check for tokens in URL (OAuth redirect)
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const refreshToken = params.get('refreshToken')

    if (token) {
      localStorage.setItem('codex-token', token)
      if (refreshToken)
        localStorage.setItem('codex-refresh-token', refreshToken)

      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname)

      // Force auth check immediately
      checkAuth()

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
          popup:
            'border border-neon-green/30 shadow-[0_0_20px_rgba(0,255,100,0.1)]',
        },
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        },
      })

      Toast.fire({
        icon: 'success',
        title: '¡Sesión iniciada con éxito! 🚀',
      })
    } else {
      checkAuth()
    }
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

      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  )
}

export default AppLayout
