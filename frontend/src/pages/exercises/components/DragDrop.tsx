import { exerciseApi } from '@/services/endpoints/exercises'
import { useAuthStore } from '@/store/useAuthStore'
import type { DragDropExercise } from '@/types/exercise'
import type { DragDropFeedback } from '@/types/feedback'
import {
  IconHourglass,
  IconPlayerPlayFilled,
  IconRestore,
} from '@tabler/icons-react'
import { useState } from 'react'
import { ExerciseHeader } from './ExerciseHeader'
import { FeedbackMessage } from './FeedbackMessage'

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

  return (
    <div>
      <ExerciseHeader
        prompt={exercise.prompt}
        difficulty={exercise.difficulty}
        xpReward={exercise.xpReward}
      />
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
          {loading ? (
            <span className="flex items-center gap-2">
              <IconHourglass /> VALIDANDO...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <IconPlayerPlayFilled /> VERIFICAR ORDEN
            </span>
          )}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          <span className="flex items-center gap-2">
            <IconRestore /> REINICIAR
          </span>
        </button>
      </div>
      {feedback && <FeedbackMessage feedback={feedback} />}
    </div>
  )
}

export default DragDrop
