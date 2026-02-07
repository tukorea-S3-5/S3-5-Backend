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
}
