import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdatePregnancyDto {
  /**
   * 임신 전 체중
   */
  @ApiPropertyOptional({ example: 56 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pre_weight?: number;

  /**
   * 출산 예정일
   */
  @ApiPropertyOptional({ example: '2026-08-22' })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  /**
   * 다태아 여부
   */
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_multiple?: boolean;
}