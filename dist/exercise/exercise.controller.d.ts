import { ExerciseService } from './exercise.service';
import { StartExerciseDto } from './dto/start-exercise.dto';
export declare class ExerciseController {
    private readonly exerciseService;
    constructor(exerciseService: ExerciseService);
    start(req: any, dto: StartExerciseDto): Promise<import("../entities/exercise-session.entity").ExerciseSession>;
    end(req: any): Promise<import("../entities/exercise-session.entity").ExerciseSession>;
}
