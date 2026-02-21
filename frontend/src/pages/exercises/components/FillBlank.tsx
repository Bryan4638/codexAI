import { exerciseApi } from '@/services/endpoints/exercises'
import { useAuthStore } from '@/store/useAuthStore'
import type { FillBlankExercise } from '@/types/exercise'
import type { FillBlankFeedback } from '@/types/feedback'
import {
  IconBulb,
  IconCheck,
  IconHourglass,
  IconPlayerPlayFilled,
  IconRestore,
  IconXboxX,
} from '@tabler/icons-react'
import { useState } from 'react'
import { ExerciseHeader } from './ExerciseHeader'

interface FillBlankProps {
  exercise: FillBlankExercise
  onComplete: () => void
  onNewBadges?: (badges: any[]) => void
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

  return (
    <div>
      <ExerciseHeader
        prompt={exercise.prompt}
        difficulty={exercise.difficulty}
        xpReward={exercise.xpReward}
      />
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
            {loading ? (
              <span className="flex items-center gap-2">
                <IconHourglass /> Validando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <IconPlayerPlayFilled /> Verificar
              </span>
            )}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleReset}>
            <span className="flex items-center gap-2">
              <IconRestore /> Intentar de nuevo
            </span>
          </button>
        )}
      </div>
      {submitted && result && (
        <div className={`feedback ${result.correct ? 'success' : 'error'}`}>
          <span className="feedback-icon">
            {result.correct ? (
              <IconCheck color="#00ff88" size={40} />
            ) : (
              <IconXboxX color="#ff2d92" size={40} />
            )}
          </span>
          <div className="feedback-text">
            <div className="feedback-title">
              {result.correct ? '¡Correcto! ' : 'Inténtalo de nuevo'}
              {result.xpEarned &&
                result.xpEarned > 0 &&
                ` (+${result.xpEarned} XP)`}
            </div>
            <div className="feedback-message">{result.message}</div>
            {result.explanation && (
              <div className="mt-2 italic opacity-90 flex items-center gap-2">
                <IconBulb size={26} /> {result.explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FillBlank
