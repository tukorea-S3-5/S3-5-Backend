import { User } from '../user/user.entity';
import { PregnancyCondition } from './pregnancy-condition.entity';
export declare class PregnancyInfo {
    pregnancy_id: number;
    user_id: string;
    user: User;
    last_menstrual_period: Date;
    pregnancy_start_date: Date;
    week: number;
    trimester: number;
    due_date: Date;
    is_multiple: boolean | null;
    height: number;
    pre_weight: number;
    bmi: number;
    fitness_level: 'ACTIVE' | 'SEDENTARY';
    max_allowed_bpm: number;
    conditions: PregnancyCondition[];
    created_at: Date;
    updated_at: Date;
}
