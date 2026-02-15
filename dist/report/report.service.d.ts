import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
export declare class ReportService {
    private readonly sessionRepository;
    private readonly recordRepository;
    constructor(sessionRepository: Repository<ExerciseSession>, recordRepository: Repository<ExerciseRecord>);
    generateSessionReport(userId: string, sessionId: number): Promise<{
        total_duration: number;
        avg_heart_rate: null;
        max_heart_rate: null;
        exercises: {
            exercise_name: string;
            duration: number | null;
            avg_heart_rate: null;
            max_heart_rate: null;
        }[];
    }>;
}
