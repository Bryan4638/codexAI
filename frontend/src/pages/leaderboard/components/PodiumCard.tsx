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
          <IconUserFilled size={40} />
        )}
      </div>

      <h4 className={`${styles.nameClass} mb-1`}>{user.username}</h4>

      <div className="text-sm text-text-secondary flex justify-center items-center">
        Nivel {user.level} • <IconMedal size={18} color="gold" />{' '}
        {user.badgeCount}
      </div>

      <div className="text-xs text-text-muted mt-1">{user.xp} XP</div>
    </div>
  )
}
