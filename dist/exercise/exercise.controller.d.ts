import { ExerciseService } from './exercise.service';
import { EndExerciseRecordDto } from './dto/end-exercise-record.dto';
export declare class ExerciseController {
    private readonly exerciseService;
    constructor(exerciseService: ExerciseService);
    startSession(req: any, body: {
        type?: 'recommend' | 'caution';
    }): Promise<{
        session: import("../entities/exercise-session.entity").ExerciseSession;
        records: import("../entities/exercise-record.entity").ExerciseRecord[];
    }>;
    startSelectedRecords(req: any, body: {
        exercise_ids: number[];
    }): Promise<{
        session: import("../entities/exercise-session.entity").ExerciseSession;
        records: import("../entities/exercise-record.entity").ExerciseRecord[];
    }>;
    endRecord(dto: EndExerciseRecordDto): Promise<import("../entities/exercise-record.entity").ExerciseRecord>;
    pauseRecord(body: {
        record_id: number;
    }): Promise<import("../entities/exercise-record.entity").ExerciseRecord>;
    resumeRecord(body: {
        record_id: number;
    }): Promise<import("../entities/exercise-record.entity").ExerciseRecord>;
    abortSession(body: {
        session_id: number;
        heart_rates?: number[];
    }): Promise<import("../entities/exercise-session.entity").ExerciseSession>;
    getHistory(req: any): Promise<{
        sessions: import("../entities/exercise-session.entity").ExerciseSession[];
    }>;
    getCurrentSession(req: any): Promise<import("../entities/exercise-session.entity").ExerciseSession | {
        message: string;
    }>;
}
