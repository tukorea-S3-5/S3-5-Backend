import { Injectable } from '@nestjs/common';
import { RuleResult } from './types/rule-result.type';

/**
 * Rule Service
 * - 모든 의학 기반 운동 판단 로직의 진입점
 * - ExerciseService, RecommendationService 등에서 호출됨
 */
@Injectable()
export class RuleService {

  /**
   * 운동 가능 여부 판단
   *
   * week         : 임신 주차
   * isMultiple   : 다태아 여부
   * exerciseType : 운동 종류 (선택)
   */
  evaluateExercise(params: {
    week: number;
    isMultiple: boolean | null;
    exerciseType?: string;
  }): RuleResult {

    /**
     * 규칙 1
     * 임신 초기(12주 이하) + 고강도 운동(HIIT)은 금지
     */
    if (params.week <= 12 && params.exerciseType === 'HIIT') {
      return {
        decision: 'BLOCK',
        reason: '임신 초기에는 고강도 운동이 제한됩니다.',
      };
    }

    /**
     * 규칙 2
     * 다태아 임신일 경우 운동은 가능하지만 강도 제한
     */
    if (params.isMultiple === true) {
      return {
        decision: 'LIMIT',
        reason: '다태아 임신의 경우 운동 강도를 낮추는 것이 권장됩니다.',
      };
    }

    /**
     * 기본 규칙
     * 특별한 제한 조건이 없으면 운동 허용
     */
    return {
      decision: 'ALLOW',
      reason: '운동 가능합니다.',
    };
  }
}