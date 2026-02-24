import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { SymptomType } from 'src/common/enums/symptom.enum';

/**
 * 증상 입력 요청 DTO
 * - 여러 개 증상을 배열로 받는다
 * - 0개 허용 (해당 없음)
 */
export class CreateSymptomDto {

  /**
   * 선택된 증상 코드 목록
   * 예: ["BACK_PAIN", "FATIGUE"]
   */
  @ApiPropertyOptional({
    enum: SymptomType,
    isArray: true,
    description: '오늘의 증상 코드 배열 (없으면 빈 배열)',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(SymptomType, { each: true })
  symptoms?: SymptomType[];
}