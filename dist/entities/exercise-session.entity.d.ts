import { ExerciseRecord } from './exercise-record.entity';
export declare class ExerciseSession {
    session_id: number;
    user_id: string;
    exercise_type: string | null;
    started_at: Date;
    ended_at: Date | null;
    status: string;
    records: ExerciseRecord[];
    created_at: Date;
}
