import { difficultyStyles } from '@/pages/challenges/data/difficultyStyles'
import { useAuthStore } from '@/store/useAuthStore'
import type { Challenge } from '@/types/challenge'
import type { User } from '@/types/user'
import {
  IconCircleCheckFilled,
  IconHeart,
  IconTrash,
  IconUserFilled,
} from '@tabler/icons-react'

interface ChallengeCardProps {
  challenge: Challenge
  currentUser: User
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onReaction: (id: string) => void
}

export const ChallengeCard = ({
  challenge,
  currentUser,
  onSelect,
  onDelete,
  onReaction,
}: ChallengeCardProps) => {
  const { user } = useAuthStore()

  return (
    <article
      className={`bg-bg-secondary relative before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-[rgba(0,240,255,0.5)] before:to-transparent before:content-[''] border rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-300 hover:border-neon-cyan/50 hover:-translate-y-1 hover:shadow-neon-cyan ${challenge.hasCompleted ? 'border-neon-green/40 shadow-[0_0_15px_rgba(57,255,20,0.05)]' : 'border-white/10'}`}
      onClick={() => onSelect(challenge.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center mb-4">
          <span
            className={`text-xs px-3 py-1 rounded-full border bg-bg-tertiary ${difficultyStyles[challenge.difficulty] || ''}`}
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

        {currentUser && currentUser.username === challenge.author?.username && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(challenge.id)
            }}
            className="bg-transparent hover:text-neon-pink transition-colors duration-300 text-text-muted border-none cursor-pointer p-1"
            title="Eliminar reto"
          >
            <IconTrash size={20} />
          </button>
        )}
      </div>

      <h3 className="mb-2 text-lg font-display text-text-main group-hover:text-neon-cyan transition-colors">
        {challenge.title}
      </h3>
      <p className="text-sm text-text-secondary mb-6 flex-1 line-clamp-3">
        {challenge.description}
      </p>

      <div className="flex justify-between items-center mt-auto text-sm text-text-muted pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          {challenge.author?.avatarUrl ? (
            <img
              src={challenge.author.avatarUrl}
              alt=""
              className="w-7 h-7 rounded-full border border-white/20"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-bg-tertiary flex items-center justify-center border border-white/10">
              <IconUserFilled size={14} className="text-text-muted" />
            </div>
          )}
          <span className="font-medium">
            {challenge.author?.username || 'Anónimo'}
          </span>
        </div>

        <button
          disabled={!user}
          title={!user ? 'Inicia sesión para reaccionar' : ''}
          onClick={(e) => {
            e.stopPropagation()
            if (user) onReaction(challenge.id)
          }}
          className={`cursor-pointedivr flex items-center gap-1.5 transition-all duration-200 hover:scale-110 px-2 py-1 rounded-lg hover:bg-white/5 ${
            challenge.hasReacted ? 'text-neon-pink' : 'text-text-muted'
          } ${user ? 'cursor-pointer' : 'cursor-not-allowed'}`}
        >
          <IconHeart
            size={20}
            fill={challenge.hasReacted ? 'currentColor' : 'none'}
          />
          <span className="font-medium">{challenge.reactionsCount || 0}</span>
        </button>
      </div>
    </article>
  )
}
