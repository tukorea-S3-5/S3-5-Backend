import { Exercise } from './exercise.entity';
export declare class ExerciseStep {
    step_id: number;
    exercise_id: number;
    step_order: number;
    title: string;
    description: string;
    exercise: Exercise;
}
