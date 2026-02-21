import { Challenge } from '@/types/challenge'
import { User } from '@/types/user'
import { IconHeart, IconTrash, IconUserFilled } from '@tabler/icons-react'

interface ChallengeCardProps {
  challenge: Challenge
  currentUser: User
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onReaction: (id: string) => void
}

const difficultyColors: Record<string, string> = {
  easy: 'text-neon-green border-neon-green',
  medium: 'text-neon-cyan border-neon-cyan',
  hard: 'text-neon-pink border-neon-pink',
}

export const ChallengeCard = ({
  challenge,
  currentUser,
  onSelect,
  onDelete,
  onReaction,
}: ChallengeCardProps) => {
  return (
    <div
      className="bg-bg-secondary border border-white/10 rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-300 hover:border-neon-cyan/50 hover:-translate-y-1 hover:shadow-neon-cyan"
      onClick={() => onSelect(challenge.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <span
          className={`text-xs px-3 py-1 mb-4 rounded-full border bg-bg-tertiary ${difficultyColors[challenge.difficulty] || ''}`}
        >
          {challenge.difficulty.toUpperCase()}
        </span>

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
          onClick={(e) => {
            e.stopPropagation()
            onReaction(challenge.id)
          }}
          className={`cursor-pointer flex items-center gap-1.5 transition-all duration-200 hover:scale-110 px-2 py-1 rounded-lg hover:bg-white/5 ${
            challenge.hasReacted ? 'text-neon-pink' : 'text-text-muted'
          }`}
        >
          <IconHeart
            size={20}
            fill={challenge.hasReacted ? 'currentColor' : 'none'}
          />
          <span className="font-medium">{challenge.reactionsCount || 0}</span>
        </button>
      </div>
    </div>
  )
}
