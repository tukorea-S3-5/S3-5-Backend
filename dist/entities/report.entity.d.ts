import { ExerciseSession } from '../entities/exercise-session.entity';
export declare class Report {
    report_id: number;
    user_id: string;
    session_id: number | null;
    session: ExerciseSession | null;
    type: 'SESSION' | 'WEEKLY' | 'RISK';
    summary: string;
    created_at: Date;
}
