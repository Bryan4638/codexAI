import { useStreak } from '@/hooks/useStreak'
import { clsx } from 'clsx'

interface StreakCounterProps {
  variant?: 'compact' | 'full'
  className?: string
}

export default function StreakCounter({
  variant = 'compact',
  className,
}: StreakCounterProps) {
  const { streakQuery } = useStreak()
  const { data, isLoading } = streakQuery

  if (isLoading) {
    return (
      <div
        className={clsx(
          'animate-pulse rounded-xl bg-white/5 backdrop-blur-md',
          variant === 'full' ? 'h-28 w-full' : 'h-10 w-24',
          className
        )}
      />
    )
  }

  const streak = data?.currentStreak ?? 0
  const longest = data?.longestStreak ?? 0
  const isActive = data?.isActiveToday ?? false

  // Determine tier for visual styling
  const tier =
    streak >= 30
      ? 'legendary'
      : streak >= 7
        ? 'fire'
        : streak >= 1
          ? 'warm'
          : 'cold'

  const tierStyles = {
    cold: {
      bg: 'from-gray-800/60 to-gray-900/60',
      border: 'border-gray-700/50',
      glow: '',
      icon: '🔥',
      numberColor: 'text-gray-400',
    },
    warm: {
      bg: 'from-orange-950/40 to-amber-950/40',
      border: 'border-orange-700/40',
      glow: '',
      icon: '🔥',
      numberColor: 'text-orange-400',
    },
    fire: {
      bg: 'from-red-950/50 to-orange-950/50',
      border: 'border-red-600/40',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
      icon: '🔥',
      numberColor: 'text-red-400',
    },
    legendary: {
      bg: 'from-yellow-950/50 to-amber-950/50',
      border: 'border-yellow-500/40',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.2)]',
      icon: '👑',
      numberColor: 'text-yellow-400',
    },
  }

  const style = tierStyles[tier]

  if (variant === 'compact') {
    return (
      <div
        className={clsx(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5',
          'bg-gradient-to-r border backdrop-blur-md',
          style.bg,
          style.border,
          style.glow,
          isActive && 'ring-1 ring-orange-400/30',
          className
        )}
      >
        <span
          className={clsx(
            'text-base',
            isActive && 'animate-[pulse_2s_ease-in-out_infinite]'
          )}
        >
          {style.icon}
        </span>
        <span className={clsx('text-sm font-bold tabular-nums', style.numberColor)}>
          {streak}
        </span>
      </div>
    )
  }

  // Full variant
  return (
    <div
      className={clsx(
        'rounded-2xl border p-5',
        'bg-gradient-to-br backdrop-blur-md',
        style.bg,
        style.border,
        style.glow,
        'transition-all duration-300',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              'flex h-12 w-12 items-center justify-center rounded-xl text-2xl',
              'bg-gradient-to-br from-white/10 to-white/5',
              isActive && 'animate-[pulse_2s_ease-in-out_infinite]'
            )}
          >
            {style.icon}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/50">
              Racha Actual
            </p>
            <p
              className={clsx(
                'text-3xl font-extrabold tabular-nums',
                style.numberColor
              )}
            >
              {streak}{' '}
              <span className="text-sm font-normal text-white/40">
                {streak === 1 ? 'día' : 'días'}
              </span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-white/50">
            Récord
          </p>
          <p className="text-lg font-bold tabular-nums text-white/70">
            {longest}{' '}
            <span className="text-xs font-normal text-white/40">
              {longest === 1 ? 'día' : 'días'}
            </span>
          </p>
        </div>
      </div>

      {!isActive && streak > 0 && (
        <div className="mt-3 rounded-lg bg-orange-500/10 px-3 py-1.5 text-center text-xs text-orange-300/80">
          ¡Completa un ejercicio hoy para mantener tu racha!
        </div>
      )}

      {isActive && (
        <div className="mt-3 rounded-lg bg-green-500/10 px-3 py-1.5 text-center text-xs text-green-300/80">
          ✅ Racha activa hoy
        </div>
      )}
    </div>
  )
}
