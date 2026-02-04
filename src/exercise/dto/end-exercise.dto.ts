import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class EndExerciseDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  session_id: number;
}