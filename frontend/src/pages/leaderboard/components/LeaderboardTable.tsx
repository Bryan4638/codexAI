import type { UserProfileData } from '@/types/profile'
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
            <th className="p-4 text-center">Liga</th>
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
                      <div className="w-7 h-7 rounded-full bg-bg-tertiary flex items-center justify-center border border-white/10">
                        <IconUserFilled size={14} className="text-text-muted" />
                      </div>
                    )}
                  </div>
                  <span>{user.username}</span>
                  {!user.isPublic && (
                    <IconLockFilled size={16} color="#ffffff66" />
                  )}
                </div>
              </td>

              <td className="p-4">
                <div className="flex justify-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold capitalize
                    ${
                      user.league === 'legend'
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]'
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
              </td>

              <td className="p-4 text-center text-neon-purple">{user.level}</td>

              <td className="p-4 text-center flex items-center justify-center gap-2">
                <IconMedal size={18} color="gold" /> {user.badgeCount}
              </td>

              <td className="p-4 text-center text-neon-cyan font-mono">
                {user.periodXp !== undefined ? user.periodXp : user.xp}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
