import { UserProfileData } from '@/types/profile'
import { IconLockFilled, IconMedal, IconUserFilled } from '@tabler/icons-react'

interface Props {
  users: UserProfileData[]
  onUserClick: (id: string) => void
}

export default function LeaderboardTable({ users, onUserClick }: Props) {
  if (users.length === 0) return null

  return (
    <div className="glass-card p-0! overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-neon-cyan/10 border-b border-neon-cyan/20">
            <th className="p-4 text-center w-16">#</th>
            <th className="p-4 text-left">Usuario</th>
            <th className="p-4 text-center">Nivel</th>
            <th className="p-4 text-center">Medallas</th>
            <th className="p-4 text-center">XP</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => onUserClick(user.id)}
              className="border-b border-white/5 cursor-pointer transition-colors duration-200 hover:bg-neon-cyan/5"
            >
              <td className="p-4 text-center font-display text-text-muted">
                {user.rank}
              </td>

              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-gradient-card rounded-full flex items-center justify-center text-base">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <IconUserFilled size={20} />
                    )}
                  </div>
                  <span>{user.username}</span>
                  {!user.isPublic && (
                    <IconLockFilled size={16} color="#ffffff66" />
                  )}
                </div>
              </td>

              <td className="p-4 text-center text-neon-purple">{user.level}</td>

              <td className="p-4 text-center flex items-center justify-center gap-2">
                <IconMedal size={18} color="gold" /> {user.badgeCount}
              </td>

              <td className="p-4 text-center text-neon-cyan font-mono">
                {user.xp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
