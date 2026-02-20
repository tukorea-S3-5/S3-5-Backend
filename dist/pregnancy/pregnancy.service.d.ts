import { Repository } from 'typeorm';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { PregnancyWeightLog } from '../entities/pregnancy-weight-log.entity';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
import { User } from 'src/user/user.entity';
export declare class PregnancyService {
    private readonly pregnancyRepository;
    private readonly weightRepository;
    private readonly userRepository;
    constructor(pregnancyRepository: Repository<PregnancyInfo>, weightRepository: Repository<PregnancyWeightLog>, userRepository: Repository<User>);
    private calculateAge;
    private calculateMaxBpm;
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
    } | null>;
    updateLatestByUser(userId: string, dto: UpdatePregnancyDto): Promise<PregnancyInfo | null>;
}
