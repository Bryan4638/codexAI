import { useBadges } from '@/hooks/useBadges'
import { useExercises } from '@/hooks/useExercises'
import CodeEditor from '@/pages/exercises/components/CodeEditor'
import DragDrop from '@/pages/exercises/components/DragDrop'
import FillBlank from '@/pages/exercises/components/FillBlank'
import Quiz from '@/pages/exercises/components/Quiz'
import { useAuthStore } from '@/store/useAuthStore'
import { Badge } from '@/types/badge'
import { LessonExercise } from '@/types/exercise'
import { Module } from '@/types/module'
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconArrowRight,
  IconCode,
  IconDragDrop,
  IconPencilCode,
  IconQuestionMark,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'

interface ExerciseViewProps {
  module: Module
  lessonId: string
  lessonTitle: string
  onBack: () => void
  onNewBadges: (badges: Badge[]) => void
}

export default function ExerciseView({
  module,
  lessonId,
  lessonTitle,
  onBack,
  onNewBadges,
}: ExerciseViewProps) {
  const { user } = useAuthStore()

  const {
    data: exercises = [],
    isLoading,
    error,
  } = useExercises({ lessonId }).getExercises
  const { data: userProgress } = useBadges().getUserProgress

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])

  useEffect(() => {
    if (!user || exercises.length === 0 || !userProgress) return

    const completedIds = new Set(
      userProgress.history.map((history) => history.id)
    )
    const completedIndices = exercises.reduce(
      (acc: number[], exercise: LessonExercise, index: number) => {
        if (completedIds.has(exercise.id)) {
          acc.push(index)
        }
        return acc
      },
      []
    )

    setCompletedExercises(completedIndices)

    if (completedIndices.length === exercises.length) {
      setCurrentExerciseIndex(exercises.length - 1)
      return
    }

    const firstIncomplete = exercises.findIndex(
      (_, index) => !completedIndices.includes(index)
    )
    if (firstIncomplete !== -1) {
      setCurrentExerciseIndex(firstIncomplete)
    }
  }, [exercises, user, userProgress])

  if (isLoading) return <div>Cargando ejercicios...</div>
  if (error) return <div>Error cargando ejercicios</div>

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

  return (
    <div className="py-28 max-w-7xl mx-auto px-6">
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
          <span className="text-text-muted">{module.name}</span>
          <span className="text-text-muted">/</span>
          <span>{lessonTitle}</span>
        </div>

        <h1 className="mb-6 text-3xl">Lección</h1>

        {!user && (
          <div className="p-4 bg-neon-orange/10 border border-neon-orange rounded-xl mb-6 text-neon-orange flex gap-4">
            <IconAlertTriangle /> Inicia sesión para guardar tu progreso y ganar
            XP
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-card shadow-card relative overflow-hidden rounded-2xl border border-white/8 p-10 backdrop-blur-[20px]">
          <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"></div>
          {/* Header del Ejercicio */}
          <div className="flex justify-between items-center mb-8">
            <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium tracking-wider">
              {currentExercise?.type === 'dragDrop' && (
                <span className="flex items-center gap-2">
                  <IconDragDrop size={21} /> ORDENAR CÓDIGO
                </span>
              )}
              {currentExercise?.type === 'quiz' && (
                <span className="flex items-center gap-2">
                  <IconQuestionMark size={21} /> QUIZ
                </span>
              )}
              {currentExercise?.type === 'code' && (
                <span className="flex items-center gap-2">
                  <IconPencilCode size={21} /> CÓDIGO
                </span>
              )}
              {currentExercise?.type === 'fillBlank' && (
                <span className="flex items-center gap-2">
                  <IconCode size={21} /> COMPLETAR
                </span>
              )}
            </span>
            <span className="text-text-muted text-sm font-medium">
              Ejercicio {currentExerciseIndex + 1} de {exercises.length}
            </span>
          </div>

          {/* Contenido del Ejercicio */}
          <div className="mb-8">{renderExercise()}</div>

          {/* Navegación Inferior */}
          <div className="mt-8 flex justify-between items-center pt-8">
            <button
              className="btn btn-secondary"
              onClick={handlePrevExercise}
              style={{
                visibility: currentExerciseIndex === 0 ? 'hidden' : 'visible',
              }}
            >
              <IconArrowLeft size={18} /> ANTERIOR
            </button>

            <button
              className="btn btn-secondary"
              onClick={
                currentExerciseIndex === exercises.length - 1
                  ? onBack
                  : handleNextExercise
              }
            >
              {currentExerciseIndex === exercises.length - 1 ? (
                <span className="flex items-center gap-1.5">
                  FINALIZAR <IconArrowRight size={18} />
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  SIGUIENTE <IconArrowRight size={18} />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
