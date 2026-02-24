import { ConditionType } from 'src/common/enums/condition.enum';
import { FitnessLevel } from 'src/common/enums/fitness.enum';
export declare class CreatePregnancyDto {
    last_menstrual_period: string;
    height: number;
    pre_weight: number;
    is_multiple?: boolean;
    fitness_level: FitnessLevel;
    conditions?: ConditionType[];
}
