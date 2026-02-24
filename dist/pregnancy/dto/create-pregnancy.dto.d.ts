import { ConditionType } from 'src/common/enums/condition.enum';
export declare class CreatePregnancyDto {
    last_menstrual_period: string;
    height: number;
    pre_weight: number;
    is_multiple?: boolean;
    fitness_level: 'ACTIVE' | 'SEDENTARY';
    conditions?: ConditionType[];
}
