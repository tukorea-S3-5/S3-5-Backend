import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 심박 위험 판단 요청 DTO
 */
export class CheckHeartRateDto {
    @ApiProperty({
        example: 150,
        description: '현재 심박수 (30~220)',
    })
    @IsInt()
    @Min(30)
    @Max(220)
    currentHeartRate: number;
}