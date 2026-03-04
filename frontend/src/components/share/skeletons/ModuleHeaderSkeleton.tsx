import Skeleton from '@/components/share/skeletons/Skeleton'

export default function ModuleHeaderSkeleton() {
  return (
    <header className="text-left">
      <div className="flex items-top gap-6 mb-4">
        <Skeleton className="w-16 h-16 rounded-xl" />

        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <Skeleton className="h-4 w-80" />
        </div>
      </div>
    </header>
  )
}
