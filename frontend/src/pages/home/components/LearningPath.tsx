import dragonMascot from '@/assets/cyber_dragon_mascot.png'
import nodeArchitecture from '@/assets/node_architecture.png'
import nodeCloud from '@/assets/node_cloud.png'
import nodeDevops from '@/assets/node_devops.png'
import nodeProgramming from '@/assets/node_programming.png'
import nodeTerminal from '@/assets/node_terminal.png'
import { useNavigate } from 'react-router-dom'

export default function LearningPath() {
  const navigate = useNavigate()

  return (
    <section className="relative overflow-hidden py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.05),transparent_50%)]"></div>

      <div className="relative z-10 px-6 max-w-5xl mx-auto">
        <div className="text-center pt-8">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
            El Camino del Chambeador Dragón
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Desbloquea tu verdadero potencial. Sigue la ruta de fuego y código
            para convertirte en un maestro del desarrollo de software. Cada nodo
            es un reto, cada módulo es una llama que forjará tus habilidades.
            ¿Estás listo para ascender?
          </p>
        </div>

        <div className="relative min-h-[2000px]">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 800 2000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient
                id="pathGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
                <stop offset="25%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#ff2d92" stopOpacity="0.6" />
                <stop offset="75%" stopColor="#ff00ff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.6" />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d="M 400 100
                 C 400 200, 400 250, 550 350
                 S 700 450, 650 600
                 S 500 700, 250 850
                 S 100 1000, 200 1150
                 S 400 1250, 550 1350
                 S 650 1450, 500 1600
                 S 300 1750, 400 1900"
              stroke="url(#pathGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="10 5"
              filter="url(#glow)"
              className="animate-pulse"
            />

            <circle cx="400" cy="100" r="8" fill="#00f0ff" filter="url(#glow)">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="550" cy="350" r="8" fill="#8b5cf6" filter="url(#glow)">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                begin="0.4s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="650" cy="600" r="8" fill="#ff2d92" filter="url(#glow)">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                begin="0.8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="250" cy="850" r="8" fill="#ff00ff" filter="url(#glow)">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                begin="1.2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="550" cy="1350" r="8" fill="#00f0ff" filter="url(#glow)">
              <animate
                attributeName="r"
                values="8;12;8"
                dur="2s"
                begin="1.6s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          <div className="relative z-10 space-y-0">
            <div className="absolute left-1/2 -translate-x-1/2 top-[80px]">
              <PathNode
                title="Programming Languages"
                subtitle="JS • Python • C++"
                color="cyan"
                onClick={() => navigate('/modules')}
                image={nodeProgramming}
                alt="Programming Languages"
              />
            </div>

            <div className="absolute right-[15%] top-[330px]">
              <PathNode
                title="System Design"
                subtitle="Architecture Blueprints"
                color="purple"
                onClick={() => navigate('/modules')}
                image={nodeArchitecture}
                alt="System Design"
              />
            </div>

            <div className="absolute right-[30%] top-[680px]">
              <PathNode
                title="DevOps & CI/CD"
                subtitle="Pipeline & Automation"
                color="pink"
                onClick={() => navigate('/modules')}
                image={nodeDevops}
                alt="DevOps & CI/CD"
              />
            </div>

            <div className="absolute left-[10%] top-[830px]">
              <PathNode
                title="Advanced Coding"
                subtitle="Terminal Challenges"
                color="magenta"
                onClick={() => navigate('/challenges')}
                image={nodeTerminal}
                alt="Advanced Coding"
              />
            </div>

            <div className="absolute right-[15%] top-[1330px]">
              <PathNode
                title="Databases & Cloud"
                subtitle="Infrastructure Scales"
                color="cyan"
                onClick={() => navigate('/modules')}
                image={nodeCloud}
                alt="Databases & Cloud"
              />
            </div>
          </div>
        </div>

        <div className="-mt-26 flex flex-col items-center">
          <div className="relative group">
            <div className="w-72 h-72 mx-auto mb-8 flex items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800/50 to-transparent">
              <img
                src={dragonMascot}
                alt="Dragon mascot"
                className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(0,240,255,0.4)]"
              />
            </div>
            <div className="px-8 py-3 border-2 border-pink-500 rounded-xl bg-pink-500/10 shadow-[0_0_30px_#ff2d92] backdrop-blur-sm">
              <h2 className="text-pink-500 font-bold text-2xl tracking-widest text-center">
                CHAMBEADOR DRAGON
              </h2>
            </div>
            <div className="mt-6 text-center max-w-md mx-auto">
              <p className="text-slate-400 text-sm italic leading-relaxed">
                "Keep grinding, coder. The system is your playground."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface PathNodeProps {
  title: string
  subtitle: string
  color: 'cyan' | 'purple' | 'pink' | 'magenta'
  onClick: () => void
  image: string
  alt: string
}

function PathNode({
  title,
  subtitle,
  color,
  onClick,
  image,
  alt,
}: PathNodeProps) {
  const colorClasses = {
    cyan: {
      border: 'border-cyan-400/40 hover:border-cyan-400',
      text: 'text-cyan-400',
      glow: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]',
      bg: 'bg-cyan-500/10',
      imageGlow: 'drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]',
    },
    purple: {
      border: 'border-purple-500/40 hover:border-purple-500',
      text: 'text-purple-400',
      glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]',
      bg: 'bg-purple-500/10',
      imageGlow: 'drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]',
    },
    pink: {
      border: 'border-pink-500/40 hover:border-pink-500',
      text: 'text-pink-400',
      glow: 'hover:shadow-[0_0_30px_rgba(255,45,146,0.5)]',
      bg: 'bg-pink-500/10',
      imageGlow: 'drop-shadow-[0_0_20px_rgba(255,45,146,0.8)]',
    },
    magenta: {
      border: 'border-fuchsia-500/40 hover:border-fuchsia-500',
      text: 'text-fuchsia-400',
      glow: 'hover:shadow-[0_0_30px_rgba(255,0,255,0.5)]',
      bg: 'bg-fuchsia-500/10',
      imageGlow: 'drop-shadow-[0_0_20px_rgba(255,0,255,0.8)]',
    },
  }

  const colors = colorClasses[color]

  return (
    <div
      className="flex flex-col items-center gap-4 cursor-pointer group transition-all duration-300"
      onClick={onClick}
    >
      <div
        className={`w-36 h-36 flex items-center justify-center rounded-full ${colors.bg} ${colors.border} border-2 backdrop-blur-md group-hover:scale-110 transition-all duration-300 ${colors.glow} overflow-hidden`}
      >
        <img
          src={image}
          alt={alt}
          className={`w-full h-full object-contain filter ${colors.imageGlow}`}
        />
      </div>
      <div
        className={`${colors.bg} border ${colors.border} p-4 rounded-xl backdrop-blur-md w-56 text-center transition-all duration-300 ${colors.glow}`}
      >
        <h3 className={`text-base font-bold ${colors.text}`}>{title}</h3>
        <p
          className={`text-xs ${colors.text} opacity-60 mt-2 uppercase tracking-wide`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  )
}
