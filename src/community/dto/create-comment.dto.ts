import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

/**
 * 댓글 생성 DTO
 * - userId는 JWT에서 자동 주입
 */
export class CreateCommentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  postId: number;

  @ApiProperty({ example: '저도 같은 고민이에요 ㅠㅠ' })
  @IsString()
  @IsNotEmpty()
  content: string;
}