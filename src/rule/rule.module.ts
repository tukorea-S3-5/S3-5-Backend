import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RuleService } from './rule.service';
import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap } from '../entities/exercise-tag-map.entity';
import { RuleController } from './rule.controller';

/**
 * Rule Module
 * - 의학 기반 Rule Engine을 담당하는 모듈
 * - Exercise, Recommendation 등에서 공통으로 사용
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Exercise,
      ExerciseTagMap,
    ]),
  ],
  providers: [RuleService],
  controllers: [RuleController],
  exports: [RuleService],
})
export class RuleModule {}