import { exerciseApi } from '@/services/endpoints/exercises'
import { useAuthStore } from '@/store/useAuthStore'
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
  onNewBadges?: (badges: any[]) => void
}

function CodeEditor({ exercise, onComplete, onNewBadges }: CodeEditorProps) {
  const [code, setCode] = useState<string>(
    exercise.data?.placeholder || '// Escribe tu código aquí\n'
  )
  const [feedback, setFeedback] = useState<CodeEditorFeedback | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { user, updateUser } = useAuthStore()

  const handleSubmit = async () => {
    if (!user) {
      setFeedback({
        type: 'error',
        message: 'Debes iniciar sesión para validar ejercicios',
      })
      return
    }

    setLoading(true)
    try {
      const result = await exerciseApi.validate(exercise.id, code)

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

        if (result.newBadges && result.newBadges.length > 0) {
          if (onNewBadges) onNewBadges(result.newBadges)
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
    } finally {
      setLoading(false)
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
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <IconHourglass /> Validando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <IconPlayerPlayFilled /> Ejecutar
            </span>
          )}
        </button>
        <button
          className="btn btn-secondary gap-2"
          onClick={() => setCode(exercise.data?.placeholder || '')}
        >
          <IconRestore /> Reiniciar
        </button>
      </div>
      {feedback && <FeedbackMessage feedback={feedback} />}
    </div>
  )
}

export default CodeEditor
