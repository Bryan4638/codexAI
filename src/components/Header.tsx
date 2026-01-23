import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

interface HeaderProps {
  onNavigate: (view: string) => void;
  currentView: string;
  onShowAuth: () => void;
}

function Header({ onNavigate, currentView, onShowAuth }: HeaderProps) {
  const { user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => handleNavClick("home")}>
          <div className="logo-icon">{"</>"}</div>
          <span className="logo-text">CODEX</span>
        </div>

        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <span
            className={`nav-link ${currentView === "home" ? "active" : ""}`}
            onClick={() => handleNavClick("home")}
          >
            Inicio
          </span>
          <span
            className={`nav-link ${currentView === "modules" ? "active" : ""}`}
            onClick={() => handleNavClick("modules")}
          >
            Módulos
          </span>
          <span
            className={`nav-link ${currentView === "badges" ? "active" : ""}`}
            onClick={() => handleNavClick("badges")}
          >
            Medallas
          </span>
          <span
            className={`nav-link ${currentView === "leaderboard" ? "active" : ""}`}
            onClick={() => handleNavClick("leaderboard")}
          >
            Ranking
          </span>
          <span
            className={`nav-link ${currentView === "challenges" ? "active" : ""}`}
            onClick={() => handleNavClick("challenges")}
          >
            Retos
          </span>
        </nav>

        <div className="header-actions">
          {user ? (
            <div
              className="user-profile-btn"
              onClick={() => handleNavClick("profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-sm)",
                padding: "var(--spacing-sm) var(--spacing-md)",
                background: "rgba(0, 240, 255, 0.1)",
                border: "1px solid rgba(0, 240, 255, 0.3)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                transition: "var(--transition-normal)",
              }}
            >
              <span
                className="user-avatar"
                style={{
                  width: "28px",
                  height: "28px",
                  background: "var(--gradient-primary)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                }}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "👤"
                )}
              </span>
              <span
                className="user-info desktop-only"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--spacing-sm)",
                }}
              >
                <span
                  className="user-name"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.85rem",
                  }}
                >
                  {user.username}
                </span>
                <span
                  className="user-level"
                  style={{
                    background: "var(--gradient-success)",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    color: "var(--bg-primary)",
                  }}
                >
                  Nv.{user.level || user.current_level}
                </span>
              </span>
            </div>
          ) : (
            <button className="btn btn-primary btn-login" onClick={onShowAuth}>
              Login
            </button>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
