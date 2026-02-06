interface BaseExercise {
  id: string
  prompt: string
  difficulty: string
  xpReward: number
}

export interface LessonExercise extends BaseExercise {
  type: 'code' | 'quiz' | 'dragDrop' | 'fillBlank'
  data?: any
  [key: string]: any
}

export interface CodeEditorExercise extends BaseExercise {
  data?: {
    placeholder?: string
  }
}

export interface DragDropExercise extends BaseExercise {
  data?: {
    items?: Option[]
  }
}

export interface FillBlankExercise extends BaseExercise {
  data?: {
    template?: string[]
    blanks?: Blank[]
  }
}

export interface QuizExercise extends BaseExercise {
  data?: {
    options?: Option[]
  }
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
