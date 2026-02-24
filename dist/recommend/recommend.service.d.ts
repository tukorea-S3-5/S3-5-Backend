import { Repository } from 'typeorm';
import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap } from '../entities/exercise-tag-map.entity';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { SymptomLog } from '../entities/symptom-log.entity';
export declare class RecommendService {
    private readonly exerciseRepository;
    private readonly tagRepository;
    private readonly pregnancyRepository;
    private readonly symptomRepository;
    constructor(exerciseRepository: Repository<Exercise>, tagRepository: Repository<ExerciseTagMap>, pregnancyRepository: Repository<PregnancyInfo>, symptomRepository: Repository<SymptomLog>);
    private isIntensityAllowed;
    recommend(userId: string): Promise<{
        recommend: Exercise[];
        caution: Exercise[];
        not_recommend: Exercise[];
    }>;
}
