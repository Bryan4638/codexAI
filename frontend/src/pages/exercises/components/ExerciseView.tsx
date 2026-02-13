import CodeEditor from '@/components/exercises/CodeEditor'
import DragDrop from '@/components/exercises/DragDrop'
import FillBlank from '@/components/exercises/FillBlank'
import Quiz from '@/components/exercises/Quiz'
import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import { useExercises } from '@/hooks//useExercises'
import { badgeApi } from '@/services/endpoints/badges'
import { useAuthStore } from '@/store/useAuthStore'
import { Badge } from '@/types/badge'
import { LessonExercise } from '@/types/exercise'
import { Module } from '@/types/module'
import { useEffect, useState } from 'react'

interface ExerciseViewProps {
  module: Module
  lessonId: string
  onBack: () => void
  onNewBadges: (badges: Badge[]) => void
}

export default function ExerciseView({
  module,
  lessonId,
  onBack,
  onNewBadges,
}: ExerciseViewProps) {
  const { user } = useAuthStore()

  const {
    data: exercises = [],
    isLoading,
    error,
  } = useExercises({
    moduleId: module.icon,
    lessonId,
  }).getExercises

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])

  useEffect(() => {
    console.log('Ejercicios:', exercises)
    const initializeProgress = async () => {
      if (!user || exercises.length === 0) return

      try {
        const progressData = await badgeApi.getProgress()

        const completedIds = progressData.history?.map((h: any) => h.id) || []

        const completedIndices = exercises.reduce(
          (acc: number[], exercise: LessonExercise, index: number) => {
            if (completedIds.includes(exercise.id)) {
              acc.push(index)
            }
            return acc
          },
          []
        )

        setCompletedExercises(completedIndices)

        if (
          completedIndices.length > 0 &&
          completedIndices.length < exercises.length
        ) {
          const firstIncomplete = exercises.findIndex(
            (_, index) => !completedIndices.includes(index)
          )
          if (firstIncomplete !== -1) {
            setCurrentExerciseIndex(firstIncomplete)
          }
        } else if (completedIndices.length === exercises.length) {
          setCurrentExerciseIndex(exercises.length - 1)
        }
      } catch (err) {
        console.error('Error cargando progreso:', err)
      }
    }

    initializeProgress()
  }, [exercises, user])

  if (isLoading) {
    return <div>Cargando ejercicios...</div>
  }

  if (error) {
    return <div>Error cargando ejercicios</div>
  }

  if (exercises.length === 0) {
    return <div>No hay ejercicios para esta lección.</div>
  }

  const currentExercise = exercises[currentExerciseIndex]

  const handleExerciseComplete = () => {
    if (!completedExercises.includes(currentExerciseIndex)) {
      setCompletedExercises((prev) => [...prev, currentExerciseIndex])
    }
  }

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
    }
  }

  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1)
    }
  }

  const renderExercise = () => {
    if (!currentExercise) return <div>No hay ejercicio.</div>

    const commonProps = {
      onComplete: handleExerciseComplete,
      onNewBadges,
    }

    switch (currentExercise.type) {
      case 'code':
        return (
          <CodeEditor
            key={currentExercise.id}
            exercise={currentExercise}
            {...commonProps}
          />
        )
      case 'quiz':
        return (
          <Quiz
            key={currentExercise.id}
            exercise={currentExercise}
            {...commonProps}
          />
        )
      case 'dragDrop':
        return (
          <DragDrop
            key={currentExercise.id}
            exercise={currentExercise}
            {...commonProps}
          />
        )
      case 'fillBlank':
        return (
          <FillBlank
            key={currentExercise.id}
            exercise={currentExercise}
            {...commonProps}
          />
        )
      default:
        return <div>Tipo de ejercicio no soportado.</div>
    }
  }

  if (isLoading) {
    return <Loading section="ejercicios" />
  }

  if (error) {
    return <Error section="ejercicios" />
  }
  const lesson = module?.lessons.find((l) => l.id === lessonId)
  if (exercises.length !== 0) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6">
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <span
              onClick={onBack}
              className="cursor-pointer text-neon-cyan hover:underline"
            >
              ← Volver
            </span>
            <span className="text-text-muted">/</span>
            <span className="text-text-muted">{module?.name}</span>
            <span className="text-text-muted">/</span>
            <span>{lesson?.title}</span>
          </div>

          <h1 className="mb-6 text-3xl">Lección</h1>

          {!user && (
            <div className="p-4 bg-neon-orange/10 border border-neon-orange rounded-xl mb-6 text-neon-orange">
              ⚠️ Inicia sesión para guardar tu progreso y ganar XP
            </div>
          )}

          {/* Progress */}
          <div className="glass-card p-6 mb-8">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-text-secondary">
                  Progreso de la lección
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full text-sm text-neon-cyan font-mono">
                  {currentExercise?.type}
                </span>
              </div>
              <span className="text-neon-cyan font-mono text-sm">
                {completedExercises.length} / {exercises.length} ejercicios
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    exercises.length
                      ? (completedExercises.length / exercises.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {renderExercise()}

          <div className="mt-8 flex justify-between">
            <button
              className="btn btn-secondary"
              onClick={handlePrevExercise}
              disabled={currentExerciseIndex === 0}
            >
              ← Anterior
            </button>

            <button
              className="btn btn-secondary"
              onClick={
                currentExerciseIndex === exercises.length - 1
                  ? onBack
                  : handleNextExercise
              }
            >
              {currentExerciseIndex === exercises.length - 1
                ? 'Finalizar ✅'
                : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    )
  }
}
