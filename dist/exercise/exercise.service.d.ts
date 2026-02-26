import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { RecommendService } from '../recommend/recommend.service';
export declare class ExerciseService {
    private readonly sessionRepository;
    private readonly recordRepository;
    private readonly recommendService;
    constructor(sessionRepository: Repository<ExerciseSession>, recordRepository: Repository<ExerciseRecord>, recommendService: RecommendService);
    startRecommendedSession(userId: string): Promise<{
        session: ExerciseSession;
        records: ExerciseRecord[];
    }>;
    startSelectedRecords(userId: string, exerciseIds: number[]): Promise<{
        session: ExerciseSession;
        records: ExerciseRecord[];
    }>;
    endRecord(recordId: number): Promise<ExerciseRecord>;
    pauseRecord(recordId: number): Promise<ExerciseRecord>;
    resumeRecord(recordId: number): Promise<ExerciseRecord>;
    abortSession(sessionId: number): Promise<ExerciseSession>;
    getCurrentSession(userId: string): Promise<{
        message: string;
    } | {
        total_duration_formatted: string;
        session_id: number;
        user_id: string;
        status: "ONGOING" | "COMPLETED" | "ABORTED";
        started_at: Date;
        ended_at: Date | null;
        total_duration: number;
        records: ExerciseRecord[];
        message?: undefined;
    }>;
    getHistory(userId: string): Promise<{
        sessions: {
            total_duration_formatted: string;
            session_id: number;
            user_id: string;
            status: "ONGOING" | "COMPLETED" | "ABORTED";
            started_at: Date;
            ended_at: Date | null;
            total_duration: number;
            records: ExerciseRecord[];
        }[];
    }>;
    private formatDuration;
}
