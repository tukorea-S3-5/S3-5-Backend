import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

/**
 * 개별 운동 종료 DTO
 */
export class EndExerciseRecordDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  record_id: number;
}