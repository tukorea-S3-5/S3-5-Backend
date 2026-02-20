/**
 * 임신 정보 등록 요청 DTO
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsNumber,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreatePregnancyDto {
  /**
   * 마지막 생리 시작일 (LMP)
   * 임신 주차 계산의 기준
   */
  @ApiProperty({ example: '2025-11-15' })
  @IsDateString()
  last_menstrual_period: string;

  /**
   * 키 (cm)
   */
  @ApiProperty({ example: 160 })
  @IsNumber()
  height: number;

  /**
   * 임신 전 체중 (kg)
   */
  @ApiProperty({ example: 55 })
  @IsNumber()
  pre_weight: number;

  /**
   * 다태아 여부
   */
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_multiple?: boolean;

  /**
   * 임신 전 운동 여부
   */
  @ApiProperty({
    example: 'ACTIVE',
    description: '임신 전 운동 여부 (ACTIVE 또는 SEDENTARY)',
  })
  @IsString()
  fitness_level: 'ACTIVE' | 'SEDENTARY';

  /**
   * 상대적 금기사항 유무
   */
  @ApiProperty({ example: false, description: '상대적 금기사항 유무' })
  @IsBoolean()
  contraindication: boolean;
}
