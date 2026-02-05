import { ExerciseService } from './exercise.service';
import { StartExerciseDto } from './dto/start-exercise.dto';
import { EndExerciseDto } from './dto/end-exercise.dto';
export declare class ExerciseController {
    private readonly exerciseService;
    constructor(exerciseService: ExerciseService);
    startExercise(dto: StartExerciseDto): Promise<import("../entities/exercise-session.entity").ExerciseSession>;
    endExercise(dto: EndExerciseDto): Promise<import("../entities/exercise-session.entity").ExerciseSession>;
    getUserSessions(userId: string): Promise<import("../entities/exercise-session.entity").ExerciseSession[]>;
}
