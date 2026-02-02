/**
 * 임신 정보 등록 요청 DTO
 * 프론트엔드에서 전달받는 데이터 구조
 */
import { ApiProperty } from '@nestjs/swagger';

export class CreatePregnancyDto {
  @ApiProperty({ example: 'test-user-uuid' })
  user_id: string;

  @ApiProperty({ example: 160 })
  height: number;

  @ApiProperty({ example: 55 })
  pre_weight: number;

  @ApiProperty({ example: 57 })
  current_weight: number;

  @ApiProperty({ example: '2024-10-01' })
  pregnancy_start_date: string;

  @ApiProperty({ example: '2025-07-01', required: false })
  due_date?: string;
}

  