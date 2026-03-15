import { Repository } from 'typeorm';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { PregnancyCondition } from '../entities/pregnancy-condition.entity';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
import { User } from '../user/user.entity';
export declare class PregnancyService {
    private readonly pregnancyRepository;
    private readonly weightRepository;
    private readonly pregnancyConditionRepository;
    private readonly userRepository;
    constructor(pregnancyRepository: Repository<PregnancyInfo>, weightRepository: Repository<PregnancyWeightLog>, pregnancyConditionRepository: Repository<PregnancyCondition>, userRepository: Repository<User>);
    private readonly GUIDELINES;
    private calculateAge;
    private calculateMaxBpm;
    private calculateWeek;
    private calculateTrimester;
    create(userId: string, dto: CreatePregnancyDto): Promise<PregnancyInfo>;
    findLatestByUser(userId: string): Promise<{
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
    updateLatestByUser(userId: string, dto: UpdatePregnancyDto): Promise<PregnancyInfo | null>;
    getGuideline(userId: string): Promise<{
        week: number;
        trimester: number;
        title: any;
        guidelines: any;
    }>;
    private getCommonSymptoms;
    private getDefaultTip;
    private calculateRecommendedWeight;
    private calculateGuidelineWeight;
    getWeeklyHealth(userId: string): Promise<{
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
    calculateWeightTrend(userId: string): Promise<{
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
