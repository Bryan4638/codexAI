import Footer from '@/components/nav/Footer'
import StreakCounter from '@/components/streaks/StreakCounter'
import Hero from '@/pages/home/components/Hero'
import LearningPath from '@/pages/home/components/LearningPath'

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <StreakCounter variant="full" />
      </div>
      <LearningPath />
      <Footer />
    </>
  )
}
