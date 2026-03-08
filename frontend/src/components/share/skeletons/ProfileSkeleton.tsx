import Skeleton from '@/components/share/skeletons/Skeleton'

export default function ProfilePageSkeleton() {
  return (
    <div className="pt-32 pb-16 max-w-3xl mx-auto px-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-12 max-md:flex-col max-md:text-center">
        <Skeleton className="w-24 h-24 rounded-full shrink-0" />

        <div className="flex-1 space-y-3">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-12 max-md:grid-cols-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card !p-8 text-center">
            <Skeleton className="h-10 w-16 mx-auto mb-4" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="glass-card !p-8 mb-12">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-6 w-32" />
        </div>

        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
        {/* Badges */}
        <div>
          <Skeleton className="h-6 w-40 mb-6" />

          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="glass-card !p-6 text-center min-w-[120px] flex-1"
              >
                <Skeleton className="h-10 w-10 mx-auto mb-2 rounded-full" />
                <Skeleton className="h-4 w-20 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Module Progress */}
        <div>
          <Skeleton className="h-6 w-48 mb-6" />

          <div className="glass-card !p-6 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>

                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="mt-12">
        <Skeleton className="h-6 w-52 mb-6" />

        <div className="glass-card !p-0 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="px-6 py-4 border-b border-white/5 flex justify-between"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>

              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
