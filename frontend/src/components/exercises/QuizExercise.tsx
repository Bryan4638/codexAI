import { useState } from "react";
import { exerciseApi } from "../../services/api";
import { useAuthStore } from "../../store/useAuthStore";

interface Option {
  id: string;
  text: string;
}

interface Exercise {
  id: string;
  prompt: string;
  difficulty: string;
  xpReward: number;
  data?: {
    options?: Option[];
  };
}

interface QuizExerciseProps {
  exercise: Exercise;
  onComplete: () => void;
  onNewBadges?: (badges: any[]) => void;
}

interface Result {
  correct: boolean;
  message: string;
  explanation?: string;
  xpEarned?: number;
  newLevel?: number;
  newBadges?: any[];
}

function QuizExercise({
  exercise,
  onComplete,
  onNewBadges,
}: QuizExerciseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, updateUser } = useAuthStore();

  const handleSelect = (optionId: string) => {
    if (submitted) return;
    setSelected(optionId);
  };

  const handleSubmit = async () => {
    if (!selected || !user) return;

    setLoading(true);
    try {
      const response = await exerciseApi.validate(exercise.id, selected);
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
    } catch (error) {
      console.error("Error validando:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOptionClass = (optionId: string) => {
    let classes = "quiz-option";
    if (selected === optionId) classes += " selected";
    if (submitted && result) {
      if (result.correct && selected === optionId) classes += " correct";
      else if (!result.correct && selected === optionId)
        classes += " incorrect";
    }
    return classes;
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
      <div className="quiz-options">
        {exercise.data?.options?.map((option) => (
          <div
            key={option.id}
            className={getOptionClass(option.id)}
            onClick={() => handleSelect(option.id)}
          >
            <span className="quiz-option-marker">
              {option.id.toUpperCase()}
            </span>
            <span className="quiz-option-text">{option.text}</span>
          </div>
        ))}
      </div>
      {!submitted && (
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!selected || loading || !user}
          style={{ marginTop: "var(--spacing-lg)" }}
        >
          {loading ? "⏳ Validando..." : "Verificar Respuesta"}
        </button>
      )}
      {submitted && result && (
        <div className={`feedback ${result.correct ? "success" : "error"}`}>
          <span className="feedback-icon">{result.correct ? "✓" : "✗"}</span>
          <div className="feedback-text">
            <div className="feedback-title">
              {result.correct ? "¡Correcto!" : "Incorrecto"}
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

export default QuizExercise;
