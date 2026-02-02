/**
 * 임신 정보 수정 DTO
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class UpdatePregnancyDto {
  @ApiPropertyOptional({ example: 58 })
  @IsOptional()
  @IsNumber()
  current_weight?: number;

  @ApiPropertyOptional({ example: '2025-07-10' })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_multiple?: boolean;
}
