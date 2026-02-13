import { Repository } from 'typeorm';
import { ExerciseSession } from '../entities/exercise-session.entity';
import { ExerciseRecord } from '../entities/exercise-record.entity';
import { Exercise } from '../entities/exercise.entity';
import { ExerciseStep } from '../entities/exercise-step.entity';
export declare class ExerciseService {
    private readonly sessionRepository;
    private readonly recordRepository;
    private readonly exerciseRepository;
    private readonly stepRepository;
    constructor(sessionRepository: Repository<ExerciseSession>, recordRepository: Repository<ExerciseRecord>, exerciseRepository: Repository<Exercise>, stepRepository: Repository<ExerciseStep>);
    startSession(userId: string): Promise<ExerciseSession>;
    endSession(userId: string): Promise<ExerciseSession>;
    startRecord(userId: string, exerciseName: string, orderIndex: number): Promise<ExerciseRecord>;
    endRecord(recordId: number): Promise<ExerciseRecord>;
    getHistory(userId: string): Promise<{
        sessions: ExerciseSession[];
        single_records: ExerciseRecord[];
    }>;
    getAllExercises(): Promise<Exercise[]>;
    getExerciseDetail(exerciseId: number): Promise<{
        steps: ExerciseStep[];
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
