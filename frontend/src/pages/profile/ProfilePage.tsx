import Error from '@/components/share/Error'
import ProfilePageSkeleton from '@/components/share/skeletons/ProfileSkeleton'
import { useBadges } from '@/hooks/useBadges'
import ProfileActivityHistory from '@/pages/profile/components/ProfileActivityHistory'
import ProfileBadgesSection from '@/pages/profile/components/ProfileBadgesSection'
import ProfileHeader from '@/pages/profile/components/ProfileHeader'
import ProfileLevelProgressBar from '@/pages/profile/components/ProfileLevelProgressBar'
import ProfileModuleProgress from '@/pages/profile/components/ProfileModuleProgress'
import ProfileStats from '@/pages/profile/components/ProfileStats'

function ProfilePage() {
  const { userBadgesQuery, userProgressQuery } = useBadges()

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

  if (isPendingBadges || isPendingProgress) return <ProfilePageSkeleton />
  if (isErrorBadges || isErrorProgress) return <Error section="Perfil" />

  return (
    <section className="pt-32 pb-16 max-w-3xl mx-auto px-6">
      <ProfileHeader />
      <ProfileStats progress={progress} />
      <ProfileLevelProgressBar progress={progress} />

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
