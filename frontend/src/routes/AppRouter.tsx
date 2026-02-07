import AppLayout from '@/layouts/AppLayout'
import BadgesPage from '@/pages/badges/BadgesPage'
import ChallengesPage from '@/pages/challenges/ChallengesPage'
import Home from '@/pages/home/Home'
import LeaderboardPage from '@/pages/leaderboard/LeaderboardPage'
import ModulesPage from '@/pages/modules/ModulesPage'
import SingleModule from '@/pages/modules/components/SingleModule'
import ProfilePage from '@/pages/profile/ProfilePage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />

          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/ranking" element={<LeaderboardPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/modules/:modulePath" element={<SingleModule />} />
          <Route path="modules/:module/lessons/le" element={<h1>Lesson</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
