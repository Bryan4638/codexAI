export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type:
      | 'exercises_completed'
      | 'level_reached'
      | 'module_completed'
      | 'streak';
    value: number;
    moduleId?: number;
  };
}

export interface Exercise {
  id: string;
  moduleId: number;
  lessonId: string;
  type: 'code' | 'quiz' | 'dragDrop' | 'fillBlank';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  prompt: string;
  data: ExerciseData;
}

export interface ExerciseData {
  placeholder?: string;
  solutions?: string[];
  hint?: string;
  explanation?: string;
  options?: { id: string; text: string }[];
  correctAnswer?: string;
  items?: { id: number; text: string }[];
  correctOrder?: number[];
  template?: string[];
  blanks?: { id: number; answers: string[] }[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    xp: number;
    level: number;
    createdAt: Date;
  };
  token: string;
}

export interface ValidateExerciseRequest {
  exerciseId: string;
  answer: unknown;
}

export interface ValidateExerciseResponse {
  correct: boolean;
  message: string;
  explanation?: string;
  xpEarned?: number;
  newBadges?: Badge[];
  levelUp?: boolean;
  newLevel?: number;
}

export interface JwtPayload {
  userId: string;
}
