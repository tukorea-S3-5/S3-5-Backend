import { RuleResult } from './types/rule-result.type';
export declare class RuleService {
    evaluateExercise(params: {
        week: number;
        isMultiple: boolean | null;
        exerciseType?: string;
    }): RuleResult;
}
