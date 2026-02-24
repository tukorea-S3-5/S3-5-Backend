/**
 * 임신 정보 등록 요청 DTO
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ConditionType } from 'src/common/enums/condition.enum';

export class CreatePregnancyDto {

  @ApiProperty({ example: '2025-11-15' })
  @IsDateString()
  last_menstrual_period: string;

  @ApiProperty({ example: 160 })
  @IsNumber()
  height: number;

  @ApiProperty({ example: 55 })
  @IsNumber()
  pre_weight: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_multiple?: boolean;

  @ApiProperty({
    example: 'ACTIVE',
    description: '임신 전 운동 여부 (ACTIVE 또는 SEDENTARY)',
  })
  fitness_level: 'ACTIVE' | 'SEDENTARY';

  /**
   * 임신 관련 질환 코드 배열
   * 예: ['HYPERTENSION', 'ANEMIA']
   */
  @ApiPropertyOptional({
    enum: ConditionType,
    isArray: true,
    example: ['HYPERTENSION', 'ANEMIA'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ConditionType, { each: true })
  conditions?: ConditionType[];
}