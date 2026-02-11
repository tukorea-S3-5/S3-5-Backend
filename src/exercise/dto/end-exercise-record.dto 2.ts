import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

/**
 * 개별 운동 종료 DTO
 * - 하나의 운동이 끝났을 때 호출
 */
export class EndExerciseRecordDto {
  /**
   * 운동 기록 ID
   */
  @ApiProperty({ example: 10 })
  @IsInt()
  record_id: number;
}