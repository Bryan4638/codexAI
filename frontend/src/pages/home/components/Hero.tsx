import CountUp from 'react-countup'
import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">Plataforma Educativa Interactiva</div>
        <h1>Aprende a Programar desde Cero</h1>
        <p className="hero-subtitle">
          Domina los fundamentos de la programación con ejercicios interactivos,
          retroalimentación instantánea y un diseño que te mantendrá motivado.
        </p>
        <div className="hero-buttons">
          <Link className="btn btn-primary" to="/modules">
            🚀 Comenzar Ahora
          </Link>
          <Link className="btn btn-secondary" to="/challenges">
            📖 Ver Retos de la Comunidad
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">
              <CountUp end={4} duration={2} />
            </div>
            <div className="hero-stat-label">Módulos</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">
              <CountUp end={8} duration={2} />
            </div>
            <div className="hero-stat-label">Lecciones</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">
              <CountUp end={20} suffix="+" duration={2} />
            </div>
            <div className="hero-stat-label">Ejercicios</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
