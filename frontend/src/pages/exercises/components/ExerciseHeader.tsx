import { difficultyMap } from '@/pages/exercises/data/dificultyMap'
import type { ExerciseDifficulty } from '@/types/exercise'

interface ExerciseHeaderProps {
  prompt: string
  difficulty: ExerciseDifficulty
  xpReward: number
}

export const ExerciseHeader = ({
  prompt,
  difficulty,
  xpReward,
}: ExerciseHeaderProps) => {
  const diff = difficultyMap[difficulty] || difficultyMap.beginner

  return (
    <>
      <p className="exercise-prompt">{prompt}</p>
      <div className="inline-flex gap-2 mb-4">
        <span className={`badge-difficulty ${diff.classes}`}>
          <diff.icon size={18} />
          {diff.label}
        </span>
        <span className="badge-xp">+{xpReward} XP</span>
      </div>
    </>
  )
}
