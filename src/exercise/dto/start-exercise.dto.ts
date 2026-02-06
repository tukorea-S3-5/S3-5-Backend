import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * 운동 시작 요청 DTO
 * - JWT에서 user_id를 얻기 때문에 여기에는 포함x
 * - 운동 종류는 선택 값 (초기에는 단순 기록용)
 */
export class StartExerciseDto {
  @ApiPropertyOptional({ example: '걷기' })
  @IsOptional()
  @IsString()
  exercise_type?: string;
}