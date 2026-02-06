import ChallengesPage from "@/pages/challenges/ChallengesPage";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import BadgesPage from "@/pages/badges/BadgesPage";
import LeaderboardPage from "@/pages/leaderboard/LeaderboardPage";
import ModulesPage from "@/pages/modules/ModulesPage";
import ProfilePage from "@/pages/profile/ProfilePage";
import Home from "@/pages/home/Home";
import AppLayout from "@/layouts/AppLayout";
import SingleModule from "@/pages/modules/SingleModule";

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

          <Route path="/modulos/:module" element={<SingleModule />} />
          {/*<Route path="modulos/:module/:lesson" element={ <LessonView} />*/}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
