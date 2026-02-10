interface BaseExercise {
  id: string
  prompt: string
  xpReward: number
  type: ExerciseType
  difficulty: ExerciseDifficulty
  moduleId: number
  lessonId: string
}

export interface CodeEditorExercise extends BaseExercise {
  type: 'code'
  data: {
    placeholder: string
    hint?: string
    explanation?: string
  }
}

export interface QuizExercise extends BaseExercise {
  type: 'quiz'
  data: {
    options: Option[]
    explanation?: string
  }
}

export interface DragDropExercise extends BaseExercise {
  type: 'dragDrop'
  data: {
    items: {
      id: number
      text: string
    }[]
    hint?: string
    explanation?: string
  }
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fillBlank'
  data: {
    template: string[]
    blanks: Blank[]
    hint?: string
    explanation?: string
  }
}

export interface ExerciseResponse {
  exercises: LessonExercise[]
}

export interface Option {
  id: string
  text: string
}

export interface DraggedItem {
  item: Option
  fromTarget: boolean
}

export interface Blank {
  id: string
}

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced'
export type ExerciseType = 'code' | 'quiz' | 'dragDrop' | 'fillBlank'
export type LessonExercise =
  | CodeEditorExercise
  | QuizExercise
  | DragDropExercise
  | FillBlankExercise
