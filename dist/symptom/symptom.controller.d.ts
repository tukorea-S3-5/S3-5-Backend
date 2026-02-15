import { SymptomService } from './symptom.service';
import { CreateSymptomDto } from './dto/create-symptom.dto';
export declare class SymptomController {
    private readonly symptomService;
    constructor(symptomService: SymptomService);
    create(req: any, dto: CreateSymptomDto): Promise<import("../entities/symptom-log.entity").SymptomLog>;
    history(req: any): Promise<import("../entities/symptom-log.entity").SymptomLog[]>;
}
