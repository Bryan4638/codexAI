interface ProfileStatsCardProps {
  stat: number
  statName: string
  className?: string
}

export default function ProfileStatsCard({
  stat,
  statName,
  className,
}: ProfileStatsCardProps) {
  return (
    <article className="glass-card p-4 text-center">
      <span className={`text-2xl ${className}`}>{stat}</span>
      <p className="text-xs text-text-muted uppercase">{statName}</p>
    </article>
  )
}
