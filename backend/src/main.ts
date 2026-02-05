import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS configuration
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://10.34.0.193:5173',
    ],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`🚀 CODEX API corriendo en http://localhost:${PORT}`);
  console.log(`🐘 Usando PostgreSQL con TypeORM`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/me`);
  console.log(`   - GET  /api/exercises`);
  console.log(`   - POST /api/exercises/validate`);
  console.log(`   - GET  /api/badges`);
  console.log(`   - GET  /api/badges/user`);
  console.log(`   - GET  /api/badges/progress`);
}
bootstrap();
