import { Badge } from '@/types/badge'
import { UserProfileData } from '@/types/profile'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconLock,
  IconUserFilled,
  IconWorld,
} from '@tabler/icons-react'
import ProfileStatsCard from './ProfileStatsCard'

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
            <header className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-3xl">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <IconUserFilled size={40} className="text-white/60" />
                )}
              </div>
              <div>
                <h2 className="mb-1 flex items-center gap-3">
                  {profile.username}
                </h2>
                <p className="text-text-secondary m-0">Nivel {profile.level}</p>
              </div>
            </header>

            {profile.isPublic ? (
              <>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 my-8">
                  <ProfileStatsCard
                    stat={profile.xp}
                    statName="XP"
                    className="text-neon-cyan"
                  />
                  <ProfileStatsCard
                    stat={profile.badgeCount}
                    statName="Medallas"
                    className="text-neon-purple"
                  />
                  <ProfileStatsCard
                    stat={profile.exercisesCompleted}
                    statName="Ejercicios"
                    className="text-neon-green"
                  />
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
                  <section className="mb-8">
                    <h4 className="mb-2 text-text-secondary">Contacto</h4>
                    <div className="flex gap-4 flex-wrap">
                      {profile.contact.github && (
                        <a
                          href={`https://github.com/${profile.contact.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:underline flex items-center gap-1"
                        >
                          <IconBrandGithub size={18} /> GitHub
                        </a>
                      )}
                      {profile.contact.linkedin && (
                        <a
                          href={`https://linkedin.com/in/${profile.contact.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:underline flex items-center gap-1"
                        >
                          <IconBrandLinkedin size={18} /> LinkedIn
                        </a>
                      )}
                      {profile.contact.twitter && (
                        <a
                          href={`https://twitter.com/${profile.contact.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:underline flex items-center gap-1"
                        >
                          <IconBrandX size={18} /> X (Twitter)
                        </a>
                      )}
                      {profile.contact.website && (
                        <a
                          href={profile.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:underline flex items-center gap-1"
                        >
                          <IconWorld size={18} /> Portafolio
                        </a>
                      )}
                    </div>
                  </section>
                )}

                {/* Badges */}
                {profile.badges && profile.badges.length > 0 && (
                  <section>
                    <h4 className="mb-2 text-text-secondary">Medallas</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.badges.map((badge: Badge) => (
                        <div
                          key={badge.id}
                          className="px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-xl text-sm"
                        >
                          {badge.icon} {badge.name}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              <section className="text-center flex flex-col items-center justify-center py-8">
                <div className="mb-4">
                  <IconLock size={58} />
                </div>
                <h2>Este perfil es privado</h2>
                <p className="text-sm text-text-muted">
                  Solo puedes ver su nombre y su nivel alcanzado
                </p>
              </section>
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
