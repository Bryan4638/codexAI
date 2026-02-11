import CodeEditor from '@/components/exercises/CodeEditor'
import DragDrop from '@/components/exercises/DragDrop'
import FillBlank from '@/components/exercises/FillBlank'
import Quiz from '@/components/exercises/Quiz'
import { badgeApi } from '@/services/endpoints/badge'
import { exerciseApi } from '@/services/endpoints/exercise'
import { useAuthStore } from '@/store/useAuthStore'
import { LessonExercise } from '@/types/exercise'
import { Module } from '@/types/module'
import { useEffect, useState } from 'react'

interface LessonViewProps {
  module: Module
  lessonId: string
  onBack: () => void
  onNewBadges: (badges: any[]) => void
}

function LessonView({
  module,
  lessonId,
  onBack,
  onNewBadges,
}: LessonViewProps) {
  const [exercises, setExercises] = useState<LessonExercise[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { user } = useAuthStore()

  useEffect(() => {
    loadExercises()
  }, [lessonId])

  const loadExercises = async () => {
    try {
      const [exercisesData, progressData] = await Promise.all([
        exerciseApi.getAll({ lessonId }),
        user
          ? badgeApi.getProgress()
          : Promise.resolve({ completedExercises: [], history: [] }),
      ])

      const exercisesList: LessonExercise[] = exercisesData || []
      setExercises(exercisesList)

      if (
        progressData.completedExercises > 0 ||
        progressData.history?.length > 0
      ) {
        const completedIds = progressData.history?.map((h: any) => h.id) || []

        const completedIndices = exercisesList.reduce(
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
          completedIndices.length < exercisesList.length
        ) {
          const firstIncomplete = exercisesList.findIndex(
            (_: any, index: number) => !completedIndices.includes(index)
          )
          if (firstIncomplete !== -1) {
            setCurrentExerciseIndex(firstIncomplete)
          }
        } else if (completedIndices.length === exercisesList.length) {
          setCurrentExerciseIndex(exercisesList.length - 1)
        }
      }
    } catch (error) {
      console.error('Error cargando ejercicios:', error)
    } finally {
      setLoading(false)
    }
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
    if (!currentExercise) return <p>No hay ejercicios disponibles.</p>

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
        return <p>Tipo de ejercicio no soportado.</p>
    }
  }

  const getExerciseTypeName = (type: string) => {
    const types: Record<string, string> = {
      code: '💻 Editor de Código',
      quiz: '❓ Quiz',
      dragDrop: '🎯 Ordenar Código',
      fillBlank: '✏️ Completar Código',
    }
    return types[type] || 'Ejercicio'
  }

  const lessonTitles: Record<string, string> = {
    '1-1': '¿Qué son las variables?',
    '1-2': 'Tipos de Datos',
    '2-1': 'Estructura if/else',
    '2-2': 'Operadores de Comparación',
    '3-1': 'Bucle For',
    '3-2': 'Bucle While',
    '4-1': 'Crear Funciones',
    '4-2': 'Parámetros y Retorno',
  }

  if (loading) {
    return (
      <div className="pt-40 max-w-7xl mx-auto px-6 text-center">
        <p>Cargando ejercicios...</p>
      </div>
    )
  }

  return (
    <div className="pt-32 max-w-7xl mx-auto px-6">
      <div className="mb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <span
            onClick={onBack}
            className="cursor-pointer text-neon-cyan hover:underline"
          >
            ← Volver
          </span>
          <span className="text-text-muted">/</span>
          <span className="text-text-muted">{module?.title}</span>
          <span className="text-text-muted">/</span>
          <span>{lessonTitles[lessonId] || lessonId}</span>
        </div>

        <h1 className="mb-6">{lessonTitles[lessonId] || 'Lección'}</h1>

        {!user && (
          <div className="p-4 bg-neon-orange/10 border border-neon-orange rounded-xl mb-6 text-neon-orange">
            ⚠️ Inicia sesión para guardar tu progreso y ganar XP
          </div>
        )}

        {/* Progress */}
        <div className="glass-card !p-6 mb-8">
          <div className="flex justify-between mb-3">
            <span className="text-text-secondary text-sm">
              Progreso de la lección
            </span>
            <span className="text-neon-cyan font-mono text-sm">
              {completedExercises.length} / {exercises.length} ejercicios
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${exercises.length ? (completedExercises.length / exercises.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {exercises.length > 0 ? (
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full text-sm text-neon-cyan font-mono">
              {getExerciseTypeName(currentExercise?.type)}
            </span>
            <span className="text-text-muted text-sm">
              Ejercicio {currentExerciseIndex + 1} de {exercises.length}
              {completedExercises.includes(currentExerciseIndex) && ' ✓'}
            </span>
          </div>

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
      ) : (
        <div className="text-center py-16">
          <p>No hay ejercicios para esta lección.</p>
        </div>
      )}
    </div>
  )
}

export default LessonView
