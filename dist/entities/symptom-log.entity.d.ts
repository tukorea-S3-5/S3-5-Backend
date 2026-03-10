import { SymptomType } from '../common/enums/symptom.enum';
export declare class SymptomLog {
    symptom_id: number;
    user_id: string;
    symptoms: SymptomType[];
    created_at: Date;
}
