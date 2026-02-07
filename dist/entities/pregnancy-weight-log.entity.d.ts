import { PregnancyInfo } from './pregnancy-info.entity';
export declare class PregnancyWeightLog {
    weight_log_id: number;
    pregnancy_id: number;
    week: number;
    weight: number;
    pregnancy: PregnancyInfo;
    created_at: Date;
}
