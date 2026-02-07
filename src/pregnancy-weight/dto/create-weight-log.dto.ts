import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

/**
 * 임신 주차별 체중 기록 생성 DTO
 */
export class CreateWeightLogDto {
  /**
   * 임신 주차
   */
  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(0)
  week: number;

  /**
   * 해당 주차 체중 (kg)
   */
  @ApiProperty({ example: 57.2 })
  @IsNumber()
  weight: number;
}