interface BaseFeedback {
  message: string;
  explanation?: string;
  xpEarned?: number;
}

export interface CodeEditorFeedback extends BaseFeedback {
  type: "success" | "error";
  levelUp?: boolean;
  newLevel?: number;
}

export interface DragDropFeedback extends BaseFeedback {
  type: "success" | "error";
}

export interface FillBlankFeedback extends BaseFeedback {
  correct: boolean;
  newLevel?: number;
  newBadges?: any[];
}

export interface QuizFeedback extends BaseFeedback {
  correct: boolean;
  newLevel?: number;
  newBadges?: any[];
}
