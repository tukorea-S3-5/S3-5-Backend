import { PregnancyService } from './pregnancy.service';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
export declare class PregnancyController {
    private readonly pregnancyService;
    constructor(pregnancyService: PregnancyService);
    create(req: any, dto: CreatePregnancyDto): Promise<import("../entities/pregnancy-info.entity").PregnancyInfo>;
    findMyLatest(req: any): Promise<{
        pregnancy_id: number;
        week: number;
        trimester: number;
        pre_weight: number;
        current_weight: number;
        total_gain: number;
        due_date: Date;
        is_multiple: boolean | null;
        bmi: number;
        max_allowed_bpm: number;
        conditions: import("../common/enums/condition.enum").ConditionType[];
    } | null>;
    updateMyLatest(req: any, dto: UpdatePregnancyDto): Promise<import("../entities/pregnancy-info.entity").PregnancyInfo | null>;
    getGuideline(req: any): Promise<{
        week: number;
        trimester: number;
        title: any;
        guidelines: any;
    }>;
    getWeeklyHealth(req: any): Promise<{
        week: number;
        recommended_weight_gain: string;
        guideline_range_today: {
            min: number;
            max: number;
        };
        current_weight_status: string;
        common_symptoms: string[];
        today_tip: string;
    }>;
    getWeightTrend(req: any): Promise<{
        current_position: {
            range: {
                min: number;
                max: number;
            };
            status: string;
        };
        slope: number;
        status: string;
        slope_status?: undefined;
        based_on?: undefined;
        recommended_weekly_range?: undefined;
    } | {
        current_position: {
            range: {
                min: number;
                max: number;
            };
            status: string;
        };
        slope: number;
        slope_status: string;
        status?: undefined;
        based_on?: undefined;
        recommended_weekly_range?: undefined;
    } | {
        based_on: string;
        current_position: {
            range: {
                min: number;
                max: number;
            };
            status: string;
        };
        slope: number;
        recommended_weekly_range: {
            min: number;
            max: number;
        };
        slope_status: string;
        status?: undefined;
    }>;
}
