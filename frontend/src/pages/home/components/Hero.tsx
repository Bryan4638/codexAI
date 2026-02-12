import CountUp from 'react-countup'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <div className="animate-slide-up">
      <section className="flex items-center justify-center flex-col gap-10 min-h-screen text-center pt-18">
        <div className="hero-badge">Plataforma Educativa Interactiva</div>
        <div>
          <h1 className="mb-6 [text-shadow:0_0_40px_rgba(0,240,255,0.3)] shadow-aqua/30 text-4xl">
            Aprende a Programar desde Cero
          </h1>
          <p className="text-pretty">
            Domina los fundamentos de la programación con ejercicios
            interactivos, retroalimentación instantánea y un diseño que te
            mantendrá motivado.
          </p>
        </div>
        <div className="flex gap-6 justify-center flex-wrap">
          <Link className="btn btn-primary" to="/modules">
            Comenzar Ahora
          </Link>
          <Link className="btn btn-secondary" to="/challenges">
            Retos de la Comunidad
          </Link>
        </div>
        <div className="flex justify-center gap-6 text-sm pt-8 border-t border-gray-800/80">
          <div className="text-center">
            <div className="font-display text-[2.7rem] font-extrabold bg-gradient-primary bg-clip-text text-transparent mb-1">
              <CountUp end={4} duration={2} />
            </div>
            <span className="text-2xs text-text-muted uppercase tracking-widest">
              Módulos
            </span>
          </div>
          <div className="text-center">
            <div className="font-display text-[2.7rem] font-extrabold bg-gradient-primary bg-clip-text text-transparent mb-1">
              <CountUp end={8} duration={2} />
            </div>
            <span className="text-2xs text-text-muted uppercase tracking-widest">
              Lecciones
            </span>
          </div>
          <div className="text-center">
            <div className="font-display text-[2.7rem] font-extrabold bg-gradient-primary bg-clip-text text-transparent mb-1">
              <CountUp end={20} suffix="+" duration={2} />
            </div>
            <span className="text-2xs text-text-muted uppercase tracking-widest">
              Ejercicios
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
