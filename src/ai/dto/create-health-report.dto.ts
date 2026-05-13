import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHealthReportDto {

  @ApiProperty({
    example: 16,
    description: '임신 주차',
  })
  @Type(() => Number)
  @IsNumber()
  week: number;

  @ApiProperty({
    example: 22.5,
    description: 'BMI 수치',
  })
  @Type(() => Number)
  @IsNumber()
  bmi: number;

  @ApiProperty({
    example: '정상',
    description: '체중 상태',
  })
  @IsString()
  weightStatus: string;
}