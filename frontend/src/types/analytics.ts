export interface HeatmapDay {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
  exercisesCompleted: number
  challengesCompleted: number
  xpEarned: number
}

export interface HeatmapData {
  days: HeatmapDay[]
  totalActiveDays: number
  totalExercises: number
  totalChallenges: number
  totalXp: number
}
