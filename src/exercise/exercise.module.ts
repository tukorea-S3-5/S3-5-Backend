import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { ExerciseService } from './exercise.service';
import { ExerciseController } from './exercise.controller';
import { RecommendModule } from '../recommend/recommend.module';
import { AiModule } from '../ai/ai.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseSession,
      ExerciseRecord,
    ]),
    RecommendModule,
    AiModule, 
  ],
  controllers: [ExerciseController],
  providers: [ExerciseService],
})
export class ExerciseModule {}