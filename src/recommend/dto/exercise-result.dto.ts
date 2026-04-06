import { ApiProperty } from '@nestjs/swagger';

export class ExerciseResultDto {
  @ApiProperty()
  exercise_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  intensity: string | null;

  @ApiProperty({ type: [String] })
  reason: string[];
}