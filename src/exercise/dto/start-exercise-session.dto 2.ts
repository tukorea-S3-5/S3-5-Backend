import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

/**
 * 전체 운동 시작 DTO
 * - 추천 운동 전체 or 선택한 운동 목록
 * - 순서는 프론트에서 정해서 전달
 */
export class StartExerciseSessionDto {
  /**
   * 운동 목록
   * 예: ["요가", "걷기", "케겔"]
   */
  @ApiProperty({
    example: ['요가', '걷기', '케겔'],
    description: '이번 세션에서 진행할 운동 목록',
  })
  @IsArray()
  @IsString({ each: true })
  exercises: string[];
}