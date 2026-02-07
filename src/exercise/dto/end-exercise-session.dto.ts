import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

/**
 * 전체 운동 종료 DTO
 * - 마지막 운동까지 끝난 후 호출
 */
export class EndExerciseSessionDto {
  /**
   * 운동 세션 ID
   */
  @ApiProperty({ example: 1 })
  @IsInt()
  session_id: number;
}