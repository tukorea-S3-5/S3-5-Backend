import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { RecommendService } from '../recommend/recommend.service';
type SessionStartType = 'recommend' | 'caution';
export declare class ExerciseService {
    private readonly sessionRepository;
    private readonly recordRepository;
    private readonly recommendService;
    constructor(sessionRepository: Repository<ExerciseSession>, recordRepository: Repository<ExerciseRecord>, recommendService: RecommendService);
    startRecommendedSession(userId: string, type?: SessionStartType): Promise<{
        session: ExerciseSession;
        records: ExerciseRecord[];
    }>;
    startSelectedRecords(userId: string, exerciseIds: number[]): Promise<{
        session: ExerciseSession;
        records: ExerciseRecord[];
    }>;
    endRecord(recordId: number, heartRates?: number[]): Promise<ExerciseRecord>;
    pauseRecord(recordId: number): Promise<ExerciseRecord>;
    startOrResumeRecord(recordId: number): Promise<ExerciseRecord>;
    abortSession(sessionId: number, heartRates?: number[]): Promise<ExerciseSession>;
    getCurrentSession(userId: string): Promise<ExerciseSession | {
        message: string;
    }>;
    getHistory(userId: string): Promise<{
        sessions: ExerciseSession[];
    }>;
    private calculateHeartRateSummary;
}
export {};
