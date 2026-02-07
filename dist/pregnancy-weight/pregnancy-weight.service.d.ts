import { Repository } from 'typeorm';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { CreateWeightLogDto } from './dto/create-weight-log.dto';
import { UpdateWeightLogDto } from './dto/update-weight-log.dto';
export declare class PregnancyWeightService {
    private readonly pregnancyRepository;
    private readonly weightRepository;
    constructor(pregnancyRepository: Repository<PregnancyInfo>, weightRepository: Repository<PregnancyWeightLog>);
    addWeight(userId: string, dto: CreateWeightLogDto): Promise<PregnancyWeightLog>;
    updateWeight(userId: string, week: number, dto: UpdateWeightLogDto): Promise<PregnancyWeightLog>;
    getMyWeightLogs(userId: string): Promise<{
        summary: {
            start_weight: number;
            current_weight: number;
            total_gain: number;
        };
        logs: PregnancyWeightLog[];
    }>;
    private getLatestPregnancy;
}
