import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { badgeApi } from "@/services/endpoints/badge";
import EditProfileModal from "@/pages/profile/components/EditProfileModal";
import { ProgressData, ProfileBadgesData } from "@/types/profile";

function ProfilePage() {
  const { user, logout } = useAuthStore();
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [badges, setBadges] = useState<ProfileBadgesData>({
    badges: [],
    total: 0,
    unlocked: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [progressData, badgesData] = await Promise.all([
        badgeApi.getProgress(),
        badgeApi.getUserBadges(),
      ]);
      setProgress(progressData);
      setBadges(badgesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (showEditProfile) {
    return (
      <EditProfileModal
        onClose={() => setShowEditProfile(false)}
        onSave={loadData}
      />
    );
  }

  if (loading) {
    return (
      <div
        className="container"
        style={{ paddingTop: "120px", textAlign: "center" }}
      >
        <p>Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{ paddingTop: "120px", paddingBottom: "60px" }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header del perfil */}
        <div
          className="profile-header-container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-lg)",
            marginBottom: "var(--spacing-2xl)",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              background: "var(--gradient-primary)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
            }}
          >
            👤
          </div>
          <div style={{ flex: 1 }}>
            <h1
              style={{ marginBottom: "var(--spacing-xs)", fontSize: "2.5rem" }}
            >
              {user?.username}
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                margin: 0,
                fontSize: "1.1rem",
              }}
            >
              {user?.email}
            </p>
            {user?.createdAt && (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  marginTop: "8px",
                }}
              >
                Miembro desde: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
            <button
              onClick={() => setShowEditProfile(true)}
              className="btn btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-xs)",
              }}
            >
              ✏️ Editar Perfil
            </button>
            <button
              className="btn"
              onClick={handleLogout}
              style={{
                background: "rgba(255, 45, 146, 0.2)",
                color: "var(--neon-pink)",
                border: "1px solid var(--neon-pink)",
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          className="profile-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--spacing-lg)",
            marginBottom: "var(--spacing-2xl)",
          }}
        >
          <div
            className="glass-card"
            style={{ padding: "var(--spacing-xl)", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: "3rem",
                fontFamily: "var(--font-display)",
                color: "var(--neon-cyan)",
              }}
            >
              {progress?.level || 1}
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: "var(--text-muted)",
                letterSpacing: "2px",
              }}
            >
              NIVEL
            </div>
          </div>
          <div
            className="glass-card"
            style={{ padding: "var(--spacing-xl)", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: "3rem",
                fontFamily: "var(--font-display)",
                color: "var(--neon-purple)",
              }}
            >
              {progress?.xp || 0}
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: "var(--text-muted)",
                letterSpacing: "2px",
              }}
            >
              XP
            </div>
          </div>
          <div
            className="glass-card"
            style={{ padding: "var(--spacing-xl)", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: "3rem",
                fontFamily: "var(--font-display)",
                color: "var(--neon-green)",
              }}
            >
              {progress?.completedExercises || 0}
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: "var(--text-muted)",
                letterSpacing: "2px",
              }}
            >
              EJERCICIOS
            </div>
          </div>
        </div>

        {/* Barra de progreso del nivel */}
        <div
          className="glass-card"
          style={{
            padding: "var(--spacing-xl)",
            marginBottom: "var(--spacing-2xl)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "var(--spacing-md)",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              Progreso al nivel {(progress?.level || 1) + 1}
            </span>
            <span
              style={{
                color: "var(--neon-cyan)",
                fontFamily: "var(--font-mono)",
                fontSize: "1.2rem",
              }}
            >
              {progress?.xp || 0} / {progress?.nextLevelXp || 100} XP
            </span>
          </div>
          <div className="progress-bar" style={{ height: "12px" }}>
            <div
              className="progress-fill"
              style={{ width: `${progress?.levelProgress || 0}%` }}
            />
          </div>
        </div>

        <div
          className="profile-content-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--spacing-xl)",
          }}
        >
          {/* Medallas */}
          <div>
            <h3
              style={{
                marginBottom: "var(--spacing-lg)",
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
              }}
            >
              🏆 Medallas ({badges.unlocked}/{badges.total})
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--spacing-md)",
              }}
            >
              {badges.badges.length > 0 ? (
                badges.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="glass-card"
                    style={{
                      padding: "var(--spacing-lg)",
                      textAlign: "center",
                      minWidth: "120px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2.5rem",
                        marginBottom: "var(--spacing-xs)",
                      }}
                    >
                      {badge.icon}
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>
                      {badge.name}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                  Completa ejercicios para desbloquear medallas
                </p>
              )}
            </div>
          </div>

          {/* Progreso por módulo */}
          <div>
            {progress?.moduleProgress && (
              <>
                <h3 style={{ marginBottom: "var(--spacing-lg)" }}>
                  📊 Progreso por Módulo
                </h3>
                <div
                  className="glass-card"
                  style={{ padding: "var(--spacing-lg)" }}
                >
                  {Object.entries(progress.moduleProgress).map(
                    ([moduleId, data]) => (
                      <div
                        key={moduleId}
                        style={{ marginBottom: "var(--spacing-lg)" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "var(--spacing-xs)",
                          }}
                        >
                          <span style={{ color: "var(--text-secondary)" }}>
                            Módulo {moduleId}
                          </span>
                          <span style={{ color: "var(--neon-cyan)" }}>
                            {data.completed}/{data.total}
                          </span>
                        </div>
                        <div className="progress-bar" style={{ height: "8px" }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${(data.completed / data.total) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Historial de Actividad */}
        {progress?.history && progress.history.length > 0 && (
          <div style={{ marginTop: "var(--spacing-2xl)" }}>
            <h3 style={{ marginBottom: "var(--spacing-lg)" }}>
              📜 Historial de Actividad
            </h3>
            <div
              className="glass-card"
              style={{ padding: "0", overflow: "hidden" }}
            >
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {progress.history.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    style={{
                      padding: "var(--spacing-md) var(--spacing-lg)",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "var(--text-primary)",
                          marginBottom: "4px",
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {new Date(item.completedAt).toLocaleDateString()} •{" "}
                        {new Date(item.completedAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.05)",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {item.attempts} intento{item.attempts !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
