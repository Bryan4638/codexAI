export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  xp: number;
  level: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  exercise_id: string;
  completed_at: string;
  attempts: number;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  unlocked_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type:
      | "exercises_completed"
      | "level_reached"
      | "module_completed"
      | "streak";
    value: number;
    moduleId?: number;
  };
}

export interface Exercise {
  id: string;
  moduleId: number;
  lessonId: string;
  type: "code" | "quiz" | "dragDrop" | "fillBlank";
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  prompt: string;
  data: any;
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
  user: Omit<User, "password">;
  token: string;
}

export interface ValidateExerciseRequest {
  exerciseId: string;
  answer: any;
}

export interface ValidateExerciseResponse {
  correct: boolean;
  message: string;
  xpEarned?: number;
  newBadges?: Badge[];
  levelUp?: boolean;
  newLevel?: number;
}
