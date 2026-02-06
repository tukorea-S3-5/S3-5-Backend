import { PregnancyService } from './pregnancy.service';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
export declare class PregnancyController {
    private readonly pregnancyService;
    constructor(pregnancyService: PregnancyService);
    create(req: any, dto: CreatePregnancyDto): Promise<import("../entities/pregnancy-info.entity").PregnancyInfo>;
    findMyLatest(req: any): Promise<import("../entities/pregnancy-info.entity").PregnancyInfo>;
    updateMyLatest(req: any, dto: UpdatePregnancyDto): Promise<import("../entities/pregnancy-info.entity").PregnancyInfo | null>;
}
