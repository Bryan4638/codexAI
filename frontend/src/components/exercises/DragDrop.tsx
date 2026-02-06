import { useState } from "react";
import { exerciseApi } from "@/services/endpoints/exercise";
import { useAuthStore } from "@/store/useAuthStore";
import type { DragDropFeedback } from "@/types/feedback";
import type { DragDropExercise, DraggedItem, Option } from "@/types/exercise";

interface DragDropProps {
  exercise: DragDropExercise;
  onComplete: () => void;
  onNewBadges?: (badges: any[]) => void;
}

function DragDrop({ exercise, onComplete, onNewBadges }: DragDropProps) {
  const [sourceItems, setSourceItems] = useState<Option[]>([
    ...(exercise.data?.items || []),
  ]);
  const [targetItems, setTargetItems] = useState<Option[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [feedback, setFeedback] = useState<DragDropFeedback | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, updateUser } = useAuthStore();

  const handleDragStart = (item: Option, fromTarget = false) => {
    setDraggedItem({ item, fromTarget });
  };

  const handleDropOnTarget = () => {
    if (!draggedItem || draggedItem.fromTarget) return;
    setSourceItems((prev) => prev.filter((i) => i.id !== draggedItem.item.id));
    setTargetItems((prev) => [...prev, draggedItem.item]);
    setDraggedItem(null);
  };

  const handleDropOnSource = () => {
    if (!draggedItem || !draggedItem.fromTarget) return;
    setTargetItems((prev) => prev.filter((i) => i.id !== draggedItem.item.id));
    setSourceItems((prev) => [...prev, draggedItem.item]);
    setDraggedItem(null);
  };

  const handleVerify = async () => {
    if (!user) {
      setFeedback({ type: "error", message: "Debes iniciar sesión" });
      return;
    }

    setLoading(true);
    try {
      const answer = targetItems.map((i) => i.id);
      const result = await exerciseApi.validate(exercise.id, answer);

      if (result.correct) {
        setFeedback({
          type: "success",
          message: result.message,
          explanation: result.explanation,
          xpEarned: result.xpEarned,
        });
        if (result.xpEarned) {
          updateUser({
            xp: user.xp + result.xpEarned,
            level: result.newLevel || user.level,
          });
        }
        if (result.newBadges?.length > 0 && onNewBadges)
          onNewBadges(result.newBadges);
        onComplete();
      } else {
        setFeedback({
          type: "error",
          message: result.message,
          explanation: result.explanation,
        });
      }
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSourceItems([...(exercise.data?.items || [])]);
    setTargetItems([]);
    setFeedback(null);
  };

  return (
    <div>
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div
        style={{
          display: "inline-flex",
          gap: "var(--spacing-sm)",
          marginBottom: "var(--spacing-md)",
        }}
      >
        <span
          style={{
            padding: "2px 8px",
            background:
              exercise.difficulty === "beginner"
                ? "rgba(0, 255, 136, 0.2)"
                : exercise.difficulty === "intermediate"
                  ? "rgba(255, 165, 0, 0.2)"
                  : "rgba(255, 45, 146, 0.2)",
            border: `1px solid ${
              exercise.difficulty === "beginner"
                ? "var(--neon-green)"
                : exercise.difficulty === "intermediate"
                  ? "var(--neon-orange)"
                  : "var(--neon-pink)"
            }`,
            borderRadius: "var(--radius-sm)",
            fontSize: "0.75rem",
            color:
              exercise.difficulty === "beginner"
                ? "var(--neon-green)"
                : exercise.difficulty === "intermediate"
                  ? "var(--neon-orange)"
                  : "var(--neon-pink)",
          }}
        >
          {exercise.difficulty === "beginner"
            ? "🌱 Básico"
            : exercise.difficulty === "intermediate"
              ? "🌿 Intermedio"
              : "🌳 Avanzado"}
        </span>
        <span
          style={{
            padding: "2px 8px",
            background: "rgba(139, 92, 246, 0.2)",
            border: "1px solid var(--neon-purple)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.75rem",
            color: "var(--neon-purple)",
          }}
        >
          +{exercise.xpReward} XP
        </span>
      </div>
      <div className="drag-drop-container">
        <div>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "var(--spacing-sm)",
              fontSize: "0.9rem",
            }}
          >
            Bloques disponibles:
          </p>
          <div
            className="drag-source"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnSource}
          >
            {sourceItems.map((item) => (
              <div
                key={item.id}
                className="drag-item"
                draggable
                onDragStart={() => handleDragStart(item, false)}
              >
                {item.text}
              </div>
            ))}
            {sourceItems.length === 0 && (
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Arrastra aquí para devolver
              </span>
            )}
          </div>
        </div>
        <div>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "var(--spacing-sm)",
              fontSize: "0.9rem",
            }}
          >
            Ordena el código aquí:
          </p>
          <div
            className={`drag-target ${draggedItem ? "drag-over" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnTarget}
          >
            {targetItems.length === 0 ? (
              <div className="drag-target-placeholder">
                Arrastra los bloques aquí en el orden correcto
              </div>
            ) : (
              targetItems.map((item) => (
                <div
                  key={item.id}
                  className="drag-item"
                  draggable
                  onDragStart={() => handleDragStart(item, true)}
                >
                  {item.text}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: "var(--spacing-lg)",
          display: "flex",
          gap: "var(--spacing-md)",
        }}
      >
        <button
          className="btn btn-primary"
          onClick={handleVerify}
          disabled={
            targetItems.length !== (exercise.data?.items?.length || 0) ||
            loading
          }
        >
          {loading ? "⏳ Validando..." : "✓ Verificar Orden"}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          ↺ Reiniciar
        </button>
      </div>
      {feedback && (
        <div className={`feedback ${feedback.type}`}>
          <span className="feedback-icon">
            {feedback.type === "success" ? "✓" : "✗"}
          </span>
          <div className="feedback-text">
            <div className="feedback-title">
              {feedback.type === "success"
                ? "¡Correcto!"
                : "Inténtalo de nuevo"}
              {feedback.xpEarned &&
                feedback.xpEarned > 0 &&
                ` (+${feedback.xpEarned} XP)`}
            </div>
            <div className="feedback-message">{feedback.message}</div>
            {feedback.explanation && (
              <div
                className="feedback-explanation"
                style={{
                  marginTop: "var(--spacing-sm)",
                  fontStyle: "italic",
                  opacity: 0.9,
                }}
              >
                💡 {feedback.explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DragDrop;
