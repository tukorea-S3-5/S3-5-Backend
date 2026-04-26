import { ApiProperty } from '@nestjs/swagger';

export class ExerciseResultDto {
  @ApiProperty({ example: 1 })
  exercise_id: number;

  @ApiProperty({ example: '산책' })
  exercise_name: string;

  @ApiProperty({ example: '유산소' })
  category_name: string;

  @ApiProperty({ example: 'low' })
  intensity: string;

  @ApiProperty({ example: 'standing' })
  position_type: string;

  @ApiProperty({ example: false })
  fall_risk: boolean;

  @ApiProperty({ type: [Number], example: [1, 2, 3] })
  allowed_trimesters: number[];

  @ApiProperty({
    example: '임산부에게 적합한 저강도 유산소 운동입니다.',
  })
  description: string;

  @ApiProperty({ example: '쉬움' })
  difficulty_label: string;

  @ApiProperty({
    example: 'https://example.com/video.mp4',
    required: false,
    nullable: true,
  })
  video_url?: string | null;

  // // LLM 붙일 준비
  // @ApiProperty({
  //   example: '현재 BMI와 안정 심박수 기준으로 안전한 운동입니다.',
  //   required: false,
  //   nullable: true,
  // })
  // ai_comment?: string;
}