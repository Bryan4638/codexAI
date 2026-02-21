import { Module } from '@/types/module'
import { IconBook2 } from '@tabler/icons-react'

interface ModuleCardProps {
  module: Module
  progress: number
  onClick: () => void
}

export default function ModuleCard({
  module,
  progress,
  onClick,
}: ModuleCardProps) {
  return (
    <article onClick={onClick} className="module-card flex flex-col h-auto p-6">
      <header>
        <span className="font-display text-4xl font-black text-white/5 absolute top-4 right-4">
          0{module.moduleNumber}
        </span>
        <div className="w-16 h-16 bg-neon-cyan/10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 overflow-hidden">
          <img
            src={`/icons/${encodeURIComponent(module.icon)}.png`}
            alt={`${module.name} icon`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.parentElement!.innerHTML = module.icon
            }}
          />
        </div>
        <h3 className="font-display text-base font-semibold mb-2 text-pretty line-clamp-1 overflow-hidden text-ellipsis">
          {module.name}
        </h3>
      </header>
      <main className="mb-8 flex-1 flex flex-col">
        <p className="text-sm text-text-secondary mb-2 text-pretty line-clamp-2 overflow-hidden text-ellipsis">
          {module.description}
        </p>
        <div className="progress-bar mt-auto">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </main>
      <footer className="flex items-center gap-2 mt-4 text-xs text-text-muted absolute bottom-4 right-4">
        <IconBook2 />
        <span>{module.totalExercises} lecciones</span>
        <span className="ml-auto text-neon-cyan">{progress}% completado</span>
      </footer>
    </article>
  )
}
