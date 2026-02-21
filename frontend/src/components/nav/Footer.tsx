import { IconCode, IconHeart, IconMail, IconWorld } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-bg-secondary/80 border-t border-white/10 mt-auto backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center shadow-neon-purple">
                <span className="font-display text-black font-bold text-sm">
                  LC
                </span>
              </div>
              <h2 className="font-display text-xl text-text-main tracking-wider">
                <span className="text-neon-cyan">chamba—code</span>
              </h2>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-sm">
              Aprende programación de forma interactiva, moderna y divertida.
              Desbloquea niveles, compite y mejora cada día.
            </p>

            <div>
              <h4 className="font-display text-xs mb-2 text-neon-green tracking-wide">
                Soporte general
              </h4>
              <p className="text-text-secondary text-xs flex gap-2 items-center hover:text-neon-green transition">
                <IconMail size={14} />
                learncode@learncode.bryandev.dev
              </p>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-display text-sm mb-4 text-neon-purple tracking-wide">
              Navegación
            </h3>

            <section className="space-y-2 flex flex-col text-sm text-text-secondary">
              <Link to="/" className="hover:text-neon-cyan transition">
                Inicio
              </Link>
              <Link to="/modules" className="hover:text-neon-cyan transition">
                Módulos
              </Link>
              <Link to="/badges" className="hover:text-neon-cyan transition">
                Medallas
              </Link>
              <Link to="/ranking" className="hover:text-neon-cyan transition">
                Ranking
              </Link>
              <Link
                to="/challenges"
                className="hover:text-neon-cyan transition"
              >
                Retos
              </Link>
              <Link to="/profile" className="hover:text-neon-cyan transition">
                Perfil
              </Link>
            </section>
          </div>

          {/* Built By */}
          <div>
            <h3 className="font-display flex items-center gap-2 text-sm mb-6 text-neon-orange tracking-wide">
              Built with <IconHeart size={18} /> and <IconCode size={18} /> by
            </h3>

            <div className="space-y-6 text-sm">
              {/* Brayan */}
              <div className="p-5 rounded-2xl bg-bg-tertiary/80 border border-white/5 hover:border-neon-purple/40 transition-all duration-300">
                <p className="text-neon-purple font-semibold">
                  Brayan Céspedes
                </p>
                <p className="text-text-muted text-xs mb-3">
                  Backend • Arquitectura
                </p>

                <div className="space-y-1">
                  <p className="text-text-secondary text-xs flex gap-2 items-center">
                    <IconMail size={14} />
                    brayancespedes57@gmail.com
                  </p>

                  <a
                    href="https://bryandev.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-neon-green transition text-xs flex gap-2 items-center"
                  >
                    <IconWorld size={14} />
                    bryandev.dev
                  </a>
                </div>
              </div>

              {/* Kevin */}
              <div className="p-5 rounded-2xl bg-bg-tertiary/80 border border-white/5 hover:border-neon-cyan/40 transition-all duration-300">
                <p className="text-neon-cyan font-semibold">Kevin Santamaria</p>
                <p className="text-text-muted text-xs mb-3">Frontend • UI/UX</p>

                <div className="space-y-1">
                  <p className="text-text-secondary text-xs flex gap-2 items-center">
                    <IconMail size={14} />
                    kevsantamaria01@gmail.com
                  </p>

                  <a
                    href="https://kevsantamaria.is-a.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-neon-green transition text-xs flex gap-2 items-center"
                  >
                    <IconWorld size={14} />
                    kevsantamaria.is-a.dev
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-14 pt-6 text-center">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()}{' '}
            <span className="text-neon-cyan font-display tracking-wider">
              chamba—code
            </span>{' '}
            • Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
