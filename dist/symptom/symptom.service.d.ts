import { Repository } from 'typeorm';
import { SymptomLog } from '../entities/symptom-log.entity';
import { SymptomType } from 'src/common/enums/symptom.enum';
export declare class SymptomService {
    private readonly symptomRepository;
    constructor(symptomRepository: Repository<SymptomLog>);
    createSymptoms(userId: string, symptoms?: SymptomType[]): Promise<SymptomLog>;
    getHistory(userId: string): Promise<SymptomLog[]>;
    getLatestSymptoms(userId: string): Promise<SymptomType[]>;
}
