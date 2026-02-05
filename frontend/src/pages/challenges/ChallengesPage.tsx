import { useState, useEffect } from "react";
import { challengeApi } from "@/services/api";
import CreateChallengeModal from "@/pages/challenges/components/CreateChallengeModal";
import ChallengeDetailModal from "@/pages/challenges/components/CreateChallengeModal";
import { useAuthStore } from "@/store/useAuthStore";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  authorId: string;
  author?: {
    username: string;
    avatarUrl?: string;
  };
  reactions?: { userId: string }[];
  _count?: {
    reactions: number;
    solutions?: number;
  };
  createdAt?: string;
  // Add other fields as needed
}

function ChallengesPage() {
  const { user } = useAuthStore();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [filters, setFilters] = useState({
    difficulty: "all",
    sort: "newest",
  });

  useEffect(() => {
    loadChallenges();
  }, [filters]);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const data = await challengeApi.getAll(filters);
      setChallenges(data || []);
    } catch (error) {
      console.error("Error cargando retos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    loadChallenges();
  };

  const handleReaction = async (id: string) => {
    try {
      const data = await challengeApi.toggleReaction(id);
      // Actualizar estado localmente para feedback inmediato
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const isLiked = data.liked;
          // Mocking user reaction update locally
          const reactions = c.reactions || [];
          const newReactions = isLiked
            ? [...reactions, { userId: user?.id || "temp" }]
            : reactions.filter((r) => r.userId !== user?.id);

          return {
            ...c,
            reactions: newReactions,
            _count: {
              ...c._count,
              reactions: isLiked
                ? (c._count?.reactions || 0) + 1
                : (c._count?.reactions || 1) - 1,
            },
          };
        }),
      );
      // loadChallenges(); // Refetching to ensure consistency, commented out to rely on optimistic update mostly
    } catch (error) {
      console.error("Error reaccionando:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este reto?"))
      return;
    try {
      await challengeApi.delete(id);
      setChallenges((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  const difficultyColors: Record<string, string> = {
    easy: "var(--neon-green)",
    medium: "var(--neon-cyan)",
    hard: "var(--neon-pink)",
  };

  return (
    <section className="container" style={{ paddingTop: "120px" }}>
      <div
        className="section-header"
        style={{ textAlign: "center", marginBottom: "var(--spacing-2xl)" }}
      >
        <h2>💻 Retos de la Comunidad</h2>
        <p>Resuelve desafíos creados por otros estudiantes o sube los tuyos</p>
      </div>

      {/* Controles y Filtros */}
      <div className="challenges-header">
        <div className="filter-controls">
          <span className="filter-label">🎯 Filtrar:</span>
          <select
            className="filter-select"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, difficulty: e.target.value }))
            }
          >
            <option value="all">Todas las dificultades</option>
            <option value="easy">🟢 Fácil</option>
            <option value="medium">🟡 Medio</option>
            <option value="hard">🔴 Difícil</option>
          </select>

          <select
            className="filter-select"
            value={filters.sort}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sort: e.target.value }))
            }
          >
            <option value="newest">⏰ Más recientes</option>
            <option value="popularity">🔥 Más populares</option>
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Crear Reto
        </button>
      </div>

      {/* Lista de Retos */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando retos...</p>
      ) : challenges.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          No hay retos aún. ¡Sé el primero en crear uno!
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--spacing-lg)",
          }}
        >
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="glass-card"
              style={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
              }}
              onClick={() => setSelectedChallenge(challenge)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "var(--spacing-sm)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    border: `1px solid ${difficultyColors[challenge.difficulty]}`,
                    color: difficultyColors[challenge.difficulty],
                  }}
                >
                  {challenge.difficulty.toUpperCase()}
                </span>
                {user && user.id === challenge.authorId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(challenge.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "1rem",
                    }}
                    title="Eliminar reto"
                  >
                    🗑️
                  </button>
                )}
              </div>

              <h3
                style={{
                  marginBottom: "var(--spacing-sm)",
                  color: "var(--text-primary)",
                }}
              >
                {challenge.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  marginBottom: "var(--spacing-md)",
                  flex: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {challenge.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto",
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  paddingTop: "var(--spacing-md)",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  {challenge.author?.avatarUrl ? (
                    <img
                      src={challenge.author.avatarUrl}
                      alt=""
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <span>👤</span>
                  )}
                  <span>{challenge.author?.username || "Anónimo"}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReaction(challenge.id);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: challenge.reactions?.some(
                      (r) => r.userId === user?.id,
                    )
                      ? "var(--neon-pink)"
                      : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  ❤️ {challenge._count?.reactions || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateChallengeModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateSuccess}
        />
      )}

      {selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onReaction={(id) => {
            handleReaction(id);
            // Actualizar el challenge seleccionado con los nuevos datos
            const updated = challenges.find((c) => c.id === id);
            if (updated) setSelectedChallenge(updated);
          }}
          onDelete={(id) => {
            handleDelete(id);
            setSelectedChallenge(null);
          }}
        />
      )}
    </section>
  );
}

export default ChallengesPage;
