import { exerciseApi } from '@/services/endpoints/exercises'
import { useAuthStore } from '@/store/useAuthStore'
import type { QuizExercise } from '@/types/exercise'
import type { QuizFeedback } from '@/types/feedback'
import { useState } from 'react'

interface QuizProps {
  exercise: QuizExercise
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

function Quiz({ exercise, onComplete, onNewBadges }: QuizProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [result, setResult] = useState<QuizFeedback | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { user, updateUser } = useAuthStore()

  const handleSelect = (optionId: string) => {
    if (submitted) return
    setSelected(optionId)
  }

  const handleSubmit = async () => {
    if (!selected || !user) return

    setLoading(true)
    try {
      const response = await exerciseApi.validate(exercise.id, selected)
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
    } catch (error) {
      console.error('Error validando:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOptionClass = (optionId: string) => {
    let classes = 'quiz-option'
    if (selected === optionId) classes += ' selected'
    if (submitted && result) {
      if (result.correct && selected === optionId) classes += ' correct'
      else if (!result.correct && selected === optionId) classes += ' incorrect'
    }
    return classes
  }

  const diff = difficultyMap[exercise.difficulty] || difficultyMap.beginner

  return (
    <div>
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div className="inline-flex gap-2 mb-4">
        <span className={`badge-difficulty ${diff.classes}`}>{diff.label}</span>
        <span className="badge-xp">+{exercise.xpReward} XP</span>
      </div>
      <div className="flex flex-col gap-4">
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
          className="btn btn-primary mt-6"
          onClick={handleSubmit}
          disabled={!selected || loading || !user}
        >
          {loading ? '⏳ VALIDANDO...' : 'VERIFICAR RESPUESTA'}
        </button>
      )}
      {submitted && result && (
        <div className={`feedback ${result.correct ? 'success' : 'error'}`}>
          <span className="feedback-icon">{result.correct ? '✓' : '✗'}</span>
          <div className="feedback-text">
            <div className="feedback-title">
              {result.correct ? '¡Correcto!' : 'Incorrecto'}
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

export default Quiz
