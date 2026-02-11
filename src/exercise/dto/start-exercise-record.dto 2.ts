import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

/**
 * 개별 운동 시작 DTO
 * - 세션 내에서 하나의 운동을 시작
 */
export class StartExerciseRecordDto {
  /**
   * 운동 세션 ID
   */
  @ApiProperty({ example: 1 })
  @IsInt()
  session_id: number;

  /**
   * 운동 이름
   * 예: 요가, 걷기, 케겔
   */
  @ApiProperty({ example: '요가' })
  @IsString()
  exercise_name: string;

  /**
   * 운동 순서
   * - 프론트에서 정렬한 순서
   */
  @ApiProperty({ example: 1 })
  @IsInt()
  order_index: number;
}