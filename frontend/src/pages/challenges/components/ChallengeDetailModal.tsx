import { useChallenges } from '@/hooks/useChallenges'
import { difficultyStyles } from '@/pages/challenges/data/difficultyStyles'
import { useAuthStore } from '@/store/useAuthStore'
import { Challenge } from '@/types/challenge'
import {
  IconCircleCheckFilled,
  IconHeart,
  IconTrash,
  IconUserFilled,
  IconX,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

interface ChallengeDetailModalProps {
  challenge: Challenge
  onClose: () => void
}

function ChallengeDetailModal({
  challenge,
  onClose,
}: ChallengeDetailModalProps) {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { toggleReactionMutation, deleteChallengeMutation } = useChallenges(
    undefined,
    user?.id
  )

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este reto?')) {
      deleteChallengeMutation.mutate(challenge.id, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  return (
    <section className="modal-overlay" onClick={onClose}>
      <div
        className="modal max-w-175 text-left min-h-fit max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex justify-between items-start">
          <div className="mb-6 flex items-center justify-start gap-3 flex-wrap">
            {/* Title */}
            <h2 className="text-3xl m-0">{challenge.title}</h2>
            <div className="flex gap-2 items-center">
              <span
                className={`text-xs px-3 py-1 rounded-full border ${difficultyStyles[challenge.difficulty] || ''}`}
              >
                {challenge.difficulty.toUpperCase()}
              </span>
              {challenge.hasCompleted && (
                <span className="text-neon-green flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-neon-green/10 border border-neon-green/20">
                  <IconCircleCheckFilled size={14} />
                  Completado
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-2xl text-text-muted leading-none p-1 hover:text-text-main transition-colors"
            title="Cerrar"
          >
            <IconX />
          </button>
        </header>
        {/* Author info */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-white/3 rounded-xl border border-white/5">
          {challenge.author?.avatarUrl ? (
            <img
              src={challenge.author.avatarUrl}
              alt={challenge.author.username}
              className="w-10 h-10 rounded-full border-2 border-neon-cyan"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-xl">
              <IconUserFilled className="text-white/60" />
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
          <h4 className="text-neon-cyan mb-2 font-display">Descripción</h4>
          <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
            {challenge.description}
          </p>
        </div>

        {/* Initial Code */}
        {challenge.initialCode && !challenge.bestExecutionCode && (
          <div className="mb-8">
            <h4 className="text-neon-cyan mb-2 font-display">Código Inicial</h4>
            <div className="bg-bg-primary border border-neon-cyan/20 rounded-xl p-6 overflow-auto max-h-52">
              <pre className="font-mono text-sm m-0 whitespace-pre-wrap wrap-break-word">
                {challenge.initialCode}
              </pre>
            </div>
          </div>
        )}

        {/* Best Execution Code */}
        {challenge.bestExecutionCode && (
          <div className="mb-8">
            <h4 className="text-neon-green mb-2 font-display flex items-center gap-2">
              <IconCircleCheckFilled size={18} />
              Tu Mejor Solución
            </h4>
            <div className="bg-bg-primary border border-neon-green/20 rounded-xl p-6 overflow-auto max-h-52 relative">
              <div className="absolute top-2 right-2 text-xs text-neon-green border border-neon-green/20 bg-neon-green/10 px-2 py-0.5 rounded">
                Resuelto
              </div>
              <pre className="font-mono text-sm m-0 whitespace-pre-wrap wrap-break-word">
                {challenge.bestExecutionCode}
              </pre>
            </div>
          </div>
        )}

        {/* Test Cases */}
        {challenge.testCases && challenge.testCases.length > 0 && (
          <div className="mb-8">
            <h4 className="text-neon-cyan mb-2 font-display">
              Casos de Prueba
            </h4>
            <div className="flex flex-col gap-2">
              {challenge.testCases.map((testCase, index: number) => (
                <div
                  key={index}
                  className="bg-neon-purple/10 border border-neon-purple/30 rounded-lg p-4 font-mono text-sm"
                >
                  <div className="text-text-muted mb-1">Caso {index + 1}:</div>
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
            onClick={() => toggleReactionMutation.mutate(challenge.id)}
            className={`cursor-pointer flex items-center gap-1 transition-transform duration-200 hover:scale-110 ${challenge.hasReacted ? 'text-neon-pink' : 'text-text-muted'}`}
          >
            <IconHeart fill={challenge.hasReacted ? 'currentColor' : 'none'} />
            {challenge.reactionsCount || 0}
          </button>

          <div className="flex gap-4">
            <button
              onClick={() => {
                if (!user) {
                  import('sweetalert2').then(({ default: Swal }) => {
                    Swal.fire({
                      toast: true,
                      position: 'bottom-end',
                      icon: 'warning',
                      title: 'Debes iniciar sesión para resolver retos',
                      showConfirmButton: false,
                      timer: 3000,
                      background: '#101018',
                      color: '#ff6b35',
                      iconColor: '#ff6b35',
                      customClass: {
                        popup:
                          'border border-[#ff6b35]/30 rounded-xl shadow-[0_0_15px_rgba(255,107,53,0.15)] font-display text-sm backdrop-blur-md !z-[9999]',
                      },
                    })
                  })
                  return
                }
                onClose()
                navigate(`/challenges/${challenge.id}/editor`)
              }}
              className="btn btn-primary"
            >
              {challenge.hasCompleted ? 'Volver a Resolver' : 'Resolver Reto'}
            </button>
            {user && user.username === challenge.author?.username && (
              <button
                onClick={handleDelete}
                className="btn btn-secondary text-neon-pink! border-neon-pink! shadow-none hover:bg-neon-pink/10"
              >
                <IconTrash size={20} /> Eliminar
              </button>
            )}
            <button onClick={onClose} className="btn btn-secondary shadow-none">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChallengeDetailModal
