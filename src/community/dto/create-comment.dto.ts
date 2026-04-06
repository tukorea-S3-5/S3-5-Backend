import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  postId: number;

  @ApiProperty({ example: '저도 같은 고민이에요 ㅠㅠ' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '1' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}