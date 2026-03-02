import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Challenge } from '../challenges/entities/challenge.entity';
import { ChallengeTest } from '../challenges/entities/challenge-test.entity';
import { User } from '../auth/entities/user.entity';
import { challengesWithTests } from './data/challenges.data';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  console.log('🌱 Inicializando seeder de Challenges...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const challengeRepo = dataSource.getRepository(Challenge);
    const challengeTestRepo = dataSource.getRepository(ChallengeTest);
    const userRepo = dataSource.getRepository(User);

    console.log('🧹 Limpiando los tests previos de la base de datos...');
    await challengeTestRepo.createQueryBuilder().delete().execute(); // purgar TypeORM

    // Obtener un usuario author, crear uno ficticio si no existe
    let sysAdmin = await userRepo.findOne({
      where: { email: 'admin@codex.ai' },
    });

    if (!sysAdmin) {
      console.log('🤖 Usuario admin no encontrado, creando sys_admin...');

      sysAdmin = userRepo.create({
        username: 'sys_admin',
        email: 'admin@codex.ai',
        authProvider: 'email',
      });
      await userRepo.save(sysAdmin);
    }

    // Sembrar challenges
    for (const chData of challengesWithTests) {
      console.log(`\n⏳ Procesando reto: "${chData.title}"`);

      // Buscar si ya existe para no duplicar
      let challenge = await challengeRepo.findOne({
        where: { title: chData.title },
      });

      if (!challenge) {
        challenge = challengeRepo.create({
          title: chData.title,
          description: chData.description,
          initialCode: chData.initialCode,
          difficulty: chData.difficulty as any,
          author: sysAdmin,
        });
        await challengeRepo.save(challenge);
        console.log(`   ✅ Reto creado: ${challenge.title} (${challenge.id})`);
      } else {
        console.log(`   ⏩ Reto existente: ${challenge.title}`);
      }

      // Sembrar tests del reto
      for (const testData of chData.tests) {
        const existingTest = await challengeTestRepo.findOne({
          where: {
            description: testData.description,
            challenge: { id: challenge.id },
          },
        });

        if (!existingTest) {
          const newTest = challengeTestRepo.create({
            description: testData.description,
            input: testData.input,
            expectedOutput: testData.expectedOutput,
            isHidden: testData.isHidden,
            order: testData.order,
            challenge: challenge,
          });
          await challengeTestRepo.save(newTest);
          const visibility = testData.isHidden ? '🔒 oculto' : '✅ visible';
          console.log(
            `      🧪 Test añadido [${visibility}]: ${testData.description}`,
          );
        } else {
          console.log(`      ⏩ Test existente: ${testData.description}`);
        }
      }
    }

    console.log('\n✅ Seeding de Retos completado satisfactoriamente.');
  } catch (error) {
    console.error('❌ Error durante el seeding de retos:', error);
  } finally {
    // Cerrar contexto de NestJS
    await app.close();
  }
}

bootstrap();
