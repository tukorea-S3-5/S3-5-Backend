/**
 * 임신 정보 등록 요청 DTO
 *
 * - 회원가입 후 임신 정보 최초 등록 시 사용
 * - ValidationPipe(whitelist, forbidNonWhitelisted) 기준에 맞게
 *   모든 필드에 validator 데코레이터를 명시
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
import { FitnessLevel } from 'src/common/enums/fitness.enum';

export class CreatePregnancyDto {

  /**
   * 마지막 생리 시작일 (LMP)
   * - 임신 주차 계산의 기준
   */
  @ApiProperty({
    example: '2025-11-15',
    description: '마지막 생리 시작일 (YYYY-MM-DD)',
  })
  @IsDateString()
  last_menstrual_period: string;

  /**
   * 키 (cm)
   */
  @ApiProperty({
    example: 160,
    description: '키 (cm 단위)',
  })
  @IsNumber()
  height: number;

  /**
   * 임신 전 체중 (kg)
   */
  @ApiProperty({
    example: 55,
    description: '임신 전 체중 (kg 단위)',
  })
  @IsNumber()
  pre_weight: number;

  /**
   * 다태아 여부
   * - true: 쌍둥이 이상
   * - false 또는 생략: 단태아
   */
  @ApiPropertyOptional({
    example: true,
    description: '다태아 여부',
  })
  @IsOptional()
  @IsBoolean()
  is_multiple?: boolean;

  /**
   * 임신 전 운동 수준
   *
   * ACTIVE: 임신 전 규칙적인 운동 습관이 있었음
   * SEDENTARY: 운동을 거의 하지 않았음
   *
   * ※ enum + @IsEnum 필수 (ValidationPipe 대응)
   */
  @ApiProperty({
    enum: FitnessLevel,
    example: FitnessLevel.ACTIVE,
    description: '임신 전 운동 수준',
  })
  @IsEnum(FitnessLevel)
  fitness_level: FitnessLevel;

  /**
   * 임신 관련 질환 코드 배열
   *
   * 예:
   * ['HYPERTENSION', 'ANEMIA']
   *
   * - 없으면 빈 배열 또는 생략 가능
   */
  @ApiPropertyOptional({
    enum: ConditionType,
    isArray: true,
    example: ['HYPERTENSION', 'ANEMIA'],
    description: '임신 관련 질환 코드 배열',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ConditionType, { each: true })
  conditions?: ConditionType[];
}