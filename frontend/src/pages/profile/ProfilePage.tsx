import ProfilePageSkeleton from '@/components/share/skeletons/ProfileSkeleton'
import { useBadges } from '@/hooks/useBadges'
import ProfileBadgesSection from '@/pages/profile/components/ProfileBadgesSection'
import ProfileHeader from '@/pages/profile/components/ProfileHeader'
import ProfileLevelProgressBar from '@/pages/profile/components/ProfileLevelProgressBar'
import ProfileModuleProgress from '@/pages/profile/components/ProfileModuleProgress'
import ProfileStats from '@/pages/profile/components/ProfileStats'
import { useAuthStore } from '@/store/useAuthStore'
import StreakCounter from '@/components/streaks/StreakCounter'
import ActivityHeatmap from '@/components/analytics/ActivityHeatmap'
import { lazy } from 'react'
import { useNavigate } from 'react-router-dom'

const Error = lazy(() => import('@/components/share/Error'))
const ProfileActivityHistory = lazy(
  () => import('@/pages/profile/components/ProfileActivityHistory')
)

function ProfilePage() {
  const { userBadgesQuery, userProgressQuery } = useBadges()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const {
    data: badges,
    isPending: isPendingBadges,
    isError: isErrorBadges,
  } = userBadgesQuery
  const {
    data: progress,
    isPending: isPendingProgress,
    isError: isErrorProgress,
  } = userProgressQuery

  if (!user) navigate('/')
  if (isPendingBadges || isPendingProgress) return <ProfilePageSkeleton />
  if (isErrorBadges || isErrorProgress) return <Error section="Perfil" />

  return (
    <section className="pt-32 pb-16 max-w-3xl mx-auto px-6">

      <ProfileHeader />
      <StreakCounter variant="full" className="mt-6 mb-8 " />

      <ProfileStats progress={progress} />
      <ProfileLevelProgressBar progress={progress} />

      <ActivityHeatmap className="mt-6 mb-8" />

      <section className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
        <ProfileBadgesSection badges={badges} />
        <ProfileModuleProgress progress={progress} />
      </section>

      {progress.history && progress.history.length > 0 && (
        <ProfileActivityHistory progress={progress} />
      )}
    </section>
  )
}

export default ProfilePage
