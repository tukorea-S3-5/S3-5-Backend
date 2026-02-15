import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { RecommendModule } from '../recommend/recommend.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseSession,
      ExerciseRecord,
    ]),
    RecommendModule,
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}