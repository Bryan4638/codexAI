import ChallengesPage from "../components/ChallengesPage";
import App from "../App";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import BadgesPage from "../components/BadgesPage";
import LeaderboardPage from "../components/LeaderboardPage";
import ModulesPage from "../components/ModulesPage";
import ProfilePage from "../components/ProfilePage";
import Home from "../components/Home";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />

          <Route path="/modulos" element={<ModulesPage />} />
          <Route path="/medallas" element={<BadgesPage />} />
          <Route path="/ranking" element={<LeaderboardPage />} />
          <Route path="/retos" element={<ChallengesPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
