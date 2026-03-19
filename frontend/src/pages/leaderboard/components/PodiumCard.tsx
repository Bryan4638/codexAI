import { config } from '@/pages/leaderboard/data/podiumCardConfig'
import type { UserProfileData } from '@/types/profile'
import { IconMedal, IconUserFilled } from '@tabler/icons-react'

interface PodiumCardProps {
  user: UserProfileData
  position: 1 | 2 | 3
  onClick: (id: string) => void
}

export default function PodiumCard({
  user,
  position,
  onClick,
}: PodiumCardProps) {
  const styles = config[position]

  return (
    <div
      onClick={() => onClick(user.id)}
      className={`${styles.container} ${styles.scale} transition-transform duration-300`}
    >
      <div className="text-4xl mb-4">{styles.icon}</div>

      <div
        className={`${styles.avatarSize} bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center`}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <IconUserFilled size={40} className="text-white/60" />
        )}
      </div>

      <h4 className={`${styles.nameClass} mb-1`}>{user.username}</h4>

      <div className="mb-2">
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize
          ${
            user.league === 'legend'
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-[0_0_8px_rgba(250,204,21,0.5)]'
              : user.league === 'diamond'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
              : user.league === 'gold'
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
              : user.league === 'silver'
              ? 'bg-gray-400/20 text-gray-300 border border-gray-400/50'
              : 'bg-orange-800/20 text-orange-300 border border-orange-800/50'
          }`}
        >
          {user.league || 'bronze'}
        </span>
      </div>

      <div className="text-sm text-text-secondary flex justify-center items-center">
        Nivel {user.level} • <IconMedal size={18} color="gold" />{' '}
        {user.badgeCount}
      </div>

      <div className="text-xs text-text-muted mt-1">
        {user.periodXp !== undefined ? user.periodXp : user.xp} XP
      </div>
    </div>
  )
}
