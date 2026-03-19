import Header from '@/components/nav/Header'
import { useMe } from '@/hooks/custom-hooks/useMe'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

function AppLayout() {
  useMe()
  const [newBadgeNotification, _setNewBadgeNotification] = useState<any>(null)

  return (
    <>
      <Header />
      {newBadgeNotification && (
        <div className="fixed top-24 right-5 p-6 bg-gradient-card border-2 border-neon-green rounded-2xl z-1001 animate-slide-up max-w-sm">
          <div className="text-3xl text-center mb-2">
            {newBadgeNotification.icon}
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
    </>
  )
}

export default AppLayout
