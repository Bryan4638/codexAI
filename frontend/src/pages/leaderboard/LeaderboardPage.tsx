import { useState, useEffect } from "react";
import { leaderboardApi } from "@/services/endpoints/leaderboard";
import { LeaderboardUser } from "@/types/leaderboard";
import { UserProfileData } from "@/types/profile";

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await leaderboardApi.getLeaderboard();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Error cargando leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (userId: string) => {
    setSelectedUser(userId);
    setProfileLoading(true);
    try {
      const data = await leaderboardApi.getUserProfile(userId);
      setUserProfile(data.profile);
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const closeProfile = () => {
    setSelectedUser(null);
    setUserProfile(null);
  };

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  if (loading) {
    return (
      <section
        className="container"
        style={{ paddingTop: "120px", textAlign: "center" }}
      >
        <p>Cargando ranking...</p>
      </section>
    );
  }

  return (
    <section className="container" style={{ paddingTop: "120px" }}>
      <div
        className="section-header"
        style={{ textAlign: "center", marginBottom: "var(--spacing-2xl)" }}
      >
        <h2>🏆 Tabla de Posiciones</h2>
        <p>Los mejores estudiantes de CODEX</p>
      </div>

      {/* Podio - Top 3 */}
      {top3.length > 0 && (
        <div
          className="leaderboard-podium"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "var(--spacing-lg)",
            marginBottom: "var(--spacing-3xl)",
            flexWrap: "wrap",
          }}
        >
          {/* 2do lugar */}
          {top3[1] && (
            <div
              onClick={() => handleUserClick(top3[1].id)}
              className="glass-card"
              style={{
                padding: "var(--spacing-xl)",
                textAlign: "center",
                cursor: "pointer",
                transition: "var(--transition-normal)",
                transform: "scale(0.95)",
                order: 1,
                minWidth: "180px",
              }}
            >
              <div
                style={{ fontSize: "2rem", marginBottom: "var(--spacing-sm)" }}
              >
                🥈
              </div>
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  background: "var(--gradient-secondary)",
                  borderRadius: "50%",
                  margin: "0 auto var(--spacing-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                }}
              >
                {top3[1].avatarUrl ? (
                  <img
                    src={top3[1].avatarUrl}
                    alt=""
                    style={{ width: "100%", borderRadius: "50%" }}
                  />
                ) : (
                  "👤"
                )}
              </div>
              <h4
                style={{
                  color: "var(--neon-purple)",
                  marginBottom: "var(--spacing-xs)",
                }}
              >
                {top3[1].username}
              </h4>
              <div
                style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
              >
                Nivel {top3[1].level} • {top3[1].badgeCount} 🏅
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  marginTop: "var(--spacing-xs)",
                }}
              >
                {top3[1].xp} XP
              </div>
            </div>
          )}

          {/* 1er lugar */}
          {top3[0] && (
            <div
              onClick={() => handleUserClick(top3[0].id)}
              className="glass-card"
              style={{
                padding: "var(--spacing-2xl)",
                textAlign: "center",
                cursor: "pointer",
                transition: "var(--transition-normal)",
                transform: "scale(1.1)",
                order: 2,
                minWidth: "220px",
                background:
                  "linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2))",
                border: "2px solid var(--neon-cyan)",
              }}
            >
              <div
                style={{ fontSize: "3rem", marginBottom: "var(--spacing-md)" }}
              >
                👑
              </div>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  background: "var(--gradient-primary)",
                  borderRadius: "50%",
                  margin: "0 auto var(--spacing-lg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  boxShadow: "0 0 30px rgba(0, 240, 255, 0.5)",
                }}
              >
                {top3[0].avatarUrl ? (
                  <img
                    src={top3[0].avatarUrl}
                    alt=""
                    style={{ width: "100%", borderRadius: "50%" }}
                  />
                ) : (
                  "👤"
                )}
              </div>
              <h3
                style={{
                  color: "var(--neon-cyan)",
                  marginBottom: "var(--spacing-sm)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {top3[0].username}
              </h3>
              <div style={{ fontSize: "1rem", color: "var(--text-primary)" }}>
                Nivel {top3[0].level} • {top3[0].badgeCount} 🏅
              </div>
              <div
                style={{
                  fontSize: "1.2rem",
                  color: "var(--neon-cyan)",
                  marginTop: "var(--spacing-sm)",
                  fontWeight: "600",
                }}
              >
                {top3[0].xp} XP
              </div>
            </div>
          )}

          {/* 3er lugar */}
          {top3[2] && (
            <div
              onClick={() => handleUserClick(top3[2].id)}
              className="glass-card"
              style={{
                padding: "var(--spacing-xl)",
                textAlign: "center",
                cursor: "pointer",
                transition: "var(--transition-normal)",
                transform: "scale(0.9)",
                order: 3,
                minWidth: "170px",
              }}
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                🥉
              </div>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: "linear-gradient(135deg, #CD7F32, #8B4513)",
                  borderRadius: "50%",
                  margin: "0 auto var(--spacing-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                {top3[2].avatarUrl ? (
                  <img
                    src={top3[2].avatarUrl}
                    alt=""
                    style={{ width: "100%", borderRadius: "50%" }}
                  />
                ) : (
                  "👤"
                )}
              </div>
              <h4
                style={{ color: "#CD7F32", marginBottom: "var(--spacing-xs)" }}
              >
                {top3[2].username}
              </h4>
              <div
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
              >
                Nivel {top3[2].level} • {top3[2].badgeCount} 🏅
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "var(--spacing-xs)",
                }}
              >
                {top3[2].xp} XP
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resto del ranking */}
      {rest.length > 0 && (
        <div className="glass-card" style={{ padding: 0, overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.95rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "rgba(0, 240, 255, 0.1)",
                  borderBottom: "1px solid rgba(0, 240, 255, 0.2)",
                }}
              >
                <th
                  style={{
                    padding: "var(--spacing-md)",
                    textAlign: "center",
                    width: "60px",
                  }}
                >
                  #
                </th>
                <th style={{ padding: "var(--spacing-md)", textAlign: "left" }}>
                  Usuario
                </th>
                <th
                  style={{ padding: "var(--spacing-md)", textAlign: "center" }}
                >
                  Nivel
                </th>
                <th
                  style={{ padding: "var(--spacing-md)", textAlign: "center" }}
                >
                  Medallas
                </th>
                <th
                  style={{ padding: "var(--spacing-md)", textAlign: "center" }}
                >
                  XP
                </th>
              </tr>
            </thead>
            <tbody>
              {rest.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    cursor: "pointer",
                    transition: "var(--transition-fast)",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(0, 240, 255, 0.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                      fontFamily: "var(--font-display)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {user.rank}
                  </td>
                  <td style={{ padding: "var(--spacing-md)" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--spacing-sm)",
                      }}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          background: "var(--gradient-card)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1rem",
                        }}
                      >
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt=""
                            style={{ width: "100%", borderRadius: "50%" }}
                          />
                        ) : (
                          "👤"
                        )}
                      </div>
                      <span>{user.username}</span>
                      {!user.isPublic && (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          🔒
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                      color: "var(--neon-purple)",
                    }}
                  >
                    {user.level}
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                    }}
                  >
                    {user.badgeCount} 🏅
                  </td>
                  <td
                    style={{
                      padding: "var(--spacing-md)",
                      textAlign: "center",
                      color: "var(--neon-cyan)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {user.xp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {leaderboard.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "var(--spacing-3xl)",
            color: "var(--text-muted)",
          }}
        >
          <p>No hay usuarios en el ranking aún. ¡Sé el primero!</p>
        </div>
      )}

      {/* Modal de Perfil */}
      {selectedUser && (
        <div className="modal-overlay" onClick={closeProfile}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "500px", textAlign: "left" }}
          >
            {profileLoading ? (
              <p style={{ textAlign: "center" }}>Cargando perfil...</p>
            ) : userProfile ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--spacing-lg)",
                    marginBottom: "var(--spacing-xl)",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      background: "var(--gradient-primary)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    {userProfile.avatarUrl ? (
                      <img
                        src={userProfile.avatarUrl}
                        alt=""
                        style={{ width: "100%", borderRadius: "50%" }}
                      />
                    ) : (
                      "👤"
                    )}
                  </div>
                  <div>
                    <h2 style={{ marginBottom: "var(--spacing-xs)" }}>
                      {userProfile.username}
                      {!userProfile.isPublic && " 🔒"}
                    </h2>
                    <p style={{ color: "var(--text-secondary)", margin: 0 }}>
                      Nivel {userProfile.level}
                    </p>
                  </div>
                </div>

                {userProfile.isPublic ? (
                  <>
                    {/* Stats */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "var(--spacing-md)",
                        marginBottom: "var(--spacing-xl)",
                      }}
                    >
                      <div
                        className="glass-card"
                        style={{
                          padding: "var(--spacing-md)",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.5rem",
                            color: "var(--neon-cyan)",
                          }}
                        >
                          {userProfile.xp}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          XP
                        </div>
                      </div>
                      <div
                        className="glass-card"
                        style={{
                          padding: "var(--spacing-md)",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.5rem",
                            color: "var(--neon-purple)",
                          }}
                        >
                          {userProfile.badgeCount}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          MEDALLAS
                        </div>
                      </div>
                      <div
                        className="glass-card"
                        style={{
                          padding: "var(--spacing-md)",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.5rem",
                            color: "var(--neon-green)",
                          }}
                        >
                          {userProfile.exercisesCompleted}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          EJERCICIOS
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {userProfile.bio && (
                      <div style={{ marginBottom: "var(--spacing-xl)" }}>
                        <h4
                          style={{
                            marginBottom: "var(--spacing-sm)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Bio
                        </h4>
                        <p style={{ fontSize: "0.95rem" }}>{userProfile.bio}</p>
                      </div>
                    )}

                    {/* Contacto */}
                    {(userProfile.contact?.github ||
                      userProfile.contact?.linkedin ||
                      userProfile.contact?.twitter ||
                      userProfile.contact?.website) && (
                      <div style={{ marginBottom: "var(--spacing-xl)" }}>
                        <h4
                          style={{
                            marginBottom: "var(--spacing-sm)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Contacto
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--spacing-md)",
                            flexWrap: "wrap",
                          }}
                        >
                          {userProfile.contact.github && (
                            <a
                              href={`https://github.com/${userProfile.contact.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "var(--neon-cyan)",
                                textDecoration: "none",
                              }}
                            >
                              🐙 GitHub
                            </a>
                          )}
                          {userProfile.contact.linkedin && (
                            <a
                              href={`https://linkedin.com/in/${userProfile.contact.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "var(--neon-cyan)",
                                textDecoration: "none",
                              }}
                            >
                              💼 LinkedIn
                            </a>
                          )}
                          {userProfile.contact.twitter && (
                            <a
                              href={`https://twitter.com/${userProfile.contact.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "var(--neon-cyan)",
                                textDecoration: "none",
                              }}
                            >
                              𝕏 Twitter
                            </a>
                          )}
                          {userProfile.contact.website && (
                            <a
                              href={userProfile.contact.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "var(--neon-cyan)",
                                textDecoration: "none",
                              }}
                            >
                              🌐 Web
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Medallas */}
                    {userProfile.badges && userProfile.badges.length > 0 && (
                      <div>
                        <h4
                          style={{
                            marginBottom: "var(--spacing-sm)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Medallas
                        </h4>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "var(--spacing-sm)",
                          }}
                        >
                          {userProfile.badges.map((badge) => (
                            <div
                              key={badge.id}
                              style={{
                                padding: "var(--spacing-sm) var(--spacing-md)",
                                background: "rgba(0, 255, 136, 0.1)",
                                border: "1px solid rgba(0, 255, 136, 0.3)",
                                borderRadius: "var(--radius-md)",
                                fontSize: "0.85rem",
                              }}
                            >
                              {badge.icon} {badge.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "var(--spacing-xl)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "3rem",
                        marginBottom: "var(--spacing-md)",
                      }}
                    >
                      🔒
                    </div>
                    <p>Este perfil es privado</p>
                    <p style={{ fontSize: "0.9rem" }}>
                      Solo puedes ver el nombre y {userProfile.badgeCount}{" "}
                      medallas
                    </p>
                  </div>
                )}

                <button
                  className="btn btn-secondary"
                  onClick={closeProfile}
                  style={{ width: "100%", marginTop: "var(--spacing-xl)" }}
                >
                  Cerrar
                </button>
              </>
            ) : (
              <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
                Error cargando perfil
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default LeaderboardPage;
