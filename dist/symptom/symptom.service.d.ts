import { Repository } from 'typeorm';
import { SymptomLog } from '../entities/symptom-log.entity';
export declare class SymptomService {
    private readonly symptomRepository;
    constructor(symptomRepository: Repository<SymptomLog>);
    createSymptoms(userId: string, symptoms: string[]): Promise<SymptomLog>;
    getHistory(userId: string): Promise<SymptomLog[]>;
    getLatestSymptoms(userId: string): Promise<string[]>;
}
