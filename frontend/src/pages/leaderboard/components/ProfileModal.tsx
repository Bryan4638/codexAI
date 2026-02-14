import { UserProfileData } from '@/types/profile'

interface ProfileModalProps {
  isLoading: boolean
  profile: UserProfileData | null
  onClose: () => void
}

export default function ProfileModal({
  isLoading,
  profile,
  onClose,
}: ProfileModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal max-w-lg text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <p className="text-center">Cargando perfil...</p>
        ) : profile ? (
          <>
            {/* Header del Perfil */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-3xl">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  '👤'
                )}
              </div>
              <div>
                <h2 className="mb-1">
                  {profile.username}
                  {!profile.isPublic && ' 🔒'}
                </h2>
                <p className="text-text-secondary m-0">Nivel {profile.level}</p>
              </div>
            </div>

            {profile.isPublic ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="glass-card !p-4 text-center">
                    <div className="text-2xl text-neon-cyan">{profile.xp}</div>
                    <div className="text-xs text-text-muted">XP</div>
                  </div>
                  <div className="glass-card !p-4 text-center">
                    <div className="text-2xl text-neon-purple">
                      {profile.badgeCount}
                    </div>
                    <div className="text-xs text-text-muted">MEDALLAS</div>
                  </div>
                  <div className="glass-card !p-4 text-center">
                    <div className="text-2xl text-neon-green">
                      {profile.exercisesCompleted}
                    </div>
                    <div className="text-xs text-text-muted">EJERCICIOS</div>
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <div className="mb-8">
                    <h4 className="mb-2 text-text-secondary">Bio</h4>
                    <p className="text-sm">{profile.bio}</p>
                  </div>
                )}

                {/* Contact */}
                {(profile.contact?.github ||
                  profile.contact?.linkedin ||
                  profile.contact?.twitter ||
                  profile.contact?.website) && (
                  <div className="mb-8">
                    <h4 className="mb-2 text-text-secondary">Contacto</h4>
                    <div className="flex gap-4 flex-wrap">
                      {profile.contact.github && (
                        <a
                          href={`https://github.com/${profile.contact.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:underline"
                        >
                          🐙 GitHub
                        </a>
                      )}
                      {profile.contact.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${profile.contact.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:underline"
                        >
                          💼 LinkedIn
                        </a>
                      )}
                      {profile.contact.twitter && (
                        <a
                          href={`https://twitter.com/${profile.contact.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:underline"
                        >
                          𝕏 Twitter
                        </a>
                      )}
                      {profile.contact.website && (
                        <a
                          href={profile.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:underline"
                        >
                          🌐 Web
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Badges */}
                {profile.badges && profile.badges.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-text-secondary">Medallas</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.badges.map((badge: any) => (
                        <div
                          key={badge.id}
                          className="px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-xl text-sm"
                        >
                          {badge.icon} {badge.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-text-muted">
                <div className="text-5xl mb-4">🔒</div>
                <p>Este perfil es privado</p>
                <p className="text-sm">
                  Solo puedes ver el nombre y {profile.badgeCount} medallas
                </p>
              </div>
            )}

            <button className="btn btn-secondary w-full mt-8" onClick={onClose}>
              Cerrar
            </button>
          </>
        ) : (
          <p className="text-center text-text-muted">Error cargando perfil</p>
        )}
      </div>
    </div>
  )
}
