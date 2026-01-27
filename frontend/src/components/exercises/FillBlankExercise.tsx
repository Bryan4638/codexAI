import { useState } from "react";
import { exerciseApi } from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";

interface Blank {
  id: string;
}

interface Exercise {
  id: string;
  prompt: string;
  difficulty: string;
  xpReward: number;
  data?: {
    template?: string[];
    blanks?: Blank[];
  };
}

interface FillBlankExerciseProps {
  exercise: Exercise;
  onComplete: () => void;
  onNewBadges?: (badges: any[]) => void;
}

interface Feedback {
  correct: boolean;
  message: string;
  explanation?: string;
  xpEarned?: number;
  newLevel?: number;
  newBadges?: any[];
}

function FillBlankExercise({
  exercise,
  onComplete,
  onNewBadges,
}: FillBlankExerciseProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, updateUser } = useAuthStore();

  const handleChange = (blankId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [blankId]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await exerciseApi.validate(exercise.id, answers);
      setResult(response);
      setSubmitted(true);

      if (response.correct) {
        if (response.xpEarned) {
          updateUser({
            xp: user.xp + response.xpEarned,
            level: response.newLevel || user.level,
          });
        }
        if (response.newBadges?.length > 0) {
          if (onNewBadges) onNewBadges(response.newBadges);
        }
        onComplete();
      }
    } catch (error: any) {
      setResult({ correct: false, message: error.message });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
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
      <div className="fill-blank-code">
        {exercise.data?.template?.map((part, index) => (
          <span key={index}>
            {part}
            {exercise.data?.blanks && index < exercise.data.blanks.length && (
              <input
                type="text"
                className={`fill-blank-input ${submitted ? (result?.correct ? "correct" : "incorrect") : ""}`}
                value={answers[exercise.data.blanks[index].id] || ""}
                onChange={(e) =>
                  exercise.data?.blanks &&
                  handleChange(exercise.data.blanks[index].id, e.target.value)
                }
                disabled={submitted}
                placeholder="..."
              />
            )}
          </span>
        ))}
      </div>
      <div
        style={{
          marginTop: "var(--spacing-lg)",
          display: "flex",
          gap: "var(--spacing-md)",
        }}
      >
        {!submitted ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || !user}
          >
            {loading ? "⏳ Validando..." : "✓ Verificar"}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleReset}>
            ↺ Intentar de nuevo
          </button>
        )}
      </div>
      {submitted && result && (
        <div className={`feedback ${result.correct ? "success" : "error"}`}>
          <span className="feedback-icon">{result.correct ? "✓" : "✗"}</span>
          <div className="feedback-text">
            <div className="feedback-title">
              {result.correct ? "¡Correcto!" : "Inténtalo de nuevo"}
              {result.xpEarned &&
                result.xpEarned > 0 &&
                ` (+${result.xpEarned} XP)`}
            </div>
            <div className="feedback-message">{result.message}</div>
            {result.explanation && (
              <div
                className="feedback-explanation"
                style={{
                  marginTop: "var(--spacing-sm)",
                  fontStyle: "italic",
                  opacity: 0.9,
                }}
              >
                💡 {result.explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FillBlankExercise;
