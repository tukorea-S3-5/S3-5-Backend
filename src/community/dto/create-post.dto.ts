import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: '임신 16주 식단 추천 부탁드려요' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '입덧이 심한데 뭐가 좋을까요?' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}