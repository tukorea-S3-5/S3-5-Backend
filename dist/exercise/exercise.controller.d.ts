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
    pauseRecord(body: {
        record_id: number;
    }): Promise<import("../entities/exercise-record.entity").ExerciseRecord>;
    resumeRecord(body: {
        record_id: number;
    }): Promise<import("../entities/exercise-record.entity").ExerciseRecord>;
    abortSession(body: {
        session_id: number;
    }): Promise<import("../entities/exercise-session.entity").ExerciseSession>;
    getHistory(req: any): Promise<{
        sessions: {
            total_duration_formatted: string;
            session_id: number;
            user_id: string;
            status: "ONGOING" | "COMPLETED" | "ABORTED";
            started_at: Date;
            ended_at: Date | null;
            total_duration: number;
            records: import("../entities/exercise-record.entity").ExerciseRecord[];
        }[];
    }>;
    getCurrentSession(req: any): Promise<{
        message: string;
    } | {
        total_duration_formatted: string;
        session_id: number;
        user_id: string;
        status: "ONGOING" | "COMPLETED" | "ABORTED";
        started_at: Date;
        ended_at: Date | null;
        total_duration: number;
        records: import("../entities/exercise-record.entity").ExerciseRecord[];
        message?: undefined;
    }>;
}
