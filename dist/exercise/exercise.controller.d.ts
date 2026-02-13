import { ExerciseService } from './exercise.service';
import { StartExerciseRecordDto } from './dto/start-exercise-record.dto';
import { EndExerciseRecordDto } from './dto/end-exercise-record.dto';
export declare class ExerciseController {
    private readonly exerciseService;
    constructor(exerciseService: ExerciseService);
    startSession(req: any): Promise<import("../entities/exercise-session.entity").ExerciseSession>;
    endSession(req: any): Promise<import("../entities/exercise-session.entity").ExerciseSession>;
    startRecord(req: any, dto: StartExerciseRecordDto): Promise<import("../entities/exercise-record.entity").ExerciseRecord>;
    endRecord(dto: EndExerciseRecordDto): Promise<import("../entities/exercise-record.entity").ExerciseRecord>;
    getHistory(req: any): Promise<{
        sessions: import("../entities/exercise-session.entity").ExerciseSession[];
        single_records: import("../entities/exercise-record.entity").ExerciseRecord[];
    }>;
    getAllExercises(): Promise<import("../entities/exercise.entity").Exercise[]>;
    getExerciseDetail(id: string): Promise<{
        steps: import("../entities/exercise-step.entity").ExerciseStep[];
        exercise_id: number;
        exercise_name: string;
        category_name: string;
        intensity: string | null;
        position_type: string | null;
        fall_risk: boolean;
        allowed_trimesters: number[];
        description: string | null;
        difficulty_label: string | null;
        tagMaps: import("../entities/exercise-tag-map.entity").ExerciseTagMap[];
    }>;
}
