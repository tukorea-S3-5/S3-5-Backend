import { Exercise } from './exercise.entity';
import { SymptomType } from 'src/common/enums/symptom.enum';
export declare class ExerciseTagMap {
    map_id: number;
    exercise_id: number;
    symptom_name: SymptomType;
    effect_type: 'POSITIVE' | 'NEGATIVE';
    exercise: Exercise;
}
