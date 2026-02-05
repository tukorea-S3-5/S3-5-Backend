import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindEmailDto {
  @ApiProperty({
    example: 'test@tukorea.ac.kr',
    description: '사용자 이메일 (로그인 ID로 사용)',
  })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  @IsNotEmpty()
  readonly email: string;
}
