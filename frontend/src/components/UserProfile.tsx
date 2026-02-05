import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { badgeApi } from "../services/api";
import EditProfileModal from "../pages/profile/components/EditProfileModal";

interface UserProfileProps {
  onClose: () => void;
}

function UserProfile({ onClose }: UserProfileProps) {
  const { user, logout } = useAuthStore();
  const [progress, setProgress] = useState<any>(null); // Use any or strict type if defined elsewhere
  const [badges, setBadges] = useState<any>({
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
    onClose();
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
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header del perfil */}
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
            👤
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: "var(--spacing-xs)" }}>
              {user?.username}
            </h2>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              {user?.email}
            </p>
            {user?.createdAt && (
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  marginTop: "4px",
                }}
              >
                Miembro desde: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowEditProfile(true)}
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              background: "rgba(139, 92, 246, 0.2)",
              border: "1px solid var(--neon-purple)",
              borderRadius: "var(--radius-md)",
              color: "var(--neon-purple)",
              cursor: "pointer",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-xs)",
            }}
          >
            ✏️ Editar
          </button>
        </div>

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
            style={{ padding: "var(--spacing-lg)", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: "2rem",
                fontFamily: "var(--font-display)",
                color: "var(--neon-cyan)",
              }}
            >
              {progress?.level || 1}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              NIVEL
            </div>
          </div>
          <div
            className="glass-card"
            style={{ padding: "var(--spacing-lg)", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: "2rem",
                fontFamily: "var(--font-display)",
                color: "var(--neon-purple)",
              }}
            >
              {progress?.xp || 0}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              XP
            </div>
          </div>
          <div
            className="glass-card"
            style={{ padding: "var(--spacing-lg)", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: "2rem",
                fontFamily: "var(--font-display)",
                color: "var(--neon-green)",
              }}
            >
              {progress?.completedExercises || 0}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              EJERCICIOS
            </div>
          </div>
        </div>

        {/* Barra de progreso del nivel */}
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "var(--spacing-sm)",
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              Progreso al nivel {(progress?.level || 1) + 1}
            </span>
            <span
              style={{
                color: "var(--neon-cyan)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {progress?.xp || 0} / {progress?.nextLevelXp || 100} XP
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress?.levelProgress || 0}%` }}
            />
          </div>
        </div>

        {/* Medallas */}
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <h3
            style={{
              marginBottom: "var(--spacing-md)",
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
              badges.badges.map((badge: any) => (
                <div
                  key={badge.id}
                  style={{
                    padding: "var(--spacing-md)",
                    background: "rgba(0, 255, 136, 0.1)",
                    border: "1px solid rgba(0, 255, 136, 0.3)",
                    borderRadius: "var(--radius-md)",
                    textAlign: "center",
                    minWidth: "100px",
                  }}
                >
                  <div style={{ fontSize: "2rem" }}>{badge.icon}</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: "600" }}>
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
        {progress?.moduleProgress && (
          <div style={{ marginBottom: "var(--spacing-xl)" }}>
            <h3 style={{ marginBottom: "var(--spacing-md)" }}>
              📊 Progreso por Módulo
            </h3>
            {Object.entries(progress.moduleProgress).map(
              ([moduleId, data]: [string, any]) => (
                <div
                  key={moduleId}
                  style={{ marginBottom: "var(--spacing-md)" }}
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
                  <div className="progress-bar" style={{ height: "6px" }}>
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
        )}

        {/* Historial de Actividad */}
        {progress?.history && progress.history.length > 0 && (
          <div style={{ marginBottom: "var(--spacing-xl)" }}>
            <h3 style={{ marginBottom: "var(--spacing-md)" }}>
              📜 Historial de Actividad
            </h3>
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                paddingRight: "10px",
              }}
            >
              {progress.history.map((item: any, index: number) => (
                <div
                  key={`${item.id}-${index}`}
                  className="glass-card"
                  style={{
                    padding: "var(--spacing-md)",
                    marginBottom: "var(--spacing-sm)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {new Date(item.completedAt).toLocaleDateString()} •{" "}
                      {new Date(item.completedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                    }}
                  >
                    {item.attempts} intento{item.attempts !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones */}
        <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{ flex: 1 }}
          >
            Cerrar
          </button>
          <button
            className="btn"
            onClick={handleLogout}
            style={{
              flex: 1,
              background: "rgba(255, 45, 146, 0.2)",
              color: "var(--neon-pink)",
              border: "1px solid var(--neon-pink)",
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
