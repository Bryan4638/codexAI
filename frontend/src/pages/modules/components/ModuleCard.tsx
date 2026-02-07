import { Module } from '@/types/module'
import { Link } from 'react-router-dom'

interface ModuleCardProps {
  module: Module
  progress: number
}

function ModuleCard({ module, progress }: ModuleCardProps) {
  return (
    <Link to={`/modulos/${module.id}`} className="module-card">
      <div className="module-number">0{module.id}</div>
      <div className="module-icon">{module.icon}</div>
      <h3 className="module-title">{module.title}</h3>
      <p className="module-description">{module.description}</p>
      <div className="module-progress-bar">
        <div
          className="module-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="module-lessons">
        <span>📚</span>
        <span>{module.lessons.length} lecciones</span>
        <span style={{ marginLeft: 'auto', color: 'var(--neon-cyan)' }}>
          {progress}% completado
        </span>
      </div>
    </Link>
  )
}

export default ModuleCard
