import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PregnancyInfo } from './pregnancy-info.entity';
import { HealthBaseline } from './health-baseline.entity';
import { ExerciseSession } from './exercise-session.entity';
import { ExerciseRecord } from './exercise-record.entity';
import { SymptomLog } from './symptom-log.entity';
import { HeartRateLog } from './heart-rate-log.entity';
import { Report } from './report.entity';
import { Recommendation } from './recommendation.entity';
import { Exercise } from './exercise.entity';
import { ExerciseTagMap } from './exercise-tag-map.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PregnancyInfo,
      HealthBaseline,
      Exercise,
      ExerciseTagMap,
      ExerciseSession,
      ExerciseRecord,
      SymptomLog,
      HeartRateLog,
      Report,
      Recommendation,
    ]),
  ],
})
export class EntitiesModule {}
