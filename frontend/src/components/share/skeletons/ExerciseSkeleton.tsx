import Skeleton from '@/components/share/skeletons/Skeleton'

export default function ExerciseSkeleton() {
  return (
    <section className="max-w-4xl mx-auto">
      <div className="bg-gradient-card shadow-card overflow-hidden rounded-2xl border border-white/8 p-6 backdrop-blur-[20px]">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="space-y-4 mb-8">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>

        <div className="flex justify-between pt-8">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </section>
  )
}
