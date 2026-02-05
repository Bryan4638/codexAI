import { useAuthStore } from "@/store/useAuthStore";

interface ChallengeDetailModalProps {
  challenge: any; // Define proper type if reused
  onClose: () => void;
  onReaction?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function ChallengeDetailModal({
  challenge,
  onClose,
  onReaction,
  onDelete,
}: ChallengeDetailModalProps) {
  const { user } = useAuthStore();

  const difficultyColors: Record<string, string> = {
    easy: "var(--neon-green)",
    medium: "var(--neon-cyan)",
    hard: "var(--neon-pink)",
  };

  const difficultyLabels: Record<string, string> = {
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este reto?")) {
      if (onDelete) onDelete(challenge.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal challenge-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "700px",
          textAlign: "left",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "var(--spacing-lg)",
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              padding: "4px 12px",
              borderRadius: "20px",
              border: `1px solid ${difficultyColors[challenge.difficulty]}`,
              color: difficultyColors[challenge.difficulty],
              background: `${difficultyColors[challenge.difficulty]}15`,
            }}
          >
            {difficultyLabels[challenge.difficulty] ||
              challenge.difficulty.toUpperCase()}
          </span>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
              color: "var(--text-muted)",
              lineHeight: 1,
              padding: "4px",
            }}
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <h2
          style={{
            marginBottom: "var(--spacing-lg)",
            color: "var(--text-primary)",
            fontSize: "1.75rem",
          }}
        >
          {challenge.title}
        </h2>

        {/* Author info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "var(--spacing-xl)",
            padding: "var(--spacing-md)",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "var(--radius-md)",
          }}
        >
          {challenge.author?.avatarUrl ? (
            <img
              src={challenge.author.avatarUrl}
              alt=""
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid var(--neon-cyan)",
              }}
            />
          ) : (
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "var(--gradient-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              👤
            </div>
          )}
          <div>
            <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>
              {challenge.author?.username || "Anónimo"}
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Creador del reto
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <h4
            style={{
              color: "var(--neon-cyan)",
              marginBottom: "var(--spacing-sm)",
              fontSize: "1rem",
              fontFamily: "var(--font-display)",
            }}
          >
            📝 Descripción
          </h4>
          <p
            style={{
              color: "var(--text-secondary)",
              lineHeight: "1.7",
              whiteSpace: "pre-wrap",
            }}
          >
            {challenge.description}
          </p>
        </div>

        {/* Initial Code */}
        {challenge.initialCode && (
          <div style={{ marginBottom: "var(--spacing-xl)" }}>
            <h4
              style={{
                color: "var(--neon-cyan)",
                marginBottom: "var(--spacing-sm)",
                fontSize: "1rem",
                fontFamily: "var(--font-display)",
              }}
            >
              💻 Código Inicial
            </h4>
            <div
              style={{
                background: "var(--bg-primary)",
                border: "1px solid rgba(0, 240, 255, 0.2)",
                borderRadius: "var(--radius-md)",
                padding: "var(--spacing-lg)",
                overflow: "auto",
                maxHeight: "200px",
              }}
            >
              <pre
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {challenge.initialCode}
              </pre>
            </div>
          </div>
        )}

        {/* Test Cases */}
        {challenge.testCases && challenge.testCases.length > 0 && (
          <div style={{ marginBottom: "var(--spacing-xl)" }}>
            <h4
              style={{
                color: "var(--neon-cyan)",
                marginBottom: "var(--spacing-sm)",
                fontSize: "1rem",
                fontFamily: "var(--font-display)",
              }}
            >
              🧪 Casos de Prueba
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-sm)",
              }}
            >
              {challenge.testCases.map((testCase: any, index: number) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(139, 92, 246, 0.1)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    borderRadius: "var(--radius-sm)",
                    padding: "var(--spacing-md)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                  }}
                >
                  <div
                    style={{ color: "var(--text-muted)", marginBottom: "4px" }}
                  >
                    Caso {index + 1}:
                  </div>
                  <div style={{ color: "var(--neon-purple)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Input:
                    </span>{" "}
                    {JSON.stringify(testCase.input)}
                  </div>
                  <div style={{ color: "var(--neon-green)" }}>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Output:
                    </span>{" "}
                    {JSON.stringify(testCase.output)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "var(--spacing-lg)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={() => onReaction?.(challenge.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: challenge.reactions?.some(
                (r: any) => r.userId === user?.id,
              )
                ? "var(--neon-pink)"
                : "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "1.1rem",
              padding: "var(--spacing-sm) var(--spacing-md)",
              borderRadius: "var(--radius-md)",
              transition: "var(--transition-fast)",
            }}
          >
            ❤️ {challenge._count?.reactions || 0} Me gusta
          </button>

          <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
            {user && user.id === challenge.authorId && (
              <button
                onClick={handleDelete}
                className="btn btn-secondary"
                style={{
                  color: "var(--neon-pink)",
                  borderColor: "var(--neon-pink)",
                }}
              >
                🗑️ Eliminar
              </button>
            )}
            <button onClick={onClose} className="btn btn-primary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChallengeDetailModal;
