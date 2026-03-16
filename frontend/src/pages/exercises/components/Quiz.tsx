import { useExercises } from '@/hooks/useExercises'
import { useAuthStore } from '@/store/useAuthStore'
import type { Badge } from '@/types/badge'
import type { QuizExercise } from '@/types/exercise'
import type { QuizFeedback } from '@/types/feedback'
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

interface QuizProps {
  exercise: QuizExercise
  onComplete: () => void
  onNewBadges?: (badges: Badge[]) => void
}

function Quiz({ exercise, onComplete, onNewBadges }: QuizProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [result, setResult] = useState<QuizFeedback | null>(null)
  const { user, updateUser } = useAuthStore()
  const { mutateAsync, isPending } = useExercises().validateExersiceMutation

  const handleSelect = (optionId: string) => {
    if (submitted) return
    setSelected(optionId)
  }

  const handleSubmit = async () => {
    if (!selected || !user) return

    try {
      const response = await mutateAsync({
        exerciseId: exercise.id,
        answer: selected,
      })
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
    }
  }

  const handleReset = () => {
    setSelected(null)
    setSubmitted(false)
    setResult(null)
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

  return (
    <div>
      <ExerciseHeader
        prompt={exercise.prompt}
        difficulty={exercise.difficulty}
        xpReward={exercise.xpReward}
      />
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
      {!submitted ? (
        <button
          className="btn btn-primary mt-6"
          onClick={handleSubmit}
          disabled={!selected || isPending || !user}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <IconHourglass /> VALIDANDO...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <IconPlayerPlayFilled /> VERIFICAR RESPUESTA
            </span>
          )}
        </button>
      ) : (
        <button className="btn btn-secondary mt-6" onClick={handleReset}>
          <span className="flex items-center gap-2">
            <IconRestore /> Intentar de nuevo
          </span>
        </button>
      )}
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
              {result.correct ? '¡Correcto! ' : 'Incorrecto'}
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

export default Quiz
