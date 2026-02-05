import { User } from '../users/user.entity';
import { ExerciseRecord } from './exercise-record.entity';
export declare class ExerciseSession {
    session_id: number;
    user_id: string;
    user: User;
    started_at: Date;
    ended_at: Date | null;
    avg_hr: number | null;
    max_hr: number | null;
    status: string;
    records: ExerciseRecord[];
    created_at: Date;
    updated_at: Date;
}
