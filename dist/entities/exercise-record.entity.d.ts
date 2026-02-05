import { ExerciseSession } from './exercise-session.entity';
export declare class ExerciseRecord {
    record_id: number;
    session_id: number;
    session: ExerciseSession;
    exercise_name: string;
    duration: number;
    intensity: string | null;
}
