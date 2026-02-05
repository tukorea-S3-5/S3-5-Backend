import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { StartExerciseDto } from './dto/start-exercise.dto';
import { EndExerciseDto } from './dto/end-exercise.dto';
export declare class ExerciseService {
    private readonly sessionRepository;
    constructor(sessionRepository: Repository<ExerciseSession>);
    startExercise(dto: StartExerciseDto): Promise<ExerciseSession>;
    endExercise(dto: EndExerciseDto): Promise<ExerciseSession>;
    getSessionsByUser(userId: string): Promise<ExerciseSession[]>;
    getOngoingSession(userId: string): Promise<ExerciseSession | null>;
}
