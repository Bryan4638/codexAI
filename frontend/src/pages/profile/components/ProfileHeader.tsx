import EditProfileModal from '@/pages/profile/components/EditProfileModal'
import { useAuthStore } from '@/store/useAuthStore'
import { IconUserFilled } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProfileHeader() {
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false)

  const { user, logout } = useAuthStore()
  const { username, email, avatarUrl, createdAt } = user || {}
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const refreshProfile = () => {
    queryClient.invalidateQueries({ queryKey: ['userBadges'] })
    queryClient.invalidateQueries({ queryKey: ['userProgress'] })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (showEditProfile) {
    return (
      <EditProfileModal
        onClose={() => setShowEditProfile(false)}
        onSave={refreshProfile}
      />
    )
  }

  return (
    <div className="flex items-center gap-6 mb-12 max-md:flex-col max-md:text-center">
      <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-4xl shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full rounded-full"
          />
        ) : (
          <IconUserFilled size={42} />
        )}
      </div>
      <div className="flex-1">
        <h1 className="mb-1 text-4xl">{username}</h1>
        <p className="text-text-secondary m-0 text-lg">{email}</p>
        {createdAt && (
          <p className="text-text-muted text-sm mt-2">
            Miembro desde: {new Date(createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 max-sm:w-full max-sm:flex-col">
        <button
          onClick={() => setShowEditProfile(true)}
          className="btn btn-secondary"
        >
          Editar Perfil
        </button>
        <button
          className="border-neon-pink text-neon-pink transition-colors duration-300 btn btn-secondary shadow-none hover:bg-neon-pink/30"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
