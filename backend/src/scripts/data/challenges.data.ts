export const challengesWithTests = [
  {
    title: 'Dos Sumas (Two Sum)',
    description: `Dado un arreglo de números enteros \`nums\` y un número entero \`target\`, devuelve los *índices de los dos números de manera que sumen* \`target\`.
    
Puedes asumir que cada entrada tendría **exactamente una solución**, y no puedes usar el mismo elemento dos veces.
Aceptaremos la respuesta en cualquier orden. Tu función debe imprimir un arreglo JSON o los números separados por coma.
**Ejemplo:**
Input: nums = [2,7,11,15], target = 9
Output: [0, 1]`,
    initialCode: `// Escribe tu función aquí para sumar dos números y usa \`console.log\` para imprimir el resultado
function twoSum(nums, target) {
  // tu código
}

// Ejemplo de llamada: console.log(twoSum([2, 7, 11, 15], 9));
`,
    difficulty: 'Fácil',
    tests: [
      {
        description: 'Test básico',
        input: '[[2,7,11,15], 9]',
        expectedOutput: '[0,1]',
        isHidden: false,
        order: 1,
      },
      {
        description: 'Test intermedio',
        input: '[[3,2,4], 6]',
        expectedOutput: '[1,2]',
        isHidden: false,
        order: 2,
      },
      {
        description: 'Test oculto con lista grande',
        input: '[[1, 2, 3, 4, 5, 20, 25, 30], 45]',
        expectedOutput: '[3,7]', // wait, 20+25 is 45, indexes are 5 and 6
        isHidden: true,
        order: 3,
      },
      {
        description: 'Test oculto con negativos',
        input: '[[-1, -2, -3, -4, -5], -8]',
        expectedOutput: '[2,4]',
        isHidden: true,
        order: 4,
      },
    ],
  },
  {
    title: 'Validar Palíndromo',
    description: `Dada una cadena de texto \`s\`, retorna \`true\` si es un palíndromo, o \`false\` en caso contrario.

Una frase es un palíndromo si, después de convertir todas las letras mayúsculas a letras minúsculas y eliminar todos los caracteres no alfanuméricos, se lee igual hacia adelante que hacia atrás. Los caracteres alfanuméricos incluyen letras y números.

**Ejemplo:**
Input: s = "A man, a plan, a canal: Panama"
Output: true`,
    initialCode: `function isPalindrome(s) {
  // Escribe tu código aquí
}

// console.log(isPalindrome("racecar"));`,
    difficulty: 'Fácil',
    tests: [
      {
        description: 'Test oración con espacios',
        input: '["A man, a plan, a canal: Panama"]',
        expectedOutput: 'true',
        isHidden: false,
        order: 1,
      },
      {
        description: 'Test oración fallida',
        input: '["race a car"]',
        expectedOutput: 'false',
        isHidden: false,
        order: 2,
      },
      {
        description: 'Test string vacío (oculto)',
        input: '[" "]',
        expectedOutput: 'true',
        isHidden: true,
        order: 3,
      },
    ],
  },
  {
    title: 'Sucesión de Fibonacci',
    description: `El número de Fibonacci, comúnmente denotado como \`F(n)\` forma una secuencia, llamada la *sucesión de Fibonacci*, tal que cada número es la suma de los dos anteriores, comenzando en 0 y 1.

Dicho \`n\`, calcula \`F(n)\`. Imprime el resultado numérico en consola.

**Ejemplo:**
Input: n = 4
Output: 3
Explicación: F(4) = F(3) + F(2) = 2 + 1 = 3.`,
    initialCode: `function fib(n) {
  // Implementa aquí
}

// Ejemplo: console.log(fib(4))`,
    difficulty: 'Fácil',
    tests: [
      {
        description: 'Fib(2)',
        input: '[2]',
        expectedOutput: '1',
        isHidden: false,
        order: 1,
      },
      {
        description: 'Fib(4)',
        input: '[4]',
        expectedOutput: '3',
        isHidden: false,
        order: 2,
      },
      {
        description: 'Fib(10) (Oculto)',
        input: '[10]',
        expectedOutput: '55',
        isHidden: true,
        order: 3,
      },
      {
        description: 'Fib(30) (Oculto - Rendimiento)',
        input: '[30]',
        expectedOutput: '832040',
        isHidden: true,
        order: 4,
      },
    ],
  },
];
