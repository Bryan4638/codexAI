import AppLayout from '@/layouts/AppLayout'
import BadgesPage from '@/pages/badges/BadgesPage'
import ChallengesPage from '@/pages/challenges/ChallengesPage'
import ExercisesPage from '@/pages/exercises/ExercisesPage'
import Home from '@/pages/home/Home'
import LeaderboardPage from '@/pages/leaderboard/LeaderboardPage'
import LessonsPage from '@/pages/lessons/LessonsPage'
import ModulesPage from '@/pages/modules/ModulesPage'
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

          <Route path="/modules/:modulePath" element={<LessonsPage />} />
          <Route
            path="modules/:modulePath/:lessonPath"
            element={<ExercisesPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
