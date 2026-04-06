import { ApiProperty } from '@nestjs/swagger';

export class SessionExerciseDto {
  @ApiProperty()
  exercise_name: string;

  @ApiProperty({ nullable: true })
  duration: number | null;

  @ApiProperty({ nullable: true })
  avg_heart_rate: number | null;

  @ApiProperty({ nullable: true })
  max_heart_rate: number | null;
}