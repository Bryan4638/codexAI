import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Nombres de usuario creativos
const usernames = [
  "CodeMaster",
  "TechNinja",
  "DataWizard",
  "PixelCoder",
  "ByteRunner",
  "AlgoExpert",
  "WebHero",
  "DevNewbie",
  "CyberPunk",
  "StackOverflow",
  "ReactRanger",
  "TypeScriptKing",
  "PythonMaster",
  "JavaJunkie",
  "RustLord",
  "GoGopher",
  "NodeNinja",
  "CSSWizard",
  "HTMLHero",
  "DockerDude",
  "KubeKing",
  "CloudCrafter",
  "APIArchitect",
  "DBDragon",
  "GitGuru",
  "LinuxLover",
  "VimVanguard",
  "EmacsMaster",
  "VSCodeVet",
  "TerminalTitan",
  "BugBuster",
  "TestTamer",
  "RefactorRex",
  "CleanCoder",
  "AgileAce",
  "ScrumSamurai",
  "DevOpsNinja",
  "MLMaven",
  "AIArtist",
  "DataDriller",
  "BlockchainBoss",
  "CryptoKid",
  "SmartContract",
  "Web3Warrior",
  "DeFiDev",
  "GameDev",
  "UnityUnicorn",
  "UnrealUltra",
  "GraphicsGod",
  "ShaderSage",
  "MobileMaster",
  "SwiftSword",
  "KotlinKnight",
  "FlutterFan",
  "DartDancer",
  "SecureScout",
  "HackerHunter",
  "PenTester",
  "FirewallFixer",
  "CryptoGuard",
  "FullStackFury",
  "BackendBeast",
  "FrontendFlash",
  "MiddlewareMage",
  "APIPro",
  "CodeCrusader",
  "DebugDemon",
  "SyntaxSavant",
  "LogicLord",
  "BinaryBoss",
  "HexHacker",
  "BitBender",
  "NullKiller",
  "TypeChecker",
  "LintLion",
  "CacheCaptain",
  "MemoryMaster",
  "ThreadThrasher",
  "AsyncAce",
  "ParallelPro",
  "RecursiveRex",
  "IteratorIvan",
  "LoopLord",
  "ConditionalKing",
  "SwitchSage",
  "FunctionFan",
  "LambdaLover",
  "ClosureCrafter",
  "PrototypePro",
  "ClassyCoder",
  "OOPOracle",
  "FunctionalFiend",
  "StatelessSam",
  "ImmutableIvan",
  "PurePatrick",
  "MonadMaster",
  "FunctorFred",
  "ComposeCrafter",
  "CurryChamp",
  "PartialPete",
];

// Bios variadas
const bios = [
  "Apasionado por la programación y el open source",
  "Full Stack Developer | React & Node.js",
  "Data Science enthusiast | ML lover",
  "Learning to code everyday! 🚀",
  "Algorithms and data structures lover",
  "Copy-paste expert 😅",
  "Building the future, one line at a time",
  "Coffee → Code → Repeat ☕",
  "Breaking things to learn how they work",
  "From zero to hero in programming",
  "Self-taught developer on a mission",
  "Code artisan crafting digital experiences",
  "Obsessed with clean, efficient code",
  "Making the web a better place",
  "Turning caffeine into code since 2020",
  "Passionate about UI/UX and beautiful code",
  "Backend enthusiast | API lover",
  "Cloud computing aficionado ☁️",
  "DevOps engineer in training",
  "Solving problems one commit at a time",
  "Junior dev with senior dreams",
  "Tech lover and eternal learner",
  "Building apps that matter",
  "Code is poetry 📝",
  "Debugging my way through life",
  null,
  null,
  null, // Algunos sin bio
];

// IDs de ejercicios disponibles
const exerciseIds = [
  "ex-1-1-1",
  "ex-1-1-2",
  "ex-1-2-1",
  "ex-1-2-2",
  "ex-2-1-1",
  "ex-2-1-2",
  "ex-2-2-1",
  "ex-3-1-1",
  "ex-3-1-2",
  "ex-3-2-1",
  "ex-4-1-1",
  "ex-4-1-2",
  "ex-4-2-1",
  "ex-4-2-2",
];

// IDs de medallas disponibles
const badgeIds = [
  "first_steps",
  "on_the_way",
  "dedicated_student",
  "level_5",
  "level_10",
  "variables_master",
  "conditionals_master",
  "loops_master",
  "functions_master",
  "perfect_score",
  "speed_demon",
  "persistent",
  "early_bird",
  "night_owl",
  "community_star",
];

// Retos de la comunidad
const challengeData = [
  {
    title: "FizzBuzz Clásico",
    description:
      "Imprime los números del 1 al 100. Para múltiplos de 3 imprime 'Fizz', para múltiplos de 5 'Buzz', y para múltiplos de ambos 'FizzBuzz'.",
    initialCode: "function fizzBuzz() {\n  // Tu código aquí\n}",
    testCases: [
      { input: 3, expected: "Fizz" },
      { input: 5, expected: "Buzz" },
      { input: 15, expected: "FizzBuzz" },
      { input: 7, expected: "7" },
    ],
    difficulty: "easy",
  },
  {
    title: "Palíndromo Detector",
    description:
      "Crea una función que determine si una cadena es un palíndromo (se lee igual de izquierda a derecha que de derecha a izquierda).",
    initialCode: "function isPalindrome(str) {\n  // Tu código aquí\n}",
    testCases: [
      { input: "radar", expected: true },
      { input: "hello", expected: false },
      { input: "A man a plan a canal Panama", expected: true },
    ],
    difficulty: "easy",
  },
  {
    title: "Suma de Arrays",
    description:
      "Escribe una función que sume todos los números de un array sin usar el método reduce.",
    initialCode: "function sumArray(arr) {\n  // Tu código aquí\n}",
    testCases: [
      { input: [1, 2, 3], expected: 6 },
      { input: [10, 20, 30], expected: 60 },
      { input: [], expected: 0 },
    ],
    difficulty: "easy",
  },
  {
    title: "Fibonacci Secuencia",
    description: "Genera los primeros N números de la secuencia de Fibonacci.",
    initialCode: "function fibonacci(n) {\n  // Tu código aquí\n}",
    testCases: [
      { input: 5, expected: [0, 1, 1, 2, 3] },
      { input: 8, expected: [0, 1, 1, 2, 3, 5, 8, 13] },
    ],
    difficulty: "medium",
  },
  {
    title: "Factorial Recursivo",
    description:
      "Implementa el cálculo del factorial de un número usando recursión.",
    initialCode: "function factorial(n) {\n  // Tu código aquí\n}",
    testCases: [
      { input: 5, expected: 120 },
      { input: 0, expected: 1 },
      { input: 10, expected: 3628800 },
    ],
    difficulty: "medium",
  },
  {
    title: "Ordenamiento Burbuja",
    description:
      "Implementa el algoritmo de ordenamiento burbuja para ordenar un array de números.",
    initialCode: "function bubbleSort(arr) {\n  // Tu código aquí\n}",
    testCases: [
      {
        input: [64, 34, 25, 12, 22, 11, 90],
        expected: [11, 12, 22, 25, 34, 64, 90],
      },
      { input: [5, 1, 4, 2, 8], expected: [1, 2, 4, 5, 8] },
    ],
    difficulty: "medium",
  },
  {
    title: "Búsqueda Binaria",
    description:
      "Implementa una búsqueda binaria que retorne el índice del elemento buscado o -1 si no existe.",
    initialCode: "function binarySearch(arr, target) {\n  // Tu código aquí\n}",
    testCases: [
      { input: { arr: [1, 2, 3, 4, 5], target: 3 }, expected: 2 },
      { input: { arr: [1, 2, 3, 4, 5], target: 6 }, expected: -1 },
    ],
    difficulty: "medium",
  },
  {
    title: "Anagramas",
    description:
      "Determina si dos cadenas son anagramas (contienen las mismas letras).",
    initialCode: "function areAnagrams(str1, str2) {\n  // Tu código aquí\n}",
    testCases: [
      { input: { str1: "listen", str2: "silent" }, expected: true },
      { input: { str1: "hello", str2: "world" }, expected: false },
    ],
    difficulty: "medium",
  },
  {
    title: "Números Primos",
    description:
      "Encuentra todos los números primos hasta N usando la Criba de Eratóstenes.",
    initialCode: "function sieveOfEratosthenes(n) {\n  // Tu código aquí\n}",
    testCases: [
      { input: 10, expected: [2, 3, 5, 7] },
      { input: 20, expected: [2, 3, 5, 7, 11, 13, 17, 19] },
    ],
    difficulty: "hard",
  },
  {
    title: "Árbol Binario de Búsqueda",
    description:
      "Implementa la inserción y búsqueda en un árbol binario de búsqueda.",
    initialCode:
      "class BST {\n  constructor() {\n    this.root = null;\n  }\n  \n  insert(value) {\n    // Tu código aquí\n  }\n  \n  search(value) {\n    // Tu código aquí\n  }\n}",
    testCases: [
      { input: "insert and search 5", expected: true },
      { input: "search non-existent", expected: false },
    ],
    difficulty: "hard",
  },
  {
    title: "Merge Sort",
    description: "Implementa el algoritmo de ordenamiento Merge Sort.",
    initialCode: "function mergeSort(arr) {\n  // Tu código aquí\n}",
    testCases: [
      {
        input: [38, 27, 43, 3, 9, 82, 10],
        expected: [3, 9, 10, 27, 38, 43, 82],
      },
    ],
    difficulty: "hard",
  },
  {
    title: "Quick Sort",
    description: "Implementa el algoritmo de ordenamiento Quick Sort.",
    initialCode: "function quickSort(arr) {\n  // Tu código aquí\n}",
    testCases: [{ input: [10, 7, 8, 9, 1, 5], expected: [1, 5, 7, 8, 9, 10] }],
    difficulty: "hard",
  },
  {
    title: "Validar Paréntesis",
    description:
      "Verifica si una cadena tiene paréntesis, corchetes y llaves balanceados.",
    initialCode: "function isBalanced(str) {\n  // Tu código aquí\n}",
    testCases: [
      { input: "({[]})", expected: true },
      { input: "([)]", expected: false },
      { input: "{[]}", expected: true },
    ],
    difficulty: "medium",
  },
  {
    title: "Invertir Palabras",
    description: "Invierte el orden de las palabras en una oración.",
    initialCode: "function reverseWords(str) {\n  // Tu código aquí\n}",
    testCases: [
      { input: "Hello World", expected: "World Hello" },
      { input: "The quick brown fox", expected: "fox brown quick The" },
    ],
    difficulty: "easy",
  },
  {
    title: "Contador de Vocales",
    description: "Cuenta el número de vocales en una cadena.",
    initialCode: "function countVowels(str) {\n  // Tu código aquí\n}",
    testCases: [
      { input: "Hello World", expected: 3 },
      { input: "JavaScript", expected: 3 },
    ],
    difficulty: "easy",
  },
  {
    title: "Suma de Dos Números",
    description:
      "Encuentra dos números en un array que sumen un objetivo dado. Retorna sus índices.",
    initialCode: "function twoSum(nums, target) {\n  // Tu código aquí\n}",
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
    ],
    difficulty: "medium",
  },
  {
    title: "Cadena Más Larga Sin Repetir",
    description:
      "Encuentra la longitud de la subcadena más larga sin caracteres repetidos.",
    initialCode:
      "function lengthOfLongestSubstring(s) {\n  // Tu código aquí\n}",
    testCases: [
      { input: "abcabcbb", expected: 3 },
      { input: "bbbbb", expected: 1 },
      { input: "pwwkew", expected: 3 },
    ],
    difficulty: "hard",
  },
  {
    title: "Rotar Array",
    description: "Rota un array k posiciones a la derecha.",
    initialCode: "function rotate(nums, k) {\n  // Tu código aquí\n}",
    testCases: [
      {
        input: { nums: [1, 2, 3, 4, 5, 6, 7], k: 3 },
        expected: [5, 6, 7, 1, 2, 3, 4],
      },
    ],
    difficulty: "medium",
  },
  {
    title: "Máximo Subarray",
    description:
      "Encuentra el subarray contiguo con la suma máxima (Algoritmo de Kadane).",
    initialCode: "function maxSubArray(nums) {\n  // Tu código aquí\n}",
    testCases: [
      { input: [-2, 1, -3, 4, -1, 2, 1, -5, 4], expected: 6 },
      { input: [1], expected: 1 },
    ],
    difficulty: "hard",
  },
  {
    title: "Escaleras",
    description:
      "Puedes subir 1 o 2 escalones a la vez. ¿De cuántas formas distintas puedes subir N escalones?",
    initialCode: "function climbStairs(n) {\n  // Tu código aquí\n}",
    testCases: [
      { input: 2, expected: 2 },
      { input: 3, expected: 3 },
      { input: 5, expected: 8 },
    ],
    difficulty: "easy",
  },
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(startDays: number, endDays: number): Date {
  const now = new Date();
  const daysAgo = getRandomInt(startDays, endDays);
  return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
}

async function main() {
  console.log("🌱 Seeding database with extensive test data...\n");

  // Limpiar datos existentes
  console.log("🧹 Cleaning existing data...");
  await prisma.reaction.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Crear 80 usuarios
  console.log("👥 Creating 80 users...");
  const users = [];

  for (let i = 0; i < 80; i++) {
    const username = usernames[i] || `User${i + 1}`;
    const xp =
      i < 5
        ? getRandomInt(2000, 5000)
        : i < 15
          ? getRandomInt(1000, 2000)
          : i < 35
            ? getRandomInt(300, 1000)
            : getRandomInt(0, 300);

    const level = Math.max(1, Math.floor(xp / 500) + 1);

    const user = await prisma.user.create({
      data: {
        username,
        email: `${username.toLowerCase()}@test.com`,
        password: hashedPassword,
        xp,
        level,
        isPublic: Math.random() > 0.15, // 85% públicos
        bio: getRandomElement(bios),
        github: Math.random() > 0.4 ? username.toLowerCase() : null,
        linkedin: Math.random() > 0.5 ? `${username.toLowerCase()}-dev` : null,
        twitter: Math.random() > 0.6 ? username.toLowerCase() : null,
        website:
          Math.random() > 0.7 ? `https://${username.toLowerCase()}.dev` : null,
        createdAt: getRandomDate(1, 365),
      },
    });
    users.push(user);

    if ((i + 1) % 20 === 0) {
      console.log(`   Created ${i + 1} users...`);
    }
  }
  console.log(`✅ Created ${users.length} users\n`);

  // Crear medallas para usuarios
  console.log("🏅 Adding badges to users...");
  let badgeCount = 0;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    // Los usuarios con más XP tienen más medallas
    const numBadges =
      i < 5
        ? getRandomInt(8, 12)
        : i < 15
          ? getRandomInt(5, 8)
          : i < 35
            ? getRandomInt(2, 5)
            : getRandomInt(0, 2);

    const shuffledBadges = [...badgeIds].sort(() => Math.random() - 0.5);
    const userBadges = shuffledBadges.slice(0, numBadges);

    for (const badgeId of userBadges) {
      await prisma.userBadge.create({
        data: {
          userId: user.id,
          badgeId,
          unlockedAt: getRandomDate(1, 180),
        },
      });
      badgeCount++;
    }
  }
  console.log(`✅ Created ${badgeCount} user badges\n`);

  // Crear progreso de ejercicios
  console.log("📊 Adding exercise progress...");
  let progressCount = 0;

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    // Los usuarios con más XP tienen más ejercicios completados
    const numExercises =
      i < 5
        ? getRandomInt(10, 14)
        : i < 15
          ? getRandomInt(6, 10)
          : i < 35
            ? getRandomInt(2, 6)
            : getRandomInt(0, 2);

    const shuffledExercises = [...exerciseIds].sort(() => Math.random() - 0.5);
    const userExercises = shuffledExercises.slice(0, numExercises);

    for (const exerciseId of userExercises) {
      await prisma.userProgress.create({
        data: {
          userId: user.id,
          exerciseId,
          attempts: getRandomInt(1, 5),
          completedAt: getRandomDate(1, 90),
        },
      });
      progressCount++;
    }
  }
  console.log(`✅ Created ${progressCount} exercise progress records\n`);

  // Crear retos de la comunidad
  console.log("🎯 Creating community challenges...");
  const challenges = [];

  for (let i = 0; i < challengeData.length; i++) {
    const data = challengeData[i];
    const authorIndex = getRandomInt(0, Math.min(19, users.length - 1)); // Top 20 usuarios como autores

    const challenge = await prisma.challenge.create({
      data: {
        title: data.title,
        description: data.description,
        initialCode: data.initialCode,
        testCases: data.testCases,
        difficulty: data.difficulty,
        authorId: users[authorIndex].id,
        createdAt: getRandomDate(1, 120),
      },
    });
    challenges.push(challenge);
  }
  console.log(`✅ Created ${challenges.length} community challenges\n`);

  // Crear reacciones a los retos
  console.log("❤️ Adding reactions to challenges...");
  let reactionCount = 0;

  for (const challenge of challenges) {
    // Cada reto tiene entre 5 y 40 reacciones
    const numReactions = getRandomInt(5, 40);
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const reactingUsers = shuffledUsers.slice(0, numReactions);

    for (const user of reactingUsers) {
      // No crear reacción del autor a su propio reto
      if (user.id === challenge.authorId) continue;

      try {
        await prisma.reaction.create({
          data: {
            userId: user.id,
            challengeId: challenge.id,
            type: Math.random() > 0.1 ? "LIKE" : "LOVE",
            createdAt: getRandomDate(1, 60),
          },
        });
        reactionCount++;
      } catch {
        // Ignorar duplicados
      }
    }
  }
  console.log(`✅ Created ${reactionCount} reactions\n`);

  // Resumen final
  console.log("═".repeat(50));
  console.log("🎉 SEEDING COMPLETE!");
  console.log("═".repeat(50));
  console.log(`
📊 Summary:
   👥 Users:      ${users.length}
   🏅 Badges:     ${badgeCount}
   📈 Progress:   ${progressCount}
   🎯 Challenges: ${challenges.length}
   ❤️ Reactions:  ${reactionCount}

🔐 All test users have password: password123
🎮 Top users (sorted by XP):
`);

  const topUsers = users
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10)
    .map((u, i) => `   ${i + 1}. ${u.username} (Level ${u.level}, ${u.xp} XP)`);

  console.log(topUsers.join("\n"));
  console.log("");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
