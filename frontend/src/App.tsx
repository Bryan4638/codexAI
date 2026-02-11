import { useState, useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import Header from "./components/Header";
import AuthModal from "./components/AuthModal";
import { Outlet } from "react-router-dom";

function App() {
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [newBadgeNotification] = useState<any>(null);

  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Header
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
