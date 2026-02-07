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

      const exercisesList = exercisesData.exercises || []
      console.log(exercisesList)
      setExercises(exercisesList)

      // Sincronizar ejercicios completados
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

        // Auto-avanzar al primer ejercicio no completado
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
          // Si todos están completados, ir al último
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

    const props = {
      exercise: currentExercise,
      onComplete: handleExerciseComplete,
      onNewBadges,
    }

    switch (currentExercise.type) {
      case 'code':
        return <CodeEditor key={currentExercise.id} {...props} />
      case 'quiz':
        return <Quiz key={currentExercise.id} {...props} />
      case 'dragDrop':
        return <DragDrop key={currentExercise.id} {...props} />
      case 'fillBlank':
        return <FillBlank key={currentExercise.id} {...props} />
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
      <div
        className="lesson-container container"
        style={{ textAlign: 'center', paddingTop: '150px' }}
      >
        <p>Cargando ejercicios...</p>
      </div>
    )
  }

  return (
    <div className="lesson-container container">
      <div className="lesson-header">
        <div className="lesson-breadcrumb">
          <span
            onClick={onBack}
            style={{ cursor: 'pointer', color: 'var(--neon-cyan)' }}
          >
            ← Volver
          </span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-muted)' }}>{module?.title}</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-primary)' }}>
            {lessonTitles[lessonId] || lessonId}
          </span>
        </div>
        <h1 className="lesson-title">{lessonTitles[lessonId] || 'Lección'}</h1>

        {!user && (
          <div
            style={{
              padding: 'var(--spacing-md)',
              background: 'rgba(255, 165, 0, 0.1)',
              border: '1px solid var(--neon-orange)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--neon-orange)',
            }}
          >
            ⚠️ Inicia sesión para guardar tu progreso y ganar XP
          </div>
        )}

        <div className="progress-container">
          <div className="progress-header">
            <span className="progress-label">Progreso de la lección</span>
            <span className="progress-value">
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
        <div
          className="exercise-section"
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <div className="exercise-header">
            <span className="exercise-type">
              {getExerciseTypeName(currentExercise?.type)}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Ejercicio {currentExerciseIndex + 1} de {exercises.length}
              {completedExercises.includes(currentExerciseIndex) && ' ✓'}
            </span>
          </div>
          {renderExercise()}
          <div
            style={{
              marginTop: 'var(--spacing-xl)',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
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
              disabled={false}
            >
              {currentExerciseIndex === exercises.length - 1
                ? 'Finalizar ✅'
                : 'Siguiente →'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-3xl)' }}>
          <p>No hay ejercicios para esta lección.</p>
        </div>
      )}
    </div>
  )
}

export default LessonView
