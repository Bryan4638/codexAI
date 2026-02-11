import { Module as NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './exercises.controller';
import { ModulesController } from './modules.controller';
import { LessonsController } from './lessons.controller';
import { User } from '../auth/entities/user.entity';
import { UserProgress } from '../auth/entities/user-progress.entity';
import { UserBadge } from '../auth/entities/user-badge.entity';
import { Module } from './entities/module.entity';
import { Lesson } from './entities/lesson.entity';
import { Exercise } from './entities/exercise.entity';
import { GetAllExercisesUseCase } from './use-cases/get-all-exercises.use-case';
import { GetExerciseByIdUseCase } from './use-cases/get-exercise-by-id.use-case';
import { ValidateExerciseUseCase } from './use-cases/validate-exercise.use-case';
import { CheckAndUnlockBadgesUseCase } from './use-cases/check-and-unlock-badges.use-case';
import { AuthModule } from '../auth/auth.module';
import { CreateModuleUseCase } from './use-cases/modules/create-module.use-case';
import { GetAllModulesUseCase } from './use-cases/modules/get-all-modules.use-case';
import { GetModuleByIdUseCase } from './use-cases/modules/get-module-by-id.use-case';
import { UpdateModuleUseCase } from './use-cases/modules/update-module.use-case';
import { DeleteModuleUseCase } from './use-cases/modules/delete-module.use-case';
import { CreateLessonUseCase } from './use-cases/lessons/create-lesson.use-case';
import { GetAllLessonsUseCase } from './use-cases/lessons/get-all-lessons.use-case';
import { GetLessonByIdUseCase } from './use-cases/lessons/get-lesson-by-id.use-case';
import { UpdateLessonUseCase } from './use-cases/lessons/update-lesson.use-case';
import { DeleteLessonUseCase } from './use-cases/lessons/delete-lesson.use-case';

@NestModule({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserProgress,
      UserBadge,
      Module,
      Lesson,
      Exercise,
    ]),
    AuthModule,
  ],
  controllers: [ExercisesController, ModulesController, LessonsController],
  providers: [
    GetAllExercisesUseCase,
    GetExerciseByIdUseCase,
    ValidateExerciseUseCase,
    CheckAndUnlockBadgesUseCase,
    // Module Use Cases
    CreateModuleUseCase,
    GetAllModulesUseCase,
    GetModuleByIdUseCase,
    UpdateModuleUseCase,
    DeleteModuleUseCase,
    // Lesson Use Cases
    CreateLessonUseCase,
    GetAllLessonsUseCase,
    GetLessonByIdUseCase,
    UpdateLessonUseCase,
    DeleteLessonUseCase,
  ],
  exports: [CheckAndUnlockBadgesUseCase],
})
export class ExercisesModule {}
