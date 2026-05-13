import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseSession,
      ExerciseRecord,
    ]),
    AiModule,
  ],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}