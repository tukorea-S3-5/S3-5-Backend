import { ExerciseRecord } from './exercise-record.entity';
export declare class ExerciseSession {
    session_id: number;
    user_id: string;
    status: 'ONGOING' | 'COMPLETED' | 'ABORTED';
    started_at: Date;
    ended_at: Date | null;
    total_duration: number;
    records: ExerciseRecord[];
}
