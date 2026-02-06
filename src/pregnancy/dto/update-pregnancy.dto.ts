/**
 * 임신 정보 수정 DTO
 * - 이미 등록된 임신 정보 중 변할 수 있는 값만 수정
 * - JWT로 사용자 식별이 되므로 user_id는 포함x
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class UpdatePregnancyDto {
  /**
   * 현재 체중
   * - 임신 중 주기적으로 변하는 값
   * - BMI, 체중 증가 추적에 사용
   */
  @ApiPropertyOptional({ example: 58 })
  @IsOptional()
  @IsNumber()
  current_weight?: number;

  /**
   * 출산 예정일
   * - 병원 진단 결과 등에 따라 변경될 수 있음
   * - 초기에는 null → 이후 업데이트 가능
   */
  @ApiPropertyOptional({ example: '2025-07-10' })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  /**
   * 다태아 여부
   * - 임신 초기에 확정되지 않을 수 있음
   * - 이후 검사로 true/false로 변경 가능
   */
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_multiple?: boolean;
}