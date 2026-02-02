import { User } from '../users/user.entity';
export declare class PregnancyInfo {
    pregnancy_id: number;
    user_id: string;
    is_multiple: boolean | null;
    user: User;
    trimester: number;
    week: number;
    height: number;
    pre_weight: number;
    current_weight: number;
    bmi: number;
    pregnancy_start_date: Date;
    due_date: Date;
    updated_at: Date;
}
