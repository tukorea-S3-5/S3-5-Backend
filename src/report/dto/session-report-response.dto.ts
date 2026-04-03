import { ApiProperty } from '@nestjs/swagger';
import { SessionExerciseDto } from './session-exercise.dto';

export class SessionReportResponseDto {
  @ApiProperty()
  total_duration: number;

  @ApiProperty({ nullable: true })
  avg_heart_rate: number | null;

  @ApiProperty({ nullable: true })
  max_heart_rate: number | null;

  @ApiProperty({ type: [SessionExerciseDto] })
  exercises: SessionExerciseDto[];
}