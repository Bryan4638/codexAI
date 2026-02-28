import { DataSource } from 'typeorm';
import { Module } from '../exercises/entities/module.entity';
import { Lesson } from '../exercises/entities/lesson.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { ExerciseTest } from '../exercises/entities/exercise-test.entity';
import { exercises } from './data/exercises.data';
import { exercisesWithTests } from './data/exercises-with-tests.data';
import * as dotenv from 'dotenv';
import { User } from '../auth/entities/user.entity';
import { UserProgress } from '../auth/entities/user-progress.entity';
import { UserBadge } from '../auth/entities/user-badge.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { Reaction } from '../challenges/entities/reaction.entity';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Module,
    Lesson,
    Exercise,
    ExerciseTest,
    User,
    UserProgress,
    UserBadge,
    Challenge,
    Reaction,
  ],
  synchronize: false,
});

const moduleData = [
  {
    number: 1,
    name: 'Variables y Tipos de Datos',
    description:
      'Aprende los fundamentos de almacenar información en JavaScript',
    icon: 'variable',
    lessons: [
      {
        id: '1-1',
        title: '¿Qué son las variables?',
        description: 'Introducción a variables',
        order: 1,
      },
      {
        id: '1-2',
        title: 'Tipos de Datos',
        description: 'String, Number, Boolean, etc.',
        order: 2,
      },
    ],
  },
  {
    number: 2,
    name: 'Condicionales',
    description: 'Controla el flujo de tu programa con lógica booleana',
    icon: 'signs-post',
    lessons: [
      {
        id: '2-1',
        title: 'Estructura if/else',
        description: 'Toma de decisiones básica',
        order: 1,
      },
      {
        id: '2-2',
        title: 'Operadores de Comparación',
        description: 'Comparar valores',
        order: 2,
      },
    ],
  },
  {
    number: 3,
    name: 'Bucles',
    description: 'Repite acciones y automatiza tareas',
    icon: 'repeat',
    lessons: [
      {
        id: '3-1',
        title: 'Bucle For',
        description: 'Iteraciones controladas',
        order: 1,
      },
      {
        id: '3-2',
        title: 'Bucle While',
        description: 'Iteraciones condicionales',
        order: 2,
      },
    ],
  },
  {
    number: 4,
    name: 'Funciones',
    description: 'Crea bloques de código reutilizables',
    icon: 'function',
    lessons: [
      {
        id: '4-1',
        title: 'Crear Funciones',
        description: 'Definición y uso de funciones',
        order: 1,
      },
      {
        id: '4-2',
        title: 'Parámetros y Retorno',
        description: 'Entrada y salida de datos',
        order: 2,
      },
    ],
  },
];

async function seed() {
  await dataSource.initialize();
  console.log('Database connected');

  const moduleRepo = dataSource.getRepository(Module);
  const lessonRepo = dataSource.getRepository(Lesson);
  const exerciseRepo = dataSource.getRepository(Exercise);

  // Mapping to store created entities for linking
  const lessonMap = new Map<string, Lesson>(); // '1-1' -> Lesson entity

  for (const mData of moduleData) {
    let module = await moduleRepo.findOne({
      where: { moduleNumber: mData.number },
    });
    if (!module) {
      module = moduleRepo.create({
        moduleNumber: mData.number,
        name: mData.name,
        description: mData.description,
        icon: mData.icon,
        order: mData.number,
        isActive: true,
      });
      await moduleRepo.save(module);
      console.log(`Module created: ${module.name}`);
    } else {
      console.log(`Module already exists: ${module.name}`);
    }

    // Create Lessons
    for (const lData of mData.lessons) {
      let lesson = await lessonRepo.findOne({
        where: { title: lData.title, module: { id: module.id } }, // Simple check
        relations: ['module'],
      });

      if (!lesson) {
        lesson = lessonRepo.create({
          title: lData.title,
          description: lData.description,
          order: lData.order,
          isActive: true,
          module: module,
        });
        await lessonRepo.save(lesson);
        console.log(`  Lesson created: ${lesson.title}`);
      }

      lessonMap.set(lData.id, lesson);
    }
  }

  // Create Exercises
  for (const exData of exercises) {
    // Find the lesson UUID from map
    const lesson = lessonMap.get(exData.lessonId);
    if (!lesson) {
      console.warn(
        `Lesson not found for exercise ${exData.id} (lessonId: ${exData.lessonId})`,
      );
      continue;
    }

    const exists = await exerciseRepo.findOne({
      where: { prompt: exData.prompt, lesson: { id: lesson.id } },
    });

    if (!exists) {
      const newExercise = exerciseRepo.create({
        type: exData.type as any,
        difficulty: exData.difficulty as any,
        xpReward: exData.xpReward,
        prompt: exData.prompt,
        data: exData.data as any, // JSONB
        order: 0,
        isActive: true,
        lesson: lesson,
      });
      await exerciseRepo.save(newExercise);
      console.log(`    Exercise created: ${exData.id}`);
    } else {
      // console.log(`    Exercise ignored: ${exData.id} (already exists)`);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Sembrar ejercicios CON TESTS (4 ejercicios nuevos)
  // ─────────────────────────────────────────────────────────────────────────
  const exerciseTestRepo = dataSource.getRepository(ExerciseTest);

  for (const exData of exercisesWithTests) {
    const lesson = lessonMap.get(exData.lessonId);
    if (!lesson) {
      console.warn(
        `Lección no encontrada para ejercicio ${exData.id} (lessonId: ${exData.lessonId})`,
      );
      continue;
    }

    // Buscar o crear el ejercicio
    let exercise = await exerciseRepo.findOne({
      where: { prompt: exData.prompt, lesson: { id: lesson.id } },
    });

    if (!exercise) {
      exercise = exerciseRepo.create({
        type: exData.type as any,
        difficulty: exData.difficulty as any,
        xpReward: exData.xpReward,
        prompt: exData.prompt,
        data: exData.data as any,
        order: 0,
        isActive: true,
        lesson: lesson,
      });
      await exerciseRepo.save(exercise);
      console.log(`    Ejercicio con tests creado: ${exData.id}`);
    } else {
      console.log(`    Ejercicio ya existe: ${exData.id}`);
    }

    // Sembrar los tests del ejercicio
    for (const testData of exData.tests) {
      const existingTest = await exerciseTestRepo.findOne({
        where: {
          description: testData.description,
          exercise: { id: exercise.id },
        },
      });

      if (!existingTest) {
        const newTest = exerciseTestRepo.create({
          description: testData.description,
          input: testData.input,
          expectedOutput: testData.expectedOutput,
          isHidden: testData.isHidden,
          order: testData.order,
          exercise: exercise,
        });
        await exerciseTestRepo.save(newTest);
        const visibility = testData.isHidden ? '🔒 oculto' : '✅ visible';
        console.log(`      Test [${visibility}]: ${testData.description}`);
      }
    }
  }

  console.log('Seeding complete');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Error seeding:', err);
  process.exit(1);
});
