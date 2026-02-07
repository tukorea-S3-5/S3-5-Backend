import { PregnancyWeightService } from './pregnancy-weight.service';
import { CreateWeightLogDto } from './dto/create-weight-log.dto';
import { UpdateWeightLogDto } from './dto/update-weight-log.dto';
export declare class PregnancyWeightController {
    private readonly pregnancyWeightService;
    constructor(pregnancyWeightService: PregnancyWeightService);
    addWeight(req: any, dto: CreateWeightLogDto): Promise<import("../entities/pregnancy-weight-log.entity").PregnancyWeightLog>;
    getMyWeightLogs(req: any): Promise<{
        summary: {
            start_weight: number;
            current_weight: number;
            total_gain: number;
        };
        logs: import("../entities/pregnancy-weight-log.entity").PregnancyWeightLog[];
    }>;
    updateWeight(req: any, week: string, dto: UpdateWeightLogDto): Promise<import("../entities/pregnancy-weight-log.entity").PregnancyWeightLog>;
}
