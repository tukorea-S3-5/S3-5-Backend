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
    getHistory(userId: string): Promise<{
        sessions: ExerciseSession[];
        single_records: ExerciseRecord[];
    }>;
}
