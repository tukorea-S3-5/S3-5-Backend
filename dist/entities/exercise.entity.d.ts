import { ExerciseTagMap } from './exercise-tag-map.entity';
import { ExerciseStep } from './exercise-step.entity';
export declare class Exercise {
    exercise_id: number;
    exercise_name: string;
    category_name: string;
    intensity: string | null;
    position_type: string | null;
    fall_risk: boolean;
    allowed_trimesters: number[];
    description: string | null;
    difficulty_label: string | null;
    steps: ExerciseStep[];
    tagMaps: ExerciseTagMap[];
}
