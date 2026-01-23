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

function App() {
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [newBadgeNotification, setNewBadgeNotification] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [moduleProgress, setModuleProgress] = useState<
    Record<string, { completed: number; total: number }>
  >({});

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
      setSelectedModule(null);
      setSelectedLessonId(null);
    }
  };

  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
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
    setSelectedModule(null);
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
        onNavigate={handleNavigate}
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
        {currentView === "home" && (
          <>
            <Hero onStartLearning={() => handleNavigate("modules")} />
            <section className="modules-section container">
              <div className="section-header">
                <h2>Módulos de Aprendizaje</h2>
                <p>
                  Explora nuestros módulos diseñados para llevarte desde cero
                  hasta programador.
                </p>
              </div>
              <div className="modules-grid">
                {modulesData.map((module) => {
                  const stats = moduleProgress[module.id] || {
                    completed: 0,
                    total: 0,
                  };
                  const progress =
                    stats.total > 0
                      ? Math.round((stats.completed / stats.total) * 100)
                      : 0;

                  return (
                    <ModuleCard
                      key={module.id}
                      module={module}
                      progress={progress}
                      onClick={() => handleModuleClick(module)}
                    />
                  );
                })}
              </div>
            </section>
          </>
        )}

        {currentView === "modules" && (
          <section
            className="modules-section container"
            style={{ paddingTop: "120px" }}
          >
            <div className="section-header">
              <h2>Todos los Módulos</h2>
              <p>Selecciona un módulo para comenzar a aprender.</p>
            </div>
            <div className="modules-grid">
              {modulesData.map((module) => {
                const stats = moduleProgress[module.id] || {
                  completed: 0,
                  total: 0,
                };
                const progress =
                  stats.total > 0
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0;

                return (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    progress={progress}
                    onClick={() => handleModuleClick(module)}
                  />
                );
              })}
            </div>
          </section>
        )}

        {currentView === "lessons" && selectedModule && (
          <section className="container" style={{ paddingTop: "120px" }}>
            <div
              className="lesson-breadcrumb"
              style={{ marginBottom: "var(--spacing-xl)" }}
            >
              <span
                onClick={handleBackToHome}
                style={{ cursor: "pointer", color: "var(--neon-cyan)" }}
              >
                ← Volver a Módulos
              </span>
            </div>
            <div className="section-header" style={{ textAlign: "left" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-lg)",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                <div className="module-icon" style={{ fontSize: "2rem" }}>
                  {selectedModule.icon}
                </div>
                <div>
                  <h2 style={{ marginBottom: "var(--spacing-xs)" }}>
                    {selectedModule.title}
                  </h2>
                  <p style={{ margin: 0 }}>{selectedModule.description}</p>
                </div>
              </div>
            </div>
            <div
              className="modules-grid"
              style={{ marginTop: "var(--spacing-2xl)" }}
            >
              {selectedModule.lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className="module-card"
                    onClick={() => handleLessonClick(lesson.id)}
                    style={
                      isCompleted
                        ? {
                            borderColor: "var(--neon-green)",
                            background: "rgba(0, 255, 136, 0.05)",
                          }
                        : {}
                    }
                  >
                    <div className="module-number">0{index + 1}</div>
                    <h3 className="module-title">
                      {lesson.title}
                      {isCompleted && (
                        <span style={{ marginLeft: "10px" }}>✅</span>
                      )}
                    </h3>
                    <p className="module-description">
                      {isCompleted
                        ? "¡Lección completada!"
                        : "Ejercicios interactivos disponibles"}
                    </p>
                    <div className="module-lessons">
                      <span>{isCompleted ? "🌟" : "🎯"}</span>
                      <span>
                        {isCompleted
                          ? "Repasar lección"
                          : "Click para comenzar"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {currentView === "lesson" && selectedModule && selectedLessonId && (
          <LessonView
            module={selectedModule}
            lessonId={selectedLessonId}
            onBack={handleBackToModules}
            onNewBadges={handleNewBadges}
          />
        )}

        {currentView === "badges" && user && <BadgesPage />}

        {currentView === "badges" && !user && (
          <section
            className="container"
            style={{ paddingTop: "150px", textAlign: "center" }}
          >
            <h2>🔒 Acceso Restringido</h2>
            <p style={{ marginBottom: "var(--spacing-xl)" }}>
              Inicia sesión para ver tus medallas
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowAuthModal(true)}
            >
              Iniciar Sesión
            </button>
          </section>
        )}

        {currentView === "leaderboard" && <LeaderboardPage />}

        {currentView === "challenges" && <ChallengesPage />}

        {currentView === "profile" && user && <ProfilePage />}

        {currentView === "profile" && !user && (
          <section
            className="container"
            style={{ paddingTop: "150px", textAlign: "center" }}
          >
            <h2>🔒 Acceso Restringido</h2>
            <p style={{ marginBottom: "var(--spacing-xl)" }}>
              Inicia sesión para ver tu perfil
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowAuthModal(true)}
            >
              Iniciar Sesión
            </button>
          </section>
        )}
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
