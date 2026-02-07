import { useAuthStore } from '@/store/useAuthStore'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  currentView: string
  onShowAuth: () => void
}

function Header({ onShowAuth }: HeaderProps) {
  const { user } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = useLocation()

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <div className="logo-icon">{'</>'}</div>
          <span className="logo-text">CODEX</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <Link
            className={`nav-link ${pathname.pathname === '/' ? 'active' : ''}`}
            to="/"
          >
            Inicio
          </Link>
          <Link
            className={`nav-link ${pathname.pathname === '/modules' ? 'active' : ''}`}
            to="/modules"
          >
            Módulos
          </Link>
          <Link
            className={`nav-link ${pathname.pathname === '/badges' ? 'active' : ''}`}
            to="/badges"
          >
            Medallas
          </Link>
          <Link
            className={`nav-link ${pathname.pathname === '/ranking' ? 'active' : ''}`}
            to="/ranking"
          >
            Ranking
          </Link>
          <Link
            className={`nav-link ${pathname.pathname === '/challenges' ? 'active' : ''}`}
            to="/challenges"
          >
            Retos
          </Link>
        </nav>

        <div className="header-actions">
          {user ? (
            <Link
              className="user-profile-btn"
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                background: 'rgba(0, 240, 255, 0.1)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'var(--transition-normal)',
              }}
            >
              <span
                className="user-avatar"
                style={{
                  width: '28px',
                  height: '28px',
                  background: 'var(--gradient-primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                }}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  '👤'
                )}
              </span>
              <span
                className="user-info desktop-only"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                }}
              >
                <span
                  className="user-name"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                  }}
                >
                  {user.username}
                </span>
                <span
                  className="user-level"
                  style={{
                    background: 'var(--gradient-success)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    color: 'var(--bg-primary)',
                  }}
                >
                  Nv.{user.level || user.current_level}
                </span>
              </span>
            </Link>
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
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
