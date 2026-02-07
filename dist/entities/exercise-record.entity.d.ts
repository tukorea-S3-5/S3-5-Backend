import { ExerciseSession } from './exercise-session.entity';
export declare class ExerciseRecord {
    record_id: number;
    session_id: number | null;
    session: ExerciseSession | null;
    user_id: string;
    exercise_name: string;
    order_index: number;
    started_at: Date;
    ended_at: Date | null;
    duration: number | null;
}
