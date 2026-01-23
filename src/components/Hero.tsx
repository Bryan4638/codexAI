interface HeroProps {
  onStartLearning: () => void;
}

function Hero({ onStartLearning }: HeroProps) {
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
          <button className="btn btn-primary" onClick={onStartLearning}>
            🚀 Comenzar Ahora
          </button>
          <button className="btn btn-secondary">📖 Ver Módulos</button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">4</div>
            <div className="hero-stat-label">Módulos</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">8</div>
            <div className="hero-stat-label">Lecciones</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">20+</div>
            <div className="hero-stat-label">Ejercicios</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
