import { PregnancyInfo } from '../../entities/pregnancy-info.entity';
import { RuleResult } from '../types/rule-result.type';

/**
 * 임신 주차 기반 Rule
 * - 임신 단계에 따라 운동 제한 여부 판단
 */
export function trimesterRule(
  pregnancy: PregnancyInfo,
): RuleResult | null {
  // 임신 1기
  if (pregnancy.trimester === 1) {
    return {
      decision: 'LIMIT',
      reason: '임신 1기에는 저강도 운동만 권장됩니다.',
    };
  }

  // 임신 3기
  if (pregnancy.trimester === 3) {
    return {
      decision: 'LIMIT',
      reason: '임신 후기에는 균형을 요구하는 운동을 피해야 합니다.',
    };
  }

  // 해당 없으면 통과
  return null;
}