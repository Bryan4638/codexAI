import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ExecuteWithTestsUseCase } from '../execution/use-cases/execute-with-tests.use-case';
import { DataSource, Like } from 'typeorm';
import { Exercise } from '../exercises/entities/exercise.entity';

async function testSandbox() {
  console.log('🚀 Iniciando contexto de NestJS para la prueba...');
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);
  const executeUseCase = app.get(ExecuteWithTestsUseCase);
  const exerciseRepo = dataSource.getRepository(Exercise);

  console.log('🔍 Buscando un ejercicio que contenga tests...');
  const sumaExercise = await exerciseRepo.findOne({
    where: { tests: { isHidden: false } },
    relations: ['tests'],
  });

  if (!sumaExercise) {
    console.error(
      '❌ No se encontró el ejercicio de suma. ¿Ejecutaste el seed?',
    );
    process.exit(1);
  }

  console.log(`✅ Ejercicio encontrado: ID ${sumaExercise.id}`);

  // ---------------------------------------------------------
  // Prueba 1: Código Malicioso (Hardcodeo)
  // ---------------------------------------------------------
  console.log('\n================================================');
  console.log('🧪 PRUEBA 1: Intento de Hardcodeo');
  console.log('================================================');
  const badCode = `
    function suma(a, b) {
      if (a === 1 && b === 2) return 3;
      if (a === 0 && b === 0) return 0;
      return "No sé la respuesta";
    }
  `;

  console.log('Enviando código malicioso a Docker...\n');
  const badResult = await executeUseCase.execute({
    exerciseId: sumaExercise.id,
    language: 'javascript',
    code: badCode,
  });

  console.dir(badResult, { depth: null, colors: true });
  console.log(
    badResult.allPassed
      ? '❌ FALLO INESPERADO: El código malicioso pasó'
      : '✅ CORRECTO: El código malicioso fue rechazado',
  );

  // ---------------------------------------------------------
  // Prueba 2: Código Correcto
  // ---------------------------------------------------------
  console.log('\n================================================');
  console.log('🧪 PRUEBA 2: Solución Algorítmica Correcta');
  console.log('================================================');
  const goodCode = `
    function suma(a, b) {
      return a + b;
    }
  `;

  console.log('Enviando código correcto a Docker...\n');
  const goodResult = await executeUseCase.execute({
    exerciseId: sumaExercise.id,
    language: 'javascript',
    code: goodCode,
  });

  console.dir(goodResult, { depth: null, colors: true });
  console.log(
    goodResult.allPassed
      ? '✅ CORRECTO: El código bueno pasó todos los tests'
      : '❌ FALLO INESPERADO: El código bueno falló',
  );

  console.log('\nCerrando aplicación...');
  await app.close();
  process.exit(0);
}

testSandbox().catch((err) => {
  console.error('Error durante la prueba:', err);
  process.exit(1);
});
