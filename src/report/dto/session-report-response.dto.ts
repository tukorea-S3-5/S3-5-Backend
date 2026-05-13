import { ApiProperty } from '@nestjs/swagger';
import { SessionExerciseDto } from './session-exercise.dto';

export class SessionReportResponseDto {

  @ApiProperty()
  total_duration: number;

  @ApiProperty({ nullable: true })
  avg_heart_rate: number | null;

  @ApiProperty({ nullable: true })
  max_heart_rate: number | null;

  @ApiProperty({
    example: 'COMPLETED',
    description: '세션 상태 (COMPLETED | ABORTED)',
  })
  status: string;

  @ApiProperty({ type: [SessionExerciseDto] })
  exercises: SessionExerciseDto[];

  @ApiProperty({
    nullable: true,
    description: 'AI 운동 리포트 코멘트',
  })
  ai_comment: string | null;
}
// import { ApiProperty } from '@nestjs/swagger';
// import { SessionExerciseDto } from './session-exercise.dto';

// export class SessionReportResponseDto {
//   @ApiProperty()
//   total_duration: number;

//   @ApiProperty({ nullable: true })
//   avg_heart_rate: number | null;

//   @ApiProperty({ nullable: true })
//   max_heart_rate: number | null;

//   @ApiProperty({
//     example: 'COMPLETED',
//     description: '세션 상태 (COMPLETED | ABORTED)',
//   })
//   status: string;

//   @ApiProperty({ type: [SessionExerciseDto] })
//   exercises: SessionExerciseDto[];
// }
