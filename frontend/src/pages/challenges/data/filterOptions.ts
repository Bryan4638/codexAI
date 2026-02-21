import { SelectOption } from '@/components/share/CustomDropdown'
import {
  IconClock,
  IconLayersIntersect,
  IconMoodHappyFilled,
  IconMoodSmileFilled,
  IconSkull,
  IconTrendingUp,
} from '@tabler/icons-react'

export const difficultyOptions: SelectOption[] = [
  {
    id: 'all',
    label: 'Todas las dificultades',
    icon: IconLayersIntersect,
    colorClass: 'text-white/60',
  },
  {
    id: 'easy',
    label: 'Fácil',
    icon: IconMoodHappyFilled,
    colorClass: 'text-neon-green', // Cambiado a tus clases de Tailwind si las configuraste
  },
  {
    id: 'medium',
    label: 'Media',
    icon: IconMoodSmileFilled,
    colorClass: 'text-neon-cyan',
  },
  {
    id: 'hard',
    label: 'Difícil',
    icon: IconSkull,
    colorClass: 'text-neon-pink',
  },
]

// --- Opciones para el Select de Ordenación ---
export const sortOptions: SelectOption[] = [
  {
    id: 'newest',
    label: 'Más recientes',
    icon: IconClock,
    colorClass: 'text-neon-cyan',
  },
  {
    id: 'popularity',
    label: 'Más populares',
    icon: IconTrendingUp,
    colorClass: 'text-neon-purple', // Asumiendo que tienes un morado neón
  },
]
