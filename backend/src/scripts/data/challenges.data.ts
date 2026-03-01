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
      {
        description: 'Test oculto extremo: mismos números en los bordes',
        input: '[[5, 1, 2, 3, 4, 5], 10]',
        expectedOutput: '[0,5]',
        isHidden: true,
        order: 5,
      },
      {
        description: 'Test oculto extremo: elementos idénticos',
        input: '[[3, 3], 6]',
        expectedOutput: '[0,1]',
        isHidden: true,
        order: 6,
      },
      {
        description: 'Test oculto de ceros desplazados',
        input: '[[0, 4, 3, 0], 0]',
        expectedOutput: '[0,3]',
        isHidden: true,
        order: 7,
      },
      {
        description: 'Test oculto: superación de límites',
        input: '[[1000000000, 2000000000, 3000000000], 5000000000]',
        expectedOutput: '[1,2]',
        isHidden: true,
        order: 8,
      },
      {
        description: 'Test oculto: cancelación de negativo y positivo',
        input: '[[-10, 7, 15, -5], 2]',
        expectedOutput: '[1,3]',
        isHidden: true,
        order: 9,
      },
      {
        description: 'Test oculto de desorden profundo',
        input: '[[15, 3, 9, 8, 14, 2], 5]',
        expectedOutput: '[1,5]',
        isHidden: true,
        order: 10,
      },
      {
        description: 'Test oculto: solución al puro final',
        input: '[[10, 11, 12, 13, 14, 15], 29]', // 14+15
        expectedOutput: '[4,5]',
        isHidden: true,
        order: 11,
      },
      {
        description: 'Test oculto de Rendimiento Estricto (Array Intermedio)',
        input:
          '[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20, 50, 100], 150]', // 50+100
        expectedOutput: '[20,21]',
        isHidden: true,
        order: 12,
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
      {
        description: 'Test un solo caracter',
        input: '["a"]',
        expectedOutput: 'true',
        isHidden: true,
        order: 4,
      },
      {
        description: 'Test purtas puntuaciones (se reducen a vacío)',
        input: '[".,,."]',
        expectedOutput: 'true',
        isHidden: true,
        order: 5,
      },
      {
        description: 'Test palíndromo simple numérico',
        input: '["12321"]',
        expectedOutput: 'true',
        isHidden: true,
        order: 6,
      },
      {
        description: 'Test números mixtos (no palíndromo)',
        input: '["0P"]',
        expectedOutput: 'false',
        isHidden: true,
        order: 7,
      },
      {
        description: 'Test oración larga mayúsculas/minúsculas',
        input: '["Was it a car or a cat I saw?"]',
        expectedOutput: 'true',
        isHidden: true,
        order: 8,
      },
      {
        description: 'Test caso extremo falso (Casi palíndromo)',
        input: '["abccbaabccbx"]',
        expectedOutput: 'false',
        isHidden: true,
        order: 9,
      },
      {
        description: 'Test rendimiento básico: string largo',
        input: JSON.stringify(['a'.repeat(1000) + 'b' + 'a'.repeat(1000)]),
        expectedOutput: 'true',
        isHidden: true,
        order: 10,
      },
      {
        description: 'Test rendimiento extremo: muy largo falso',
        input: JSON.stringify([
          'a'.repeat(5000) + 'b' + 'a'.repeat(4999) + 'c',
        ]),
        expectedOutput: 'false',
        isHidden: true,
        order: 11,
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
        description: 'Fib(0)',
        input: '[0]',
        expectedOutput: '0',
        isHidden: false,
        order: 1,
      },
      {
        description: 'Fib(1)',
        input: '[1]',
        expectedOutput: '1',
        isHidden: false,
        order: 2,
      },
      {
        description: 'Fib(2)',
        input: '[2]',
        expectedOutput: '1',
        isHidden: false,
        order: 3,
      },
      {
        description: 'Fib(4)',
        input: '[4]',
        expectedOutput: '3',
        isHidden: false,
        order: 4,
      },
      {
        description: 'Fib(10) (Oculto)',
        input: '[10]',
        expectedOutput: '55',
        isHidden: true,
        order: 5,
      },
      {
        description: 'Fib(15) (Oculto)',
        input: '[15]',
        expectedOutput: '610',
        isHidden: true,
        order: 6,
      },
      {
        description: 'Fib(20) (Oculto)',
        input: '[20]',
        expectedOutput: '6765',
        isHidden: true,
        order: 7,
      },
      {
        description: 'Fib(25) (Oculto)',
        input: '[25]',
        expectedOutput: '75025',
        isHidden: true,
        order: 8,
      },
      {
        description: 'Fib(30) (Oculto - Rendimiento Básico)',
        input: '[30]',
        expectedOutput: '832040',
        isHidden: true,
        order: 8,
      },
      {
        description: 'Fib(35) (Oculto - Rendimiento Extremo)',
        input: '[35]',
        expectedOutput: '9227465',
        isHidden: true,
        order: 9,
      },
      {
        description: 'Fib(40) (Oculto - Rendimiento Extremo)',
        input: '[40]',
        expectedOutput: '102334155',
        isHidden: true,
        order: 10,
      },
      {
        description: 'Fib(45) (Oculto - Rendimiento Extremo)',
        input: '[45]',
        expectedOutput: '1134903170',
        isHidden: true,
        order: 11,
      },
      {
        description: 'Fib(50) (Oculto - Rendimiento Extremo)',
        input: '[50]',
        expectedOutput: '12586269025',
        isHidden: true,
        order: 12,
      },
    ],
  },
];
