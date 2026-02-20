import EditProfileModal from '@/pages/profile/components/EditProfileModal'
import { badgeApi } from '@/services/endpoints/badges'
import { useAuthStore } from '@/store/useAuthStore'
import { UserBadgeData } from '@/types/badge'
import { ProgressData } from '@/types/profile'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function ProfilePage() {
  const { user, logout } = useAuthStore()
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [badges, setBadges] = useState<UserBadgeData>({
    badges: [],
    unlocked: 0,
  })

  const [loading, setLoading] = useState<boolean>(true)
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [progressData, badgesData] = await Promise.all([
        badgeApi.getProgress(),
        badgeApi.getUserBadges(),
      ])
      setProgress(progressData)
      setBadges(badgesData)
      console.log(user)
      console.log(badges)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (showEditProfile) {
    return (
      <EditProfileModal
        onClose={() => setShowEditProfile(false)}
        onSave={loadData}
      />
    )
  }

  if (loading) {
    return (
      <div className="pt-32 max-w-7xl mx-auto px-6 text-center">
        <p>Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-16 max-w-3xl mx-auto px-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-12 max-md:flex-col max-md:text-center">
        <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-4xl shrink-0">
          👤
        </div>
        <div className="flex-1">
          <h1 className="mb-1 text-4xl">{user?.username}</h1>
          <p className="text-text-secondary m-0 text-lg">{user?.email}</p>
          {user?.createdAt && (
            <p className="text-text-muted text-sm mt-2">
              Miembro desde: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowEditProfile(true)}
            className="btn btn-secondary flex items-center gap-1"
          >
            ✏️ Editar Perfil
          </button>
          <button
            className="btn bg-neon-pink/20 text-neon-pink border border-neon-pink"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-12 max-md:grid-cols-1">
        <div className="glass-card !p-8 text-center">
          <div className="text-5xl font-display text-neon-cyan">
            {progress?.level || 1}
          </div>
          <div className="text-base text-text-muted tracking-widest mt-2">
            NIVEL
          </div>
        </div>
        <div className="glass-card !p-8 text-center">
          <div className="text-5xl font-display text-neon-purple">
            {progress?.xp || 0}
          </div>
          <div className="text-base text-text-muted tracking-widest mt-2">
            XP
          </div>
        </div>
        <div className="glass-card !p-8 text-center">
          <div className="text-5xl font-display text-neon-green">
            {progress?.completedExercises || 0}
          </div>
          <div className="text-base text-text-muted tracking-widest mt-2">
            EJERCICIOS
          </div>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="glass-card !p-8 mb-12">
        <div className="flex justify-between mb-4">
          <span className="text-text-secondary">
            Progreso al nivel {(progress?.level || 1) + 1}
          </span>
          <span className="text-neon-cyan font-mono text-xl">
            {progress?.xp || 0} / {progress?.nextLevelXp || 100} XP
          </span>
        </div>
        <div className="progress-bar !h-3">
          <div
            className="progress-fill"
            style={{ width: `${progress?.levelProgress || 0}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
        {/* Badges */}
        <div>
          <h3 className="mb-6 flex items-center gap-2">
            🏆 Medallas ({badges.unlocked}/{badges.badges.length})
          </h3>
          <div className="flex flex-wrap gap-4">
            {badges.badges.length > 0 ? (
              badges.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="glass-card !p-6 text-center min-w-[120px] flex-1"
                >
                  <div className="text-4xl mb-1">{badge.icon}</div>
                  <div className="text-sm font-semibold">{badge.name}</div>
                </div>
              ))
            ) : (
              <p className="text-text-muted italic">
                Completa ejercicios para desbloquear medallas
              </p>
            )}
          </div>
        </div>

        {/* Module Progress */}
        <div>
          {progress?.moduleProgress && (
            <>
              <h3 className="mb-6">📊 Progreso por Módulo</h3>
              <div className="glass-card !p-6">
                {Object.entries(progress.moduleProgress).map(
                  ([moduleId, data]) => (
                    <div key={moduleId} className="mb-6 last:mb-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-text-secondary">
                          Módulo {moduleId}
                        </span>
                        <span className="text-neon-cyan">
                          {data.completed}/{data.total}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${(data.completed / data.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Activity History */}
      {progress?.history && progress.history.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-6">📜 Historial de Actividad</h3>
          <div className="glass-card !p-0 overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              {progress.history.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="px-6 py-4 border-b border-white/5 flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold mb-1">{item.title}</div>
                    <div className="text-sm text-text-secondary">
                      {new Date(item.completedAt).toLocaleDateString()} •{' '}
                      {new Date(item.completedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="bg-white/5 px-3 py-1 rounded-full text-sm text-text-muted">
                    {item.attempts} intento{item.attempts !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
