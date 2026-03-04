import Skeleton from '@/components/share/skeletons/Skeleton'

export default function BadgeCardSkeleton() {
  return (
    <article className="glass-card text-center">
      <div className="flex justify-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-3/4 mx-auto mt-6" />
      <div className="space-y-2 mt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6 mx-auto" />
      </div>

      <div className="mt-6 flex justify-center">
        <Skeleton className="h-6 w-28 rounded-lg" />
      </div>
    </article>
  )
}
