import { ExerciseSession } from './exercise-session.entity';
export declare class ExerciseRecord {
    record_id: number;
    session_id: number | null;
    session: ExerciseSession | null;
    user_id: string;
    exercise_id: number;
    exercise_name: string;
    order_index: number;
    started_at: Date | null;
    ended_at: Date | null;
    duration: number | null;
    avg_heart_rate: number | null;
    max_heart_rate: number | null;
}
