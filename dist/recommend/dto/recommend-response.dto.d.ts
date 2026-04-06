import { ExerciseResultDto } from './exercise-result.dto';
export declare class RecommendResponseDto {
    recommend: ExerciseResultDto[];
    caution: ExerciseResultDto[];
    not_recommend: ExerciseResultDto[];
}
