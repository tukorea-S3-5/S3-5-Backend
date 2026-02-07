import { ExerciseRecord } from './exercise-record.entity';
export declare class ExerciseSession {
    session_id: number;
    user_id: string;
    status: string;
    started_at: Date;
    ended_at: Date | null;
    records: ExerciseRecord[];
}
