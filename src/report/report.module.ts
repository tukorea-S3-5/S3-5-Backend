import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExerciseSession,
      ExerciseRecord,
    ]),
  ],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}