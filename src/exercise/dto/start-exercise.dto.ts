import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StartExerciseDto {
  @ApiProperty({ example: 'test-user-3' })
  @IsString()
  user_id: string;
}