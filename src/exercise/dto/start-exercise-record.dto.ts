import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

/**
 * 개별 운동 시작 DTO
 */
export class StartExerciseRecordDto {
  @ApiProperty({ example: '요가' })
  @IsString()
  exercise_name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  order_index: number;
}