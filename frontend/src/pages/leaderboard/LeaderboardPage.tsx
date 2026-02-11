import { leaderboardApi } from '@/services/endpoints/leaderboard'
import { UserProfileData } from '@/types/profile'
import { useEffect, useState } from 'react'

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<UserProfileData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardApi.getLeaderboard()
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error('Error cargando leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = async (userId: string) => {
    setSelectedUser(userId)
    setProfileLoading(true)
    try {
      const data = await leaderboardApi.getUserProfile(userId)
      setUserProfile(data.profile)
    } catch (error) {
      console.error('Error cargando perfil:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const closeProfile = () => {
    setSelectedUser(null)
    setUserProfile(null)
  }

  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)

  if (loading) {
    return (
      <section className="pt-32 max-w-7xl mx-auto px-6 text-center">
        <p>Cargando ranking...</p>
      </section>
    )
  }

  return (
    <section className="pt-32 max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2>🏆 Tabla de Posiciones</h2>
        <p className="mt-2">Los mejores estudiantes de CODEX</p>
      </div>

      {/* Podium - Top 3 */}
      {top3.length > 0 && (
        <div className="flex justify-center items-end gap-10 mb-24 flex-wrap">
          {/* 2nd place */}
          {top3[1] && (
            <div
              onClick={() => handleUserClick(top3[1].id)}
              className="glass-card p-8 text-center cursor-pointer order-1 min-w-[180px] scale-95 hover:scale-100 transition-transform duration-300"
            >
              <div className="text-4xl mb-4">🥈</div>
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl bg-gradient-secondary">
                {top3[1].avatarUrl ? (
                  <img
                    src={top3[1].avatarUrl}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  '👤'
                )}
              </div>
              <h4 className="text-neon-purple mb-1">{top3[1].username}</h4>
              <div className="text-sm text-text-secondary">
                Nivel {top3[1].level} • {top3[1].badgeCount} 🏅
              </div>
              <div className="text-xs text-text-muted mt-1">
                {top3[1].xp} XP
              </div>
            </div>
          )}

          {/* 1st place */}
          {top3[0] && (
            <div
              onClick={() => handleUserClick(top3[0].id)}
              className="glass-card p-10 text-center cursor-pointer order-2 min-w-[220px] scale-110 hover:scale-115 transition-transform duration-300 bg-[linear-gradient(135deg,rgba(0,240,255,0.2),rgba(139,92,246,0.2))] border-2 border-neon-cyan"
            >
              <div className="text-5xl mb-4">👑</div>
              <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-neon-cyan">
                {top3[0].avatarUrl ? (
                  <img
                    src={top3[0].avatarUrl}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  '👤'
                )}
              </div>
              <h3 className="text-neon-cyan mb-2 font-display">
                {top3[0].username}
              </h3>
              <div className="text-base">
                Nivel {top3[0].level} • {top3[0].badgeCount} 🏅
              </div>
              <div className="text-xl text-neon-cyan mt-2 font-semibold">
                {top3[0].xp} XP
              </div>
            </div>
          )}

          {/* 3rd place */}
          {top3[2] && (
            <div
              onClick={() => handleUserClick(top3[2].id)}
              className="glass-card p-6 text-center cursor-pointer order-3 min-w-[170px] scale-90 hover:scale-95 transition-transform duration-300"
            >
              <div className="text-3xl mb-2">🥉</div>
              <div className="w-16 h-16 bg-[linear-gradient(135deg,#CD7F32,#8B4513)] rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                {top3[2].avatarUrl ? (
                  <img
                    src={top3[2].avatarUrl}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  '👤'
                )}
              </div>
              <h4 className="text-[#CD7F32] mb-1">{top3[2].username}</h4>
              <div className="text-sm text-text-secondary">
                Nivel {top3[2].level} • {top3[2].badgeCount} 🏅
              </div>
              <div className="text-xs text-text-muted mt-1">
                {top3[2].xp} XP
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rest of ranking */}
      {rest.length > 0 && (
        <div className="glass-card !p-0 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neon-cyan/10 border-b border-neon-cyan/20">
                <th className="p-4 text-center w-16">#</th>
                <th className="p-4 text-left">Usuario</th>
                <th className="p-4 text-center">Nivel</th>
                <th className="p-4 text-center">Medallas</th>
                <th className="p-4 text-center">XP</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="border-b border-white/5 cursor-pointer transition-colors duration-200 hover:bg-neon-cyan/5"
                >
                  <td className="p-4 text-center font-display text-text-muted">
                    {user.rank}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-gradient-card rounded-full flex items-center justify-center text-base">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <span>{user.username}</span>
                      {!user.isPublic && (
                        <span className="text-[0.7rem] text-text-muted">
                          🔒
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center text-neon-purple">
                    {user.level}
                  </td>
                  <td className="p-4 text-center">{user.badgeCount} 🏅</td>
                  <td className="p-4 text-center text-neon-cyan font-mono">
                    {user.xp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {leaderboard.length === 0 && (
        <div className="text-center py-16 text-text-muted">
          <p>No hay usuarios en el ranking aún. ¡Sé el primero!</p>
        </div>
      )}

      {/* Profile Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={closeProfile}>
          <div
            className="modal max-w-lg text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {profileLoading ? (
              <p className="text-center">Cargando perfil...</p>
            ) : userProfile ? (
              <>
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-3xl">
                    {userProfile.avatarUrl ? (
                      <img
                        src={userProfile.avatarUrl}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      '👤'
                    )}
                  </div>
                  <div>
                    <h2 className="mb-1">
                      {userProfile.username}
                      {!userProfile.isPublic && ' 🔒'}
                    </h2>
                    <p className="text-text-secondary m-0">
                      Nivel {userProfile.level}
                    </p>
                  </div>
                </div>

                {userProfile.isPublic ? (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="glass-card !p-4 text-center">
                        <div className="text-2xl text-neon-cyan">
                          {userProfile.xp}
                        </div>
                        <div className="text-xs text-text-muted">XP</div>
                      </div>
                      <div className="glass-card !p-4 text-center">
                        <div className="text-2xl text-neon-purple">
                          {userProfile.badgeCount}
                        </div>
                        <div className="text-xs text-text-muted">MEDALLAS</div>
                      </div>
                      <div className="glass-card !p-4 text-center">
                        <div className="text-2xl text-neon-green">
                          {userProfile.exercisesCompleted}
                        </div>
                        <div className="text-xs text-text-muted">
                          EJERCICIOS
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {userProfile.bio && (
                      <div className="mb-8">
                        <h4 className="mb-2 text-text-secondary">Bio</h4>
                        <p className="text-sm">{userProfile.bio}</p>
                      </div>
                    )}

                    {/* Contact */}
                    {(userProfile.contact?.github ||
                      userProfile.contact?.linkedin ||
                      userProfile.contact?.twitter ||
                      userProfile.contact?.website) && (
                      <div className="mb-8">
                        <h4 className="mb-2 text-text-secondary">Contacto</h4>
                        <div className="flex gap-4 flex-wrap">
                          {userProfile.contact.github && (
                            <a
                              href={`https://github.com/${userProfile.contact.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neon-cyan hover:underline"
                            >
                              🐙 GitHub
                            </a>
                          )}
                          {userProfile.contact.linkedin && (
                            <a
                              href={`https://linkedin.com/in/${userProfile.contact.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neon-cyan hover:underline"
                            >
                              💼 LinkedIn
                            </a>
                          )}
                          {userProfile.contact.twitter && (
                            <a
                              href={`https://twitter.com/${userProfile.contact.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-neon-cyan hover:underline"
                            >
                              𝕏 Twitter
                            </a>
                          )}
                          {userProfile.contact.website && (
                            <a
                              href={userProfile.contact.website}
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
                    {userProfile.badges && userProfile.badges.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-text-secondary">Medallas</h4>
                        <div className="flex flex-wrap gap-2">
                          {userProfile.badges.map((badge) => (
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
                      Solo puedes ver el nombre y {userProfile.badgeCount}{' '}
                      medallas
                    </p>
                  </div>
                )}

                <button
                  className="btn btn-secondary w-full mt-8"
                  onClick={closeProfile}
                >
                  Cerrar
                </button>
              </>
            ) : (
              <p className="text-center text-text-muted">
                Error cargando perfil
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default LeaderboardPage
