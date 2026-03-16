import AppLayout from '@/layouts/AppLayout'
import { AuthPage } from '@/pages/auth/AuthPage'
import BadgesPage from '@/pages/badges/BadgesPage'
import ChallengesPage from '@/pages/challenges/ChallengesPage'
import Home from '@/pages/home/Home'
import LeaderboardPage from '@/pages/leaderboard/LeaderboardPage'
import ModulesPage from '@/pages/modules/ModulesPage'
import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const EditorPage = lazy(() => import('@/pages/editor/EditorPage'))
const LiveCodingPage = lazy(() => import('@/pages/challenges/LiveCodingPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const LessonsPage = lazy(() => import('@/pages/lessons/LessonsPage'))
const ExercisesPage = lazy(() => import('@/pages/exercises/ExercisesPage'))

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />

        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/ranking" element={<LeaderboardPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/challenges/live-coding" element={<LiveCodingPage />} />
        <Route path="/challenges/:id/editor" element={<EditorPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/modules/:modulePath" element={<LessonsPage />} />
        <Route
          path="modules/:modulePath/:lessonPath"
          element={<ExercisesPage />}
        />
      </Route>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  )
}
