import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 안정 심박수 업데이트 요청 DTO
 */
export class UpdateRestingHrDto {
  /**
   * 안정 심박수
   * 일반적으로 40 ~ 120 사이
   */
  @ApiProperty({
    example: 62,
    description: '안정 심박수 (30~150)',
  })
  @IsInt()
  @Min(30)
  @Max(150)
  restingHeartRate: number;
}