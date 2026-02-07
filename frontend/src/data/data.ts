import { Module } from '@/types/module'

export const modulesData: Module[] = [
  {
    id: 1,
    title: 'Variables y Tipos de Datos',
    path: 'variables-types',
    description: 'Aprende a almacenar y manipular información en tu código',
    icon: '📦',
    lessons: [
      { id: '1-1', title: '¿Qué son las variables?', path: 'variables' },
      { id: '1-2', title: 'Tipos de Datos', path: 'types' },
    ],
  },
  {
    id: 2,
    title: 'Condicionales',
    path: 'conditionals',
    description: 'Toma decisiones en tu código usando if, else y operadores',
    icon: '🔀',
    lessons: [
      { id: '2-1', title: 'Estructura if/else', path: 'if-else' },
      {
        id: '2-2',
        title: 'Operadores de Comparación',
        path: 'logic-operators',
      },
    ],
  },
  {
    id: 3,
    title: 'Bucles',
    path: 'loops',
    description: 'Repite acciones de forma eficiente con for y while',
    icon: '🔄',
    lessons: [
      { id: '3-1', title: 'Bucle For', path: 'for-loop' },
      { id: '3-2', title: 'Bucle While', path: 'while-loop' },
    ],
  },
  {
    id: 4,
    title: 'Funciones',
    path: 'functions',
    description: 'Crea bloques de código reutilizables y organizados',
    icon: '⚡',
    lessons: [
      { id: '4-1', title: 'Crear Funciones', path: 'create-functions' },
      { id: '4-2', title: 'Parámetros y Retorno', path: 'params-and-return' },
    ],
  },
]
