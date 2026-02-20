import { exerciseApi } from '@/services/endpoints/exercises'
import { useAuthStore } from '@/store/useAuthStore'
import type { DragDropExercise } from '@/types/exercise'
import type { DragDropFeedback } from '@/types/feedback'
import { useState } from 'react'

interface DragDropItem {
  id: number
  text: string
}

interface DraggedItemState {
  item: DragDropItem
  fromTarget: boolean
}

interface DragDropProps {
  exercise: DragDropExercise
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

function DragDrop({ exercise, onComplete, onNewBadges }: DragDropProps) {
  const [sourceItems, setSourceItems] = useState<DragDropItem[]>([
    ...(exercise.data?.items || []),
  ])
  const [targetItems, setTargetItems] = useState<DragDropItem[]>([])
  const [draggedItem, setDraggedItem] = useState<DraggedItemState | null>(null)
  const [feedback, setFeedback] = useState<DragDropFeedback | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { user, updateUser } = useAuthStore()

  const handleDragStart = (item: DragDropItem, fromTarget = false) => {
    setDraggedItem({ item, fromTarget })
  }

  const handleDropOnTarget = () => {
    if (!draggedItem || draggedItem.fromTarget) return
    setSourceItems((prev) => prev.filter((i) => i.id !== draggedItem.item.id))
    setTargetItems((prev) => [...prev, draggedItem.item])
    setDraggedItem(null)
  }

  const handleDropOnSource = () => {
    if (!draggedItem || !draggedItem.fromTarget) return
    setTargetItems((prev) => prev.filter((i) => i.id !== draggedItem.item.id))
    setSourceItems((prev) => [...prev, draggedItem.item])
    setDraggedItem(null)
  }

  const handleVerify = async () => {
    if (!user) {
      setFeedback({ type: 'error', message: 'Debes iniciar sesión' })
      return
    }

    setLoading(true)
    try {
      const answer = targetItems.map((i) => i.id)
      const result = await exerciseApi.validate(exercise.id, answer)

      if (result.correct) {
        setFeedback({
          type: 'success',
          message: result.message,
          explanation: result.explanation,
          xpEarned: result.xpEarned,
        })
        if (result.xpEarned) {
          updateUser({
            xp: user.xp + result.xpEarned,
            level: result.newLevel || user.level,
          })
        }
        if (result.newBadges?.length > 0 && onNewBadges)
          onNewBadges(result.newBadges)
        onComplete()
      } else {
        setFeedback({
          type: 'error',
          message: result.message,
          explanation: result.explanation,
        })
      }
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSourceItems([...(exercise.data?.items || [])] as DragDropItem[])
    setTargetItems([])
    setFeedback(null)
  }

  const diff = difficultyMap[exercise.difficulty] || difficultyMap.beginner

  return (
    <div>
      <p className="exercise-prompt">{exercise.prompt}</p>
      <div className="inline-flex gap-2 mb-4">
        <span className={`badge-difficulty ${diff.classes}`}>{diff.label}</span>
        <span className="badge-xp">+{exercise.xpReward} XP</span>
      </div>
      <div className="drag-drop-container">
        <div>
          <p className="text-text-muted mb-2 text-sm">Bloques disponibles:</p>
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
              <span className="text-text-muted text-sm">
                Arrastra aquí para devolver
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-text-muted mb-2 text-sm">Ordena el código aquí:</p>
          <div
            className={`drag-target ${draggedItem ? 'drag-over' : ''}`}
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
      <div className="mt-6 flex gap-4">
        <button
          className="btn btn-primary"
          onClick={handleVerify}
          disabled={
            targetItems.length !== (exercise.data?.items?.length || 0) ||
            loading
          }
        >
          {loading ? '⏳ VALIDANDO...' : '✓ VERIFICAR ORDEN'}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          ↺ REINICIAR
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
          </div>
        </div>
      )}
    </div>
  )
}

export default DragDrop
