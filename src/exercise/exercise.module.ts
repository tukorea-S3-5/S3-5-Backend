import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseSession,
      ExerciseRecord,
    ]),
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}