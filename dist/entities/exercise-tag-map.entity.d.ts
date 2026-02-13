import { Exercise } from './exercise.entity';
export declare class ExerciseTagMap {
    map_id: number;
    exercise_id: number;
    symptom_name: string;
    effect_type: 'POSITIVE' | 'NEGATIVE';
    exercise: Exercise;
}
