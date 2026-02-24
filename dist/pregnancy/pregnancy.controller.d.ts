import { PregnancyService } from './pregnancy.service';
import { CreatePregnancyDto } from './dto/create-pregnancy.dto';
import { UpdatePregnancyDto } from './dto/update-pregnancy.dto';
export declare class PregnancyController {
    private readonly pregnancyService;
    constructor(pregnancyService: PregnancyService);
    create(req: any, dto: CreatePregnancyDto): Promise<import("../entities/pregnancy-info.entity").PregnancyInfo>;
    findMyLatest(req: any): Promise<{
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
    updateMyLatest(req: any, dto: UpdatePregnancyDto): Promise<import("../entities/pregnancy-info.entity").PregnancyInfo | null>;
}
