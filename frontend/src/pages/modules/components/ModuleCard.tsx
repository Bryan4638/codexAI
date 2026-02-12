import { Module } from '@/types/module'
import { Link } from 'react-router-dom'

interface ModuleCardProps {
  module: Module
  progress: number
}

function ModuleCard({ module, progress }: ModuleCardProps) {
  return (
    <Link to={`/modules/${module.icon}`} className="module-card">
      <div className="font-display text-4xl font-black text-white/5 absolute top-4 right-4">
        0{module.moduleNumber}
      </div>
      <div className="w-16 h-16 bg-neon-cyan/10 rounded-xl flex items-center justify-center text-3xl mb-4 transition-all duration-300 group-hover:scale-110">
        {module.icon}
      </div>
      <h3 className="font-display text-lg font-semibold mb-2">{module.name}</h3>
      <p className="text-sm text-text-secondary mb-4">{module.description}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center gap-2 mt-4 text-sm text-text-muted">
        <span>📚</span>
        <span>{module.lessons.length} lecciones</span>
        <span className="ml-auto text-neon-cyan">{progress}% completado</span>
      </div>
    </Link>
  )
}

export default ModuleCard
