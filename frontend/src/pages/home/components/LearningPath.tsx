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
    <section className="relative overflow-hidden grid-background py-20">
      {/* Background Vector Path removed from here to place inside nodes container */}

      <div className="relative z-10 px-6 max-w-4xl mx-auto">
        {/* Intro Text */}
        <div className="text-center pt-8 pb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-neon-cyan to-neon-purple drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            El Camino del Chambeador Dragón
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto font-body">
            Desbloquea tu verdadero potencial. Sigue la ruta de fuego y código
            para convertirte en un maestro del desarrollo de software. Cada nodo
            es un reto, cada módulo es una llama que forjará tus habilidades.
            ¿Estás listo para ascender?
          </p>
        </div>

        <div className="relative">
          {/* Background Vector Path (Illustrative ZigZag) */}
          <div className="absolute inset-x-0 top-[200px] bottom-[-50px] pointer-events-none opacity-40 flex justify-center">
            <svg
              className="w-full max-w-[600px] h-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 400 1500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="lightning-path"
                d="M200 0 V100 L300 300 L100 600 L300 900 L100 1200 L200 1500"
                stroke="url(#paint0_linear)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="6"
              ></path>
              <defs>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  id="paint0_linear"
                  x1="200"
                  x2="200"
                  y1="0"
                  y2="1500"
                >
                  <stop stopColor="var(--color-neon-cyan)"></stop>
                  <stop
                    offset="0.25"
                    stopColor="var(--color-neon-purple)"
                  ></stop>
                  <stop offset="0.5" stopColor="var(--color-neon-pink)"></stop>
                  <stop
                    offset="0.75"
                    stopColor="var(--color-neon-magenta)"
                  ></stop>
                  <stop offset="1" stopColor="var(--color-neon-cyan)"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="space-y-40 relative z-10 py-10 flex flex-col items-center">
            {/* Node 1: Center */}
            <div className="w-full flex justify-center">
              <div
                className="flex flex-col items-center gap-4 cursor-pointer group"
                onClick={() => navigate('/modules')}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center z-20 group-hover:scale-110 transition-transform relative">
                  <img
                    src={nodeProgramming}
                    alt="Programming"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]"
                  />
                </div>
                <div className="bg-bg-dark/90 border border-neon-cyan/40 p-3 rounded-lg backdrop-blur-md w-48 text-center shadow-lg group-hover:border-neon-cyan transition-colors mt-2">
                  <h3 className="text-sm font-bold text-neon-cyan">
                    Programming Languages
                  </h3>
                  <p className="text-[10px] text-neon-cyan/60 mt-1 uppercase tracking-tighter">
                    JS • Python • C++
                  </p>
                </div>
              </div>
            </div>

            {/* Node 2: Right */}
            <div className="w-full flex justify-end pr-8 sm:pr-24">
              <div
                className="flex flex-col items-center gap-4 cursor-pointer group"
                onClick={() => navigate('/modules')}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center z-20 group-hover:scale-110 transition-transform relative">
                  <img
                    src={nodeArchitecture}
                    alt="Architecture"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]"
                  />
                </div>
                <div className="bg-bg-dark/90 border border-neon-purple/40 p-3 rounded-lg backdrop-blur-md w-48 text-center shadow-lg group-hover:border-neon-purple transition-colors mt-2">
                  <h3 className="text-sm font-bold text-neon-purple">
                    System Design
                  </h3>
                  <p className="text-[10px] text-neon-purple/60 mt-1 uppercase tracking-tighter">
                    Architecture Blueprints
                  </p>
                </div>
              </div>
            </div>

            {/* Node 3: Left */}
            <div className="w-full flex justify-start pl-8 sm:pl-24">
              <div
                className="flex flex-col items-center gap-4 cursor-pointer group"
                onClick={() => navigate('/modules')}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center z-20 group-hover:scale-110 transition-transform relative">
                  <img
                    src={nodeDevops}
                    alt="DevOps"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,45,146,0.8)]"
                  />
                </div>
                <div className="bg-bg-dark/90 border border-neon-pink/40 p-3 rounded-lg backdrop-blur-md w-48 text-center shadow-lg group-hover:border-neon-pink transition-colors mt-2">
                  <h3 className="text-sm font-bold text-neon-pink">
                    DevOps &amp; CI/CD
                  </h3>
                  <p className="text-[10px] text-neon-pink/60 mt-1 uppercase tracking-tighter">
                    Pipeline &amp; Automation
                  </p>
                </div>
              </div>
            </div>

            {/* Node 4: Right */}
            <div className="w-full flex justify-end pr-8 sm:pr-24">
              <div
                className="flex flex-col items-center gap-4 cursor-pointer group"
                onClick={() => navigate('/challenges')}
              >
                <div className="w-52 h-52 md:w-40 md:h-40 flex items-center justify-center z-20 group-hover:scale-110 transition-transform relative">
                  <img
                    src={nodeTerminal}
                    alt="Terminal"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,0,255,0.8)]"
                  />
                </div>
                <div className="bg-bg-dark/90 border border-neon-magenta/40 p-3 rounded-lg backdrop-blur-md w-48 text-center shadow-lg group-hover:border-neon-magenta transition-colors mt-2">
                  <h3 className="text-sm font-bold text-neon-magenta">
                    Advanced Coding
                  </h3>
                  <p className="text-[10px] text-neon-magenta/60 mt-1 uppercase tracking-tighter">
                    Terminal Challenges
                  </p>
                </div>
              </div>
            </div>

            {/* Node 5: Left */}
            <div className="w-full flex justify-start pl-8 sm:pl-24">
              <div
                className="flex flex-col items-center gap-4 cursor-pointer group"
                onClick={() => navigate('/modules')}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center z-20 group-hover:scale-110 transition-transform relative">
                  <img
                    src={nodeCloud}
                    alt="Cloud"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]"
                  />
                </div>
                <div className="bg-bg-dark/90 border border-neon-cyan/40 p-3 rounded-lg backdrop-blur-md w-48 text-center shadow-lg group-hover:border-neon-cyan transition-colors mt-2">
                  <h3 className="text-sm font-bold text-neon-cyan">
                    Databases &amp; Cloud
                  </h3>
                  <p className="text-[10px] text-neon-cyan/60 mt-1 uppercase tracking-tighter">
                    Infrastructure Scales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mascot Footer Illustration */}
        <div className="pt-20 pb-10 flex flex-col items-center">
          <div className="relative group">
            {/* Mascot Image Placeholder Area */}
            <div className="relative w-72 h-72 mx-auto overflow-visible">
              <div className="absolute inset-0 bg-linear-to-t from-neon-cyan/20 to-transparent rounded-full blur-3xl opacity-50"></div>
              <img
                alt="Dragon mascot using a laptop"
                className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_20px_rgba(0,238,255,0.5)] rounded-2xl"
                src={dragonMascot}
              />
            </div>
            {/* Neon Sign */}
            <div className="mb-8 px-6 py-2 border-2 border-neon-pink rounded-lg bg-neon-pink/10 shadow-[0_0_15px_#ff2d92]">
              <h2 className="text-neon-pink font-bold text-xl tracking-widest text-center">
                CHAMBEADOR DRAGON
              </h2>
            </div>
            <div className="mt-6 text-center max-w-xs mx-auto">
              <p className="text-slate-400 text-sm italic">
                "Keep grinding, coder. The system is your playground."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
