import { ApiProperty } from '@nestjs/swagger';

export class RuleCandidateDto {
  @ApiProperty()
  exercise_id: number;

  @ApiProperty()
  exercise_name: string;

  @ApiProperty({ nullable: true })
  intensity: string | null;
}