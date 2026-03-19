import { Badge } from '../../common/types';

export const badges: Badge[] = [
  // Medallas por ejercicios completados
  {
    id: 'first-steps',
    name: 'Primeros Pasos',
    description: 'Completa tu primer ejercicio',
    icon: '🎯',
    requirement: { type: 'exercises_completed', value: 1 },
  },
  {
    id: 'getting-started',
    name: 'En Camino',
    description: 'Completa 5 ejercicios',
    icon: '🚀',
    requirement: { type: 'exercises_completed', value: 5 },
  },
  {
    id: 'dedicated-learner',
    name: 'Estudiante Dedicado',
    description: 'Completa 15 ejercicios',
    icon: '📚',
    requirement: { type: 'exercises_completed', value: 15 },
  },
  {
    id: 'coding-master',
    name: 'Maestro del Código',
    description: 'Completa 30 ejercicios',
    icon: '👨‍💻',
    requirement: { type: 'exercises_completed', value: 30 },
  },
  {
    id: 'unstoppable',
    name: 'Imparable',
    description: 'Completa 50 ejercicios',
    icon: '⚡',
    requirement: { type: 'exercises_completed', value: 50 },
  },

  // Medallas por nivel
  {
    id: 'level-5',
    name: 'Nivel 5',
    description: 'Alcanza el nivel 5',
    icon: '⭐',
    requirement: { type: 'level_reached', value: 5 },
  },
  {
    id: 'level-10',
    name: 'Nivel 10',
    description: 'Alcanza el nivel 10',
    icon: '🌟',
    requirement: { type: 'level_reached', value: 10 },
  },
  {
    id: 'level-20',
    name: 'Nivel 20',
    description: 'Alcanza el nivel 20',
    icon: '💫',
    requirement: { type: 'level_reached', value: 20 },
  },

  // Medallas por módulo completado
  {
    id: 'variables-master',
    name: 'Maestro de Variables',
    description: 'Completa todos los ejercicios del módulo Variables',
    icon: '📦',
    requirement: { type: 'module_completed', value: 1, moduleId: 1 },
  },
  {
    id: 'conditionals-master',
    name: 'Maestro de Condicionales',
    description: 'Completa todos los ejercicios del módulo Condicionales',
    icon: '🔀',
    requirement: { type: 'module_completed', value: 1, moduleId: 2 },
  },
  {
    id: 'loops-master',
    name: 'Maestro de Bucles',
    description: 'Completa todos los ejercicios del módulo Bucles',
    icon: '🔄',
    requirement: { type: 'module_completed', value: 1, moduleId: 3 },
  },
  {
    id: 'functions-master',
    name: 'Maestro de Funciones',
    description: 'Completa todos los ejercicios del módulo Funciones',
    icon: '⚡',
    requirement: { type: 'module_completed', value: 1, moduleId: 4 },
  },

  // ── Medallas por rachas (streaks) ──
  {
    id: 'streak-3',
    name: 'Constante',
    description: 'Mantén una racha de 3 días consecutivos',
    icon: '🔥',
    requirement: { type: 'streak', value: 3 },
  },
  {
    id: 'streak-7',
    name: 'Semana Perfecta',
    description: 'Mantén una racha de 7 días consecutivos',
    icon: '🔥',
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: 'streak-30',
    name: 'Mes Imparable',
    description: 'Mantén una racha de 30 días consecutivos',
    icon: '💎',
    requirement: { type: 'streak', value: 30 },
  },
  {
    id: 'streak-100',
    name: 'Leyenda Constante',
    description: 'Mantén una racha de 100 días consecutivos',
    icon: '👑',
    requirement: { type: 'streak', value: 100 },
  },

  // ── Medallas por retos completados ──
  {
    id: 'challenges-1',
    name: 'Primer Reto',
    description: 'Completa tu primer reto de la comunidad',
    icon: '🎯',
    requirement: { type: 'challenges_completed', value: 1 },
  },
  {
    id: 'challenges-5',
    name: 'Retador',
    description: 'Completa 5 retos de la comunidad',
    icon: '⚔️',
    requirement: { type: 'challenges_completed', value: 5 },
  },
  {
    id: 'challenges-20',
    name: 'Gladiador del Código',
    description: 'Completa 20 retos de la comunidad',
    icon: '🏆',
    requirement: { type: 'challenges_completed', value: 20 },
  },

  // ── Medallas por Live Coding sin copiar/pegar ──
  {
    id: 'clean-coder-5',
    name: 'Código Limpio',
    description: 'Completa 5 sesiones de Live Coding sin copiar ni pegar',
    icon: '✨',
    requirement: { type: 'live_coding_no_copy', value: 5 },
  },
  {
    id: 'clean-coder-20',
    name: 'Código Puro',
    description: 'Completa 20 sesiones de Live Coding sin copiar ni pegar',
    icon: '💫',
    requirement: { type: 'live_coding_no_copy', value: 20 },
  },

  // ── Medallas por velocidad ──
  {
    id: 'speed-demon',
    name: 'Veloz como el Rayo',
    description: 'Completa un reto en menos de 5 minutos con todos los tests pasados',
    icon: '⚡',
    requirement: { type: 'fast_completion', value: 1 },
  },
  {
    id: 'speed-master',
    name: 'Maestro de la Velocidad',
    description: 'Completa 10 retos en menos de 5 minutos con todos los tests pasados',
    icon: '🚀',
    requirement: { type: 'fast_completion', value: 10 },
  },
];

export default badges;
