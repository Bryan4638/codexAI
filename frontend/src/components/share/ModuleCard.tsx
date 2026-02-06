import { Module } from '@/types/module'

interface ModuleCardProps {
  module: Module
  progress: number
  onClick: () => void
}

function ModuleCard({ module, progress, onClick }: ModuleCardProps) {
  return (
    <div className="module-card" onClick={onClick}>
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
    </div>
  )
}

export default ModuleCard
