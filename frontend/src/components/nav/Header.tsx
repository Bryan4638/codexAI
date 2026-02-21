import { useAuthStore } from '@/store/useAuthStore'
import { IconUserFilled } from '@tabler/icons-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  onShowAuth: () => void
}

function Header({ onShowAuth }: HeaderProps) {
  const { user } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/modules', label: 'Módulos' },
    { to: '/badges', label: 'Medallas' },
    { to: '/ranking', label: 'Ranking' },
    { to: '/challenges', label: 'Retos' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-bg-primary/80 backdrop-blur-[20px] border-b border-white/8 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-extrabold text-gradient"
        >
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-xl text-bg-primary">
            {'</>'}
          </div>
          <span>LEARN-CODE</span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className={`
            flex gap-8
            max-md:fixed max-md:top-17.5 max-md:left-0 max-md:right-0
            max-md:bg-bg-primary/98 max-md:backdrop-blur-[20px]
            max-md:flex-col max-md:p-6 max-md:gap-4 max-md:border-b max-md:border-white/8
            ${isMenuOpen ? 'max-md:flex' : 'max-md:hidden'}
          `}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className={`
                font-display text-xs font-medium uppercase tracking-wide
                relative py-2 cursor-pointer transition-colors duration-300
                after:content-[''] after:absolute after:bottom-0 after:left-0
                after:w-0 after:h-0.5 after:bg-gradient-primary after:transition-all after:duration-300
                hover:text-text-main hover:after:w-full
                max-md:text-center max-md:p-4 max-md:rounded-xl max-md:bg-white/3
                ${pathname === link.to ? 'text-neon-cyan after:w-full' : 'text-text-secondary'}
              `}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl cursor-pointer transition-all duration-300 hover:bg-neon-cyan/20"
            >
              <span className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center text-xs">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <IconUserFilled size={20} />
                )}
              </span>
              <span className="hidden md:flex items-center gap-2">
                <span className="font-display text-sm">{user.username}</span>
                <span className="bg-gradient-success px-2 py-0.5 rounded-xl text-[0.7rem] font-semibold text-bg-primary">
                  Nv.{user.level}
                </span>
              </span>
            </Link>
          ) : (
            <button
              className="btn btn-primary shadow-none py-3 px-4"
              onClick={onShowAuth}
            >
              Iniciar Sesión
            </button>
          )}

          <button
            className="hidden max-md:block bg-transparent border-none text-neon-cyan text-2xl cursor-pointer p-2"
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
