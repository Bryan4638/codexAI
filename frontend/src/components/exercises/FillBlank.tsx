import { exerciseApi } from '@/services/endpoints/exercise'
import { useAuthStore } from '@/store/useAuthStore'
import type { FillBlankExercise } from '@/types/exercise'
import type { FillBlankFeedback } from '@/types/feedback'
import { useState } from 'react'

interface FillBlankProps {
  exercise: FillBlankExercise
  onComplete: () => void
  onNewBadges?: (badges: any[]) => void
}

const difficultyMap: Record<string, { classes: string; label: string }> = {
  beginner: {
    classes: 'bg-neon-green/20 border-neon-green text-neon-green',
    label: '🌱 Básico',
  },
  intermediate: {
    classes: 'bg-neon-orange/20 border-neon-orange text-neon-orange',
    label: '🌿 Intermedio',
  },
  advanced: {
    classes: 'bg-neon-pink/20 border-neon-pink text-neon-pink',
    label: '🌳 Avanzado',
  },
}

function FillBlank({ exercise, onComplete, onNewBadges }: FillBlankProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [result, setResult] = useState<FillBlankFeedback | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { user, updateUser } = useAuthStore()

  const handleChange = (blankId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [blankId]: value }))
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await exerciseApi.validate(exercise.id, answers)
      setResult(response)
      setSubmitted(true)

      if (response.correct) {
        if (response.xpEarned) {
          updateUser({
            xp: user.xp + response.xpEarned,
            level: response.newLevel || user.level,
          })
        }
        if (response.newBadges?.length > 0) {
          if (onNewBadges) onNewBadges(response.newBadges)
        }
        onComplete()
      }
    } catch (error: any) {
      setResult({ correct: false, message: error.message })
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setAnswers({})
    setSubmitted(false)
    setResult(null)
  }

  const diff = difficultyMap[exercise.difficulty] || difficultyMap.beginner

  return (
    <div>
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div className="inline-flex gap-2 mb-4">
        <span className={`badge-difficulty ${diff.classes}`}>{diff.label}</span>
        <span className="badge-xp">+{exercise.xpReward} XP</span>
      </div>
      <div className="fill-blank-code">
        {exercise.data?.template?.map((part, index) => (
          <span key={index}>
            {part}
            {exercise.data?.blanks && index < exercise.data.blanks.length && (
              <input
                type="text"
                className={`fill-blank-input ${submitted ? (result?.correct ? 'correct' : 'incorrect') : ''}`}
                value={answers[exercise.data.blanks[index].id] || ''}
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
      <div className="mt-6 flex gap-4">
        {!submitted ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || !user}
          >
            {loading ? '⏳ Validando...' : '✓ Verificar'}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleReset}>
            ↺ Intentar de nuevo
          </button>
        )}
      </div>
      {submitted && result && (
        <div className={`feedback ${result.correct ? 'success' : 'error'}`}>
          <span className="feedback-icon">{result.correct ? '✓' : '✗'}</span>
          <div className="feedback-text">
            <div className="feedback-title">
              {result.correct ? '¡Correcto!' : 'Inténtalo de nuevo'}
              {result.xpEarned &&
                result.xpEarned > 0 &&
                ` (+${result.xpEarned} XP)`}
            </div>
            <div className="feedback-message">{result.message}</div>
            {result.explanation && (
              <div className="mt-2 italic opacity-90">
                💡 {result.explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FillBlank
