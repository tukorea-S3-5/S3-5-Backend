import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { Exercise } from '../entities/exercise.entity';

import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { ExerciseStep } from '../entities/exercise-step.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseSession,
      ExerciseStep,
      ExerciseRecord,
      Exercise,
    ]),
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}