import { ApiProperty } from '@nestjs/swagger';
import { ExerciseResultDto } from './exercise-result.dto';

export class RecommendResponseDto {
  @ApiProperty({ type: [ExerciseResultDto] })
  recommend: ExerciseResultDto[];

  @ApiProperty({ type: [ExerciseResultDto] })
  caution: ExerciseResultDto[];

  @ApiProperty({ type: [ExerciseResultDto] })
  not_recommend: ExerciseResultDto[];
}