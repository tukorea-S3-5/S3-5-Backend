import { Repository } from 'typeorm';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
export declare class PregnancyService {
    private readonly pregnancyRepository;
    constructor(pregnancyRepository: Repository<PregnancyInfo>);
    create(dto: CreatePregnancyDto): Promise<PregnancyInfo>;
    findLatestByUser(userId: string): Promise<PregnancyInfo | null>;
    updateLatestByUser(userId: string, dto: UpdatePregnancyDto): Promise<PregnancyInfo | null>;
}
