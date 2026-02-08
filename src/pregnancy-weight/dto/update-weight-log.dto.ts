import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/**
 * 임신 주차별 체중 기록 수정 DTO
 */
export class UpdateWeightLogDto {
  /**
   * 수정할 체중 (kg)
   */
  @ApiProperty({ example: 58.0 })
  @IsNumber()
  weight: number;
}