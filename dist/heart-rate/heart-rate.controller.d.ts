import { HeartRateService } from './heart-rate.service';
import { UpdateRestingHrDto } from './dto/update-resting-hr.dto';
import { CheckHeartRateDto } from './dto/check-heart-rate.dto';
export declare class HeartRateController {
    private readonly heartRateService;
    constructor(heartRateService: HeartRateService);
    updateResting(req: any, dto: UpdateRestingHrDto): Promise<{
        message: string;
        restingHeartRate: number;
    }>;
    check(req: any, dto: CheckHeartRateDto): Promise<{
        status: "normal" | "warning" | "danger";
        maxHR: number;
        restingHR: number | null;
    }>;
}
