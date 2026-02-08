import { PregnancyInfo } from '../../entities/pregnancy-info.entity';
import { RuleResult } from '../types/rule-result.type';

/**
 * 다태아 임신 Rule
 * - 쌍둥이 이상인 경우 운동 제한
 */
export function multiplePregnancyRule(
  pregnancy: PregnancyInfo,
): RuleResult | null {
  if (pregnancy.is_multiple === true) {
    return {
      decision: 'LIMIT',
      reason: '다태아 임신은 저강도 운동만 허용됩니다.',
    };
  }

  return null;
}