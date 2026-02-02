/**
 * 임신 정보 수정 DTO
 * 선택적으로 값이 들어오며, 들어온 값만 수정한다.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePregnancyDto {
  // 현재 체중
  @ApiPropertyOptional({ example: 58 })
  current_weight?: number;

  // 출산 예정일
  @ApiPropertyOptional({ example: '2025-07-10' })
  due_date?: string;
}

  