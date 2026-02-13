import { Repository } from 'typeorm';
import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap } from '../entities/exercise-tag-map.entity';
export declare class RuleService {
    private readonly exerciseRepository;
    private readonly tagRepository;
    constructor(exerciseRepository: Repository<Exercise>, tagRepository: Repository<ExerciseTagMap>);
    generateCandidates(trimester: number, symptoms: string[]): Promise<Exercise[]>;
}
