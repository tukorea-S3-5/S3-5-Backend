export type RuleDecision = 'ALLOW' | 'LIMIT' | 'BLOCK';
export interface RuleResult {
    decision: RuleDecision;
    reason: string;
}
