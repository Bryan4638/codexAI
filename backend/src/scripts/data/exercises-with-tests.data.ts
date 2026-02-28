/**
 * Datos de los 4 ejercicios de código con sus tests.
 * Cada ejercicio vive en la lección 4-2 (Parámetros y Retorno)
 * y tiene 2 tests visibles + 2 tests ocultos.
 */

export interface ExerciseTestData {
  description: string;
  input: string | null;
  expectedOutput: string;
  isHidden: boolean;
  order: number;
}

export interface ExerciseWithTests {
  /** ID lógico para buscar/crear el ejercicio */
  id: string;
  lessonId: string; // '4-2'
  type: 'code';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  prompt: string;
  data: Record<string, unknown>;
  tests: ExerciseTestData[];
}

export const exercisesWithTests: ExerciseWithTests[] = [
  // ─────────────────────────────────────────────────────────────────
  // Ejercicio 1: suma(a, b) — Principiante
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'func-4-2-code-suma',
    lessonId: '4-2',
    type: 'code',
    difficulty: 'beginner',
    xpReward: 10,
    prompt:
      'Crea una función llamada "suma" que reciba dos números y retorne su suma.',
    data: {
      placeholder: '// Escribe tu función aquí\n',
      hint: 'Usa return a + b dentro de tu función',
      explanation:
        'Una función puede recibir parámetros y retornar el resultado de operar con ellos.',
    },
    tests: [
      {
        description: 'suma(1, 2) debe retornar 3',
        input: '[1, 2]',
        expectedOutput: '3',
        isHidden: false,
        order: 1,
      },
      {
        description: 'suma(0, 0) debe retornar 0',
        input: '[0, 0]',
        expectedOutput: '0',
        isHidden: false,
        order: 2,
      },
      {
        // Caso negativo — oculto
        description: 'suma(-5, 5) debe retornar 0',
        input: '[-5, 5]',
        expectedOutput: '0',
        isHidden: true,
        order: 3,
      },
      {
        // Números grandes — oculto
        description: 'suma(1000, 999) debe retornar 1999',
        input: '[1000, 999]',
        expectedOutput: '1999',
        isHidden: true,
        order: 4,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Ejercicio 2: esPrimo(n) — Intermedio
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'func-4-2-code-esprimo',
    lessonId: '4-2',
    type: 'code',
    difficulty: 'intermediate',
    xpReward: 20,
    prompt:
      'Crea una función llamada "esPrimo" que reciba un número entero positivo y retorne true si es primo, false si no lo es.',
    data: {
      placeholder: '// Escribe tu función aquí\n',
      hint: 'Un número primo solo es divisible por 1 y por sí mismo. Prueba dividiendo desde 2 hasta Math.sqrt(n)',
      explanation:
        'Los números primos son fundamentales en matemáticas y criptografía. El truco de sqrt(n) optimiza la búsqueda de divisores.',
    },
    tests: [
      {
        description: 'esPrimo(2) debe retornar true',
        input: '[2]',
        expectedOutput: 'true',
        isHidden: false,
        order: 1,
      },
      {
        description: 'esPrimo(4) debe retornar false',
        input: '[4]',
        expectedOutput: 'false',
        isHidden: false,
        order: 2,
      },
      {
        // Caso borde: 1 NO es primo — oculto
        description: 'esPrimo(1) debe retornar false',
        input: '[1]',
        expectedOutput: 'false',
        isHidden: true,
        order: 3,
      },
      {
        // Número primo grande — oculto
        description: 'esPrimo(97) debe retornar true',
        input: '[97]',
        expectedOutput: 'true',
        isHidden: true,
        order: 4,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Ejercicio 3: invertirString(s) — Intermedio
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'func-4-2-code-invertir',
    lessonId: '4-2',
    type: 'code',
    difficulty: 'intermediate',
    xpReward: 20,
    prompt:
      'Crea una función llamada "invertirString" que reciba un string y retorne el string invertido.',
    data: {
      placeholder: '// Escribe tu función aquí\n',
      hint: 'Tip: puedes usar .split(""), .reverse() y .join("") encadenados',
      explanation:
        'Invertir strings es un clásico ejercicio de manipulación de cadenas. El método de split/reverse/join es la forma más idiomática en JavaScript.',
    },
    tests: [
      {
        description: 'invertirString("hola") debe retornar "aloh"',
        input: '["hola"]',
        expectedOutput: 'aloh',
        isHidden: false,
        order: 1,
      },
      {
        description: 'invertirString("abc") debe retornar "cba"',
        input: '["abc"]',
        expectedOutput: 'cba',
        isHidden: false,
        order: 2,
      },
      {
        // String vacío — oculto
        description: 'invertirString("") debe retornar ""',
        input: '[""]',
        expectedOutput: '',
        isHidden: true,
        order: 3,
      },
      {
        // Un solo carácter — oculto
        description: 'invertirString("a") debe retornar "a"',
        input: '["a"]',
        expectedOutput: 'a',
        isHidden: true,
        order: 4,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Ejercicio 4: fibonacci(n) — Avanzado
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'func-4-2-code-fibonacci',
    lessonId: '4-2',
    type: 'code',
    difficulty: 'advanced',
    xpReward: 30,
    prompt:
      'Crea una función llamada "fibonacci" que reciba un entero n (≥ 0) y retorne el n-ésimo número de la secuencia de Fibonacci. (fibonacci(0) = 0, fibonacci(1) = 1, fibonacci(2) = 1, fibonacci(5) = 5)',
    data: {
      placeholder: '// Escribe tu función aquí\n',
      hint: 'Puedes usar recursión (caso base: n <= 1) o un bucle iterativo. La solución iterativa es más eficiente.',
      explanation:
        'La secuencia de Fibonacci aparece en muchos fenómenos naturales. La implementación iterativa evita el stackoverflow de la recursiva para valores grandes de n.',
    },
    tests: [
      {
        description: 'fibonacci(1) debe retornar 1',
        input: '[1]',
        expectedOutput: '1',
        isHidden: false,
        order: 1,
      },
      {
        description: 'fibonacci(5) debe retornar 5',
        input: '[5]',
        expectedOutput: '5',
        isHidden: false,
        order: 2,
      },
      {
        // Caso base 0 — oculto
        description: 'fibonacci(0) debe retornar 0',
        input: '[0]',
        expectedOutput: '0',
        isHidden: true,
        order: 3,
      },
      {
        // Verificación profunda — oculto
        description: 'fibonacci(10) debe retornar 55',
        input: '[10]',
        expectedOutput: '55',
        isHidden: true,
        order: 4,
      },
    ],
  },
];
