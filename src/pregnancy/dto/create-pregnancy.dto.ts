/**
 * 임신 정보 등록 요청 DTO
 * - 로그인된 사용자의 임신 기본 정보를 입력받는다
 * - user_id는 JWT에서 추출하므로 DTO에는 포함x
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreatePregnancyDto {
  /**
   * 사용자 키(cm)
   * BMI 계산에 사용
   */
  @ApiProperty({ example: 160 })
  @IsNumber()
  height: number;

  /**
   * 임신 전 체중(kg)
   * BMI 기준 체중 산출에 사용
   */
  @ApiProperty({ example: 55 })
  @IsNumber()
  pre_weight: number;

  /**
   * 현재 체중(kg)
   * 임신 진행 중 체중 변화를 추적하기 위해 사용
   */
  @ApiProperty({ example: 57 })
  @IsNumber()
  current_weight: number;

  /**
   * 임신 시작일 (마지막 생리 시작일 기준)
   * 임신 주차, 임신 단계 계산의 기준값
   */
  @ApiProperty({ example: '2024-10-01' })
  @IsString()
  pregnancy_start_date: string;

  /**
   * 출산 예정일
   * 선택 값이며 입력하지 않아도 된다
   */
  @ApiPropertyOptional({ example: '2025-07-01' })
  @IsOptional()
  @IsString()
  due_date?: string;

  /**
   * 다태아 여부
   * null  : 아직 확인되지 않음
   * false : 단태아
   * true  : 쌍둥이 이상
   */
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_multiple?: boolean;
}