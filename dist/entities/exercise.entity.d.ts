import { ExerciseTagMap } from './exercise-tag-map.entity';
import { ExerciseStep } from './exercise-step.entity';
import { ExerciseCategory } from 'src/common/enums/exercise-category.enum';
export declare class Exercise {
    exercise_id: number;
    exercise_name: string;
    category_name: ExerciseCategory;
    intensity: string | null;
    position_type: string | null;
    fall_risk: boolean;
    allowed_trimesters: number[];
    description: string | null;
    difficulty_label: string | null;
    video_url: string | null;
    steps: ExerciseStep[];
    tagMaps: ExerciseTagMap[];
}
