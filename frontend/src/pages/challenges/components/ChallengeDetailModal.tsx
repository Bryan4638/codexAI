import { useAuthStore } from '@/store/useAuthStore'
import { Challenge } from '@/types/challenge'

interface ChallengeDetailModalProps {
  challenge: Challenge
  onClose: () => void
  onReaction?: (id: string) => void
  onDelete?: (id: string) => void
}

function ChallengeDetailModal({
  challenge,
  onClose,
  onReaction,
  onDelete,
}: ChallengeDetailModalProps) {
  const { user } = useAuthStore()

  const difficultyStyles: Record<string, string> = {
    easy: 'text-neon-green border-neon-green bg-neon-green/10',
    medium: 'text-neon-cyan border-neon-cyan bg-neon-cyan/10',
    hard: 'text-neon-pink border-neon-pink bg-neon-pink/10',
  }

  const difficultyLabels: Record<string, string> = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
  }

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este reto?')) {
      if (onDelete) onDelete(challenge.id)
      onClose()
    }
  }

  const isLiked = challenge.reactions?.some(
    (r: any) => r.userId === user?.id
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal max-w-[700px] text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <span
            className={`text-xs px-3 py-1 rounded-full border ${difficultyStyles[challenge.difficulty] || ''}`}
          >
            {difficultyLabels[challenge.difficulty] ||
              challenge.difficulty.toUpperCase()}
          </span>

          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-2xl text-text-muted leading-none p-1 hover:text-text-main transition-colors"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <h2 className="mb-6 text-3xl">{challenge.title}</h2>

        {/* Author info */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-white/[0.03] rounded-xl">
          {challenge.author?.avatarUrl ? (
            <img
              src={challenge.author.avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-neon-cyan"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-xl">
              👤
            </div>
          )}
          <div>
            <div className="font-semibold">
              {challenge.author?.username || 'Anónimo'}
            </div>
            <div className="text-sm text-text-muted">Creador del reto</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h4 className="text-neon-cyan mb-2 font-display">📝 Descripción</h4>
          <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
            {challenge.description}
          </p>
        </div>

        {/* Initial Code */}
        {challenge.initialCode && (
          <div className="mb-8">
            <h4 className="text-neon-cyan mb-2 font-display">
              💻 Código Inicial
            </h4>
            <div className="bg-bg-primary border border-neon-cyan/20 rounded-xl p-6 overflow-auto max-h-52">
              <pre className="font-mono text-sm m-0 whitespace-pre-wrap break-words">
                {challenge.initialCode}
              </pre>
            </div>
          </div>
        )}

        {/* Test Cases */}
        {challenge.testCases && challenge.testCases.length > 0 && (
          <div className="mb-8">
            <h4 className="text-neon-cyan mb-2 font-display">
              🧪 Casos de Prueba
            </h4>
            <div className="flex flex-col gap-2">
              {challenge.testCases.map((testCase, index: number) => (
                <div
                  key={index}
                  className="bg-neon-purple/10 border border-neon-purple/30 rounded-lg p-4 font-mono text-sm"
                >
                  <div className="text-text-muted mb-1">
                    Caso {index + 1}:
                  </div>
                  <div className="text-neon-purple">
                    <span className="text-text-secondary">Input:</span>{' '}
                    {JSON.stringify(testCase.input)}
                  </div>
                  <div className="text-neon-green">
                    <span className="text-text-secondary">Output:</span>{' '}
                    {JSON.stringify(testCase.output)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-white/8">
          <button
            onClick={() => onReaction?.(challenge.id)}
            className={`bg-transparent border-none cursor-pointer flex items-center gap-2 text-lg px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 ${
              isLiked ? 'text-neon-pink' : 'text-text-muted'
            }`}
          >
            ❤️ {challenge._count?.reactions || 0} Me gusta
          </button>

          <div className="flex gap-4">
            {user && user.id === challenge.authorId && (
              <button
                onClick={handleDelete}
                className="btn btn-secondary !text-neon-pink !border-neon-pink"
              >
                🗑️ Eliminar
              </button>
            )}
            <button onClick={onClose} className="btn btn-primary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeDetailModal
