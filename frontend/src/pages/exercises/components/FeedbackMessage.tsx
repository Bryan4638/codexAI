import type { CodeEditorFeedback } from '@/types/feedback'
import {
  IconBalloon,
  IconBulb,
  IconCheck,
  IconXboxX,
} from '@tabler/icons-react'

interface FeedbackMessageProps {
  feedback: CodeEditorFeedback
}

export const FeedbackMessage = ({ feedback }: FeedbackMessageProps) => {
  return (
    <div className={`feedback flex items-center ${feedback.type}`}>
      <span className="feedback-icon">
        {feedback.type === 'success' ? (
          <IconCheck color="#00ff88" size={40} />
        ) : (
          <IconXboxX color="#ff2d92" size={40} />
        )}
      </span>
      <div className="feedback-text">
        <div className="feedback-title">
          {feedback.type === 'success' ? '¡Correcto! ' : 'Inténtalo de nuevo'}
          {feedback.xpEarned &&
            feedback.xpEarned > 0 &&
            ` (+${feedback.xpEarned} XP)`}
        </div>
        <div className="feedback-message">{feedback.message}</div>
        {feedback.explanation && (
          <div className="mt-2 italic opacity-90 flex items-center gap-2">
            <IconBulb size={26} /> {feedback.explanation}
          </div>
        )}
        {feedback.levelUp && (
          <div className="mt-2 text-neon-cyan">
            <IconBalloon size={26} /> ¡Subiste al nivel {feedback.newLevel}!
          </div>
        )}
      </div>
    </div>
  )
}
