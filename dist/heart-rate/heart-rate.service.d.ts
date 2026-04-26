import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
export declare class HeartRateService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    updateRestingHeartRate(userId: string, restingHeartRate: number): Promise<{
        message: string;
        restingHeartRate: number;
    }>;
    checkHeartRate(userId: string, currentHeartRate: number): Promise<{
        status: "normal" | "warning" | "danger";
        maxHR: number;
        restingHR: number | null;
    }>;
    private calculateAge;
}
