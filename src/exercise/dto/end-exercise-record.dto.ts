import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional } from 'class-validator';

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

  @ApiProperty({
    example: [82, 85, 88, 90, 87],
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  heart_rates?: number[];
}
