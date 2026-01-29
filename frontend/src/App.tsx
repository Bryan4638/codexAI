import { useState, useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { badgeApi, authApi } from "./services/api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ModuleCard from "./components/ModuleCard";
import LessonView from "./components/LessonView";
import AuthModal from "./components/AuthModal";
import ProfilePage from "./components/ProfilePage";
import BadgesPage from "./components/BadgesPage";
import LeaderboardPage from "./components/LeaderboardPage";
import ChallengesPage from "./components/ChallengesPage";
import ModulesPage from "./components/ModulesPage";
import { Outlet } from "react-router-dom";

const modulesData: Module[] = [
  {
    id: 1,
    title: "Variables y Tipos de Datos",
    description: "Aprende a almacenar y manipular información en tu código",
    icon: "📦",
    lessons: [
      { id: "1-1", title: "¿Qué son las variables?" },
      { id: "1-2", title: "Tipos de Datos" },
    ],
  },
  {
    id: 2,
    title: "Condicionales",
    description: "Toma decisiones en tu código usando if, else y operadores",
    icon: "🔀",
    lessons: [
      { id: "2-1", title: "Estructura if/else" },
      { id: "2-2", title: "Operadores de Comparación" },
    ],
  },
  {
    id: 3,
    title: "Bucles",
    description: "Repite acciones de forma eficiente con for y while",
    icon: "🔄",
    lessons: [
      { id: "3-1", title: "Bucle For" },
      { id: "3-2", title: "Bucle While" },
    ],
  },
  {
    id: 4,
    title: "Funciones",
    description: "Crea bloques de código reutilizables y organizados",
    icon: "⚡",
    lessons: [
      { id: "4-1", title: "Crear Funciones" },
      { id: "4-2", title: "Parámetros y Retorno" },
    ],
  },
];

interface Lesson {
  id: string;
  title: string;
  exercises?: any[];
}

interface Module {
  id: number;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [newBadgeNotification, setNewBadgeNotification] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [moduleProgress, setModuleProgress] = useState<
    Record<string, { completed: number; total: number }>
  >({});
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const { user, setUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (authApi.isLoggedIn()) {
      try {
        // We cast to any because api response type is not strictly typed yet for getMe
        const response: any = await authApi.getMe();
        if (response.user) {
          setUser(response.user);
        } else if (response.username) {
          // Adjust based on actual API response structure
          setUser(response);
        }
      } catch (error) {
        console.error("Session expired or invalid", error);
        authApi.logout();
        setUser(null);
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user, currentView]);

  const loadProgress = async () => {
    try {
      const data = await badgeApi.getProgress();
      if (data.completedLessons) {
        setCompletedLessons(data.completedLessons);
      }
      if (data.moduleProgress) {
        setModuleProgress(data.moduleProgress);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    if (view === "home" || view === "profile") {
      setSelectedLessonId(null);
    }
  };

  const handleModuleClick = (module: Module) => {
    setCurrentView("lessons");
  };

  const handleLessonClick = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentView("lesson");
  };

  const handleBackToModules = () => {
    setSelectedLessonId(null);
    setCurrentView("lessons");
  };

  const handleBackToHome = () => {
    setSelectedLessonId(null);
    setCurrentView("modules");
  };

  const handleNewBadges = (badges: any[]) => {
    if (badges && badges.length > 0) {
      setNewBadgeNotification(badges[0]);
      setTimeout(() => setNewBadgeNotification(null), 5000);
    }
  };

  return (
    <>
      <Header
        currentView={currentView}
        onShowAuth={() => setShowAuthModal(true)}
      />

      {/* Notificación de nueva medalla */}
      {newBadgeNotification && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            padding: "var(--spacing-lg)",
            background: "var(--gradient-card)",
            border: "2px solid var(--neon-green)",
            borderRadius: "var(--radius-lg)",
            zIndex: 1001,
            animation: "slideUp 0.5s ease",
            maxWidth: "300px",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              textAlign: "center",
              marginBottom: "var(--spacing-sm)",
            }}
          >
            🎉 {newBadgeNotification.icon}
          </div>
          <h4
            style={{
              color: "var(--neon-green)",
              textAlign: "center",
              marginBottom: "var(--spacing-xs)",
            }}
          >
            ¡Nueva Medalla!
          </h4>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
            }}
          >
            {newBadgeNotification.name}
          </p>
        </div>
      )}

      <main style={{ flex: 1, width: "100%" }}>
        <Outlet />
      </main>

      <footer className="footer">
        <p className="footer-text">
          Desarrollado con 💜 por <span>CODEX</span> • Aprende a programar de
          forma interactiva
        </p>
      </footer>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

export default App;
