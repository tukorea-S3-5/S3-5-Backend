import { PregnancyInfo } from '../../entities/pregnancy-info.entity';
import { RuleResult } from '../types/rule-result.type';

/**
 * LMP 기준 임신 주차 계산
 * - DB에 저장하지 않고 매번 계산
 */
function calculateWeek(lmp: Date): number {
  const today = new Date();

  const diffDays =
    (today.getTime() - lmp.getTime()) /
    (1000 * 60 * 60 * 24);

  return Math.floor(diffDays / 7);
}

/**
 * 임신 분기 계산
 * 1기: 1~13주
 * 2기: 14~26주
 * 3기: 27주 이상
 */
function calculateTrimester(lmp: Date): number {
  const week = calculateWeek(lmp);
  return Math.ceil(week / 13);
}

/**
 * 임신 주차 기반 Rule
 *
 * 설계 변경:
 * - trimester는 DB에서 읽지 않는다
 * - last_menstrual_period(LMP) 기준으로 계산
 */
export function trimesterRule(
  pregnancy: PregnancyInfo,
): RuleResult | null {

  const trimester =
    calculateTrimester(
      pregnancy.last_menstrual_period,
    );

  // 임신 1기
  if (trimester === 1) {
    return {
      decision: 'LIMIT',
      reason: '임신 1기에는 저강도 운동만 권장됩니다.',
    };
  }

  // 임신 3기
  if (trimester === 3) {
    return {
      decision: 'LIMIT',
      reason: '임신 후기에는 균형을 요구하는 운동을 피해야 합니다.',
    };
  }

  // 해당 없음 → 제한 없음
  return null;
}