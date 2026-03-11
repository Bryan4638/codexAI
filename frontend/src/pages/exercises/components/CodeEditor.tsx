import { useExercises } from '@/hooks/useExercises'
import { useAuthStore } from '@/store/useAuthStore'
import { Badge } from '@/types/badge'
import type { CodeEditorExercise } from '@/types/exercise'
import type { CodeEditorFeedback } from '@/types/feedback'
import {
  IconHourglass,
  IconPlayerPlayFilled,
  IconRestore,
} from '@tabler/icons-react'
import { useState } from 'react'
import { ExerciseHeader } from './ExerciseHeader'
import { FeedbackMessage } from './FeedbackMessage'

interface CodeEditorProps {
  exercise: CodeEditorExercise
  onComplete: () => void
  onNewBadges?: (badges: Badge[]) => void
}

function CodeEditor({ exercise, onComplete, onNewBadges }: CodeEditorProps) {
  const [code, setCode] = useState<string>(
    exercise.data?.placeholder || '// Escribe tu código aquí\n'
  )
  const [feedback, setFeedback] = useState<CodeEditorFeedback | null>(null)

  const { user, updateUser } = useAuthStore()
  const { mutateAsync, isPending } = useExercises().validateExersiceMutation

  const handleSubmit = async () => {
    if (!user) {
      setFeedback({
        type: 'error',
        message: 'Debes iniciar sesión para validar ejercicios',
      })
      return
    }

    try {
      const result = await mutateAsync({
        exerciseId: exercise.id,
        answer: code,
      })

      if (result.correct) {
        setFeedback({
          type: 'success',
          message: result.message,
          explanation: result.explanation,
          xpEarned: result.xpEarned,
          levelUp: result.levelUp,
          newLevel: result.newLevel,
        })

        if (result.xpEarned) {
          updateUser({
            xp: user.xp + result.xpEarned,
            level: result.newLevel || user.level,
          })
        }

        if (result.newBadges?.length) {
          onNewBadges?.(result.newBadges)
        }

        onComplete()
      } else {
        setFeedback({
          type: 'error',
          message: result.message,
          explanation: result.explanation,
        })
      }
    } catch (error: any) {
      setFeedback({
        type: 'error',
        message: error.message || 'Error occurred',
      })
    }
  }

  return (
    <div>
      <ExerciseHeader
        prompt={exercise.prompt}
        difficulty={exercise.difficulty}
        xpReward={exercise.xpReward}
      />
      <div className="code-editor">
        <div className="code-editor-header">
          <div className="code-editor-dots">
            <div className="code-editor-dot red"></div>
            <div className="code-editor-dot yellow"></div>
            <div className="code-editor-dot green"></div>
          </div>
          <span className="code-editor-title">script.js</span>
        </div>
        <textarea
          className="code-editor-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Escribe tu código aquí..."
          spellCheck={false}
        />
      </div>
      <div className="mt-6 flex gap-4">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isPending || !user}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <IconHourglass size={18} /> Validando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <IconPlayerPlayFilled size={18} /> Ejecutar
            </span>
          )}
        </button>
        <button
          className={`btn btn-secondary gap-2 ${!user ? 'disabled' : ''}`}
          onClick={() => setCode(exercise.data?.placeholder || '')}
        >
          <IconRestore size={18} />
          <span className="hidden sm:flex">Reiniciar</span>
        </button>
      </div>
      {feedback && <FeedbackMessage feedback={feedback} />}
    </div>
  )
}

export default CodeEditor
