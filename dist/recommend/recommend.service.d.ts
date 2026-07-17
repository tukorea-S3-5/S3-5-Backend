import { Repository } from 'typeorm';
import { Exercise } from '../entities/exercise.entity';
import { ExerciseTagMap } from '../entities/exercise-tag-map.entity';
import { PregnancyInfo } from '../entities/pregnancy-info.entity';
import { SymptomLog } from '../entities/symptom-log.entity';
import { RecommendResponseDto } from './dto/recommend-response.dto';
import { AiService } from '../ai/ai.service';
export declare class RecommendService {
    private readonly exerciseRepository;
    private readonly tagRepository;
    private readonly pregnancyRepository;
    private readonly symptomRepository;
    private readonly aiService;
    constructor(exerciseRepository: Repository<Exercise>, tagRepository: Repository<ExerciseTagMap>, pregnancyRepository: Repository<PregnancyInfo>, symptomRepository: Repository<SymptomLog>, aiService: AiService);
    private calculateWeek;
    private calculateTrimester;
    private buildExerciseResult;
    private buildAiComment;
    private isIntensityAllowed;
    recommend(userId: string): Promise<RecommendResponseDto>;
}
