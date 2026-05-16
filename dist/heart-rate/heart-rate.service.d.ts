import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { HeartRateRecord } from './heart-rate-record.entity';
import { HealthBaseline } from '../entities/health-baseline.entity';
export declare class HeartRateService {
    private readonly userRepository;
    private readonly heartRateRepository;
    private readonly baselineRepository;
    constructor(userRepository: Repository<User>, heartRateRepository: Repository<HeartRateRecord>, baselineRepository: Repository<HealthBaseline>);
    updateRestingHeartRate(userId: string, restingHeartRate: number): Promise<{
        message: string;
        restingHeartRate: number;
    }>;
    checkHeartRate(userId: string, currentHeartRate: number): Promise<{
        status: "normal" | "warning" | "danger";
        maxHR: number;
        restingHR: number | null;
    }>;
    getWeeklyHeartRate(userId: string): Promise<{
        average: null;
        max: null;
        count: number;
        records: never[];
    } | {
        average: number;
        max: number;
        count: number;
        records: {
            bpm: number;
            created_at: null;
        }[];
    }>;
    private calculateAge;
}
