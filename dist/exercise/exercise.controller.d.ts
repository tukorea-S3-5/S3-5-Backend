import { ExerciseService } from './exercise.service';
export declare class ExerciseController {
    private readonly exerciseService;
    constructor(exerciseService: ExerciseService);
    startSession(req: any): Promise<{
        session: import("../entities/exercise-session.entity").ExerciseSession;
        records: import("../entities/exercise-record.entity").ExerciseRecord[];
    }>;
    startSelectedRecords(req: any, body: {
        exercise_ids: number[];
    }): Promise<{
        session: import("../entities/exercise-session.entity").ExerciseSession;
        records: import("../entities/exercise-record.entity").ExerciseRecord[];
    }>;
    endRecord(body: {
        record_id: number;
    }): Promise<import("../entities/exercise-record.entity").ExerciseRecord>;
    getHistory(req: any): Promise<{
        sessions: import("../entities/exercise-session.entity").ExerciseSession[];
        single_records: import("../entities/exercise-record.entity").ExerciseRecord[];
    }>;
}
