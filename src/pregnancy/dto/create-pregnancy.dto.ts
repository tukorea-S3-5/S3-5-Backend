/**
 * 임신 정보 등록 요청 DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreatePregnancyDto {
  @ApiProperty({ example: 'test-user-uuid' })
  @IsString()
  user_id: string;

  @ApiProperty({ example: 160 })
  @IsNumber()
  height: number;

  @ApiProperty({ example: 55 })
  @IsNumber()
  pre_weight: number;

  @ApiProperty({ example: 57 })
  @IsNumber()
  current_weight: number;

  @ApiProperty({ example: '2024-10-01' })
  @IsDateString()
  pregnancy_start_date: string;

  @ApiProperty({ example: '2025-07-01', required: false })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  /**
   * 다태아 여부
   * null / true / false
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  is_multiple?: boolean;
}
