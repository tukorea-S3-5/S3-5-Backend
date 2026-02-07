/**
 * Rule Engine 판단 결과 상태
 *
 * ALLOW : 문제 없음, 운동 허용
 * LIMIT : 운동 가능하지만 제한 필요 (강도/시간/종류 조정)
 * BLOCK : 운동 불가 (의학적 위험)
 */
export type RuleDecision = 'ALLOW' | 'LIMIT' | 'BLOCK';

/**
 * Rule Engine 판단 결과 구조
 *
 * decision : 판단 결과 (허용 / 제한 / 차단)
 * reason   : 판단 사유 (UI, 로그, 리포트, LLM 입력용)
 */
export interface RuleResult {
  decision: RuleDecision;
  reason: string;
}