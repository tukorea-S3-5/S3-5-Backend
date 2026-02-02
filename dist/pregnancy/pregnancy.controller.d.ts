import { PregnancyService } from './pregnancy.service';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
export declare class PregnancyController {
    private readonly pregnancyService;
    constructor(pregnancyService: PregnancyService);
    create(dto: CreatePregnancyDto): Promise<import("../entities/pregnancy-info.entity").PregnancyInfo>;
    getLatestPregnancy(userId: string): Promise<import("../entities/pregnancy-info.entity").PregnancyInfo | null>;
    updateLatest(userId: string, dto: UpdatePregnancyDto): Promise<import("../entities/pregnancy-info.entity").PregnancyInfo | null>;
}
