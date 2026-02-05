import { useState, useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { badgeApi, authApi } from "./services/api";
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import { Outlet } from "react-router-dom";

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
