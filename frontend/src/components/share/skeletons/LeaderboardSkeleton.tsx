import Footer from '@/components/nav/Footer'
import PageHeader from '@/components/share/PageHeader'
import Skeleton from '@/components/share/skeletons/Skeleton'

export default function LeaderboardSkeleton() {
  return (
    <>
      <section className="py-28 max-w-7xl mx-auto px-6">
        <PageHeader
          title="Tabla de Posiciones"
          subtitle="Los mejores estudiantes de chamba—code"
        />

        <div className="flex justify-center items-end gap-10 mb-24 flex-wrap mt-10">
          <PodiumSkeleton size="md" />
          <PodiumSkeleton size="lg" />
          <PodiumSkeleton size="md" />
        </div>

        {/* Table skeleton */}
        <div className="glass-card p-0! overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-neon-cyan/10 border-b border-neon-cyan/20">
                <th className="p-4 w-16"></th>
                <th className="p-4"></th>
                <th className="p-4"></th>
                <th className="p-4"></th>
                <th className="p-4"></th>
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="p-4 text-center">
                    <Skeleton className="h-4 w-6 mx-auto" />
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <Skeleton className="h-4 w-10 mx-auto" />
                  </td>

                  <td className="p-4 text-center">
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </td>

                  <td className="p-4 text-center">
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Footer />
    </>
  )
}

function PodiumSkeleton({ size }: { size: 'lg' | 'md' }) {
  const avatarSize = size === 'lg' ? 'w-24 h-24' : 'w-20 h-20'
  const nameWidth = size === 'lg' ? 'w-32' : 'w-24'

  return (
    <div className="glass-card text-center p-8">
      <Skeleton className="h-10 w-10 mx-auto mb-4 rounded-full" />
      <Skeleton className={`${avatarSize} rounded-full mx-auto mb-4`} />
      <Skeleton className={`h-4 ${nameWidth} mx-auto mb-2`} />
      <Skeleton className="h-3 w-28 mx-auto mb-1" />
      <Skeleton className="h-3 w-20 mx-auto" />
    </div>
  )
}
