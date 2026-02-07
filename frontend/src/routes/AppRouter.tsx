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

          <Route path="/modulos" element={<ModulesPage />} />
          <Route path="/medallas" element={<BadgesPage />} />
          <Route path="/ranking" element={<LeaderboardPage />} />
          <Route path="/retos" element={<ChallengesPage />} />
          <Route path="/perfil" element={<ProfilePage />} />

          <Route path="/modulos/:id" element={<SingleModule />} />
          {/*<Route path="modulos/:module/:lesson" element={ <LessonView} />*/}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
