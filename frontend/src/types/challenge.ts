export interface PaginationMeta {
  total: number
  page: number
  lastPage: number
  limit: number
}

export interface PaginatedChallenges {
  data: Challenge[]
  meta: PaginationMeta
}

export interface Challenge {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  authorId: string
  author?: {
    username: string
    avatarUrl?: string
  }
  hasReacted?: boolean
  reactionsCount?: number
  hasCompleted?: boolean
  bestExecutionCode?: string | null
  createdAt?: string
  initialCode: string
  testCases: { input: string; output: string }[]
}

export interface CreateChallengeFormData {
  title: string
  description: string
  difficulty: string
  initialCode: string
  testCases: string
}

export interface ToggleReactionResponse {
  message: string
  liked: boolean
}

// ── Live Coding ──────────────────────────────────────

export interface LiveCodingSessionResponse {
  sessionId: string
  startedAt: string
  challenge: {
    id: string
    title: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard'
    initialCode: string
    tests: {
      id: string
      description: string
      input: string
      expectedOutput: string
    }[]
  }
}

export interface LiveCodingSubmitRequest {
  sessionId: string
  code: string
  language: string
  timeTakenSeconds: number
  tabSwitches: number
  copyPasteCount: number
}

export interface LiveCodingResult {
  score: number
  penaltiesApplied: number
  tabSwitches: number
  copyPasteCount: number
  executionTimeMs: number
  allPassed: boolean
  testResults: { id: string; passed: boolean; actual: string }[]
  totalTests: number
  passedTests: number
  timeTakenSeconds: number
  error?: string
}

export interface LiveCodingHistoryItem {
  id: string
  challenge: { id: string; title: string; difficulty: string }
  score: number
  timeTakenSeconds: number
  executionTimeMs: number
  allTestsPassed: boolean
  tabSwitches: number
  copyPasteCount: number
  penaltiesApplied: number
  completedAt: string
}

export interface LiveCodingHistoryResponse {
  data: LiveCodingHistoryItem[]
  meta: PaginationMeta
}
