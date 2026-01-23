import { Exercise } from "../types";

export const exercises: Exercise[] = [
  // ==========================================
  // MÓDULO 1: Variables y Tipos de Datos
  // ==========================================

  // Lección 1-1: ¿Qué son las variables? - BÁSICO
  {
    id: "var-1-1-code-1",
    moduleId: 1,
    lessonId: "1-1",
    type: "code",
    difficulty: "beginner",
    xpReward: 10,
    prompt: 'Declara una variable llamada "mensaje" con el valor "Hola Mundo"',
    data: {
      placeholder: "// Escribe tu código aquí\n",
      solutions: [
        'let mensaje = "Hola Mundo"',
        "let mensaje = 'Hola Mundo'",
        'const mensaje = "Hola Mundo"',
        "const mensaje = 'Hola Mundo'",
      ],
      hint: "Usa let o const seguido del nombre y el valor entre comillas",
      explanation:
        "Las variables string siempre deben ir entre comillas simples o dobles.",
    },
  },
  {
    id: "var-1-1-quiz-1",
    moduleId: 1,
    lessonId: "1-1",
    type: "quiz",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "¿Cuál es la forma correcta de declarar una constante?",
    data: {
      options: [
        { id: "a", text: "var PI = 3.14" },
        { id: "b", text: "let PI = 3.14" },
        { id: "c", text: "const PI = 3.14" },
        { id: "d", text: "constant PI = 3.14" },
      ],
      correctAnswer: "c",
      explanation: "const se usa para declarar valores que no cambiarán",
    },
  },
  {
    id: "var-1-1-code-2",
    moduleId: 1,
    lessonId: "1-1",
    type: "code",
    difficulty: "intermediate",
    xpReward: 15,
    prompt:
      'Declara una variable "edad" con valor 25 y otra "nombre" con tu nombre',
    data: {
      placeholder: "// Declara las dos variables\n",
      solutions: ["let edad = 25", "const edad = 25"],
      hint: "Declara cada variable en una línea separada",
      explanation:
        "Puedes declarar múltiples variables en líneas separadas para mayor claridad.",
    },
  },

  // Lección 1-2: Tipos de Datos - BÁSICO
  {
    id: "var-1-2-quiz-1",
    moduleId: 1,
    lessonId: "1-2",
    type: "quiz",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "¿Qué tipo de dato es el valor false?",
    data: {
      options: [
        { id: "a", text: "String" },
        { id: "b", text: "Number" },
        { id: "c", text: "Boolean" },
        { id: "d", text: "Undefined" },
      ],
      correctAnswer: "c",
      explanation: "false es un valor booleano, al igual que true",
    },
  },
  {
    id: "var-1-2-fill-1",
    moduleId: 1,
    lessonId: "1-2",
    type: "fillBlank",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "Completa el código para declarar un número:",
    data: {
      template: ["let precio = ", ";"],
      blanks: [{ id: 0, answers: ["regex:^\\d+$"] }],
      hint: "Asigna cualquier valor numérico.",
      explanation: "Los números en JavaScript no llevan comillas.",
    },
  },
  {
    id: "var-1-2-quiz-2",
    moduleId: 1,
    lessonId: "1-2",
    type: "quiz",
    difficulty: "intermediate",
    xpReward: 15,
    prompt: '¿Qué devuelve typeof "42"?',
    data: {
      options: [
        { id: "a", text: "number" },
        { id: "b", text: "string" },
        { id: "c", text: "boolean" },
        { id: "d", text: "object" },
      ],
      correctAnswer: "b",
      explanation: '"42" está entre comillas, por lo que es un string',
    },
  },
  {
    id: "var-1-2-code-1",
    moduleId: 1,
    lessonId: "1-2",
    type: "code",
    difficulty: "advanced",
    xpReward: 25,
    prompt: 'Crea un objeto "persona" con propiedades nombre, edad y activo',
    data: {
      placeholder: "// Crea el objeto persona\n",
      solutions: [
        "let persona = { nombre:",
        "const persona = { nombre:",
        "persona = {nombre:",
      ],
      hint: "Usa llaves {} para crear objetos",
      explanation:
        "Los objetos agrupan propiedades relacionadas entre llaves {}.",
    },
  },

  // ==========================================
  // MÓDULO 2: Condicionales
  // ==========================================

  // Lección 2-1: Estructura if/else
  {
    id: "cond-2-1-drag-1",
    moduleId: 2,
    lessonId: "2-1",
    type: "dragDrop",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "Ordena el código para crear un condicional correcto:",
    data: {
      items: [
        { id: 1, text: "if (temperatura > 30) {" },
        { id: 2, text: '  console.log("Hace calor");' },
        { id: 3, text: "} else {" },
        { id: 4, text: '  console.log("Clima agradable");' },
        { id: 5, text: "}" },
      ],
      correctOrder: [1, 2, 3, 4, 5],
      hint: "La estructura es: if (condición) { bloque } else { bloque }",
      explanation:
        "El bloque 'else' se ejecuta cuando la condición del 'if' es falsa.",
    },
  },
  {
    id: "cond-2-1-code-1",
    moduleId: 2,
    lessonId: "2-1",
    type: "code",
    difficulty: "beginner",
    xpReward: 10,
    prompt:
      'Escribe un if que muestre "Aprobado" si la variable nota es mayor o igual a 60',
    data: {
      placeholder: "let nota = 75;\n\n// Escribe tu código aquí\n",
      solutions: ["if (nota >= 60)", "if(nota >= 60)", "if (nota>=60)"],
      hint: "Usa if con la condición nota >= 60",
      explanation: "Las comparaciones >= verifican si es mayor o igual.",
    },
  },
  {
    id: "cond-2-1-code-2",
    moduleId: 2,
    lessonId: "2-1",
    type: "code",
    difficulty: "intermediate",
    xpReward: 15,
    prompt:
      'Escribe un if-else que muestre "Mayor de edad" si edad >= 18, sino "Menor de edad"',
    data: {
      placeholder: "let edad = 20;\n\n// Escribe tu código aquí\n",
      solutions: ["regex:if\\s*\\(\\s*edad\\s*>=\\s*18\\s*\\)[\\s\\S]*else"],
      hint: "Necesitas tanto if como else",
      explanation:
        "El bloque else captura todos los casos no cubiertos por el if.",
    },
  },
  {
    id: "cond-2-1-code-3",
    moduleId: 2,
    lessonId: "2-1",
    type: "code",
    difficulty: "advanced",
    xpReward: 25,
    prompt:
      'Escribe un if-else if-else para clasificar notas: >= 90 "Excelente", >= 70 "Aprobado", sino "Reprobado"',
    data: {
      placeholder: "let nota = 85;\n\n// Escribe tu código aquí\n",
      solutions: [
        "regex:if\\s*\\(\\s*nota\\s*>=\\s*90\\s*\\)[\\s\\S]*else\\s+if\\s*\\(\\s*nota\\s*>=\\s*70\\s*\\)[\\s\\S]*else",
      ],
      hint: "Usa else if para condiciones intermedias",
      explanation:
        "else if permite encadenar múltiples condiciones secuenciales.",
    },
  },

  // Lección 2-2: Operadores de Comparación
  {
    id: "cond-2-2-quiz-1",
    moduleId: 2,
    lessonId: "2-2",
    type: "quiz",
    difficulty: "beginner",
    xpReward: 10,
    prompt: '¿Cuál es el resultado de: 10 === "10"?',
    data: {
      options: [
        { id: "a", text: "true" },
        { id: "b", text: "false" },
        { id: "c", text: "undefined" },
        { id: "d", text: "Error" },
      ],
      correctAnswer: "b",
      explanation: '=== compara valor Y tipo. 10 es number, "10" es string',
    },
  },
  {
    id: "cond-2-2-quiz-2",
    moduleId: 2,
    lessonId: "2-2",
    type: "quiz",
    difficulty: "intermediate",
    xpReward: 15,
    prompt:
      "¿Qué operador verifica si dos valores son diferentes (valor y tipo)?",
    data: {
      options: [
        { id: "a", text: "!=" },
        { id: "b", text: "!==" },
        { id: "c", text: "<>" },
        { id: "d", text: "=/=" },
      ],
      correctAnswer: "b",
      explanation: "!== es el operador de desigualdad estricta",
    },
  },
  {
    id: "cond-2-2-fill-1",
    moduleId: 2,
    lessonId: "2-2",
    type: "fillBlank",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "Completa para verificar si x es mayor que 10:",
    data: {
      template: ["if (x ", " 10) { }"],
      blanks: [{ id: 0, answers: [">", ">="] }],
      hint: "El símbolo > significa 'mayor que'.",
      explanation: "Si x es 11 o más, x > 10 será verdadero.",
    },
  },

  // ==========================================
  // MÓDULO 3: Bucles
  // ==========================================

  // Lección 3-1: Bucle For
  {
    id: "loop-3-1-fill-1",
    moduleId: 3,
    lessonId: "3-1",
    type: "fillBlank",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "Completa el bucle para contar del 0 al 9:",
    data: {
      template: ["for (let i = 0; i ", " 10; i++) {\n  console.log(i);\n}"],
      blanks: [{ id: 0, answers: ["<", "<="] }],
      hint: "Para contar HASTA 9 (incluido), i debe ser MENOR que 10.",
      explanation:
        "El bucle se detiene cuando la condición i < 10 es falsa (i=10).",
    },
  },
  {
    id: "loop-3-1-code-1",
    moduleId: 3,
    lessonId: "3-1",
    type: "code",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "Escribe un bucle for que imprima los números del 1 al 3",
    data: {
      placeholder: "// Escribe tu bucle for aquí\n",
      solutions: [
        "for (let i = 1; i <= 3; i++)",
        "for(let i=1;i<=3;i++)",
        "for (let i = 1; i < 4; i++)",
      ],
      hint: "Inicia en 1, termina en 3, incrementa con i++",
      explanation:
        "Los bucles for son ideales cuando sabes cuántas veces repetir algo.",
    },
  },
  {
    id: "loop-3-1-drag-1",
    moduleId: 3,
    lessonId: "3-1",
    type: "dragDrop",
    difficulty: "intermediate",
    xpReward: 15,
    prompt: "Ordena para crear un bucle que recorra un array:",
    data: {
      items: [
        { id: 1, text: 'let frutas = ["manzana", "pera"];' },
        { id: 2, text: "for (let i = 0; i < frutas.length; i++) {" },
        { id: 3, text: "  console.log(frutas[i]);" },
        { id: 4, text: "}" },
      ],
      correctOrder: [1, 2, 3, 4],
      hint: "Primero declara el array, luego el bucle que lo recorre.",
      explanation:
        "Usamos frutas.length para recorrer todos los elementos dinámicamente.",
    },
  },
  {
    id: "loop-3-1-code-2",
    moduleId: 3,
    lessonId: "3-1",
    type: "code",
    difficulty: "advanced",
    xpReward: 25,
    prompt:
      'Escribe un bucle for que sume los números del 1 al 10 en una variable "suma"',
    data: {
      placeholder: "let suma = 0;\n\n// Escribe tu bucle aquí\n",
      solutions: ["suma += i", "suma = suma + i", "for (let i = 1; i <= 10"],
      hint: "Usa += para acumular valores en suma",
      explanation:
        "El operador += es una forma corta de sumar y asignar (x = x + y).",
    },
  },

  // Lección 3-2: Bucle While
  {
    id: "loop-3-2-quiz-1",
    moduleId: 3,
    lessonId: "3-2",
    type: "quiz",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "¿Qué pasa si olvidas incrementar el contador en un while?",
    data: {
      options: [
        { id: "a", text: "El bucle no se ejecuta" },
        { id: "b", text: "El bucle se ejecuta una vez" },
        { id: "c", text: "Se crea un bucle infinito" },
        { id: "d", text: "JavaScript lo incrementa automáticamente" },
      ],
      correctAnswer: "c",
      explanation: "Sin incrementar, la condición siempre será true",
    },
  },
  {
    id: "loop-3-2-code-1",
    moduleId: 3,
    lessonId: "3-2",
    type: "code",
    difficulty: "intermediate",
    xpReward: 15,
    prompt: "Escribe un while que cuente del 0 al 4",
    data: {
      placeholder: "let i = 0;\n\n// Escribe tu bucle while aquí\n",
      solutions: ["while (i < 5)", "while (i <= 4)", "while(i < 5)"],
      hint: "No olvides incrementar i dentro del bucle!",
      explanation:
        "while repite el bloque mientras la condición sea verdadera.",
    },
  },
  {
    id: "loop-3-2-quiz-2",
    moduleId: 3,
    lessonId: "3-2",
    type: "quiz",
    difficulty: "intermediate",
    xpReward: 15,
    prompt: "¿Cuál es la diferencia entre while y do...while?",
    data: {
      options: [
        { id: "a", text: "No hay diferencia" },
        { id: "b", text: "do...while siempre ejecuta al menos una vez" },
        { id: "c", text: "while es más rápido" },
        { id: "d", text: "do...while no necesita condición" },
      ],
      correctAnswer: "b",
      explanation:
        "do...while evalúa la condición después de la primera ejecución",
    },
  },

  // ==========================================
  // MÓDULO 4: Funciones
  // ==========================================

  // Lección 4-1: Crear Funciones
  {
    id: "func-4-1-code-1",
    moduleId: 4,
    lessonId: "4-1",
    type: "code",
    difficulty: "beginner",
    xpReward: 10,
    prompt:
      'Crea una función llamada "duplicar" que reciba un número y retorne el doble',
    data: {
      placeholder: "// Escribe tu función aquí\n",
      solutions: [
        "function duplicar(n) { return n * 2; }",
        "const duplicar = (n) => n * 2",
        "function duplicar(num) { return num * 2; }",
        "return n * 2",
        "return num * 2",
      ],
      hint: "Usa return para devolver el resultado",
      explanation:
        "La palabra clave return finaliza la función y devuelve el valor.",
    },
  },
  {
    id: "func-4-1-drag-1",
    moduleId: 4,
    lessonId: "4-1",
    type: "dragDrop",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "Ordena para crear una función que calcule el cuadrado:",
    data: {
      items: [
        { id: 1, text: "function cuadrado(n) {" },
        { id: 2, text: "  return n * n;" },
        { id: 3, text: "}" },
      ],
      correctOrder: [1, 2, 3],
      hint: "Define la función, retorna el cálculo y cierra la llave.",
      explanation: "Las funciones encapsulan lógica reutilizable.",
    },
  },
  {
    id: "func-4-1-code-2",
    moduleId: 4,
    lessonId: "4-1",
    type: "code",
    difficulty: "intermediate",
    xpReward: 15,
    prompt:
      'Crea una función "saludar" que reciba un nombre y retorne "Hola, [nombre]"',
    data: {
      placeholder: "// Escribe tu función aquí\n",
      solutions: [
        'return "Hola, " + nombre',
        "return 'Hola, ' + nombre",
        "return `Hola, ${nombre}`",
      ],
      hint: 'Concatena "Hola, " con el parámetro nombre',
    },
  },
  {
    id: "func-4-1-code-3",
    moduleId: 4,
    lessonId: "4-1",
    type: "code",
    difficulty: "advanced",
    xpReward: 25,
    prompt:
      'Crea una arrow function "sumar" que reciba dos números y retorne su suma',
    data: {
      placeholder: "// Escribe tu arrow function aquí\n",
      solutions: [
        "const sumar = (a, b) => a + b",
        "let sumar = (a, b) => a + b",
        "=> a + b",
      ],
      hint: "Formato: const nombre = (params) => expresión",
      explanation:
        "Las arrow functions son más concisas para funciones simples.",
    },
  },

  // Lección 4-2: Parámetros y Retorno
  {
    id: "func-4-2-quiz-1",
    moduleId: 4,
    lessonId: "4-2",
    type: "quiz",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "¿Qué retorna una función si no tiene return?",
    data: {
      options: [
        { id: "a", text: "null" },
        { id: "b", text: "0" },
        { id: "c", text: "undefined" },
        { id: "d", text: "Error" },
      ],
      correctAnswer: "c",
      explanation: "Sin return explícito, una función retorna undefined",
    },
  },
  {
    id: "func-4-2-fill-1",
    moduleId: 4,
    lessonId: "4-2",
    type: "fillBlank",
    difficulty: "beginner",
    xpReward: 10,
    prompt: "Completa la función con parámetro por defecto:",
    data: {
      template: [
        'function saludar(nombre = "',
        '") {\n  return "Hola " + nombre;\n}',
      ],
      blanks: [{ id: 0, answers: ["Mundo", "Usuario", "Amigo", "Invitado"] }],
      hint: "Un valor común por defecto es 'Invitado' o 'Mundo'.",
      explanation:
        "Los parámetros por defecto se usan cuando no se pasa un argumento.",
    },
  },
  {
    id: "func-4-2-code-1",
    moduleId: 4,
    lessonId: "4-2",
    type: "code",
    difficulty: "intermediate",
    xpReward: 15,
    prompt:
      'Crea una función "calcularArea" que reciba base y altura, y retorne el área del rectángulo',
    data: {
      placeholder: "// Escribe tu función aquí\n",
      solutions: [
        "return base * altura",
        "return altura * base",
        "base * altura",
      ],
      hint: "Área = base × altura",
      explanation:
        "Las funciones puras como esta siempre devuelven lo mismo para los mismos inputs.",
    },
  },
  {
    id: "func-4-2-code-2",
    moduleId: 4,
    lessonId: "4-2",
    type: "code",
    difficulty: "advanced",
    xpReward: 25,
    prompt:
      'Crea una función "factorial" que calcule el factorial de un número usando recursión',
    data: {
      placeholder: "// Escribe tu función recursiva aquí\n",
      solutions: [
        "return n * factorial(n - 1)",
        "factorial(n - 1)",
        "n * factorial(n-1)",
      ],
      hint: "Caso base: si n <= 1, retorna 1. Sino retorna n * factorial(n-1)",
      explanation:
        "La recursión ocurre cuando una función se llama a sí misma.",
    },
  },
  {
    id: "func-4-2-quiz-2",
    moduleId: 4,
    lessonId: "4-2",
    type: "quiz",
    difficulty: "advanced",
    xpReward: 20,
    prompt: "¿Cuál es la salida de: ((x) => x * 2)(5)?",
    data: {
      options: [
        { id: "a", text: "undefined" },
        { id: "b", text: "5" },
        { id: "c", text: "10" },
        { id: "d", text: "Error de sintaxis" },
      ],
      correctAnswer: "c",
      explanation:
        "Es una IIFE (función invocada inmediatamente) que multiplica 5 por 2",
    },
  },
];

export const getExercisesByModule = (moduleId: number) =>
  exercises.filter((e) => e.moduleId === moduleId);

export const getExercisesByLesson = (lessonId: string) =>
  exercises.filter((e) => e.lessonId === lessonId);

export const getExerciseById = (id: string) =>
  exercises.find((e) => e.id === id);

export default exercises;
