import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://10.34.0.193:5173',
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger Configuration - Solo en desarrollo
  if (env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('CodexAI Learning Platform API')
      .setDescription(
        'API para módulos, lecciones, ejercicios y progreso de usuarios',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'jwt',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    console.log(
      `📚 Documentación Swagger disponible en: http://localhost:${env.PORT}/docs`,
    );
  }

  const PORT = env.PORT;

  await app.listen(PORT);

  console.log(`🚀 CODEX API corriendo en http://localhost:${PORT}`);
  console.log(` Usando PostgreSQL con TypeORM`);
}
bootstrap();
