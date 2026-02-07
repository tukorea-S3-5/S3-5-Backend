import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';

/**
 * Rule Module
 * - 의학 기반 Rule Engine을 담당하는 모듈
 * - Exercise, Recommendation 등에서 공통으로 사용
 */
@Module({
  providers: [RuleService],
  exports: [RuleService], // 다른 모듈에서 RuleService 사용 가능
})
export class RuleModule {}