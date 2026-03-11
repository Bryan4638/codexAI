import Skeleton from '@/components/share/skeletons/Skeleton'

interface CardSkeletonProps {
  showAvatar?: boolean
  showBadge?: boolean
  showFooter?: boolean
  lines?: number
}

export default function SkeletonCard({
  showAvatar = true,
  showBadge = true,
  showFooter = true,
  lines = 3,
}: CardSkeletonProps) {
  return (
    <article className="bg-bg-secondary border border-white/10 rounded-2xl p-5 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2 items-center">
          {showBadge && <Skeleton className="h-6 w-20 rounded-full" />}
        </div>

        <Skeleton className="h-5 w-5 rounded-md" />
      </div>

      <Skeleton className="h-6 w-3/4 mb-3" />
      <div className="space-y-2 mb-6 flex-1">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>

      {showFooter && (
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          {showAvatar && (
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          )}

          <Skeleton className="h-6 w-12 rounded-lg" />
        </div>
      )}
    </article>
  )
}
