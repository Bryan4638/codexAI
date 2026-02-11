import { exerciseApi } from '@/services/endpoints/exercise'
import { useAuthStore } from '@/store/useAuthStore'
import type { CodeEditorExercise } from '@/types/exercise'
import type { CodeEditorFeedback } from '@/types/feedback'
import { useState } from 'react'

interface CodeEditorProps {
  exercise: CodeEditorExercise
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

  const diff = difficultyMap[exercise.difficulty] || difficultyMap.beginner

  return (
    <div>
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div className="inline-flex gap-2 mb-4">
        <span className={`badge-difficulty ${diff.classes}`}>{diff.label}</span>
        <span className="badge-xp">+{exercise.xpReward} XP</span>
      </div>
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
          {loading ? '⏳ Validando...' : '▶ Ejecutar'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setCode(exercise.data?.placeholder || '')}
        >
          ↺ Reiniciar
        </button>
      </div>
      {feedback && (
        <div className={`feedback ${feedback.type}`}>
          <span className="feedback-icon">
            {feedback.type === 'success' ? '✓' : '✗'}
          </span>
          <div className="feedback-text">
            <div className="feedback-title">
              {feedback.type === 'success'
                ? '¡Correcto!'
                : 'Inténtalo de nuevo'}
              {feedback.xpEarned &&
                feedback.xpEarned > 0 &&
                ` (+${feedback.xpEarned} XP)`}
            </div>
            <div className="feedback-message">{feedback.message}</div>
            {feedback.explanation && (
              <div className="mt-2 italic opacity-90">
                💡 {feedback.explanation}
              </div>
            )}
            {feedback.levelUp && (
              <div className="mt-2 text-neon-cyan">
                🎉 ¡Subiste al nivel {feedback.newLevel}!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CodeEditor
