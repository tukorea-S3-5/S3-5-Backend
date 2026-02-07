import { RuleResult } from '../types/rule-result.type';

/**
 * 운동 종류 기반 Rule
 * - 위험한 운동은 차단
 */
export function exerciseTypeRule(
  exerciseType: string,
): RuleResult | null {
  const blockedExercises = ['점프', '복근운동', '고강도 인터벌'];

  if (blockedExercises.includes(exerciseType)) {
    return {
      decision: 'BLOCK',
      reason: '해당 운동은 임신 중 위험할 수 있습니다.',
    };
  }

  return null;
}