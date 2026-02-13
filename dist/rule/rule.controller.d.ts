import { RuleService } from './rule.service';
export declare class RuleController {
    private readonly ruleService;
    constructor(ruleService: RuleService);
    testRule(body: {
        trimester: number;
        symptoms: string[];
    }): Promise<import("../entities/exercise.entity").Exercise[]>;
}
