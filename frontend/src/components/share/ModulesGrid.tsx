import { useModules } from '@/hooks/useModules'
import ModuleCard from '@/pages/modules/components/ModuleCard'
import { Module } from '@/types/module'
import { useNavigate } from 'react-router-dom'
import Error from './Error'
import Loading from './Loading'

export default function ModulesGrid() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useModules().getModules

  if (isLoading) return <Loading section="módulos" />
  if (error) return <Error section="módulos" />

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {data?.map((module: Module) => {
        const progress =
          module.totalExercises > 0
            ? Math.round(
                (module.completedExercises / module.totalExercises) * 100
              )
            : 0

        return (
          <ModuleCard
            key={module.id}
            module={module}
            progress={progress}
            onClick={() => navigate(`/modules/${module.icon}`)}
          />
        )
      })}
    </div>
  )
}
