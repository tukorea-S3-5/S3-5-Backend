import { Repository } from 'typeorm';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { PregnancyCondition } from '../entities/pregnancy-condition.entity';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
import { User } from 'src/user/user.entity';
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
    private calculateRecommendedWeight;
    private getCommonSymptoms;
    private getDefaultTip;
    getWeeklyHealth(userId: string): Promise<{
        week: number;
        recommended_weight_gain: string;
        common_symptoms: string[];
        today_tip: string;
    }>;
    private getExpectedWeeklyGain;
    calculateWeightTrend(userId: string): Promise<{
        slope: number;
        status: string;
        based_on?: undefined;
        expected_weekly_gain?: undefined;
    } | {
        based_on: string;
        slope: number;
        expected_weekly_gain: number;
        status: string;
    }>;
}
