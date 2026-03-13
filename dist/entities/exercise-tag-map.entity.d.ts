import { Exercise } from './exercise.entity';
import { SymptomType } from '../common/enums/symptom.enum';
export declare enum EffectType {
    POSITIVE_STRONG = "POSITIVE_STRONG",
    POSITIVE_WEAK = "POSITIVE_WEAK",
    NEGATIVE = "NEGATIVE"
}
export declare class ExerciseTagMap {
    map_id: number;
    exercise_id: number;
    symptom_name: SymptomType;
    effect_type: EffectType;
    exercise: Exercise;
}
