import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
export declare class ExerciseService {
    private readonly sessionRepository;
    private readonly recordRepository;
    constructor(sessionRepository: Repository<ExerciseSession>, recordRepository: Repository<ExerciseRecord>);
    startSession(userId: string): Promise<ExerciseSession>;
    endSession(userId: string): Promise<ExerciseSession>;
    startRecord(userId: string, exerciseName: string, orderIndex: number): Promise<ExerciseRecord>;
    endRecord(recordId: number): Promise<ExerciseRecord>;
    getHistory(userId: string): Promise<{
        sessions: ExerciseSession[];
        single_records: ExerciseRecord[];
    }>;
}
