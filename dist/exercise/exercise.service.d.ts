import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { StartExerciseDto } from './dto/start-exercise.dto';
export declare class ExerciseService {
    private readonly sessionRepository;
    constructor(sessionRepository: Repository<ExerciseSession>);
    startExercise(userId: string, dto: StartExerciseDto): Promise<ExerciseSession>;
    endExercise(userId: string): Promise<ExerciseSession>;
}
