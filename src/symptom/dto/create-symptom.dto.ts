import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

/**
 * 증상 입력 요청 DTO
 * - 여러 개 증상을 배열로 받는다
 */
export class CreateSymptomDto {

  /**
   * 선택된 증상 목록
   */
  @ApiProperty({
    example: ["배뭉침", "요통", "피로감"]
  })
  @IsArray()
  @IsString({ each: true })
  symptoms: string[];
}