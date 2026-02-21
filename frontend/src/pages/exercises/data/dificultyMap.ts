import {
  IconMoodHappyFilled,
  IconMoodSmileFilled,
  IconSkull,
  TablerIcon,
} from '@tabler/icons-react'

export const difficultyMap: Record<
  string,
  { classes: string; label: string; icon: TablerIcon }
> = {
  beginner: {
    classes:
      'bg-neon-green/20 border-neon-green text-neon-green flex items-center gap-1',
    label: 'Básico',
    icon: IconMoodHappyFilled,
  },
  intermediate: {
    classes:
      'bg-neon-orange/20 border-neon-orange text-neon-orange flex items-center gap-1',
    label: 'Intermedio',
    icon: IconMoodSmileFilled,
  },
  advanced: {
    classes:
      'bg-neon-pink/20 border-neon-pink text-neon-pink flex items-center gap-1',
    label: 'Avanzado',
    icon: IconSkull,
  },
}
