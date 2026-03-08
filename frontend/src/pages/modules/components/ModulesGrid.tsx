import Error from '@/components/share/Error'
import SkeletonCard from '@/components/share/skeletons/SkeletonCard'
import { useModules } from '@/hooks/useModules'
import ModuleCard from '@/pages/modules/components/ModuleCard'
import { Module } from '@/types/module'
import { useNavigate } from 'react-router-dom'

export default function ModulesGrid() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useModules().getModules

  if (isLoading)
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} showBadge={false} lines={2} />
        ))}
      </section>
    )
  if (error) return <Error section="módulos" />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {data?.map((module: Module) => {
        const progress =
          module.completedExercises > 0
            ? Math.round(
                (module.completedExercises / module.totalExercises) * 100
              )
            : 0
        const handleClick = () => {
          setModuleId(module.id)
          navigate(`/modules/${module.id}`)
        }
        return (
          <ModuleCard
            key={module.id}
            module={module}
            progress={progress}
            onClick={() => handleClick()}
          />
        )
      })}
    </div>
  )
}
