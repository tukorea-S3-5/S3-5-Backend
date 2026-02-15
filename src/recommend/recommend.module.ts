import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RecommendController } from './recommend.controller';
import { RecommendService } from './recommend.service';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap } from '../entities/exercise-tag-map.entity';
import { SymptomLog } from '../entities/symptom-log.entity';
import { ExerciseStep } from '../entities/exercise-step.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PregnancyInfo,
      Exercise,
      ExerciseTagMap,
      SymptomLog,
      ExerciseStep,
    ]),
  ],
  controllers: [RecommendController],
  providers: [RecommendService],
  exports: [RecommendService],
})
export class RecommendModule {}