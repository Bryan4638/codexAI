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
];

export default badges;
